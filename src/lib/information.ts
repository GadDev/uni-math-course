/** Chapter 4 orientation only. No lesson IDs are released by this file. */
export const informationCopy = {
  fr: {
    title: 'Théorie de l’information',
    titleLines: ['Théorie de', 'l’information'],
    eyebrow: 'Chapitre 04 / Théorie de l’information',
    subtitle: ['Des bits aux messages,', 'puis à l’entropie.'],
    intro:
      'Comment coder un message, le décoder sans ambiguïté et mesurer la quantité d’information qu’il transporte ?',
    status: 'Leçons et exercices en préparation',
    motto: 'Un message. Un code. Une idée.',
    start: 'Le point de départ',
    basics: 'Des symboles aux bits',
    formulaReading:
      'Un codage associe à chaque symbole de l’alphabet source un mot binaire, éventuellement de longueur variable.',
    formulaCaption: 'Un langage commun pour transmettre un message.',
    description:
      'Distinguer un alphabet, un symbole et un mot codé avant d’étudier les erreurs et la compression.',
    explore: 'Explorer le parcours',
    outline: 'Les étapes à venir',
    outlineNote: 'Six étapes proposées à partir des 20 pages du document source. Aucun exercice interactif n’est encore publié.',
    upcoming: 'En préparation',
    pages: 'Pages du PDF',
    lessons: [
      { title: 'Bits et messages', pages: '2–6' },
      { title: 'Codage par substitution', pages: '7–9' },
      { title: 'Décodage unique', pages: '9–10' },
      { title: 'Probabilités des symboles', pages: '11–13' },
      { title: 'Longueur moyenne', pages: '14–16' },
      { title: 'Entropie de Shannon', pages: '17–20' },
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
      'Cette page présente le parcours prévu. Elle ne marque aucune leçon comme terminée et ne crée aucun résultat de maîtrise.',
  },
  en: {
    title: 'Information theory',
    titleLines: ['Information', 'theory'],
    eyebrow: 'Chapter 04 / Information theory',
    subtitle: ['From bits to messages,', 'then to entropy.'],
    intro:
      'How can we encode a message, decode it unambiguously and measure the information it carries?',
    status: 'Lessons and exercises in preparation',
    motto: 'One message. One code. One idea.',
    start: 'Start with the basics',
    basics: 'From symbols to bits',
    formulaReading:
      'A code assigns each source-alphabet symbol a binary codeword, possibly of variable length.',
    formulaCaption: 'A shared language for sending a message.',
    description:
      'Learn the difference between alphabets, symbols and codewords before studying errors and compression.',
    explore: 'Explore the learning path',
    outline: 'The upcoming learning path',
    outlineNote: 'Six proposed steps grounded in the 20-page source document. No interactive exercises are published yet.',
    upcoming: 'In preparation',
    pages: 'PDF pages',
    lessons: [
      { title: 'Bits and messages', pages: '2–6' },
      { title: 'Substitution coding', pages: '7–9' },
      { title: 'Unique decoding', pages: '9–10' },
      { title: 'Symbol probabilities', pages: '11–13' },
      { title: 'Average codeword length', pages: '14–16' },
      { title: 'Shannon entropy', pages: '17–20' },
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
      'This page previews the planned route. It does not mark lessons complete or create any mastery results.',
  },
} as const;
