/** Chapter 03 follows the 19-page Functions PDF; all lessons are bilingual. */
export const functionsGroups = [
  { title: { fr: 'Fonctions et dérivées', en: 'Functions and derivatives' }, lessonIds: ['L37', 'L38', 'L39'] },
  { title: { fr: 'Exponentielles et logarithmes', en: 'Exponentials and logarithms' }, lessonIds: ['L40', 'L41'] },
  { title: { fr: 'Applications informatiques', en: 'Computing applications' }, lessonIds: ['L42'] },
] as const;

export const functionsLessonIds: readonly string[] = functionsGroups.flatMap((group) => [...group.lessonIds]);
