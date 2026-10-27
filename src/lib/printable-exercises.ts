import type { Locale } from './i18n';

export type PrintableDocument = {
  id: string;
  path: string;
  pages: number;
  sha256: string;
  type: 'exercises' | 'solutions';
};

export type PrintableChapter = {
  id: 'chapter-01' | 'chapter-02' | 'chapter-04';
  number: string;
  lessons: string;
  count: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  documents: readonly PrintableDocument[];
};

// These PDFs are original independent practice supplements, NOT the course source PDFs.
// SHA-256 values identify the exact four user-supplied PDFs approved for inclusion.
export const printableChapters: readonly PrintableChapter[] = [
  {
    id: 'chapter-01',
    number: '01',
    lessons: 'L01–L20',
    count: 300,
    title: { fr: 'Logique et ensembles', en: 'Logic and sets' },
    description: {
      fr: 'Assertions, tables de vérité, quantificateurs, ensembles et applications IT. 20 leçons, 15 exercices par leçon, répartis en trois niveaux.',
      en: 'Statements, truth tables, quantifiers, sets and IT applications. 20 lessons with 15 exercises each across three difficulty levels.',
    },
    documents: [
      {
        id: 'chapter-01-exercises',
        type: 'exercises',
        path: 'pdfs/exercises/chapter-01-exercises.pdf',
        pages: 83,
        sha256:
          '7212c87b5bb45783a0bb88186d7123b75c46949fee352526e5a7a25913159ecd',
      },
      {
        id: 'chapter-01-solutions',
        type: 'solutions',
        path: 'pdfs/exercises/chapter-01-solutions.pdf',
        pages: 23,
        sha256:
          '2bb310d4f8dfdc6dc659fb6f6386747958ec39b257c4059cd9fa1010d93c9be4',
      },
    ],
  },
  {
    id: 'chapter-02',
    number: '02',
    lessons: 'L21–L36',
    count: 640,
    title: { fr: 'Droites', en: 'Straight lines' },
    description: {
      fr: 'Calculs algébriques, équations, géométrie, pixels, régression et corrélation. 16 leçons, 40 exercices de calcul par leçon.',
      en: 'Algebra, equations, geometry, pixels, regression and correlation. 16 lessons with 40 calculation exercises each.',
    },
    documents: [
      {
        id: 'chapter-02-exercises',
        type: 'exercises',
        path: 'pdfs/exercises/chapter-02-exercises.pdf',
        pages: 146,
        sha256:
          '7c936ee21b2ed47053b9f5962338746aadb4a2c9d0174d05c8a771727d16c203',
      },
      {
        id: 'chapter-02-solutions',
        type: 'solutions',
        path: 'pdfs/exercises/chapter-02-solutions.pdf',
        pages: 81,
        sha256:
          '3108f51b5976721ab15d4ca07e2c6827d285bfbd5e61faa209269319aba95b0d',
      },
    ],
  },
  {
    id: 'chapter-04',
    number: '04',
    lessons: 'L43–L49',
    count: 700,
    title: { fr: 'Théorie de l’information', en: 'Information theory' },
    description: {
      fr: 'Sept leçons, dont Huffman en extension : 700 exercices bilingues et leurs corrigés détaillés.',
      en: 'Seven lessons, including a Huffman extension: 700 bilingual exercises and worked solutions.',
    },
    documents: [
      {
        id: 'chapter-04-exercises',
        type: 'exercises',
        path: 'pdfs/exercises/chapter-04-exercises.pdf',
        pages: 86,
        sha256:
          '8ce7e9a52525f61d294d5517e94e97a10a3a5ed3beb8c0f1ce8684b283fa6d69',
      },
      {
        id: 'chapter-04-solutions',
        type: 'solutions',
        path: 'pdfs/exercises/chapter-04-solutions.pdf',
        pages: 105,
        sha256:
          '686ba995ed1356955595961bf571e2c138aa512801b6a00b37f1ad1ae1e8ba4c',
      },
    ],
  },
];

export const printableCopy = {
  fr: {
    nav: 'Exercices',
    breadcrumb: 'Le cours',
    kicker: 'CAHIERS DE PRATIQUE · FORMAT A4',
    title: 'Exercices à imprimer',
    description:
      '1 640 exercices pour s’entraîner à son rythme, avec un corrigé séparé pour chaque chapitre.',
    intro:
      'Téléchargez un cahier, écrivez vos calculs sur papier, puis vérifiez vos réponses. Pas de compte requis.',
    languageNote:
      'Les cahiers des chapitres 1 et 2 sont en français ; les deux documents du chapitre 4 sont bilingues (FR/EN).',
    toc: 'Parcourir les cahiers',
    chapterLabel: 'Chapitre',
    lessonsLabel: 'Leçons',
    exercisesLabel: 'exercices',
    documentsTitle: 'Documents PDF',
    exercises: 'Cahier d’exercices',
    solutions: 'Corrigé détaillé',
    download: 'Télécharger le PDF',
    pending: 'Fichier en attente d’ajout',
    pages: 'pages',
    howTitle: 'Comment travailler avec ces cahiers',
    howKicker: 'UNE ROUTINE SIMPLE',
    steps: [
      'Résolvez d’abord les exercices sans ouvrir le corrigé.',
      'Comparez les démarches, pas seulement les résultats.',
      'Réessayez les exercices ratés 48 heures plus tard.',
    ],
    notice:
      'Contenus de pratique originaux, non officiels, basés sur la progression des chapitres. Ils ne sont ni publiés ni approuvés par l’Université du Luxembourg.',
    unavailable:
      'Les fichiers PDF doivent encore être ajoutés à cette branche. Les téléchargements s’activeront dès leur inclusion et la reconstruction du site.',
    back: 'Retour au programme',
  },
  en: {
    nav: 'Exercises',
    breadcrumb: 'The course',
    kicker: 'PRINTABLE PRACTICE · A4',
    title: 'Printable exercises',
    description:
      '1,640 exercises to practise at your own pace, with a separate answer booklet for each chapter.',
    intro:
      'Download a workbook, work through the calculations on paper, then check your answers. No account required.',
    languageNote:
      'Chapter 1 and 2 PDFs are in French; both Chapter 4 workbooks are bilingual (FR/EN).',
    toc: 'Browse workbooks',
    chapterLabel: 'Chapter',
    lessonsLabel: 'Lessons',
    exercisesLabel: 'exercises',
    documentsTitle: 'PDF documents',
    exercises: 'Exercise workbook',
    solutions: 'Detailed solutions',
    download: 'Download PDF',
    pending: 'File not yet uploaded',
    pages: 'pages',
    howTitle: 'How to use these workbooks',
    howKicker: 'A SIMPLE ROUTINE',
    steps: [
      'Try the exercises before opening the answer booklet.',
      'Check the reasoning, not just the final answers.',
      'Retry missed exercises 48 hours later.',
    ],
    notice:
      'Original, unofficial practice materials following the chapter progression. They are not published or endorsed by the University of Luxembourg.',
    unavailable:
      'The PDF files still need to be added to this branch. Download links will activate once the files are committed and the site rebuilt.',
    back: 'Back to the programme',
  },
} as const;
