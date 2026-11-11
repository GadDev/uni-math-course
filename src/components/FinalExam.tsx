import { useEffect, useRef, useState } from 'react';
import Tex from './Tex';
import { revalidateSession, subscribeSession } from '../lib/session-lifecycle';
import {
  completed,
  parseHistory,
  parseResponses,
  validStoredPaper,
} from '../lib/final-exam/responses';
import {
  BANK_VERSION,
  topics,
  type History,
  type Paper,
  type Responses,
  type Result,
  type Response as Answer,
  type PublicQuestion,
} from '../lib/final-exam/types';

function Plot({ graph }: { graph: NonNullable<PublicQuestion['graph']> }) {
  const x = (n: number) => 200 + 35 * n,
    y = (n: number) => 200 - 35 * n;
  return (
    <figure className="exam-graph">
      <svg viewBox="0 0 400 400" role="img" aria-label={graph.description}>
        {Array.from({ length: 11 }, (_, i) => i - 5).map((n) => (
          <g key={n}>
            <path className="exam-grid" d={`M${x(n)} 25V375 M25 ${y(n)}H375`} />
            {n !== 0 && (
              <>
                <text x={x(n)} y={217} textAnchor="middle">
                  {n}
                </text>
                <text x={185} y={y(n) + 4} textAnchor="end">
                  {n}
                </text>
              </>
            )}
          </g>
        ))}
        <path className="exam-axis" d="M25 200H375 M200 375V25" />
        <text x="378" y="195">
          x
        </text>
        <text x="208" y="22">
          y
        </text>
        <text x="185" y="217">
          0
        </text>
        <path
          className="exam-curve"
          d={graph.points
            .map(([a, b], i) => `${i ? 'L' : 'M'}${x(a)} ${y(b)}`)
            .join(' ')}
        />
        {graph.points.map(([a, b], i) => (
          <g key={i}>
            <circle cx={x(a)} cy={y(b)} r="4" fill="currentColor" />
            <text x={x(a) + 7} y={y(b) - 8}>
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>{graph.description}</figcaption>
    </figure>
  );
}
const format = (value: number) =>
  new Intl.NumberFormat('fr', { maximumFractionDigits: 2 }).format(value);

export default function FinalExam({ learner }: { learner: string }) {
  const key = 'um-practice:final:v1';
  const historyKey = 'um-practice:final-history:v1';
  const [paper, setPaper] = useState<Paper | null>(null);
  const [responses, setResponses] = useState<Responses>({});
  const [history, setHistory] = useState<History>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [self, setSelf] = useState<Record<string, number[]>>({});
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState(false),
    [unavailable, setUnavailable] = useState(false);
  const [storageFailure, setStorageFailure] = useState(false),
    [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false),
    [now, setNow] = useState(Date.now());
  const [retired, setRetired] = useState(false);
  const generation = useRef(0),
    controller = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const saveAllowed = useRef(true);
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(
        sessionStorage.getItem(historyKey) ?? 'null',
      );
      if (savedHistory?.learner === learner)
        setHistory(parseHistory(savedHistory.items) ?? []);
      const saved = JSON.parse(sessionStorage.getItem(key) ?? 'null');
      if (saved?.learner === learner && validStoredPaper(saved.paper)) {
        const parsed = parseResponses(saved.paper, saved.responses);
        if (parsed) {
          setPaper(saved.paper);
          setResponses(parsed);
          // Result is deliberately fetched again after reload: local storage is not a grading authority.
          // A submitted answer snapshot remains locked, and is re-marked on request.
          if (saved.submitted) setConfirm(true);
        }
      } else if (saved) {
        setStorageFailure(true);
        sessionStorage.removeItem(key);
      }
    } catch {
      setStorageFailure(true);
    }
    setReady(true);
    return () => {
      generation.current++;
      controller.current?.abort();
    };
  }, []);
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    if (!ready || !paper || invalid || !saveAllowed.current) return;
    try {
      const previous = JSON.parse(sessionStorage.getItem(key) ?? 'null');
      if (previous?.learner === learner && previous?.submitted) setLocked(true);
      sessionStorage.setItem(
        key,
        JSON.stringify({
          learner,
          paper,
          responses,
          submitted: !!result || locked || !!previous?.submitted,
        }),
      );
    } catch {
      setStorageFailure(true);
    }
  }, [ready, paper, responses, result, locked, invalid]);
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(
    () =>
      subscribeSession((state) => {
        if (state.status === 'unavailable') {
          setUnavailable(true);
          return;
        }
        setUnavailable(false);
        if (state.status === 'anonymous' || state.learner !== learner) {
          saveAllowed.current = false;
          generation.current++;
          controller.current?.abort();
          setInvalid(true);
          setPaper(null);
          setResponses({});
          setResult(null);
          setSelf({});
          setHistory([]);
          setBusy(false);
          try {
            sessionStorage.removeItem(key);
            sessionStorage.removeItem(historyKey);
          } catch {
            /* Memory cleared. */
          }
        }
      }),
    [learner],
  );
  useEffect(() => {
    if (confirm || result) heading.current?.focus();
  }, [confirm, result]);
  async function request(action: 'start' | 'grade') {
    if (busy || invalid || unavailable) return;
    const current = generation.current;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    setError('');
    setRetired(false);
    try {
      const response = await fetch('/api/training-exams/final/', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(15000)]),
        body: JSON.stringify(
          action === 'start'
            ? {
                action,
                version: BANK_VERSION,
                expectedLearnerId: learner,
                history,
              }
            : {
                action,
                version: BANK_VERSION,
                expectedLearnerId: learner,
                ids: paper!.ids,
                seed: paper!.seed,
                startedAt: paper!.startedAt,
                responses,
              },
        ),
      });
      const data = await response.json();
      if (current !== generation.current) return;
      if (response.status === 401 || data.error === 'learner_context_changed') {
        saveAllowed.current = false;
        setInvalid(true);
        setPaper(null);
        setResponses({});
        setResult(null);
        setHistory([]);
        setSelf({});
        try {
          sessionStorage.removeItem(key);
          sessionStorage.removeItem(historyKey);
        } catch {
          /* Memory cleared. */
        }
        return;
      }
      if (!response.ok)
        throw new Error(
          data.error === 'exam_version_changed' ? 'version' : 'request',
        );
      if (action === 'start') {
        if (!validStoredPaper(data)) throw new Error('request');
        setPaper(data);
        setNow(Date.now());
        setResponses({});
        setResult(null);
        setSelf({});
        setLocked(false);
        setConfirm(false);
        const seen = new Map(history.map((h) => [h.id, h.seen]));
        for (const id of data.ids) seen.set(id, data.startedAt);
        const next = [...seen].map(([id, seen]) => ({ id, seen }));
        setHistory(next);
        try {
          sessionStorage.removeItem(key);
          sessionStorage.setItem(
            historyKey,
            JSON.stringify({ learner, items: next }),
          );
        } catch {
          setStorageFailure(true);
        }
      } else {
        if (
          data.version !== BANK_VERSION ||
          !Array.isArray(data.marks) ||
          data.marks.length !== 18
        )
          throw new Error('request');
        setResult(data);
        setLocked(true);
        setConfirm(false);
      }
    } catch (e) {
      if (current === generation.current) {
        setRetired(e instanceof Error && e.message === 'version');
        setError(
          e instanceof Error && e.message === 'version'
            ? 'La banque a changé. Votre ancien sujet reste visible. Revenez à la préparation pour démarrer une nouvelle version.'
            : 'La demande a échoué. Vos réponses sont conservées. Vérifiez votre connexion et réessayez.',
        );
      }
    } finally {
      if (current === generation.current) setBusy(false);
    }
  }
  if (invalid)
    return (
      <div role="alert">
        <p>Votre session a changé. Reconnectez-vous pour composer un sujet.</p>
        <a href="/fr/sign-in/?next=%2Ffr%2Ftraining-exams%2Ffinal%2F">
          Se connecter
        </a>
      </div>
    );
  const expired = !!paper && now >= paper.deadline;
  const disabled = busy || unavailable || expired || locked || !!result;
  const update = (id: string, value: Answer) => {
    if (disabled) return;
    setResponses((old) => ({ ...old, [id]: value }));
    setConfirm(false);
  };
  const count =
    paper?.ids.filter((id) => completed(paper, responses, id)).length ?? 0;
  const assessed = (id: string) =>
    result?.marks
      .find((m) => m.id === id)
      ?.rubric?.every((_, i) => self[id]?.[i] !== undefined) ?? false;
  const manualEarned =
    result?.marks
      .filter((m) => m.earned === null)
      .reduce(
        (sum, m) => sum + (self[m.id]?.reduce((a, b) => a + b, 0) ?? 0),
        0,
      ) ?? 0;
  const allAssessed = result?.marks
    .filter((m) => m.earned === null)
    .every((m) => assessed(m.id));
  const remaining = paper
    ? Math.max(0, Math.ceil((paper.deadline - now) / 1000))
    : 7200;
  return (
    <div className="training-exam final-exam">
      <p>
        Entraînement indépendant en français. L’évaluation officielle est un
        examen final écrit valant 100 % de la note du cours. La durée, le barème
        et les pondérations ci-dessous sont des choix d’entraînement, sans
        valeur de règlement officiel.
      </p>
      {storageFailure && (
        <p role="status">
          Le stockage est indisponible : la reprise après actualisation et
          l’historique des prochains essais ne sont pas garantis.
        </p>
      )}
      {unavailable && (
        <div role="alert">
          <p>La session ne peut pas être vérifiée.</p>
          <button onClick={() => void revalidateSession()}>
            Vérifier à nouveau
          </button>
        </div>
      )}
      {!paper ? (
        <section className="exam-preparation">
          <h2>Préparer le sujet</h2>
          <p>
            120 minutes : 108 minutes de travail estimé et 12 minutes de
            relecture. Le sujet contient 18 questions, choisies dans une banque
            de 180 questions originales.
          </p>
          <ul>
            {Object.entries(topics).map(([id, label]) => (
              <li key={id}>
                {label} : 3 questions, 10 points, 18 minutes estimées.
              </li>
            ))}
          </ul>
          <p>
            Total : 60 points, convertibles sur 20 : 27 points de correction
            automatique et 33 points à autoévaluer. Chaque thème comporte une
            question de base (2 points), une application (3 points) et un
            problème rédigé (5 points).
          </p>
          <p>
            Les réponses à choix sont notées en tout ou rien, sans retrait de
            points. Pour une réponse multiple, sélectionner exactement toutes
            les bonnes propositions. Pour un calcul à plusieurs champs, chaque
            champ vaut une part égale des points. Une réponse omise vaut zéro en
            correction automatique.
          </p>
          <p>
            Les fractions équivalentes et les décimales exactes avec virgule ou
            point sont acceptées. Aucun calcul littéral n’est interprété dans
            les champs numériques. Une tolérance n’est appliquée que si elle est
            indiquée. Les problèmes rédigés, dessins et arbres de Huffman sont
            autoévalués après remise avec une grille; toute construction
            correcte équivalente est admise.
          </p>
          <p>
            Le chronomètre commence au lancement et continue pendant une
            fermeture de page. À 120 minutes, les réponses sont figées; vous
            demandez ensuite la correction. Les solutions restent cachées
            jusqu’à cette demande confirmée. Le temps est géré dans votre
            navigateur pour cet entraînement.
          </p>
          <p>
            Vous pouvez rédiger sur papier ou dans les zones prévues. Les
            brouillons et l’historique restent dans cet onglet et sont effacés à
            la fermeture de l’onglet, à la déconnexion ou au changement de
            compte. Ils ne sont pas synchronisés avec vos autres appareils et
            n’alimentent pas votre progression. Les réponses sont envoyées au
            serveur uniquement pour la correction.
          </p>
          <p>
            Les questions et familles les moins récemment vues sont
            privilégiées. Après épuisement des alternatives, certaines questions
            reviennent. Un sujet équilibré est conservé à chaque essai.
          </p>
          <p className="status">
            Vérification mathématique par l’auteur; aucune validation
            indépendante ou approbation universitaire revendiquée.
          </p>
          <button
            className="primary-link"
            disabled={!ready || busy || unavailable}
            onClick={() => void request('start')}
          >
            Commencer les 120 minutes
          </button>
        </section>
      ) : (
        <>
          {!result && (
            <div className="exam-toolbar">
              <p>{count} / 18 questions renseignées</p>
              <p>
                Temps restant :{' '}
                <span role="timer" aria-live="off">
                  {Math.floor(remaining / 60)}:
                  {String(remaining % 60).padStart(2, '0')}
                </span>
              </p>
              <button onClick={() => window.print()}>Imprimer le sujet</button>
            </div>
          )}
          {expired && !result && (
            <p role="status">
              Temps écoulé : vos réponses sont figées. Confirmez la remise pour
              afficher la correction.
            </p>
          )}
          {locked && !result && (
            <p role="status">
              Sujet déjà remis : vos réponses restent figées. Redemandez la
              correction pour retrouver les résultats.
            </p>
          )}
          {result && (
            <section className="exam-results">
              <h2 tabIndex={-1} ref={heading}>
                Résultats de l’entraînement
              </h2>
              <p>
                Correction automatique :{' '}
                <strong>
                  {format(result.automatic)} / {result.automaticMaximum}
                </strong>
                .
              </p>
              <p>
                Partie à autoévaluer : {result.manualMaximum} points.{' '}
                {allAssessed
                  ? `Total avec votre autoévaluation : ${format(result.automatic + manualEarned)} / 60, soit ${format((result.automatic + manualEarned) / 3)} / 20.`
                  : 'Complétez toutes les grilles pour obtenir un total estimé sur 20.'}
              </p>
              <p>
                L’autoévaluation repose sur votre jugement; elle ne constitue
                pas une note corrigée par un enseignant. Elle est réinitialisée
                lors d’une actualisation.
              </p>
              <ul>
                {Object.entries(topics).map(([topic, label]) => {
                  const marks = result.marks.filter((m) => m.topic === topic);
                  const auto = marks.filter((m) => m.earned !== null);
                  const manual = marks.filter((m) => m.earned === null);
                  const done = manual.every((m) => assessed(m.id));
                  return (
                    <li key={topic}>
                      <strong>{label}</strong> : automatique{' '}
                      {format(auto.reduce((s, m) => s + m.earned!, 0))}/
                      {auto.reduce((s, m) => s + m.maximum, 0)}; autoévaluation{' '}
                      {done
                        ? format(
                            manual.reduce(
                              (s, m) =>
                                s +
                                (self[m.id]?.reduce((a, b) => a + b, 0) ?? 0),
                              0,
                            ),
                          )
                        : 'à compléter'}
                      /{manual.reduce((s, m) => s + m.maximum, 0)}.{' '}
                      <a href={`#${marks[0]!.id}`}>
                        Revoir les corrections et les leçons
                      </a>
                    </li>
                  );
                })}
              </ul>
              <button onClick={() => window.print()}>
                Imprimer avec les corrections
              </button>
            </section>
          )}
          <nav
            className="exam-question-nav"
            aria-label="Naviguer entre les questions"
          >
            {paper.questions.map((q, i) => (
              <a
                key={q.id}
                href={`#${q.id}`}
                data-complete={completed(paper, responses, q.id)}
                aria-label={`Question ${i + 1}${completed(paper, responses, q.id) ? ', renseignée' : ', incomplète'}`}
              >
                {i + 1}
              </a>
            ))}
          </nav>
          <p>
            Réponses numériques : entier, fraction de deux entiers, ou décimale
            avec virgule ou point. Les formes approchées ne sont acceptées
            qu’avec la tolérance affichée.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setConfirm(true);
            }}
          >
            {paper.questions.map((q, i) => {
              const value = responses[q.id],
                marked = result?.marks.find((m) => m.id === q.id);
              return (
                <section
                  id={q.id}
                  data-question={q.id}
                  className="exam-question"
                  key={q.id}
                >
                  <h2>
                    {String(i + 1).padStart(2, '0')}{' '}
                    <span>{topics[q.topic]}</span>
                  </h2>
                  <p>
                    {q.marks} points · {q.minutes} minutes estimées ·{' '}
                    {q.difficulty === 'easy'
                      ? 'Bases'
                      : q.difficulty === 'medium'
                        ? 'Application'
                        : 'Approfondissement'}
                  </p>
                  <div id={`${q.id}-prompt`} className="final-prompt">
                    <Tex text={q.prompt} tableLabel="Données de la question" />
                  </div>
                  {q.graph && <Plot graph={q.graph} />}
                  <fieldset
                    disabled={disabled}
                    aria-describedby={`${q.id}-prompt`}
                  >
                    <legend>
                      {q.type === 'single'
                        ? 'Une seule réponse'
                        : q.type === 'multi'
                          ? 'Toutes les bonnes réponses'
                          : q.type === 'numeric'
                            ? 'Vos résultats'
                            : 'Votre démarche — autoévaluation après remise'}
                    </legend>
                    {q.type === 'written' ? (
                      <>
                        <label className="final-written">
                          Raisonnement, calculs ou référence à votre feuille
                          papier
                          <textarea
                            maxLength={2000}
                            rows={6}
                            name={q.id}
                            value={typeof value === 'string' ? value : ''}
                            onChange={(e) => update(q.id, e.target.value)}
                          />
                        </label>
                        <p>
                          Pour un graphique ou un arbre : travaillez sur papier,
                          puis décrivez vos étapes ici si vous le souhaitez.
                        </p>
                      </>
                    ) : q.type === 'numeric' ? (
                      <div className="exam-fields">
                        {q.fields!.map((f) => (
                          <label key={f.id}>
                            <span>
                              <Tex text={f.label} />
                              {f.tolerance !== undefined &&
                                ` (tolérance ±${String(f.tolerance).replace('.', ',')})`}
                            </span>
                            <input
                              name={`${q.id}-${f.id}`}
                              maxLength={64}
                              autoComplete="off"
                              spellCheck={false}
                              value={
                                (value as Record<string, string> | undefined)?.[
                                  f.id
                                ] ?? ''
                              }
                              onChange={(e) =>
                                update(q.id, {
                                  ...((value as Record<string, string>) ?? {}),
                                  [f.id]: e.target.value,
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="exam-options">
                        {q.options!.map((o, index) => (
                          <label key={o.id}>
                            <input
                              type={q.type === 'single' ? 'radio' : 'checkbox'}
                              name={q.id}
                              value={o.id}
                              checked={
                                Array.isArray(value) && value.includes(o.id)
                              }
                              onChange={(e) => {
                                const prev = Array.isArray(value) ? value : [];
                                update(
                                  q.id,
                                  q.type === 'single'
                                    ? [o.id]
                                    : e.target.checked
                                      ? [...prev, o.id]
                                      : prev.filter((id) => id !== o.id),
                                );
                              }}
                            />
                            <span className="exam-option-letter">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>
                              <Tex text={o.label} />
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </fieldset>
                  {marked && (
                    <div
                      className="exam-solution"
                      data-correct={marked.earned === marked.maximum}
                    >
                      <h3>
                        {marked.earned === null
                          ? 'À autoévaluer'
                          : `${format(marked.earned)} / ${marked.maximum} points`}
                      </h3>
                      <p>
                        <Tex text={marked.explanation} />
                      </p>
                      <p>
                        <strong>Piège à éviter : </strong>
                        <Tex text={marked.pitfall} />
                      </p>
                      {marked.fields && (
                        <ul>
                          {q.fields!.map((f) => (
                            <li key={f.id}>
                              <Tex text={f.label} />:{' '}
                              {(marked.answer as Record<string, string>)[f.id]}{' '}
                              — {marked.fields![f.id] ? 'correct' : 'à revoir'}
                            </li>
                          ))}
                        </ul>
                      )}
                      {marked.feedback && (
                        <ul>
                          {q.options!.map((o) => {
                            const f = marked.feedback!.find(
                              (f) => f.id === o.id,
                            )!;
                            return (
                              <li key={o.id}>
                                <Tex text={o.label} /> —{' '}
                                {f.correct
                                  ? 'proposition juste'
                                  : 'proposition fausse'}
                                . <Tex text={f.text} />
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {marked.rubric && (
                        <fieldset>
                          <legend>Votre grille d’autoévaluation</legend>
                          {marked.rubric.map((r, index) => (
                            <label className="self-mark" key={index}>
                              <span>
                                <Tex text={r.label} />
                              </span>
                              <select
                                aria-label={`Question ${i + 1}, critère ${index + 1}`}
                                value={self[q.id]?.[index] ?? ''}
                                onChange={(e) =>
                                  setSelf((old) => {
                                    const scores = [...(old[q.id] ?? [])];
                                    if (e.target.value === '')
                                      delete scores[index];
                                    else scores[index] = Number(e.target.value);
                                    return { ...old, [q.id]: scores };
                                  })
                                }
                              >
                                <option value="">À évaluer</option>
                                {Array.from(
                                  { length: r.points + 1 },
                                  (_, j) => (
                                    <option key={j} value={j}>
                                      {j} / {r.points}
                                    </option>
                                  ),
                                )}
                              </select>
                            </label>
                          ))}
                        </fieldset>
                      )}
                      <a href={`/fr/lessons/${q.lessonId}/`}>
                        Réviser la leçon {q.lessonId} →
                      </a>
                    </div>
                  )}
                </section>
              );
            })}
            {!result && (
              <section className="exam-finish">
                {confirm ? (
                  <>
                    <h2 ref={heading} tabIndex={-1}>
                      Confirmer la remise
                    </h2>
                    <p>
                      {18 - count} question(s) incomplète(s). Les réponses
                      seront figées et les corrections révélées. Une démarche
                      faite sur papier peut être évaluée avec les grilles après
                      remise.
                    </p>
                    <button
                      type="button"
                      className="primary-link"
                      disabled={busy || unavailable}
                      onClick={() => void request('grade')}
                    >
                      Confirmer et voir la correction
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirm(false)}
                    >
                      Revenir au sujet
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="primary-link"
                    disabled={busy || unavailable}
                  >
                    Terminer et corriger
                  </button>
                )}
              </section>
            )}
          </form>
          {result && (
            <div className="exam-finish">
              <p>
                Le prochain sujet conserve les compétences et privilégie les
                questions les moins récemment vues.
              </p>
              <button
                disabled={busy || unavailable}
                onClick={() => {
                  setPaper(null);
                  setResult(null);
                  setResponses({});
                  setSelf({});
                  setLocked(false);
                  setConfirm(false);
                  try {
                    sessionStorage.removeItem(key);
                  } catch {
                    setStorageFailure(true);
                  }
                }}
              >
                Préparer une nouvelle tentative
              </button>
            </div>
          )}
        </>
      )}
      {error && (
        <p className="exam-error" role="alert">
          {error}
        </p>
      )}
      {retired && (
        <button
          type="button"
          onClick={() => {
            window.print();
          }}
        >
          Imprimer le brouillon conservé
        </button>
      )}
      {retired && (
        <button
          type="button"
          onClick={() => {
            setPaper(null);
            setResponses({});
            setResult(null);
            setSelf({});
            setLocked(false);
            setConfirm(false);
            setError('');
            setRetired(false);
            try {
              sessionStorage.removeItem(key);
            } catch {
              setStorageFailure(true);
            }
          }}
        >
          Abandonner ce brouillon et préparer un nouveau sujet
        </button>
      )}
    </div>
  );
}
