import { copy, type Locale } from './i18n.ts';
import { droitesLessonIds } from './droites-lessons.ts';

export const chapters = [
  {
    id: 'C01',
    number: '01',
    path: '',
    title: { fr: 'Logique et ensembles', en: 'Logic and sets' },
    shortTitle: { fr: 'Logique', en: 'Logic' },
    status: 'reading',
    lessonIds: copy.fr.programme.map((lesson) => lesson.id),
  },
  {
    id: 'C02',
    number: '02',
    path: 'chapters/C02/',
    title: { fr: 'Droites', en: 'Straight lines' },
    shortTitle: { fr: 'Droites', en: 'Lines' },
    status: 'reading',
    lessonIds: droitesLessonIds,
  },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];
export const chapterHref = (
  locale: Locale,
  chapter: (typeof chapters)[number],
) => `/${locale}/${chapter.path}`;

/** Paths are locale-relative, like Base's existing path prop. Shared resources
 * intentionally have no active chapter; never infer membership from a number. */
export function chapterForPath(path: string) {
  return chapters.find(
    (chapter) =>
      path === chapter.path ||
      chapter.lessonIds.some(
        (id) => path === `lessons/${id}/` || path === `lessons/${id}/practice/`,
      ),
  );
}

export const chapterCopy = {
  fr: {
    label: 'Chapitre',
    all: 'Chapitres',
    choose: 'Choisir un chapitre',
    current: 'Chapitre actuel',
    reading: 'Lecture disponible',
    preparing: 'En préparation',
    keepsLanguage: 'Le changement de chapitre conserve la langue.',
  },
  en: {
    label: 'Chapter',
    all: 'Chapters',
    choose: 'Choose a chapter',
    current: 'Current chapter',
    reading: 'Reading available',
    preparing: 'In preparation',
    keepsLanguage: 'Switching chapters keeps your language.',
  },
} as const;
