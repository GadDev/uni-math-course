// Server-side exercise model and grading. Never import this from a client
// component or a prerendered page: it works with the answer-bearing records.
export type Localized = { fr: string; en: string };

type Base = {
  id: string;
  lessonId: string;
  version: number;
  difficulty: string;
  prompt: Localized;
  hint: Localized;
  explanation: Localized;
};
export type SingleChoiceExercise = Base & {
  type: 'single-choice';
  options: { id: string; label: Localized; feedback: Localized }[];
  answer: string;
};
export type TruthTableExercise = Base & {
  type: 'truth-table';
  rows: ({ id: string } & Record<string, string | boolean>)[];
  answer: Record<string, boolean>;
  feedback: Localized;
};
export type Exercise = SingleChoiceExercise | TruthTableExercise;

export type ChoiceResponse = { optionId: string };
export type TableResponse = { cells: Record<string, boolean> };
export type ExerciseResponse = ChoiceResponse | TableResponse;

export type PublicExercise = Omit<Base, 'explanation'> &
  (
    | { type: 'single-choice'; options: { id: string; label: Localized }[] }
    | { type: 'truth-table'; rows: TruthTableExercise['rows'] }
  );

export type GradeResult = {
  correct: boolean;
  feedback: Localized;
  explanation: Localized;
  correctAnswer: string | Record<string, boolean>;
  rowResults?: Record<string, boolean>;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** What a learner may see before answering: no answer, feedback or explanation. */
export function publicExercise(exercise: Exercise): PublicExercise {
  const { id, lessonId, version, difficulty, prompt, hint } = exercise;
  const base = { id, lessonId, version, difficulty, prompt, hint };
  return exercise.type === 'single-choice'
    ? {
        ...base,
        type: 'single-choice',
        options: exercise.options.map(({ id, label }) => ({ id, label })),
      }
    : { ...base, type: 'truth-table', rows: exercise.rows };
}

/** Strict shape check: unknown fields, unknown options and missing rows are rejected. */
export function parseResponse(
  exercise: Exercise,
  raw: unknown,
): ExerciseResponse | null {
  if (!isObject(raw)) return null;
  const keys = Object.keys(raw);
  if (exercise.type === 'single-choice') {
    const { optionId } = raw;
    return keys.length === 1 &&
      typeof optionId === 'string' &&
      exercise.options.some((option) => option.id === optionId)
      ? { optionId }
      : null;
  }
  const { cells } = raw;
  if (keys.length !== 1 || !isObject(cells)) return null;
  const expected = exercise.rows.map((row) => row.id);
  const given = Object.keys(cells);
  if (
    given.length !== expected.length ||
    !expected.every(
      (id) => Object.hasOwn(cells, id) && typeof cells[id] === 'boolean',
    )
  )
    return null;
  return {
    cells: Object.fromEntries(expected.map((id) => [id, cells[id] as boolean])),
  };
}

export function grade(
  exercise: Exercise,
  response: ExerciseResponse,
): GradeResult {
  if (exercise.type === 'single-choice') {
    const chosen = exercise.options.find(
      (option) => option.id === (response as ChoiceResponse).optionId,
    );
    return {
      correct: chosen?.id === exercise.answer,
      feedback: chosen?.feedback ?? exercise.explanation,
      explanation: exercise.explanation,
      correctAnswer: exercise.answer,
    };
  }
  const cells = (response as TableResponse).cells;
  const rowResults = Object.fromEntries(
    Object.entries(exercise.answer).map(([id, value]) => [
      id,
      cells[id] === value,
    ]),
  );
  return {
    correct: Object.values(rowResults).every(Boolean),
    feedback: exercise.feedback,
    explanation: exercise.explanation,
    correctAnswer: exercise.answer,
    rowResults,
  };
}
