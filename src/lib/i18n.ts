export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const copy = {
  fr: {
    brand: 'Uni Math',
    navigation: 'Navigation principale',
    lessonNav: 'Leçon 05',
    heroLines: ['Logique', 'Ensembles'],
    motto: 'Comprendre. Essayer. Progresser.',
    formulaReading: 'Se lit : « si A, alors B ».',
    outline: 'Le programme',
    contents: 'Dans cette leçon',
    understand: 'Comprendre',
    skip: 'Aller au contenu',
    course: 'Le cours',
    lesson: 'Leçon pilote',
    homeTitle: 'Reprendre les maths, une idée à la fois.',
    intro:
      'Une idée, un exemple, puis à vous de raisonner. Un parcours bilingue pour retrouver le fil des mathématiques.',
    label: 'LOGIQUE ET ENSEMBLES',
    pilot: 'Pilote en construction',
    read: 'Lire la leçon',
    public: 'Lecture libre',
    time: '12 minutes',
    lessonTitle: 'L’implication',
    description:
      'Une promesse avec un seul échec. Découvrez A ⇒ B, sa table de vérité et les conditions nécessaires et suffisantes.',
    future: 'Les premières idées',
    planned: 'À venir',
    practiceTitle: 'La pratique arrive ensuite',
    practice:
      'Les exercices interactifs et le suivi des progrès sont en développement. La lecture reste libre ; la connexion sera disponible une fois le service configuré.',
    review: 'Texte original du projet · Leçon pilote · Version 1',
    language: 'Langue',
    footer:
      'Projet étudiant indépendant. Aucune affiliation ou approbation universitaire revendiquée.',
    content: 'Accès au contenu',
    notice: 'Lecture disponible',
    readingNotice:
      'Vous pouvez lire cette leçon librement. La connexion sera nécessaire pour les futurs exercices.',
    next: 'Revenir au programme',
    lessons: ['Assertions', 'Connecteurs logiques', 'Tables de vérité'],
    showGuide: 'Comment utiliser ce carnet',
    guide:
      'Lisez un exemple, puis reformulez la règle avec vos propres mots. Les activités guidées font partie de la lecture ; les réponses indépendantes viendront avec la pratique connectée.',
    hideGuide: 'Masquer le conseil',
    notFound: 'Page introuvable',
  },
  en: {
    brand: 'Uni Math',
    navigation: 'Main navigation',
    lessonNav: 'Lesson 05',
    heroLines: ['Logic', 'Sets'],
    motto: 'Understand. Try. Progress.',
    formulaReading: 'Read as: “if A, then B”.',
    outline: 'The programme',
    contents: 'In this lesson',
    understand: 'Understand',
    skip: 'Skip to content',
    course: 'The course',
    lesson: 'Pilot lesson',
    homeTitle: 'Return to maths, one idea at a time.',
    intro:
      'One idea, one example, then your turn to reason. A bilingual learning path to find your way back to mathematics.',
    label: 'LOGIC AND SETS',
    pilot: 'Pilot under construction',
    read: 'Read the lesson',
    public: 'Open reading',
    time: '12 minutes',
    lessonTitle: 'Implication',
    description:
      'A promise with one failure case. Explore A ⇒ B, its truth table, and necessary and sufficient conditions.',
    future: 'The first ideas',
    planned: 'Coming later',
    practiceTitle: 'Practice comes next',
    practice:
      'Interactive exercises and progress tracking are in development. Reading stays open; sign-in becomes available once the service is configured.',
    review: 'Original project text · Pilot lesson · Version 1',
    language: 'Language',
    footer:
      'Independent student project. No university affiliation or endorsement claimed.',
    content: 'Content access',
    notice: 'Reading available',
    readingNotice:
      'You can read this lesson freely. Sign-in will be required for future exercises.',
    next: 'Back to the programme',
    lessons: ['Assertions', 'Logical connectives', 'Truth tables'],
    showGuide: 'How to use this notebook',
    guide:
      'Read an example, then explain the rule in your own words. Guided work belongs to reading; independent answers will arrive with signed-in practice.',
    hideGuide: 'Hide the tip',
    notFound: 'Page not found',
  },
} as const;
