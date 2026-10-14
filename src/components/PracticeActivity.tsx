import { useEffect, useState } from 'react';
import type { Locale } from '../lib/i18n';

// Client-side shapes. Answers, feedback and explanations only ever arrive in a
// graded attempt response; they are never part of the exercise payload.
type Localized = { fr: string; en: string };
type Exercise = {
  id: string;
  version: number;
  prompt: Localized;
  hint: Localized;
} & (
  | { type: 'single-choice'; options: { id: string; label: Localized }[] }
  | { type: 'truth-table'; rows: Record<string, string | boolean>[] }
);
type Result = {
  correct: boolean;
  duplicate: boolean;
  independentEvidence: boolean;
  feedback: Localized;
  explanation: Localized;
  rowResults?: Record<string, boolean>;
};
type Entry = {
  version: number;
  answers: Record<string, string>;
  hintShown: boolean;
  submissionId: string;
  result: Result | null;
};
type Stored = { learner: string; entries: Record<string, Entry> };
type Phase = 'idle' | 'loading' | 'ready' | 'signin' | 'unavailable';

const text = {
  fr: {
    title: 'À vous de jouer',
    intro:
      'Six exercices indépendants sur l’implication. Votre première réponse sans indice compte comme preuve de maîtrise ; les essais suivants servent à s’entraîner.',
    start: 'Commencer les exercices',
    loading: 'Chargement des exercices…',
    signIn: 'Se connecter pour s’exercer',
    signInNote:
      'La lecture reste libre. Les exercices et l’enregistrement de vos réponses demandent un compte.',
    progress: 'Voir ma progression',
    unavailable:
      'Les exercices sont momentanément indisponibles. Réessayez dans quelques instants.',
    retryLoad: 'Réessayer',
    exercise: 'Exercice',
    hint: 'Voir l’indice',
    hintLabel: 'Indice',
    submit: 'Valider',
    sending: 'Envoi…',
    again: 'Réessayer cet exercice',
    result: 'Résultat',
    row: 'Ligne',
    correct: 'Correct.',
    incorrect: 'Pas tout à fait.',
    rowOk: 'correct',
    rowBad: 'incorrect',
    saved: 'Tentative enregistrée.',
    evidence: 'Compte comme preuve de maîtrise indépendante.',
    practiceOnly:
      'Enregistrée comme entraînement : un indice ou un essai répété ne compte pas comme preuve.',
    error:
      'La réponse n’a pas pu être enregistrée. Réessayez ; vos choix sont conservés.',
    expired: 'Votre session a expiré. Reconnectez-vous pour continuer.',
  },
  en: {
    title: 'Your turn',
    intro:
      'Six independent exercises on implication. Your first response without a hint counts as mastery evidence; later tries are practice.',
    start: 'Start the exercises',
    loading: 'Loading exercises…',
    signIn: 'Sign in to practise',
    signInNote:
      'Reading stays open. Exercises and saving your answers need an account.',
    progress: 'See my progress',
    unavailable:
      'Exercises are temporarily unavailable. Please try again shortly.',
    retryLoad: 'Try again',
    exercise: 'Exercise',
    hint: 'Show the hint',
    hintLabel: 'Hint',
    submit: 'Check answer',
    sending: 'Sending…',
    again: 'Try this exercise again',
    result: 'Result',
    row: 'Row',
    correct: 'Correct.',
    incorrect: 'Not quite.',
    rowOk: 'correct',
    rowBad: 'incorrect',
    saved: 'Attempt saved.',
    evidence: 'Counts as independent mastery evidence.',
    practiceOnly:
      'Saved as practice: a hint or a repeated try does not count as evidence.',
    error: 'Your answer could not be saved. Try again; your choices are kept.',
    expired: 'Your session has expired. Sign in again to continue.',
  },
} as const;

const draftKey = (lessonId: string) => `um-practice:${lessonId}`;
const startedKey = (lessonId: string) => `um-practice-started:${lessonId}`;

// Unfinished work lives in this tab only and holds answers, never tokens.
function readStored(lessonId: string): Stored | null {
  try {
    const raw = sessionStorage.getItem(draftKey(lessonId));
    const value = raw ? (JSON.parse(raw) as Stored) : null;
    return value && typeof value.learner === 'string' && value.entries
      ? value
      : null;
  } catch {
    return null;
  }
}
function writeStored(lessonId: string, value: Stored) {
  try {
    sessionStorage.setItem(draftKey(lessonId), JSON.stringify(value));
  } catch {
    // Storage can be unavailable; the activity still works without it.
  }
}
function flag(lessonId: string, value?: boolean): boolean {
  try {
    if (value === undefined)
      return sessionStorage.getItem(startedKey(lessonId)) === '1';
    sessionStorage.setItem(startedKey(lessonId), value ? '1' : '0');
  } catch {
    // ignore
  }
  return !!value;
}

