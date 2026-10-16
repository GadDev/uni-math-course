/** Public chapter membership only; lesson titles come from the content collection. */
export const droitesGroups = [
  {
    title: { fr: 'Calcul algébrique', en: 'Algebra' },
    lessonIds: ['L21', 'L22', 'L23', 'L24', 'L25', 'L26'],
  },
  {
    title: { fr: 'Repère et courbes', en: 'Coordinates and curves' },
    lessonIds: ['L27', 'L28'],
  },
  {
    title: { fr: 'Droites et régions', en: 'Lines and regions' },
    lessonIds: ['L29', 'L30', 'L31'],
  },
  {
    title: { fr: 'De la droite aux pixels', en: 'From lines to pixels' },
    lessonIds: ['L32', 'L33'],
  },
  {
    title: { fr: 'Régression et modèles', en: 'Regression and models' },
    lessonIds: ['L34', 'L35', 'L36'],
  },
] as const;

export const droitesLessonIds: readonly string[] = droitesGroups.flatMap(
  (group) => [...group.lessonIds],
);
