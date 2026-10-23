import { exerciseBank } from './bank.ts';
import { publicExercise } from './grading.ts';

/** Server-only projection shared by the verified page and exercise API. */
export function publicExercises(lessonId: string) {
  return [...exerciseBank.values()]
    .filter((exercise) => exercise.lessonId === lessonId)
    .map(publicExercise);
}