const freshEntry = (version: number): Entry => ({
  version,
  answers: {},
  hintShown: false,
  submissionId: crypto.randomUUID(),
  result: null,
});

const variables = (row: Record<string, string | boolean>) =>
  Object.keys(row).filter((key) => key !== 'id');
const bit = (value: string | boolean) =>
  value === true ? '1' : value === false ? '0' : String(value);

function complete(exercise: Exercise, entry: Entry): boolean {
  return exercise.type === 'single-choice'
    ? !!entry.answers.choice
    : exercise.rows.every((row) => !!entry.answers[String(row.id)]);
}

function responseOf(exercise: Exercise, entry: Entry) {
  return exercise.type === 'single-choice'
    ? { optionId: entry.answers.choice }
    : {
        cells: Object.fromEntries(
          exercise.rows.map((row) => [
            String(row.id),
            entry.answers[String(row.id)] === 'true',
          ]),
        ),
      };
}

export default function PracticeActivity({
  lessonId,
  locale,
}: {
  lessonId: string;
  locale: Locale;
}) {
  const t = text[locale];
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [learner, setLearner] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState<Record<string, 'error' | 'expired'>>({});

  async function load() {
    setPhase('loading');
    try {
      const response = await fetch(`/api/exercises/${lessonId}/`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      if (response.status === 401) return setPhase('signin');
      if (!response.ok) return setPhase('unavailable');
      const data = (await response.json()) as {
        learner: string;
        exercises: Exercise[];
      };
      // Drafts belong to one learner and one exercise version.
      const stored = readStored(lessonId);
      const mine = stored?.learner === data.learner ? stored.entries : {};
      setLearner(data.learner);
      setExercises(data.exercises);
      setEntries(
        Object.fromEntries(
          data.exercises.map((exercise) => {
            const previous = mine[exercise.id];
            return [
              exercise.id,
              previous && previous.version === exercise.version
                ? previous
                : freshEntry(exercise.version),
            ];
          }),
        ),
      );
      setPhase('ready');
    } catch {
      setPhase('unavailable');
    }
  }

  useEffect(() => {
    setReady(true);
    // A tab that already started practice resumes after a language switch.
    if (flag(lessonId)) void load();
  }, []);

  useEffect(() => {
    if (phase === 'ready' && learner)
      writeStored(lessonId, { learner, entries });
  }, [entries, learner, phase]);

  const update = (id: string, change: (entry: Entry) => Entry) =>
    setEntries((current) => {
      const entry = current[id];
      return entry ? { ...current, [id]: change(entry) } : current;
    });

  async function submit(exercise: Exercise) {
    const entry = entries[exercise.id];
    if (!entry || busy) return;
    setBusy(exercise.id);
    setFailed(({ [exercise.id]: _, ...rest }) => rest);
    try {
      const response = await fetch('/api/attempts/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          submissionId: entry.submissionId,
          exerciseId: exercise.id,
          version: exercise.version,
          locale,
          hintUsed: entry.hintShown,
          response: responseOf(exercise, entry),
        }),
      });
      if (response.status === 401)
        return setFailed((f) => ({ ...f, [exercise.id]: 'expired' }));
      if (!response.ok)
        return setFailed((f) => ({ ...f, [exercise.id]: 'error' }));
      const result = (await response.json()) as Result;
      update(exercise.id, (current) => ({ ...current, result }));
    } catch {
      setFailed((f) => ({ ...f, [exercise.id]: 'error' }));
    } finally {
      setBusy(null);
    }
  }

  const signInHref = `/${locale}/sign-in/?${new URLSearchParams({
    next: `/${locale}/lessons/${lessonId}/#practice`,
  })}`;

  return (
    <section
      id="practice"
      className="practice"
      aria-labelledby="practice-title"
    >
      <h2 id="practice-title">{t.title}</h2>
      <p>{t.intro}</p>

      {phase === 'idle' && (
        <button
          type="button"
          className="primary-link auth-button"
          disabled={!ready}
          onClick={() => {
            flag(lessonId, true);
            void load();
          }}
        >
          {t.start}
        </button>
      )}
      {phase === 'loading' && <p role="status">{t.loading}</p>}
      {phase === 'signin' && (
        <div className="practice-gate">
          <p role="status">{t.signInNote}</p>
          <a className="primary-link" href={signInHref}>
            {t.signIn}
          </a>
        </div>
      )}
      {phase === 'unavailable' && (
        <div className="practice-gate">
          <p role="alert">{t.unavailable}</p>
          <button
            type="button"
            className="primary-link auth-button"
            onClick={() => void load()}
          >
            {t.retryLoad}
          </button>
        </div>
      )}

      {phase === 'ready' &&
        exercises.map((exercise, index) => {
          const entry = entries[exercise.id];
          if (!entry) return null;
          const locked = entry.result !== null;
          const headingId = `${exercise.id}-title`;
          return (
            <article
              key={exercise.id}
              className="practice-exercise"
              aria-labelledby={headingId}
            >
              <h3 id={headingId}>
                {t.exercise} {index + 1}
              </h3>
              {exercise.type === 'single-choice' ? (
                <fieldset className="practice-fieldset" disabled={locked}>
                  <legend>{exercise.prompt[locale]}</legend>
                  {exercise.options.map((option) => (
                    <label key={option.id} className="practice-option">
                      <input
                        type="radio"
                        name={exercise.id}
                        value={option.id}
                        checked={entry.answers.choice === option.id}
                        onChange={() =>
                          update(exercise.id, (current) => ({
                            ...current,
                            answers: { choice: option.id },
                          }))
                        }
                      />
                      <span>{option.label[locale]}</span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <div className="practice-table-wrap">
                  <table className="practice-table">
                    <caption>{exercise.prompt[locale]}</caption>
                    <thead>
                      <tr>
                        {variables(exercise.rows[0] ?? {}).map((name) => (
                          <th key={name} scope="col">
                            {name}
                          </th>
                        ))}
                        <th scope="col">{t.result}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.rows.map((row) => {
                        const rowId = String(row.id);
                        const label = variables(row)
                          .map((name) => `${name} = ${bit(row[name] ?? '')}`)
                          .join(', ');
                        const verdict = entry.result?.rowResults?.[rowId];
                        return (
                          <tr key={rowId}>
                            {variables(row).map((name) => (
                              <td key={name}>{bit(row[name] ?? '')}</td>
                            ))}
                            <td>
                              <fieldset
                                className="practice-cell"
                                disabled={locked}
                              >
                                <legend className="visually-hidden">
                                  {t.row} {label}
                                </legend>
                                {(['true', 'false'] as const).map((value) => (
                                  <label key={value} className="practice-bit">
                                    <input
                                      type="radio"
                                      name={`${exercise.id}-${rowId}`}
                                      value={value}
                                      checked={entry.answers[rowId] === value}
                                      onChange={() =>
                                        update(exercise.id, (current) => ({
                                          ...current,
                                          answers: {
                                            ...current.answers,
                                            [rowId]: value,
                                          },
                                        }))
                                      }
                                    />
                                    <span>{value === 'true' ? '1' : '0'}</span>
                                  </label>
                                ))}
                                {verdict !== undefined && (
                                  <span
                                    className={
                                      verdict ? 'practice-ok' : 'practice-bad'
                                    }
                                  >
                                    {verdict ? '✓ ' : '✗ '}
                                    <span className="visually-hidden">
                                      {verdict ? t.rowOk : t.rowBad}
                                    </span>
                                  </span>
                                )}
                              </fieldset>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {!locked && (
                <div className="practice-actions">
                  <button
                    type="button"
                    className="primary-link auth-button"
                    disabled={!complete(exercise, entry) || busy !== null}
                    onClick={() => void submit(exercise)}
                  >
                    {busy === exercise.id ? t.sending : t.submit}
                  </button>
                  {!entry.hintShown && (
                    <button
                      type="button"
                      className="practice-secondary"
                      onClick={() =>
                        update(exercise.id, (current) => ({
                          ...current,
                          hintShown: true,
                        }))
                      }
                    >
                      {t.hint}
                    </button>
                  )}
                </div>
              )}
              {entry.hintShown && !locked && (
                <p className="practice-hint">
                  <strong>{t.hintLabel} :</strong> {exercise.hint[locale]}
                </p>
              )}
              {failed[exercise.id] === 'error' && (
                <p role="alert" className="practice-error">
                  {t.error}
                </p>
              )}
              {failed[exercise.id] === 'expired' && (
                <p role="alert" className="practice-error">
                  {t.expired} <a href={signInHref}>{t.signIn}</a>
                </p>
              )}

              <div role="status" aria-live="polite" className="practice-result">
                {entry.result && (
                  <>
                    <p
                      className={
                        entry.result.correct ? 'practice-ok' : 'practice-bad'
                      }
                    >
                      <strong>
                        {entry.result.correct ? t.correct : t.incorrect}
                      </strong>{' '}
                      {entry.result.feedback[locale]}
                    </p>
                    <p>{entry.result.explanation[locale]}</p>
                    <p className="practice-note">
                      {t.saved}{' '}
                      {entry.result.independentEvidence
                        ? t.evidence
                        : t.practiceOnly}
                    </p>
                  </>
                )}
              </div>
              {locked && (
                <button
                  type="button"
                  className="practice-secondary"
                  onClick={() =>
                    update(exercise.id, (current) => ({
                      ...freshEntry(current.version),
                      hintShown: current.hintShown,
                    }))
                  }
                >
                  {t.again}
                </button>
              )}
            </article>
          );
        })}
      {phase === 'ready' && (
        <p>
          <a href={`/${locale}/progress/`}>{t.progress}</a>
        </p>
      )}
    </section>
  );
}
