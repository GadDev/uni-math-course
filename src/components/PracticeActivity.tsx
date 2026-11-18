import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../lib/i18n';
import Tex from './Tex';
import {
  clearPracticeDrafts,
  subscribeSession,
} from '../lib/session-lifecycle';
import { practiceHref, type PracticeTarget } from '../lib/practice-navigation';

// Client-side shapes. Answers, feedback and explanations only ever arrive in a
// graded attempt response; they are never part of the exercise payload.
type Localized = { fr: string; en: string };
type Exercise = {
  id: string;
  version: number;
  difficulty: string;
  scope?: 'core' | 'extension';
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
  showSummary?: boolean;
};
type Phase = 'loading' | 'ready' | 'signin' | 'unavailable' | 'account-changed';

const text = {
  fr: {
    kicker: 'Pratiquer',
    title: 'À vous de raisonner',
    subtitle: 'Exercice original',
    bankVersion: 'Version de la banque',
    dataTable: 'Table de données de l’exercice',
    core: 'Parcours principal',
    extension: 'Approfondissement facultatif',
    scopeNote:
      'Les questions du parcours principal viennent en premier, puis les approfondissements facultatifs.',
    supplement: 'Lire le complément facultatif',
    reviewKicker: 'Comprendre son erreur',
    reviewTitle: ['Revoir', 'Comprendre', 'Réessayer'],
    reviewSubtitle: 'Une erreur peut préciser une idée.',
    doneTitle: ['Bien raisonné'],
    doneSubtitle:
      'Votre réponse est juste. Lisez l’explication, puis continuez.',
    loading: 'Chargement des exercices…',
    signIn: 'Se connecter pour s’exercer',
    accountChanged:
      'Le compte a changé. Vos anciennes réponses ont été retirées de cet onglet et n’ont pas été envoyées au nouveau compte.',
    loadAccount: 'Charger le compte actuel',
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
    remaining: (count: number) =>
      count === 1
        ? 'Il reste 1 exercice requis.'
        : `Il reste ${count} exercices requis.`,
    finish: 'Voir le bilan',
    summaryTitle: 'Pratique terminée',
    summarySubtitle: 'Bravo, vous avez répondu à tous les exercices requis.',
    coreCorrect: 'Réponses justes sur le parcours principal',
    coreReview: 'Exercices du parcours principal à revoir',
    optionalProgress: 'Approfondissements facultatifs traités',
    continueOptional: 'Faire les exercices facultatifs',
    nextLesson: 'Leçon suivante',
    chapter: 'Revenir au chapitre',
    progress: 'Voir ma progression',
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
      'Nous n’avons pas pu confirmer l’enregistrement de votre réponse. Vos choix sont conservés dans cet onglet. Vérifiez l’enregistrement pour réessayer sans créer de doublon.',
    versionChanged:
      'Cet exercice a changé. Chargez la version actuelle avant de répondre à nouveau. Votre ancienne réponse ne sera pas appliquée à la nouvelle version ; les tentatives enregistrées restent dans votre historique.',
    reloadExercise: 'Charger la version actuelle',
    draftNote:
      'Les réponses inachevées restent dans cet onglet si le stockage du navigateur est disponible. Fermer l’onglet peut les effacer. Les tentatives enregistrées restent dans votre historique.',
    expired: 'Votre session a expiré. Reconnectez-vous pour continuer.',
  },
  en: {
    kicker: 'Practise',
    title: 'Your turn to reason',
    subtitle: 'Original exercise',
    bankVersion: 'Bank version',
    dataTable: 'Exercise data table',
    core: 'Core practice',
    extension: 'Optional extension',
    scopeNote: 'Core questions come first, followed by optional extensions.',
    supplement: 'Read the optional supplement',
    reviewKicker: 'Understand your mistake',
    reviewTitle: ['Review', 'Understand', 'Retry'],
    reviewSubtitle: 'A mistake can sharpen an idea.',
    doneTitle: ['Well reasoned'],
    doneSubtitle:
      'Your answer is correct. Read the explanation, then carry on.',
    loading: 'Loading exercises…',
    signIn: 'Sign in to practise',
    accountChanged:
      'The account has changed. Your previous answers have been removed from this tab and were not submitted to the new account.',
    loadAccount: 'Load current account',
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
    remaining: (count: number) =>
      count === 1
        ? '1 required exercise remains.'
        : `${count} required exercises remain.`,
    finish: 'View practice summary',
    summaryTitle: 'Practice complete',
    summarySubtitle: 'Nice work! You answered all the required exercises.',
    coreCorrect: 'Correct answers in core practice',
    coreReview: 'Core exercises to review',
    optionalProgress: 'Optional exercises answered',
    continueOptional: 'Do the optional exercises',
    nextLesson: 'Next lesson',
    chapter: 'Back to the chapter',
    progress: 'View my progress',
    reviews: 'Find my reviews',
    row: 'Row',
    result: 'Result',
    rowOk: 'correct',
    rowBad: 'incorrect',
    saved: 'Attempt saved.',
    evidence: 'Counts as independent mastery evidence.',
    practiceOnly:
      'The correction is revealed. Trying this exercise again, or answering after a hint, is not new independent evidence.',
    error:
      'We couldn’t confirm whether your answer was saved. Your choices are kept in this tab. Check saved response to retry without creating a duplicate.',
    versionChanged:
      'This exercise has changed. Load the current version before answering again. Your previous answer will not be applied to the new version; saved attempts remain in your history.',
    reloadExercise: 'Load current version',
    draftNote:
      'Unfinished answers stay in this tab when browser storage is available. Closing the tab may lose them. Saved attempts remain in your history.',
    expired: 'Your session has expired. Sign in again to continue.',
  },
} as const;

