/** Chapter 4 public bilingual reading routes; practice remains gated. */
export const informationCopy = {
  fr: {
    title: 'Théorie de l’information',
    titleLines: ['Théorie de', 'l’information'],
    eyebrow: 'Chapitre 04 / Théorie de l’information',
    subtitle: ['Des bits aux messages,', 'puis à l’entropie.'],
    intro:
      'Comment coder un message, le décoder sans ambiguïté et mesurer la quantité d’information qu’il transporte ?',
    status: 'Six leçons à lire · exercices interactifs à venir',
    motto: 'Un message. Un code. Une idée.',
    start: 'Le point de départ',
    basics: 'Des symboles aux bits',
    formulaReading:
      'Un codage associe à chaque symbole de l’alphabet source un mot binaire, éventuellement de longueur variable.',
    formulaCaption: 'Un langage commun pour transmettre un message.',
    description:
      'Distinguer un alphabet, un symbole et un mot codé avant d’étudier les erreurs et la compression.',
    explore: 'Explorer le parcours',
    outline: 'Les leçons du chapitre',
    outlineNote:
      'Six leçons à lire en français ou en anglais, fondées sur les 20 pages du PDF. Les exercices interactifs restent en préparation.',
    upcoming: 'Lecture disponible',
    pages: 'Pages du PDF',
    lessons: [
      { id: 'L43', title: 'Bits et messages', pages: '2–6' },
      { id: 'L44', title: 'Codage par substitution', pages: '7–9' },
      { id: 'L45', title: 'Décodage unique', pages: '9–10' },
      { id: 'L46', title: 'Probabilités des symboles', pages: '11–13' },
      { id: 'L47', title: 'Longueur moyenne', pages: '14–16' },
      { id: 'L48', title: 'Entropie de Shannon', pages: '17–20' },
    ],
    goals: 'Ce que vous apprendrez',
    objectives: [
      'Représenter un message par un code binaire et expliquer comment il se décode.',
      'Reconnaître une ambiguïté de décodage et calculer une longueur moyenne pondérée.',
      'Interpréter une probabilité et l’entropie de Shannon sans confondre les deux.',
    ],
    practice: 'La pratique arrive',
    practiceText:
      'Les exercices interactifs, les cahiers A4 et les corrigés détaillés seront ajoutés après validation des leçons, des réponses et des traductions.',
    review: 'Une progression sans faux raccourcis',
    reviewText:
      'Les lectures sont disponibles ; les exercices interactifs et la maîtrise évaluée restent désactivés en attendant leur vérification.',
  },
  en: {
    title: 'Information theory',
    titleLines: ['Information', 'theory'],
    eyebrow: 'Chapter 04 / Information theory',
    subtitle: ['From bits to messages,', 'then to entropy.'],
    intro:
      'How can we encode a message, decode it unambiguously and measure the information it carries?',
    status: 'Six lessons available · interactive practice coming later',
    motto: 'One message. One code. One idea.',
    start: 'Start with the basics',
    basics: 'From symbols to bits',
    formulaReading:
      'A code assigns each source-alphabet symbol a binary codeword, possibly of variable length.',
    formulaCaption: 'A shared language for sending a message.',
    description:
      'Learn the difference between alphabets, symbols and codewords before studying errors and compression.',
    explore: 'Explore the learning path',
    outline: 'Chapter lessons',
    outlineNote:
      'Six readable French/English lessons based on the 20-page source PDF. Interactive exercises remain unavailable.',
    upcoming: 'Read now',
    pages: 'PDF pages',
    lessons: [
      { id: 'L43', title: 'Bits and messages', pages: '2–6' },
      { id: 'L44', title: 'Substitution coding', pages: '7–9' },
      { id: 'L45', title: 'Unique decoding', pages: '9–10' },
      { id: 'L46', title: 'Symbol probabilities', pages: '11–13' },
      { id: 'L47', title: 'Average codeword length', pages: '14–16' },
      { id: 'L48', title: 'Shannon entropy', pages: '17–20' },
    ],
    goals: 'What you will learn',
    objectives: [
      'Represent a message using binary code and explain how to decode it.',
      'Recognise decoding ambiguity and calculate a weighted average length.',
      'Interpret probability and Shannon entropy without conflating them.',
    ],
    practice: 'Practice is on the way',
    practiceText:
      'Interactive exercises, A4 workbooks and fully worked solutions will follow only after lessons, answers and translations have been reviewed.',
    review: 'A learning path without shortcuts',
    reviewText:
      'Reading lessons are available; interactive practice and assessed mastery remain disabled pending review.',
  },
} as const;
