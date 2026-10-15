import type { Exercise } from './grading.ts';

import { RELEASED_LESSONS, lessonReleases } from '../released-lessons.ts';

export { RELEASED_LESSONS };

const files = import.meta.glob<{ exercises: Exercise[] }>(
  '../../../exercises/L*/v*.json',
  { eager: true, import: 'default' },
);

/** Immutable historical grading contexts. Server routes only. */
export const exerciseArchive: ReadonlyMap<string, Exercise> = new Map(
  Object.values(files)
    .flatMap((file) => file.exercises)
    .filter(
      (exercise) =>
        RELEASED_LESSONS.includes(exercise.lessonId) &&
        (exercise.type === 'single-choice' || exercise.type === 'truth-table'),
    )
    .map((exercise) => [`${exercise.id}@${exercise.version}`, exercise]),
);

/** Only the explicitly selected release version is delivered for new attempts. */
export const exerciseBank: ReadonlyMap<string, Exercise> = new Map(
  [...exerciseArchive.values()]
    .filter(
      (exercise) =>
        lessonReleases[exercise.lessonId]?.version === exercise.version,
    )
    .map((exercise) => [exercise.id, exercise]),
);
