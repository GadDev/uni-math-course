import type { Exercise } from './grading.ts';

import { RELEASED_LESSONS } from '../released-lessons.ts';

export { RELEASED_LESSONS };

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
