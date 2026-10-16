import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../lib/i18n';
import Tex from './Tex';
import { practiceHref, type PracticeTarget } from '../lib/practice-navigation';

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
type SubmittedResponse =
  { optionId: string } | { cells: Record<string, boolean> };
type Submission = { answers: Record<string, string>; hintUsed: boolean };
type Result = {
  exerciseId: string;
  exerciseVersion: number;
  response: SubmittedResponse;
  hintUsed: boolean;
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
  hintUsed: boolean;
  submissionId: string;
  submission: Submission | null;
  result: Result | null;
};
type Stored = {
  learner: string;
  currentExerciseId?: string;
  entries: Record<string, Entry>;
};
type Phase = 'loading' | 'ready' | 'signin' | 'unavailable';

const text = {
  fr: {
    kicker: 'Pratiquer',
    title: 'À vous de raisonner',
    subtitle: 'Initiation · Exercice original · Version 1',
    reviewKicker: 'Comprendre son erreur',
    reviewTitle: ['Revoir', 'Comprendre', 'Réessayer'],
    reviewSubtitle: 'Une erreur peut préciser une idée.',
    doneTitle: ['Bien raisonné'],
    doneSubtitle:
      'Votre réponse est juste. Lisez l’explication, puis continuez.',
    loading: 'Chargement des exercices…',
    signIn: 'Se connecter pour s’exercer',
    signInNote:
      'La lecture reste libre. Les exercices et l’enregistrement de vos réponses demandent un compte.',
    unavailable:
      'Les exercices sont momentanément indisponibles. Réessayez dans quelques instants.',
    retryLoad: 'Réessayer',
    steps: 'Exercices',
    exercise: 'Exercice',
    of: 'sur',
    chooseOne: 'Choisissez une seule réponse.',
    complete: 'Complétez chaque ligne.',
    hint: 'Afficher un indice',
    optional: 'Facultatif',
    hintLabel: 'Indice',
    submit: 'Vérifier ma réponse',
    sending: 'Envoi…',
    recover: 'Vérifier l’enregistrement',
    pending:
      'Cette réponse est verrouillée jusqu’à confirmation de son enregistrement. Vérifiez pour retrouver le résultat sans créer de doublon.',
    needAnswer: 'Choisissez une réponse pour continuer.',
    needRows: 'Complétez toutes les lignes pour continuer.',
    example: 'Revoir l’exemple expliqué',
    lesson: 'Revoir la leçon',
    footnote: 'Pas de chronomètre. Pas de classement.',
    extended:
      'Exercices d’un cours étendu : leur relecture mathématique et linguistique n’est pas terminée. Signalez toute erreur à la personne qui gère le cours.',
    exerciseTitle: 'Exercice',
    yourChoice: 'Votre choix',
    yourAnswer: 'Votre réponse',
    yourRows: 'Vos réponses',
    toReview: 'À revoir',
    right: 'Correct',
    again: 'Réessayer cet exercice',
    next: 'Exercice suivant',
    reviews: 'Retrouver mes révisions',
    row: 'Ligne',
    result: 'Résultat',
    rowOk: 'correct',
    rowBad: 'incorrect',
    saved: 'Tentative enregistrée.',
    evidence: 'Compte comme preuve de maîtrise indépendante.',
    practiceOnly:
      'La correction est révélée. Réessayer cet exercice, ou répondre après un indice, ne constitue pas une nouvelle preuve indépendante.',
    error:
      'La réponse n’a pas pu être enregistrée. Réessayez ; vos choix sont conservés.',
    expired: 'Votre session a expiré. Reconnectez-vous pour continuer.',
  },
  en: {
    kicker: 'Practise',
    title: 'Your turn to reason',
    subtitle: 'Introductory · Original exercise · Version 1',
    reviewKicker: 'Understand your mistake',
    reviewTitle: ['Review', 'Understand', 'Retry'],
    reviewSubtitle: 'A mistake can sharpen an idea.',
    doneTitle: ['Well reasoned'],
    doneSubtitle:
      'Your answer is correct. Read the explanation, then carry on.',
    loading: 'Loading exercises…',
    signIn: 'Sign in to practise',
    signInNote:
      'Reading stays open. Exercises and saving your answers need an account.',
    unavailable:
      'Exercises are temporarily unavailable. Please try again shortly.',
    retryLoad: 'Try again',
    steps: 'Exercises',
    exercise: 'Exercise',
    of: 'of',
    chooseOne: 'Choose one answer only.',
    complete: 'Complete every row.',
    hint: 'Show a hint',
    optional: 'Optional',
    hintLabel: 'Hint',
    submit: 'Check my answer',
    sending: 'Sending…',
    recover: 'Check saved response',
    pending:
      'This response is locked until its save is confirmed. Check to recover the result without creating a duplicate.',
    needAnswer: 'Choose an answer to continue.',
    needRows: 'Complete every row to continue.',
    example: 'Review the worked example',
    lesson: 'Review the lesson',
    footnote: 'No timer. No ranking.',
    extended:
      'Exercises from the extended course: their mathematical and language review is not finished. Report any error to the person running the course.',
    exerciseTitle: 'Exercise',
    yourChoice: 'Your choice',
    yourAnswer: 'Your answer',
    yourRows: 'Your answers',
    toReview: 'To review',
    right: 'Correct',
    again: 'Try this exercise again',
    next: 'Next exercise',
    reviews: 'Find my reviews',
    row: 'Row',
    result: 'Result',
    rowOk: 'correct',
    rowBad: 'incorrect',
    saved: 'Attempt saved.',
    evidence: 'Counts as independent mastery evidence.',
    practiceOnly:
      'The correction is revealed. Trying this exercise again, or answering after a hint, is not new independent evidence.',
    error: 'Your answer could not be saved. Try again; your choices are kept.',
    expired: 'Your session has expired. Sign in again to continue.',
  },
} as const;

