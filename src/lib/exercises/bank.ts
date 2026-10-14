import type { Exercise } from './grading.ts';

// Only reviewed lessons are delivered. L05 is the reviewed pilot; add a lesson
// here only after its exercises have passed mathematical and bilingual review.
export const RELEASED_LESSONS: readonly string[] = ['L05'];

const files = import.meta.glob<{ exercises: Exercise[] }>(
  '../../../exercises/L*/v1.json',
  { eager: true, import: 'default' },
);

/** Answer-bearing records, keyed by exercise id. Server routes only. */
export const exerciseBank: ReadonlyMap<string, Exercise> = new Map(
  Object.values(files)
    .flatMap((file) => file.exercises)
    .filter(
      (exercise) =>
        RELEASED_LESSONS.includes(exercise.lessonId) &&
        (exercise.type === 'single-choice' || exercise.type === 'truth-table'),
    )
    .map((exercise) => [exercise.id, exercise]),
);
