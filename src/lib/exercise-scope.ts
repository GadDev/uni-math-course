// Answer-free teaching scope. It changes the route through the existing items,
// never their identity, grade, version or eligibility for mastery evidence.
const extensions: Readonly<Record<string, readonly number[]>> = {
  L35: [1, 6, 9, 11, 12, 15],
  L36: [1, 6, 10, 11, 14],
};
export function exerciseScope(
  lessonId: string,
  exerciseId: string,
): 'core' | 'extension' {
  return extensions[lessonId]?.includes(Number(exerciseId.split('-E')[1]))
    ? 'extension'
    : 'core';
}
export function coreFirst<T extends { id: string; lessonId: string }>(
  exercises: T[],
): T[] {
  return [...exercises].sort(
    (a, b) =>
      Number(exerciseScope(a.lessonId, a.id) === 'extension') -
      Number(exerciseScope(b.lessonId, b.id) === 'extension'),
  );
}