const draftKey = (lessonId: string) => `um-practice:${lessonId}`;

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

const freshEntry = (version: number): Entry => ({
  version,
  answers: {},
  hintShown: false,
  hintUsed: false,
  submissionId: crypto.randomUUID(),
  submission: null,
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

function responseOf(exercise: Exercise, entry: Pick<Entry, 'answers'>) {
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

// Only the recorded response may supply the choices shown beside feedback.
function answersFromResponse(
  exercise: Exercise,
  raw: unknown,
): Record<string, string> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  if (exercise.type === 'single-choice') {
    const id = (raw as { optionId?: unknown }).optionId;
    return typeof id === 'string' &&
      exercise.options.some((option) => option.id === id)
      ? { choice: id }
      : null;
  }
  const cells = (raw as { cells?: unknown }).cells;
  if (!cells || typeof cells !== 'object' || Array.isArray(cells)) return null;
  const values = cells as Record<string, unknown>;
  if (
    Object.keys(values).length !== exercise.rows.length ||
    exercise.rows.some(
      (row) =>
        !Object.hasOwn(values, String(row.id)) ||
        typeof values[String(row.id)] !== 'boolean',
    )
  )
    return null;
  return Object.fromEntries(
    exercise.rows.map((row) => [
      String(row.id),
      String(values[String(row.id)]),
    ]),
  );
}

function restoreEntry(exercise: Exercise, previous: Entry): Entry {
  const hintUsed = previous.hintUsed || previous.hintShown;
  const saved = previous.result;
  const answers =
    saved?.exerciseId === exercise.id &&
    saved.exerciseVersion === exercise.version
      ? answersFromResponse(exercise, saved.response)
      : null;
  if (saved && answers)
    return {
      ...previous,
      answers,
      hintUsed: hintUsed || saved.hintUsed,
      submission: { answers, hintUsed: saved.hintUsed },
      result: saved,
    };
  // Older cached feedback has no recorded answer. Resolve its existing ID
  // with the server instead of trusting potentially changed local choices.
  return {
    ...previous,
    answers: previous.submission?.answers ?? previous.answers,
    hintUsed: hintUsed || !!previous.submission?.hintUsed,
    result: null,
    submission:
      previous.submission ??
      (saved ? { answers: { ...previous.answers }, hintUsed } : null),
  };
}

// Options are marked 1–4 rather than A–D: the option labels themselves use the
// variable names A and B (for example "A = 0, B = 1").
const marker = (index: number) => String(index + 1);

export default function PracticeActivity({
  lessonId,
  requestedTarget,
  locale,
  lessonNumber,
  exampleHref,
  hasExample,
  extended,
}: {
  lessonId: string;
  requestedTarget: PracticeTarget | null;
  locale: Locale;
  lessonNumber: string;
  exampleHref: string;
  hasExample: boolean;
  extended: boolean;
}) {
  const t = text[locale];
  const [phase, setPhase] = useState<Phase>('loading');
  const [learner, setLearner] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState<Record<string, 'error' | 'expired'>>({});
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const graded = useRef(false);

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
      if (stored && stored.learner !== data.learner)
        sessionStorage.removeItem(draftKey(lessonId));
      setLearner(data.learner);
      setExercises(data.exercises);
      setEntries(
        Object.fromEntries(
          data.exercises.map((exercise) => {
            const previous = mine[exercise.id];
            return [
              exercise.id,
              previous && previous.version === exercise.version
                ? restoreEntry(exercise, previous)
                : freshEntry(exercise.version),
            ];
          }),
        ),
      );
      const resumed = data.exercises.findIndex(
        (item) =>
          item.id === stored?.currentExerciseId &&
          mine[item.id]?.version === item.version,
      );
      const requested = data.exercises.findIndex(
        (item) =>
          item.id === requestedTarget?.exerciseId &&
          item.version === requestedTarget.version,
      );
      setCurrent(
        requested >= 0
          ? requested
          : stored?.learner === data.learner && resumed >= 0
            ? resumed
            : 0,
      );
      setPhase('ready');
    } catch {
      setPhase('unavailable');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (phase === 'ready' && learner)
      writeStored(lessonId, {
        learner,
        entries,
        currentExerciseId: exercises[current]?.id,
      });
  }, [entries, learner, phase, current, exercises]);

  const exercise = exercises[current];
  const entry = exercise ? entries[exercise.id] : undefined;
  const result = entry?.result ?? null;
  const awaitingSave = !!entry?.submission && !result;
  const shownAnswers =
    result && exercise
      ? (answersFromResponse(exercise, result.response) ?? {})
      : (entry?.answers ?? {});

  // An explicit review URL follows subsequent exercise navigation too. Otherwise
  // its original target would override a newer selection on reload or translation.
  useEffect(() => {
    if (phase !== 'ready' || !exercise) return;
    const target = requestedTarget
      ? { exerciseId: exercise.id, version: exercise.version }
      : null;
    history.replaceState(
      history.state,
      '',
      practiceHref(locale, lessonId, target) + window.location.hash,
    );
    const alternate = locale === 'fr' ? 'en' : 'fr';
    const languageLink = document.querySelector<HTMLAnchorElement>(
      '[data-language-link]',
    );
    if (languageLink)
      languageLink.href = practiceHref(alternate, lessonId, target);
  }, [phase, exercise, locale, lessonId, requestedTarget]);

  // Announce the verdict by moving focus to the feedback heading.
  useEffect(() => {
    if (result && graded.current) feedbackHeading.current?.focus();
    graded.current = false;
  }, [result]);

  // The feedback layout drops the outline column and widens the artwork; the
  // surrounding page is server-rendered, so it is switched by a class.
  useEffect(() => {
    const page = document.querySelector('.practice-page');
    page?.classList.toggle('is-feedback', !!result);
    return () => page?.classList.remove('is-feedback');
  }, [!!result]);

  const update = (id: string, change: (entry: Entry) => Entry) =>
    setEntries((all) => {
      const found = all[id];
      return found ? { ...all, [id]: change(found) } : all;
    });

  async function submit(target: Exercise) {
    const found = entries[target.id];
    if (!found || found.result || busy || !complete(target, found)) return;
    const submission = found.submission ?? {
      answers: { ...found.answers },
      hintUsed: found.hintUsed,
    };
    const nextEntries = { ...entries, [target.id]: { ...found, submission } };
    // Persist before starting the request: navigation may unmount this island
    // before an effect runs or before the server's acknowledgement arrives.
    writeStored(lessonId, {
      learner,
      entries: nextEntries,
      currentExerciseId: exercises[current]?.id,
    });
    setEntries(nextEntries);
    setBusy(target.id);
    setFailed(({ [target.id]: _, ...rest }) => rest);
    try {
      const response = await fetch('/api/attempts/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          submissionId: found.submissionId,
          exerciseId: target.id,
          version: target.version,
          locale,
          hintUsed: submission.hintUsed,
          response: responseOf(target, submission),
        }),
      });
      if (response.status === 401)
        return setFailed((f) => ({ ...f, [target.id]: 'expired' }));
      if (!response.ok)
        return setFailed((f) => ({ ...f, [target.id]: 'error' }));
      const outcome = (await response.json()) as Result;
      const answers = answersFromResponse(target, outcome.response);
      if (
        outcome.exerciseId !== target.id ||
        outcome.exerciseVersion !== target.version ||
        !answers ||
        typeof outcome.hintUsed !== 'boolean'
      )
        throw new Error('Invalid saved response');
      graded.current = true;
      update(target.id, (value) => ({
        ...value,
        answers,
        hintUsed: value.hintUsed || outcome.hintUsed,
        submission: { answers, hintUsed: outcome.hintUsed },
        result: outcome,
      }));
    } catch {
      setFailed((f) => ({ ...f, [target.id]: 'error' }));
    } finally {
      setBusy(null);
    }
  }

  const signInHref = `/${locale}/sign-in/?${new URLSearchParams({
    next: practiceHref(
      locale,
      lessonId,
      exercise
        ? { exerciseId: exercise.id, version: exercise.version }
        : requestedTarget,
    ),
  })}`;

  const reviewing = result !== null && !result.correct;
  const heading = !result
    ? [t.title]
    : result.correct
      ? t.doneTitle
      : t.reviewTitle;
  const kicker = reviewing ? t.reviewKicker : t.kicker;
  const subtitle = !result
    ? t.subtitle
    : result.correct
      ? t.doneSubtitle
      : t.reviewSubtitle;

  const chosenOption =
    exercise?.type === 'single-choice'
      ? exercise.options.findIndex((o) => o.id === shownAnswers.choice)
      : -1;

  return (
    <section
      className={`pp pp-state-${result ? 'feedback' : 'practice'}`}
      aria-labelledby="pp-title"
    >
      <header className="pp-header">
        <p className="pp-kicker">
          <span className="pp-num">{lessonNumber}</span>
          <span className="pp-kicker-text"> / {kicker}</span>
        </p>
        <h1 id="pp-title" className="pp-title">
          {heading.map((word, index) => (
            <span
              key={word}
              className={index === heading.length - 1 ? 'pp-last' : undefined}
            >
              {word}
              <span className="pp-dot" aria-hidden="true">
                .
              </span>{' '}
            </span>
          ))}
        </h1>
        <p className="pp-subtitle">{subtitle}</p>
        <span className="pp-arrow" aria-hidden="true" />
      </header>

      {phase === 'loading' && (
        <p role="status" className="pp-body">
          {t.loading}
        </p>
      )}
      {phase === 'signin' && (
        <div className="pp-body pp-gate">
          <p role="status">{t.signInNote}</p>
          <a className="primary-link" href={signInHref}>
            {t.signIn}
          </a>
        </div>
      )}
      {phase === 'unavailable' && (
        <div className="pp-body pp-gate">
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

      {phase === 'ready' && exercise && entry && (
        <div className="pp-body">
          <nav className="pp-steps" aria-label={t.steps} hidden={!!result}>
            <ol>
              {exercises.map((item, index) => {
                const done = entries[item.id]?.result;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={
                        done
                          ? done.correct
                            ? 'pp-step is-right'
                            : 'pp-step is-wrong'
                          : 'pp-step'
                      }
                      aria-current={index === current ? 'step' : undefined}
                      onClick={() => setCurrent(index)}
                    >
                      <span className="visually-hidden">{t.exercise} </span>
                      {String(index + 1).padStart(2, '0')}
                      {done && (
                        <span className="visually-hidden">
                          {' '}
                          ({done.correct ? t.rowOk : t.rowBad})
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="pp-count">
              {t.exercise} {current + 1} {t.of} {exercises.length}
            </p>
          </nav>

          <div className="pp-grid">
            <div className="pp-question">
              {result && (
                <h2 className="pp-exercise-title">{t.exerciseTitle}</h2>
              )}
              {exercise.type === 'single-choice' ? (
                <fieldset
                  className="pp-fieldset"
                  disabled={!!result || awaitingSave}
                >
                  <legend className="pp-prompt">
                    <Tex text={exercise.prompt[locale] ?? ''} />
                  </legend>
                  {!result && <p className="pp-instruction">{t.chooseOne}</p>}
                  <div className="pp-options">
                    {exercise.options.map((option, index) => (
                      <label
                        key={option.id}
                        className={`pp-option${
                          shownAnswers.choice === option.id ? ' is-chosen' : ''
                        }${
                          result && shownAnswers.choice === option.id
                            ? result.correct
                              ? ' is-right'
                              : ' is-wrong'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={exercise.id}
                          value={option.id}
                          checked={shownAnswers.choice === option.id}
                          onChange={() =>
                            update(exercise.id, (value) => ({
                              ...value,
                              answers: { choice: option.id },
                            }))
                          }
                        />
                        <span className="pp-marker" aria-hidden="true">
                          {marker(index)}
                        </span>
                        <span className="pp-rule" aria-hidden="true" />
                        <span className="pp-label">
                          <Tex text={option.label[locale] ?? ''} />
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <div className="practice-table-wrap">
                  <table className="practice-table">
                    <caption className="pp-prompt">
                      <Tex text={exercise.prompt[locale] ?? ''} />
                    </caption>
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
                        const verdict = result?.rowResults?.[rowId];
                        return (
                          <tr key={rowId}>
                            {variables(row).map((name) => (
                              <td key={name}>{bit(row[name] ?? '')}</td>
                            ))}
                            <td>
                              <fieldset
                                className="practice-cell"
                                disabled={!!result || awaitingSave}
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
                                      checked={shownAnswers[rowId] === value}
                                      onChange={() =>
                                        update(exercise.id, (found) => ({
                                          ...found,
                                          answers: {
                                            ...found.answers,
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

              {result && exercise.type === 'single-choice' && (
                <div className="pp-answer">
                  <h2 className="pp-answer-title">{t.yourAnswer}</h2>
                  <p
                    className={`pp-answer-row ${
                      result.correct ? 'is-right' : 'is-wrong'
                    }`}
                  >
                    <span className="pp-marker" aria-hidden="true">
                      {marker(chosenOption)}
                    </span>
                    <span className="pp-label">
                      <Tex
                        text={
                          exercise.options[chosenOption]?.label[locale] ?? ''
                        }
                      />
                    </span>
                    <span className="pp-tag">
                      {result.correct ? t.right : t.toReview}
                    </span>
                  </p>
                </div>
              )}

              {!result && (
                <>
                  {exercise.type === 'truth-table' && (
                    <p className="pp-instruction">{t.complete}</p>
                  )}
                  <div className="pp-actions">
                    <div className="pp-action">
                      <button
                        type="button"
                        className="pp-button pp-button-outline"
                        disabled={awaitingSave}
                        aria-expanded={entry.hintShown}
                        aria-controls="pp-hint"
                        aria-describedby="pp-optional"
                        onClick={() =>
                          update(exercise.id, (value) => ({
                            ...value,
                            hintShown: !value.hintShown,
                            hintUsed: true,
                          }))
                        }
                      >
                        {t.hint} <span aria-hidden="true">→</span>
                      </button>
                      <small id="pp-optional">{t.optional}</small>
                    </div>
                    <div className="pp-action">
                      <button
                        type="button"
                        className="pp-button pp-button-solid"
                        disabled={!complete(exercise, entry) || busy !== null}
                        aria-describedby="pp-submit-note"
                        onClick={() => void submit(exercise)}
                      >
                        {busy === exercise.id
                          ? t.sending
                          : awaitingSave
                            ? t.recover
                            : t.submit}{' '}
                        <span aria-hidden="true">→</span>
                      </button>
                      <small id="pp-submit-note">
                        {awaitingSave
                          ? t.pending
                          : complete(exercise, entry)
                            ? ' '
                            : exercise.type === 'single-choice'
                              ? t.needAnswer
                              : t.needRows}
                      </small>
                    </div>
                    <div className="pp-action pp-action-link">
                      <a className="pp-example" href={exampleHref}>
                        {hasExample ? t.example : t.lesson}
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                  <div id="pp-hint" hidden={!entry.hintShown}>
                    {entry.hintShown && (
                      <p className="pp-hint">
                        <strong>{t.hintLabel} :</strong>{' '}
                        <Tex text={exercise.hint[locale] ?? ''} />
                      </p>
                    )}
                  </div>
                </>
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
            </div>

            {result && (
              <section
                className={`pp-feedback ${
                  result.correct ? 'is-right' : 'is-wrong'
                }`}
                aria-labelledby="pp-feedback-title"
              >
                <h2
                  id="pp-feedback-title"
                  ref={feedbackHeading}
                  tabIndex={-1}
                  className="pp-feedback-title"
                >
                  <Tex text={result.feedback[locale] ?? ''} />
                </h2>
                {exercise.type === 'single-choice' && chosenOption >= 0 && (
                  <p className="pp-choice">
                    {t.yourChoice} :{' '}
                    <Tex
                      text={exercise.options[chosenOption]?.label[locale] ?? ''}
                    />
                  </p>
                )}
                <p className="pp-explanation">
                  <Tex text={result.explanation[locale] ?? ''} />
                </p>
                {!result.correct && (
                  <p className="pp-retry-hint">
                    <Tex text={exercise.hint[locale] ?? ''} />
                  </p>
                )}
                <div className="pp-actions">
                  {!result.correct || current === exercises.length - 1 ? (
                    <button
                      type="button"
                      className="pp-button pp-button-solid"
                      onClick={() =>
                        update(exercise.id, (value) => ({
                          ...freshEntry(value.version),
                          hintShown: value.hintShown,
                          hintUsed: value.hintUsed,
                        }))
                      }
                    >
                      {t.again} <span aria-hidden="true">→</span>
                    </button>
                  ) : null}
                  <a
                    className="pp-button pp-button-outline"
                    href={`/${locale}/progress/`}
                  >
                    {t.reviews}
                  </a>
                  {current < exercises.length - 1 && (
                    <button
                      type="button"
                      className={`pp-button ${
                        result.correct ? 'pp-button-solid' : 'pp-button-outline'
                      }`}
                      onClick={() => setCurrent(current + 1)}
                    >
                      {t.next} <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
                <p className="pp-note">
                  {t.saved}{' '}
                  {result.independentEvidence ? t.evidence : t.practiceOnly}
                </p>
              </section>
            )}
          </div>
          <p className="pp-footnote">
            {t.footnote}
            {extended && <> {t.extended}</>}
          </p>
        </div>
      )}
    </section>
  );
}
