import type { Locale } from './i18n';

export type PrintableDocument = {
  id: string;
  path: string;
  pages: number;
  sha256: string;
  type: 'exercises' | 'solutions';
  language?: Locale;
  label?: Record<Locale, string>;
};

export type PrintableChapter = {
  id: 'chapter-01' | 'chapter-02' | 'chapter-03';
  number: string;
  lessons: string;
  count: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  documents: readonly PrintableDocument[];
};

// These PDFs are original independent practice supplements, NOT the course source PDFs.
// SHA-256 values identify the exact approved PDF bytes, including the eight
// original bilingual Chapter 3 workbooks and challenge documents.
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
    id: 'chapter-03',
    number: '03',
    lessons: 'L37–L42',
    count: 600,
    title: {
      fr: 'Fonctions d’une variable réelle',
      en: 'Functions of a real variable',
    },
    description: {
      fr: 'Fonctions, dérivées, exponentielles, logarithmes et complexité. Six leçons, 600 exercices imprimables et défis Ninja séparés.',
      en: 'Functions, derivatives, exponentials, logarithms and complexity. Six lessons, 600 printable exercises and separate Ninja challenges.',
    },
    documents: [
      {
        id: 'chapter-03-exercises-fr',
        type: 'exercises',
        language: 'fr',
        label: {
          fr: '600 exercices de calcul',
          en: '600 calculation exercises',
        },
        path: 'pdfs/exercises/chapter-03-exercises-fr.pdf',
        pages: 50,
        sha256:
          '663493d43c2e060853f169af302dc039ec2bf451a578649a5a0d0bf93275a2a4',
      },
      {
        id: 'chapter-03-solutions-fr',
        type: 'solutions',
        language: 'fr',
        label: {
          fr: 'Corrigés des 600 exercices',
          en: 'Solutions to 600 exercises',
        },
        path: 'pdfs/exercises/chapter-03-solutions-fr.pdf',
        pages: 40,
        sha256:
          '3678912c2cbb964269d4cb3abc8d5fd94776b9226e7420fc88b0777cb46c76d2',
      },
      {
        id: 'chapter-03-challenge-exercises-fr',
        type: 'exercises',
        language: 'fr',
        label: {
          fr: 'Défis Math Ninja',
          en: 'Math Ninja challenges',
        },
        path: 'pdfs/exercises/chapter-03-challenge-exercises-fr.pdf',
        pages: 6,
        sha256:
          '0fbb50cfe4ec7fb8ac737b3f32551cfd225686b6377aa2eaa5122b73fb9e685d',
      },
      {
        id: 'chapter-03-challenge-solutions-fr',
        type: 'solutions',
        language: 'fr',
        label: {
          fr: 'Corrigés des défis Ninja',
          en: 'Math Ninja challenge solutions',
        },
        path: 'pdfs/exercises/chapter-03-challenge-solutions-fr.pdf',
        pages: 6,
        sha256:
          '841783a9e0811619207a4255377d3418ae3a1f9559fa67094cf433bf97124296',
      },
      {
        id: 'chapter-03-exercises-en',
        type: 'exercises',
        language: 'en',
        label: {
          fr: '600 exercices de calcul',
          en: '600 calculation exercises',
        },
        path: 'pdfs/exercises/chapter-03-exercises-en.pdf',
        pages: 50,
        sha256:
          '7b30b6c887a5dd7f4782612ecfc5db369ceadbdec3993ecb08b7496253197134',
      },
      {
        id: 'chapter-03-solutions-en',
        type: 'solutions',
        language: 'en',
        label: {
          fr: 'Corrigés des 600 exercices',
          en: 'Solutions to 600 exercises',
        },
        path: 'pdfs/exercises/chapter-03-solutions-en.pdf',
        pages: 39,
        sha256:
          '749feccb5192bfe170112a97cde24ca7279561d1ba2ea03877fe22e877d2283d',
      },
      {
        id: 'chapter-03-challenge-exercises-en',
        type: 'exercises',
        language: 'en',
        label: {
          fr: 'Défis Math Ninja',
          en: 'Math Ninja challenges',
        },
        path: 'pdfs/exercises/chapter-03-challenge-exercises-en.pdf',
        pages: 6,
        sha256:
          'dd004978822734e198523a727bf8334942c28e918b50ed3dd36491f60c3afff8',
      },
      {
        id: 'chapter-03-challenge-solutions-en',
        type: 'solutions',
        language: 'en',
        label: {
          fr: 'Corrigés des défis Ninja',
          en: 'Math Ninja challenge solutions',
        },
        path: 'pdfs/exercises/chapter-03-challenge-solutions-en.pdf',
        pages: 6,
        sha256:
          'b2bb3026ae5c88379e77528ec1e7952d93bd134ce3b063a268c31a579fede190',
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
      '1 540 exercices pour s’entraîner à son rythme, avec un corrigé séparé pour chaque chapitre.',
    intro:
      'Téléchargez un cahier, écrivez vos calculs sur papier, puis vérifiez vos réponses. Pas de compte requis.',
    languageNote:
      'Les cahiers des chapitres 1 et 2 sont en français. Les ressources du chapitre 3 existent en français et en anglais ; vous voyez la langue de cette page.',
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
      '1,540 exercises to practise at your own pace, with a separate answer booklet for each chapter.',
    intro:
      'Download a workbook, work through the calculations on paper, then check your answers. No account required.',
    languageNote:
      'Chapters 1 and 2 have French-only PDFs. Chapter 3 has both French and English editions; this page displays the English PDFs.',
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