const difficultyLabels: Record<Locale, Record<string, string>> = {
  fr: {
    foundation: 'Initiation',
    application: 'Application',
    easy: 'Facile',
    medium: 'Intermédiaire',
    hard: 'Difficile',
  },
  en: {
    foundation: 'Foundation',
    application: 'Application',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  },
};

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
  initialData,
  requestedTarget,
  locale,
  lessonNumber,
  exampleHref,
  hasExample,
  extended,
  nextLesson,
  chapterHref,
}: {
  lessonId: string;
  initialData: { learner: string; exercises: Exercise[] };
  requestedTarget: PracticeTarget | null;
  locale: Locale;
  lessonNumber: string;
  exampleHref: string;
  hasExample: boolean;
  extended: boolean;
  nextLesson?: { href: string; title: string };
  chapterHref: string;
}) {
  const t = text[locale];
  const [phase, setPhase] = useState<Phase>('loading');
  const [learner, setLearner] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [current, setCurrent] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState<
    Record<string, 'error' | 'expired' | 'version'>
  >({});
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const activityHeading = useRef<HTMLHeadingElement>(null);
  const focusActivity = useRef(false);
  const graded = useRef(false);
  const contextGeneration = useRef(0);
  const observedLearner = useRef<string | null | undefined>(undefined);

  async function load(reloadExerciseId?: string, initial?: typeof initialData) {
    const generation = ++contextGeneration.current;
    observedLearner.current = undefined;
    setPhase('loading');
    setLearner('');
    setExercises([]);
    setEntries({});
    setFailed({});
    setCurrent(0);
    setShowSummary(false);
    graded.current = false;
    try {
      let data = initial;
      if (!data) {
        const response = await fetch(`/api/exercises/${lessonId}/`, {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(15000),
        });
        if (generation !== contextGeneration.current) return;
        if (response.status === 401) return setPhase('signin');
        if (!response.ok) return setPhase('unavailable');
        data = (await response.json()) as typeof initialData;
      }
      if (generation !== contextGeneration.current) return;
      if (
        observedLearner.current !== undefined &&
        observedLearner.current !== data.learner
      ) {
        clearPracticeDrafts();
        setPhase(
          observedLearner.current === null ? 'signin' : 'account-changed',
        );
        return;
      }
      // Drafts belong to one learner and one exercise version.
      const stored = readStored(lessonId);
      const mine = stored?.learner === data.learner ? stored.entries : {};
      if (stored && stored.learner !== data.learner)
        sessionStorage.removeItem(draftKey(lessonId));
      const restored = Object.fromEntries(
        data.exercises.map((exercise) => {
          const previous = mine[exercise.id];
          return [
            exercise.id,
            previous && previous.version === exercise.version
              ? restoreEntry(exercise, previous)
              : freshEntry(exercise.version),
          ];
        }),
      );
      setLearner(data.learner);
      setExercises(data.exercises);
      setEntries(restored);
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
      const reloaded = data.exercises.findIndex(
        (item) => item.id === reloadExerciseId,
      );
      setShowSummary(
        stored?.learner === data.learner &&
          stored.showSummary === true &&
          requested < 0 &&
          reloadExerciseId === undefined &&
          data.exercises.every(
            (item) => item.scope === 'extension' || restored[item.id]?.result,
          ),
      );
      setCurrent(
        reloaded >= 0
          ? reloaded
          : requested >= 0
            ? requested
            : stored?.learner === data.learner && resumed >= 0
              ? resumed
              : 0,
      );
      setPhase('ready');
    } catch {
      if (generation !== contextGeneration.current) return;
      setPhase('unavailable');
    }
  }

  useEffect(() => {
    void load(undefined, initialData);
  }, []);

  useEffect(
    () =>
      subscribeSession((state) => {
        if (state.status === 'unavailable') return;
        observedLearner.current =
          state.status === 'authenticated' ? state.learner : null;
        if (state.status === 'authenticated' && !learner) return;
        if (state.status === 'authenticated' && state.learner === learner)
          return;
        contextGeneration.current++;
        clearPracticeDrafts();
        setPhase(state.status === 'anonymous' ? 'signin' : 'account-changed');
        setLearner('');
        setExercises([]);
        setEntries({});
        setFailed({});
        setBusy(null);
        setCurrent(0);
        setShowSummary(false);
        graded.current = false;
      }),
    [learner],
  );

  const coreExercises = exercises.filter((item) => item.scope !== 'extension');
  const optionalExercises = exercises.filter(
    (item) => item.scope === 'extension',
  );
  const coreRemaining = coreExercises.filter(
    (item) => !entries[item.id]?.result,
  );
  const coreComplete = coreExercises.length > 0 && coreRemaining.length === 0;
  const summary = phase === 'ready' && showSummary && coreComplete;
  const nextOptional = optionalExercises.find(
    (item) => !entries[item.id]?.result,
  );
  const coreCorrect = coreExercises.filter(
    (item) => entries[item.id]?.result?.correct,
  ).length;
  const nextCore =
    coreRemaining.find((item) => exercises.indexOf(item) > current) ??
    coreRemaining[0];

  useEffect(() => {
    if (phase === 'ready' && learner)
      writeStored(lessonId, {
        learner,
        entries,
        currentExerciseId: exercises[current]?.id,
        showSummary: summary,
      });
  }, [entries, learner, phase, current, exercises, summary]);

  const exercise = exercises[current];
  const entry = exercise ? entries[exercise.id] : undefined;
  const nextExercise =
    nextCore ?? (exercise?.scope === 'extension' ? nextOptional : undefined);
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
    const target =
      requestedTarget && !summary
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
  }, [phase, exercise, locale, lessonId, requestedTarget, summary]);

  useEffect(() => {
    if (focusActivity.current) activityHeading.current?.focus();
    focusActivity.current = false;
  }, [summary, current]);

  // Announce the verdict by moving focus to the feedback heading.
  useEffect(() => {
    if (result && graded.current) feedbackHeading.current?.focus();
    graded.current = false;
  }, [result]);

  // The feedback layout drops the outline column and widens the artwork; the
  // surrounding page is server-rendered, so it is switched by a class.
  useEffect(() => {
    const page = document.querySelector('.practice-page');
    page?.classList.toggle('is-feedback', !!result && !summary);
    return () => page?.classList.remove('is-feedback');
  }, [!!result, summary]);

  function openExercise(item: Exercise) {
    focusActivity.current = true;
    setCurrent(exercises.indexOf(item));
    setShowSummary(false);
  }

  function finishPractice() {
    focusActivity.current = true;
    setShowSummary(true);
  }

  const update = (id: string, change: (entry: Entry) => Entry) =>
    setEntries((all) => {
      const found = all[id];
      return found ? { ...all, [id]: change(found) } : all;
    });

  async function submit(target: Exercise) {
    const generation = contextGeneration.current;
    const found = entries[target.id];
    if (
      !found ||
      found.result ||
      busy ||
      failed[target.id] === 'version' ||
      !complete(target, found)
    )
      return;
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
    // Bound the entire fetch, including response-body reading. Aborting our wait
    // cannot roll back a server commit; retain the snapshot and UUID for replay.
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('/api/attempts/', {
        signal: controller.signal,
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          expectedLearnerId: learner,
          submissionId: found.submissionId,
          exerciseId: target.id,
          version: target.version,
          locale,
          hintUsed: submission.hintUsed,
          response: responseOf(target, submission),
        }),
      });
      if (generation !== contextGeneration.current) return;
      if (response.status === 401)
        return setFailed((f) => ({ ...f, [target.id]: 'expired' }));
      if (response.status === 409) {
        const problem = (await response.json()) as { error?: string };
        if (generation !== contextGeneration.current) return;
        if (problem.error === 'version_mismatch')
          return setFailed((f) => ({ ...f, [target.id]: 'version' }));
        if (problem.error === 'learner_context_changed') {
          contextGeneration.current++;
          clearPracticeDrafts();
          setBusy(null);
          setPhase('account-changed');
          setLearner('');
          setExercises([]);
          setEntries({});
          setFailed({});
          setCurrent(0);
          graded.current = false;
          return;
        }
      }
      if (!response.ok)
        return setFailed((f) => ({ ...f, [target.id]: 'error' }));
      const outcome = (await response.json()) as Result;
      if (generation !== contextGeneration.current) return;
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
      if (generation !== contextGeneration.current) return;
      setFailed((f) => ({ ...f, [target.id]: 'error' }));
    } finally {
      window.clearTimeout(deadline);
      if (generation === contextGeneration.current) setBusy(null);
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
  const heading = summary
    ? [t.summaryTitle]
    : !result
      ? [t.title]
      : result.correct
        ? t.doneTitle
        : t.reviewTitle;
  const kicker = reviewing && !summary ? t.reviewKicker : t.kicker;
  const subtitle = summary
    ? t.summarySubtitle
    : !result
      ? exercise
        ? `${difficultyLabels[locale][exercise.difficulty] ?? exercise.difficulty} · ${t.bankVersion} ${exercise.version}`
        : t.subtitle
      : result.correct
        ? t.doneSubtitle
        : t.reviewSubtitle;

  const chosenOption =
    exercise?.type === 'single-choice'
      ? exercise.options.findIndex((o) => o.id === shownAnswers.choice)
      : -1;

  return (
    <section
      className={`pp pp-state-${result && !summary ? 'feedback' : 'practice'}`}
      aria-labelledby="pp-title"
    >
      <header className="pp-header">
        <p className="pp-kicker">
          <span className="pp-num">{lessonNumber}</span>
          <span className="pp-kicker-text"> / {kicker}</span>
        </p>
        <h1
          id="pp-title"
          className="pp-title"
          ref={activityHeading}
          tabIndex={-1}
          aria-describedby={!result && exercise ? 'pp-count' : undefined}
        >
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
      {phase === 'account-changed' && (
        <div className="pp-body pp-gate">
          <p role="alert">{t.accountChanged}</p>
          <button
            type="button"
            className="primary-link auth-button"
            onClick={() => void load()}
          >
            {t.loadAccount}
          </button>
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

      {summary && (
        <div className="pp-body pp-summary">
          <dl className="pp-summary-stats">
            <div>
              <dt>{t.coreCorrect}</dt>
              <dd>
                {coreCorrect} / {coreExercises.length}
              </dd>
            </div>
            <div>
              <dt>{t.coreReview}</dt>
              <dd>{coreExercises.length - coreCorrect}</dd>
            </div>
            {optionalExercises.length > 0 && (
              <div>
                <dt>{t.optionalProgress}</dt>
                <dd>
                  {
                    optionalExercises.filter((item) => entries[item.id]?.result)
                      .length
                  }{' '}
                  / {optionalExercises.length}
                </dd>
              </div>
            )}
          </dl>
          <div className="pp-actions">
            <a
              className="pp-button pp-button-solid"
              href={nextLesson?.href ?? chapterHref}
            >
              {nextLesson ? `${t.nextLesson} · ${nextLesson.title}` : t.chapter}{' '}
              <span aria-hidden="true">→</span>
            </a>
            {nextOptional && (
              <button
                type="button"
                className="pp-button pp-button-outline"
                onClick={() => openExercise(nextOptional)}
              >
                {t.continueOptional}
              </button>
            )}
            <a
              className="pp-button pp-button-outline"
              href={`/${locale}/progress/`}
            >
              {t.progress}
            </a>
            <a
              className="pp-button pp-button-outline"
              href={`/${locale}/lessons/${lessonId}/`}
            >
              {t.lesson}
            </a>
          </div>
        </div>
      )}

      {phase === 'ready' && !summary && exercise && entry && (
        <div className="pp-body">
          {exercises.some((item) => item.scope === 'extension') && (
            <div className="pp-scope">
              <p>{t.scopeNote}</p>
              <p>
                <strong>
                  {exercise.scope === 'extension' ? t.extension : t.core}
                </strong>
                {exercise.scope === 'extension' && (
                  <>
                    {' '}
                    ·{' '}
                    <a
                      href={`/${locale}/lessons/${lessonId}/#${lessonId === 'L36' ? 'supplement-correlation' : 'supplement-square'}`}
                    >
                      {t.supplement}
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
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
            <p id="pp-count" className="pp-count">
              {t.exercise} {current + 1} {t.of} {exercises.length}
            </p>
          </nav>

          <div className="pp-grid">
            <div className="pp-question">
              {result && (
                <h2 className="pp-exercise-title">{t.exerciseTitle}</h2>
              )}
              {exercise.type === 'single-choice' ? (
                <div>
                  <div id="pp-prompt" className="pp-prompt">
                    <Tex
                      text={exercise.prompt[locale] ?? ''}
                      tableLabel={t.dataTable}
                    />
                  </div>
                  <fieldset
                    className="pp-fieldset"
                    aria-describedby="pp-prompt"
                    disabled={!!result || awaitingSave}
                  >
                    <legend className="visually-hidden">{t.chooseOne}</legend>
                    {!result && <p className="pp-instruction">{t.chooseOne}</p>}
                    <div className="pp-options">
                      {exercise.options.map((option, index) => (
                        <label
                          key={option.id}
                          className={`pp-option${
                            shownAnswers.choice === option.id
                              ? ' is-chosen'
                              : ''
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
                </div>
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
                        disabled={
                          !complete(exercise, entry) ||
                          busy !== null ||
                          failed[exercise.id] === 'version'
                        }
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
              {failed[exercise.id] === 'version' && (
                <div className="practice-error">
                  <p role="alert">{t.versionChanged}</p>
                  <button
                    type="button"
                    className="primary-link auth-button"
                    onClick={() => void load(exercise.id)}
                  >
                    {t.reloadExercise}
                  </button>
                </div>
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
                {nextCore && exercises.indexOf(nextCore) < current && (
                  <p className="pp-note">{t.remaining(coreRemaining.length)}</p>
                )}
                <div className="pp-actions">
                  <button
                    type="button"
                    className="pp-button pp-button-solid"
                    disabled={!!busy}
                    onClick={() =>
                      nextExercise
                        ? openExercise(nextExercise)
                        : finishPractice()
                    }
                  >
                    {nextExercise ? t.next : t.finish}{' '}
                    <span aria-hidden="true">→</span>
                  </button>
                  {nextExercise && coreComplete && (
                    <button
                      type="button"
                      className="pp-button pp-button-outline"
                      disabled={!!busy}
                      onClick={finishPractice}
                    >
                      {t.finish}
                    </button>
                  )}
                  {!result.correct && (
                    <button
                      type="button"
                      className="pp-button pp-button-outline"
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
                  )}
                  <a
                    className="pp-button pp-button-outline"
                    href={`/${locale}/progress/`}
                  >
                    {t.reviews}
                  </a>
                </div>
                <p className="pp-note">
                  {t.saved}{' '}
                  {result.independentEvidence ? t.evidence : t.practiceOnly}
                </p>
              </section>
            )}
          </div>
          <p className="pp-footnote">
            {t.footnote} {t.draftNote}
            {extended && <> {t.extended}</>}
          </p>
        </div>
      )}
    </section>
  );
}
