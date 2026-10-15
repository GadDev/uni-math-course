import {
  grade,
  parseResponse,
  type Exercise,
  type Localized,
} from './grading.ts';
import type { AttemptRow } from './submit.ts';

// Reading, attempt history and mastery evidence are kept apart on purpose:
// an attempt is a record; mastery evidence is only a first, unaided, correct one.
export type ExerciseProgress = {
  exerciseId: string;
  attempts: number;
  correctAttempts: number;
  latestCorrect: boolean;
  masteryEvidence: boolean;
  lastAt: string;
};
export type LessonProgress = {
  lessonId: string;
  total: number;
  attempted: number;
  mastered: number;
  exercises: ExerciseProgress[];
};
export type Mistake = {
  exerciseId: string;
  exerciseVersion: number;
  attemptId: string;
  at: string;
  prompt: Localized;
  feedback: Localized;
  explanation: Localized;
  chosen?: Localized;
  wrongRows?: string[];
};
export type HistoryItem = {
  attemptId: string;
  exerciseId: string;
  exerciseVersion: number;
  at: string;
  correct: boolean;
  independentEvidence: boolean;
  hintUsed: boolean;
};
export type Progress = {
  totalAttempts: number;
  lessons: LessonProgress[];
  mistakes: Mistake[];
  history: HistoryItem[];
};

const bit = (value: string | boolean) =>
  value === true ? '1' : value === false ? '0' : String(value);

function rowLabel(row: Record<string, string | boolean>): string {
  return Object.keys(row)
    .filter((key) => key !== 'id')
    .map((key) => `${key} = ${bit(row[key] ?? '')}`)
    .join(', ');
}

export function summarise(
  attempts: readonly AttemptRow[],
  bank: ReadonlyMap<string, Exercise>,
  historyLimit = 20,
  archive: ReadonlyMap<string, Exercise> = new Map(),
): Progress {
  // Attempts for exercises that are not currently released are ignored.
  const known = attempts
    .filter((attempt) => bank.has(attempt.exerciseId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const byExercise = new Map<string, AttemptRow[]>();
  for (const attempt of known)
    byExercise.set(attempt.exerciseId, [
      ...(byExercise.get(attempt.exerciseId) ?? []),
      attempt,
    ]);

  const lessons = new Map<string, LessonProgress>();
  for (const exercise of bank.values()) {
    const lesson = lessons.get(exercise.lessonId) ?? {
      lessonId: exercise.lessonId,
      total: 0,
      attempted: 0,
      mastered: 0,
      exercises: [],
    };
    lesson.total += 1;
    // A corrected exercise starts new evidence; old attempts remain in history.
    const list = byExercise
      .get(exercise.id)
      ?.filter((attempt) => attempt.exerciseVersion === exercise.version);
    if (list?.[0]) {
      const progress: ExerciseProgress = {
        exerciseId: exercise.id,
        attempts: list.length,
        correctAttempts: list.filter((a) => a.correct).length,
        latestCorrect: list[0].correct,
        masteryEvidence: list.some((a) => a.independentEvidence),
        lastAt: list[0].createdAt,
      };
      lesson.attempted += 1;
      if (progress.masteryEvidence) lesson.mastered += 1;
      lesson.exercises.push(progress);
    }
    lessons.set(exercise.lessonId, lesson);
  }

  // Open mistakes: the learner's latest attempt on the exercise is wrong.
  const mistakes: Mistake[] = [];
  for (const [exerciseId, list] of byExercise) {
    const latest = list[0];
    const current = bank.get(exerciseId);
    const exercise =
      archive.get(`${exerciseId}@${latest?.exerciseVersion}`) ??
      (current?.version === latest?.exerciseVersion ? current : undefined);
    if (!latest || !exercise || latest.correct) continue;
    const parsed = parseResponse(exercise, latest.response);
    const graded = parsed ? grade(exercise, parsed) : null;
    const mistake: Mistake = {
      exerciseId,
      exerciseVersion: latest.exerciseVersion,
      attemptId: latest.id,
      at: latest.createdAt,
      prompt: exercise.prompt,
      feedback: graded?.feedback ?? exercise.explanation,
      explanation: exercise.explanation,
    };
    if (parsed && exercise.type === 'single-choice' && 'optionId' in parsed)
      mistake.chosen = exercise.options.find(
        (option) => option.id === parsed.optionId,
      )?.label;
    if (graded?.rowResults && exercise.type === 'truth-table')
      mistake.wrongRows = exercise.rows
        .filter((row) => graded.rowResults?.[row.id] === false)
        .map(rowLabel);
    mistakes.push(mistake);
  }
  mistakes.sort((a, b) => b.at.localeCompare(a.at));

  return {
    totalAttempts: known.length,
    lessons: [...lessons.values()].sort((a, b) =>
      a.lessonId.localeCompare(b.lessonId),
    ),
    mistakes,
    history: known.slice(0, historyLimit).map((attempt) => ({
      attemptId: attempt.id,
      exerciseId: attempt.exerciseId,
      exerciseVersion: attempt.exerciseVersion,
      at: attempt.createdAt,
      correct: attempt.correct,
      independentEvidence: attempt.independentEvidence,
      hintUsed: attempt.hintUsed,
    })),
  };
}
