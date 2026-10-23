import { coreFirst, exerciseScope } from '../exercise-scope.ts';
import { exerciseBank } from './bank.ts';
import { publicExercise } from './grading.ts';

/** Server-only projection shared by the verified page and exercise API. */
export function publicExercises(lessonId: string) {
  return coreFirst(
    [...exerciseBank.values()].filter(
      (exercise) => exercise.lessonId === lessonId,
    ),
  ).map((exercise) => ({
    ...publicExercise(exercise),
    scope: exerciseScope(lessonId, exercise.id),
  }));
}
