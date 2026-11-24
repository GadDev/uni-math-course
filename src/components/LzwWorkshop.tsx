import { useRef, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  decodeLzw,
  encodeLzw,
  generateLzw,
  initialDictionary,
  lzwExamples,
  LzwInputError,
  parseCodes,
  type Difficulty,
  type LzwResult,
  type LzwStep,
} from '../lib/lzw';
import './lzw-workshop.css';

type Mode = 'explore' | 'guided' | 'exam';
type Direction = 'encode' | 'decode';
const first = encodeLzw(lzwExamples[0].message, lzwExamples[0].alphabet);

export default function LzwWorkshop({ locale }: { locale: Locale }) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const [exercise, setExercise] = useState<LzwResult>(first);
  const [direction, setDirection] = useState<Direction>('encode');
  const [mode, setMode] = useState<Mode>('explore');
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState('');
  const [entry, setEntry] = useState('');
  const [feedback, setFeedback] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const [error, setError] = useState('');
  const [alphabet, setAlphabet] = useState('ABN');
  const [custom, setCustom] = useState('BANANABANANA');
  const [seed, setSeed] = useState('2026');
  const [level, setLevel] = useState<Difficulty>('starter');
  const [source, setSource] = useState('BANANABANANA');
  const [achievements, setAchievements] = useState(false);
  const [completed, setCompleted] = useState(false);
  const answerInput = useRef<HTMLInputElement>(null);

  const trace =
    direction === 'encode'
      ? exercise
      : decodeLzw(exercise.codes, exercise.alphabet);
  const step = trace.steps[position];
  const done = position === trace.steps.length;
  const showCurrent = mode === 'explore' || accepted;
  const visibleCount =
    mode === 'exam'
      ? revealed
        ? trace.steps.length
        : 0
      : position + Number(accepted && !done);
  const visible = trace.steps.slice(0, visibleCount);
  const last = visible.at(-1);
  const dictionary = last?.after ?? initialDictionary(exercise.alphabet);
  const none = '—';

  function reset() {
    setPosition(0);
    setAnswer('');
    setEntry('');
    setFeedback('');
    setAccepted(false);
    setRevealed(false);
    setHint(false);
    setError('');
    setCompleted(false);
  }
  function load(result: LzwResult, newSource: string) {
    setExercise(result);
    setAlphabet(result.alphabet);
    setCustom(direction === 'encode' ? result.message : result.codes.join(' '));
    setSource(newSource);
    reset();
  }
  function explain(s: LzwStep) {
    if (direction === 'encode') {
      if (s.final)
        return t(
          `Fin du message : émettre le code de ${s.w}, soit ${s.emitted}. Aucun ajout après la fin.`,
          `End of message: emit the code of ${s.w}, which is ${s.emitted}. No final dictionary addition.`,
        );
      if (!s.added)
        return t(
          `${s.phrase} existe déjà : ne rien émettre, ne rien ajouter et prolonger w en ${s.phrase}.`,
          `${s.phrase} already exists: emit nothing, add nothing and extend w to ${s.phrase}.`,
        );
      return t(
        `${s.phrase} est absent : émettre ${s.emitted} (code de ${s.w}), ajouter ${s.added.word} = ${s.added.code}, puis w := ${s.c}.`,
        `${s.phrase} is absent: emit ${s.emitted} (code of ${s.w}), add ${s.added.word} = ${s.added.code}, then w := ${s.c}.`,
      );
    }
    const explanation = s.special
      ? t(
          `Cas particulier : ${s.c} désigne ${s.pendingBefore?.word}. Compléter avec la première lettre de ${s.w} : ${s.w} + ${s.w[0]} = ${s.phrase}.`,
          `Special case: ${s.c} refers to ${s.pendingBefore?.word}. Use the first letter of ${s.w}: ${s.w} + ${s.w[0]} = ${s.phrase}.`,
        )
      : t(
          `Le code ${s.c} donne le morceau ${s.phrase}.`,
          `Code ${s.c} gives the chunk ${s.phrase}.`,
        );
    return (
      explanation +
      ' ' +
      (s.added
        ? t(
            `Compléter ${s.pendingBefore?.word} par ${s.phrase[0]} : ${s.added.word} = ${s.added.code}.`,
            `Complete ${s.pendingBefore?.word} with ${s.phrase[0]}: ${s.added.word} = ${s.added.code}.`,
          )
        : t(
            'Premier code : aucune entrée à compléter.',
            'First code: no entry to complete.',
          )) +
      ' ' +
      t(
        `En attente : ${s.pending?.word} = ${s.pending?.code}.`,
        `Pending: ${s.pending?.word} = ${s.pending?.code}.`,
      ) +
      (s.final
        ? t(
            ' Cette dernière entrée reste incomplète.',
            ' This final entry remains incomplete.',
          )
        : '')
    );
  }
  function move(next: number) {
    setPosition(next);
    setAnswer('');
    setEntry('');
    setFeedback('');
    setAccepted(false);
    setHint(false);
    if (next === trace.steps.length) setCompleted(true);
    if (mode === 'guided') answerInput.current?.focus();
  }
  function validateGuided() {
    if (!step) return;
    const expected =
      direction === 'encode' ? String(step.emitted ?? none) : step.phrase;
    const added = step.added?.word ?? none;
    const normalise = (value: string) =>
      value.trim() === '-' ? none : value.trim();
    const correct =
      normalise(answer) === expected && normalise(entry) === added;
    setAccepted(correct);
    setFeedback(
      correct
        ? t('Bien joué. ', 'Well done. ') + explain(step)
        : t(
            `À revoir : la sortie attendue est ${expected} et l’entrée ${added}. `,
            `Try again: the expected output is ${expected} and the entry is ${added}. `,
          ) + explain(step),
    );
  }
  function inputError(cause: unknown) {
    const reason = cause instanceof LzwInputError ? cause.reason : 'codes';
    const messages = {
      alphabet: t(
        'Alphabet : 1 à 8 lettres A–Z distinctes, sans espace, dans l’ordre des codes.',
        'Alphabet: 1–8 distinct A–Z letters, without spaces, in code order.',
      ),
      message: t(
        'Message : 1 à 96 lettres de l’alphabet. Le texte décodé est également limité à 96 lettres.',
        'Message: 1–96 letters from the alphabet. Decoded text is also limited to 96 letters.',
      ),
      codes: t(
        'Codes : 1 à 96 entiers strictement positifs, séparés par des espaces, virgules ou points-virgules.',
        'Codes: 1–96 positive integers, separated by spaces, commas or semicolons.',
      ),
      'unknown-code': t(
        'Code impossible à cette étape. Seul le prochain numéro libre peut désigner une entrée encore incomplète ; le premier code doit être initial.',
        'Impossible code at this step. Only the next free number can refer to an incomplete entry; the first code must be initial.',
      ),
    };
    setError(messages[reason]);
  }

  return (
    <section
      className="lzw-workshop"
      aria-label={t('Atelier LZW', 'LZW workshop')}
    >
      <div className="lzw-intro">
        <p className="eyebrow">
          {t(
            'Un dictionnaire qui grandit avec vous',
            'A dictionary that grows with you',
          )}
        </p>
        <h2>{t('La machine à morceaux', 'The phrase machine')}</h2>
        <p>
          {t(
            'Suivez une lettre, construisez une entrée, puis essayez sans filet. Aucun chronomètre : prenez le temps de raisonner.',
            'Follow a letter, build an entry, then try it independently. No timer: take time to reason.',
          )}
        </p>
      </div>
      <div className="lzw-controls">
        <label>
          {t('Activité', 'Activity')}
          <select
            aria-label={t('Activité', 'Activity')}
            value={direction}
            onChange={(event) => {
              const value = event.target.value as Direction;
              setDirection(value);
              setCustom(
                value === 'encode'
                  ? exercise.message
                  : exercise.codes.join(' '),
              );
              reset();
            }}
          >
            <option value="encode">{t('Encodage', 'Encoding')}</option>
            <option value="decode">{t('Décodage', 'Decoding')}</option>
          </select>
        </label>
        <label>
          {t('Mode', 'Mode')}
          <select
            aria-label="Mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              reset();
            }}
          >
            <option value="explore">{t('Explorer', 'Explore')}</option>
            <option value="guided">
              {t('Pratique guidée', 'Guided practice')}
            </option>
            <option value="exam">
              {t('Entraînement examen', 'Exam practice')}
            </option>
          </select>
        </label>
        <label>
          {t('Exemple', 'Example')}
          <select
            aria-label={t('Exemple', 'Example')}
            value={source}
            onChange={(event) => {
              const example = lzwExamples.find(
                (item) => item.message === event.target.value,
              );
              if (example)
                load(
                  encodeLzw(example.message, example.alphabet),
                  example.message,
                );
            }}
          >
            {lzwExamples.map((item, index) => (
              <option key={item.message} value={item.message}>
                {direction === 'encode'
                  ? item.message
                  : `${t('Exemple', 'Example')} ${index + 1} · ${item.alphabet}`}
              </option>
            ))}
            {!lzwExamples.some((item) => item.message === source) && (
              <option value={source}>{source}</option>
            )}
          </select>
        </label>
      </div>
      <details className="lzw-settings">
        <summary>
          {t(
            'Créer un défi : aléatoire ou personnalisé',
            'Create a challenge: random or custom',
          )}
        </summary>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            try {
              load(
                generateLzw(Number(seed), level),
                t('Défi généré', 'Generated challenge'),
              );
            } catch {
              setError(
                t(
                  'La graine doit être un entier de 1 à 4294967295.',
                  'The seed must be an integer from 1 to 4294967295.',
                ),
              );
            }
          }}
        >
          <h3>{t('Défi reproductible', 'Reproducible challenge')}</h3>
          <div className="lzw-controls">
            <label>
              {t('Difficulté', 'Difficulty')}
              <select
                aria-label={t('Difficulté', 'Difficulty')}
                value={level}
                onChange={(event) => setLevel(event.target.value as Difficulty)}
              >
                <option value="starter">
                  {t('Découverte · 8 lettres', 'Starter · 8 letters')}
                </option>
                <option value="intermediate">
                  {t('Intermédiaire · 20 lettres', 'Intermediate · 20 letters')}
                </option>
                <option value="advanced">
                  {t(
                    'Avancé · 40 lettres et cas particulier',
                    'Advanced · 40 letters and special case',
                  )}
                </option>
              </select>
            </label>
            <label>
              {t('Graine', 'Seed')}
              <input
                value={seed}
                inputMode="numeric"
                onChange={(event) => setSeed(event.target.value)}
              />
            </label>
          </div>
          <p>
            {t(
              'Même graine + même difficulté = même message. Changez la graine pour un autre défi.',
              'Same seed + same difficulty = same message. Change the seed for another challenge.',
            )}
          </p>
          <button type="submit">
            {t('Générer le défi', 'Generate challenge')}
          </button>
        </form>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            try {
              const result =
                direction === 'encode'
                  ? encodeLzw(custom, alphabet)
                  : decodeLzw(parseCodes(custom), alphabet);
              load(result, t('Personnalisé', 'Custom'));
            } catch (cause) {
              inputError(cause);
            }
          }}
        >
          <h3>{t('Votre propre exercice', 'Your own exercise')}</h3>
          <label>
            {t(
              'Alphabet initial, dans l’ordre des codes',
              'Initial alphabet, in code order',
            )}
            <input
              value={alphabet}
              maxLength={8}
              onChange={(event) => setAlphabet(event.target.value)}
            />
          </label>
          <label>
            {direction === 'encode'
              ? t('Message personnalisé', 'Custom message')
              : t('Codes personnalisés', 'Custom codes')}
            <textarea
              aria-label={
                direction === 'encode'
                  ? t('Message personnalisé', 'Custom message')
                  : t('Codes personnalisés', 'Custom codes')
              }
              value={custom}
              maxLength={600}
              onChange={(event) => setCustom(event.target.value)}
            />
          </label>
          <p>
            {t(
              'Lettres A–Z uniquement, sans espaces dans le message. Aucun changement automatique de casse ou d’alphabet.',
              'A–Z letters only, no spaces within the message. Case and alphabet are never changed automatically.',
            )}
          </p>
          <button type="submit">
            {t('Charger cet exercice', 'Load this exercise')}
          </button>
        </form>
      </details>
      {error && (
        <p role="alert" className="lzw-feedback">
          {error}
        </p>
      )}
      <div className="lzw-brief">
        <p>
          <strong>{t('Dictionnaire initial', 'Initial dictionary')} : </strong>
          {initialDictionary(exercise.alphabet)
            .map((item) => `${item.word} = ${item.code}`)
            .join(' · ')}
        </p>
        <p>
          {t(
            'Numérotation à partir de 1. Ajouts consécutifs. Pas de remise à zéro ni de limite de dictionnaire dans cet atelier.',
            'Codes start at 1. Additions are consecutive. No resets or dictionary-size limit in this workshop.',
          )}
        </p>
        <p>
          <strong>
            {direction === 'encode'
              ? t('Message à encoder', 'Message to encode')
              : t('Codes à décoder', 'Codes to decode')}
          </strong>
        </p>
        <p className="lzw-message" data-testid="lzw-input">
          {direction === 'encode' ? exercise.message : exercise.codes.join(' ')}
        </p>
        {direction === 'encode' && (
          <p>
            {t(
              'w = morceau courant ; c = prochaine lettre ; wc = leur concaténation. « — » signifie aucune sortie ou aucun ajout.',
              'w = current phrase; c = next letter; wc = their concatenation. “—” means no output or no addition.',
            )}
          </p>
        )}
        {direction === 'decode' && (
          <p>
            {t(
              'u? = entrée en attente : ? sera la première lettre du morceau suivant. Après le dernier code, l’entrée reste incomplète.',
              'u? = pending entry: ? will be the first letter of the next chunk. After the last code, the entry remains incomplete.',
            )}
          </p>
        )}
      </div>

      {mode !== 'exam' && (
        <>
          <label className="lzw-progress">
            {t('Étapes terminées', 'Completed steps')} :{' '}
            {Math.min(position, trace.steps.length)} / {trace.steps.length}
            <progress max={trace.steps.length} value={position} />
          </label>
          {!done && step && (
            <section
              className="lzw-turn"
              key={`${mode}-${direction}-${position}`}
              aria-label={t('Étape courante', 'Current step')}
            >
              <h3>
                {t('Étape', 'Step')} {position + 1}
              </h3>
              {direction === 'encode' ? (
                <p>
                  <strong>w = {step.w}</strong> ·{' '}
                  <strong>c = {step.c || t('(fin)', '(end)')}</strong>
                  {step.c && <> · wc = {step.phrase}</>}
                </p>
              ) : (
                <p>
                  {t('Code reçu', 'Received code')} : <strong>{step.c}</strong>{' '}
                  · {t('Entrée en attente', 'Pending entry')} :{' '}
                  {step.pendingBefore
                    ? `${step.pendingBefore.word} = ${step.pendingBefore.code}`
                    : none}
                </p>
              )}
              {mode === 'explore' && (
                <p>
                  {t(
                    'Prédisez la sortie et l’ajout, puis avancez pour vérifier.',
                    'Predict the output and addition, then step forward to check.',
                  )}
                </p>
              )}
              {mode === 'guided' && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    validateGuided();
                  }}
                >
                  <div className="lzw-controls">
                    <label>
                      {direction === 'encode'
                        ? t('Code émis ou —', 'Emitted code or —')
                        : t('Morceau décodé', 'Decoded chunk')}
                      <input
                        ref={answerInput}
                        value={answer}
                        readOnly={accepted}
                        onChange={(event) => setAnswer(event.target.value)}
                        autoComplete="off"
                      />
                    </label>
                    <label>
                      {direction === 'encode'
                        ? t('Chaîne ajoutée ou —', 'Added string or —')
                        : t('Entrée complétée ou —', 'Completed entry or —')}
                      <input
                        value={entry}
                        readOnly={accepted}
                        onChange={(event) => setEntry(event.target.value)}
                        autoComplete="off"
                      />
                    </label>
                  </div>
                  <p>
                    {t(
                      'Écrivez la chaîne seule, sans son numéro. Vous pouvez taper - pour —.',
                      'Enter just the string, without its number. You may type - for —.',
                    )}
                  </p>
                  <div className="lzw-actions">
                    <button type="submit" disabled={accepted}>
                      {t('Vérifier cette étape', 'Check this step')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHint(!hint)}
                      aria-expanded={hint}
                    >
                      {t('Indice', 'Hint')}
                    </button>
                  </div>
                  {hint && (
                    <p>
                      {direction === 'encode'
                        ? t(
                            'Cherchez wc dans le dictionnaire avant l’étape. Absent : émettre le code de w et ajouter wc. Présent : aucune sortie. À la fin : émettre w sans ajout.',
                            'Look for wc in the dictionary before this step. Absent: emit the code of w and add wc. Present: no output. At the end: emit w without adding.',
                          )
                        : t(
                            'Cherchez le code. Complétez ensuite l’ancienne entrée en attente avec la première lettre du nouveau morceau. Si le code est celui de l’entrée incomplète, utilisez w + première lettre de w.',
                            'Look up the code. Then complete the previous pending entry with the first letter of the new chunk. If the code refers to the incomplete entry, use w + first letter of w.',
                          )}
                    </p>
                  )}
                </form>
              )}
            </section>
          )}
          <div className="lzw-feedback" role="status" aria-live="polite">
            {feedback ||
              (showCurrent && last
                ? explain(last)
                : t('À vous de jouer.', 'Your turn.'))}
          </div>
          <div className="lzw-actions">
            <button
              type="button"
              disabled={position === 0}
              onClick={() => move(position - 1)}
            >
              {t('Étape précédente', 'Previous step')}
            </button>
            <button
              type="button"
              disabled={done || (mode === 'guided' && !accepted)}
              onClick={() => move(position + 1)}
            >
              {position === trace.steps.length - 1
                ? t('Terminer', 'Finish')
                : t('Étape suivante', 'Next step')}
            </button>
            <button type="button" onClick={reset}>
              {t('Recommencer', 'Restart')}
            </button>
          </div>
        </>
      )}

      {mode === 'exam' && (
        <form
          className="lzw-exam"
          onSubmit={(event) => {
            event.preventDefault();
            let correct = false;
            if (direction === 'encode') {
              try {
                correct =
                  JSON.stringify(parseCodes(answer)) ===
                  JSON.stringify(exercise.codes);
              } catch {
                /* Mark malformed answers without breaking the exercise. */
              }
            } else correct = answer.trim() === exercise.message;
            setFeedback(
              correct
                ? t(
                    'Réponse correcte. Comparez maintenant votre dictionnaire à la correction.',
                    'Correct answer. Now compare your dictionary with the solution.',
                  )
                : t(
                    'La réponse diffère. Comparez les étapes, puis recommencez pour essayer à nouveau.',
                    'The answer differs. Compare the steps, then restart to try again.',
                  ),
            );
            setCompleted(correct);
            setRevealed(true);
          }}
        >
          <h3>
            {t(
              'À vous : rédigez votre trace sur papier',
              'Your turn: write your trace on paper',
            )}
          </h3>
          <p>
            {t(
              'Construisez le dictionnaire et donnez le résultat complet. La vérification automatique porte sur le résultat ; vérifiez votre raisonnement avec la trace détaillée.',
              'Build the dictionary and give the complete result. Automatic checking covers the result; check your reasoning against the detailed trace.',
            )}
          </p>
          <label>
            {direction === 'encode'
              ? t('Séquence de codes', 'Code sequence')
              : t('Message décodé', 'Decoded message')}
            <textarea
              aria-label={
                direction === 'encode'
                  ? t('Séquence de codes', 'Code sequence')
                  : t('Message décodé', 'Decoded message')
              }
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              maxLength={600}
            />
          </label>
          <div className="lzw-actions">
            <button type="submit">
              {t('Remettre et corriger', 'Submit and check')}
            </button>
            <button
              type="button"
              onClick={() => {
                setRevealed(true);
                setFeedback(
                  t(
                    'Correction révélée : utilisez-la pour comprendre, puis recommencez.',
                    'Solution revealed: use it to understand, then restart.',
                  ),
                );
              }}
            >
              {t('Révéler la solution', 'Reveal solution')}
            </button>
            <button type="button" onClick={reset}>
              {t('Recommencer', 'Restart')}
            </button>
          </div>
          <p role="status">{feedback}</p>
        </form>
      )}

      {(mode !== 'exam' || revealed) && (
        <div className="lzw-workspace">
          <section>
            <h3>
              {t('Dictionnaire à cette étape', 'Dictionary at this step')}
            </h3>
            <p>
              {t('Code suivant', 'Next code')} : {dictionary.length + 1}
            </p>
            <div
              className="lzw-scroll"
              role="region"
              tabIndex={0}
              aria-label={t('Table du dictionnaire', 'Dictionary table')}
            >
              <table>
                <thead>
                  <tr>
                    <th>{t('Code', 'Code')}</th>
                    <th>{t('Chaîne', 'String')}</th>
                  </tr>
                </thead>
                <tbody>
                  {dictionary.map((item) => (
                    <tr
                      key={`${exercise.message}-${item.code}`}
                      className={
                        last?.added?.code === item.code ? 'lzw-new' : ''
                      }
                    >
                      <td>{item.code}</td>
                      <td>{item.word}</td>
                    </tr>
                  ))}
                  {direction === 'decode' && last?.pending && (
                    <tr className="lzw-pending">
                      <td>{last.pending.code}</td>
                      <td>
                        {last.pending.word} · {t('en attente', 'pending')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <section className="lzw-output">
            <h3>{t('Sortie construite', 'Output so far')}</h3>
            <p className="lzw-message" data-testid="lzw-output">
              {direction === 'encode'
                ? visible
                    .filter((s) => s.emitted !== null)
                    .map((s) => s.emitted)
                    .join(' ') || none
                : visible.map((s) => s.phrase).join('') || none}
            </p>
            <h3>{t('Trace détaillée', 'Detailed trace')}</h3>
            <div
              className="lzw-scroll"
              role="region"
              tabIndex={0}
              aria-label={t('Table des étapes', 'Step table')}
            >
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      {direction === 'encode'
                        ? 'w · c'
                        : t('Code reçu', 'Received code')}
                    </th>
                    <th>{t('Sortie', 'Output')}</th>
                    <th>{t('Ajout complété', 'Completed addition')}</th>
                    {direction === 'decode' && (
                      <th>{t('En attente', 'Pending')}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s, index) => (
                    <tr key={index} className={s.special ? 'lzw-special' : ''}>
                      <td>
                        {index + 1}
                        {s.special && ' ★'}
                      </td>
                      <td>
                        {direction === 'encode'
                          ? `${s.w} · ${s.c || t('(fin)', '(end)')}`
                          : s.c}
                      </td>
                      <td>
                        {direction === 'encode'
                          ? (s.emitted ?? none)
                          : s.phrase}
                      </td>
                      <td>
                        {s.added ? `${s.added.word} = ${s.added.code}` : none}
                      </td>
                      {direction === 'decode' && (
                        <td>
                          {s.pending?.word} = {s.pending?.code}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {direction === 'decode' && (
              <p>
                {t(
                  '★ Cas particulier. La dernière entrée en attente n’est pas ajoutée au dictionnaire complété.',
                  '★ Special case. The final pending entry is not added to the completed dictionary.',
                )}
              </p>
            )}
          </section>
        </div>
      )}

      {(done || revealed) && (
        <section
          className="lzw-summary"
          aria-label={t('Bilan du défi', 'Challenge summary')}
        >
          <h3>
            {completed
              ? t('Défi terminé !', 'Challenge completed!')
              : t('Correction à étudier', 'Solution to study')}
          </h3>
          <p>
            {exercise.message.length} {t('lettres', 'letters')} →{' '}
            {exercise.codes.length} {t('codes', 'codes')} · {trace.steps.length}{' '}
            {t('étapes', 'steps')}
          </p>
          <p>
            {t(
              'Moins de codes ne signifie pas automatiquement moins de bits : il faut connaître leur largeur et compter les frais du format.',
              'Fewer codes do not automatically mean fewer bits: account for code width and format overhead.',
            )}
          </p>
          <div className="lzw-actions">
            <button
              type="button"
              onClick={() => {
                const nextSeed =
                  Number(seed) >= 0xffffffff ? 1 : Number(seed) + 1;
                const valid =
                  Number.isInteger(nextSeed) && nextSeed > 0 ? nextSeed : 1;
                setSeed(String(valid));
                load(
                  generateLzw(valid, level),
                  t('Défi généré', 'Generated challenge'),
                );
              }}
            >
              {t('Nouveau défi', 'New challenge')}
            </button>
            <button
              type="button"
              onClick={() => {
                const value = direction === 'encode' ? 'decode' : 'encode';
                setDirection(value);
                setCustom(
                  value === 'encode'
                    ? exercise.message
                    : exercise.codes.join(' '),
                );
                reset();
              }}
            >
              {t('Essayer dans l’autre sens', 'Try the other direction')}
            </button>
            <a href={`/${locale}/lessons/L57/`}>
              {t('Revoir le cas particulier', 'Review the special case')}
            </a>
          </div>
        </section>
      )}
      <label className="lzw-rewards">
        <input
          type="checkbox"
          checked={achievements}
          onChange={(event) => setAchievements(event.target.checked)}
        />
        {t(
          'Afficher les réussites de cette session',
          'Show achievements for this session',
        )}
      </label>
      {achievements && (
        <p role="status">
          {completed
            ? t(
                '★ Bâtisseur de dictionnaire : défi terminé.',
                '★ Dictionary builder: challenge completed.',
              )
            : t(
                'Premier objectif : terminer un défi à votre rythme.',
                'First goal: finish a challenge at your own pace.',
              )}
        </p>
      )}
      <p className="lzw-footnote">
        {t(
          'Atelier public, calculé dans le navigateur. Les résultats ne sont pas enregistrés dans votre progression et ne constituent pas une note d’examen.',
          'Public workshop calculated in your browser. Results are not saved to your progress and do not constitute an exam grade.',
        )}
      </p>
    </section>
  );
}
