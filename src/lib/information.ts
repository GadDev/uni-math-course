/** Chapter 4 public bilingual reading routes; practice remains gated. */
export const informationCopy = {
  fr: {
    title: 'Théorie de l’information',
    titleLines: ['Théorie de', 'l’information'],
    eyebrow: 'Chapitre 04 / Théorie de l’information',
    subtitle: ['Des bits aux messages,', 'puis à l’entropie.'],
    intro:
      'Comment coder un message, le décoder sans ambiguïté et mesurer la quantité d’information qu’il transporte ?',
    status: 'Douze leçons disponibles · exercices après connexion',
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
      'Douze leçons bilingues, des alphabets aux blocs de Shannon, alignées sur le PDF actualisé de 60 pages. Connectez-vous pour pratiquer 15 exercices par leçon.',
    upcoming: 'Lecture disponible',
    pages: 'Pages du PDF',
    lessons: [
      { id: 'L43', title: 'Bits et messages', pages: '2–6' },
      { id: 'L44', title: 'Codage par substitution', pages: '7–9' },
      { id: 'L45', title: 'Décodage unique', pages: '9–10' },
      { id: 'L46', title: 'Probabilités des symboles', pages: '11–13' },
      { id: 'L47', title: 'Longueur moyenne', pages: '14–16' },
      { id: 'L48', title: 'Entropie de Shannon', pages: '22–32' },
      { id: 'L49', title: 'Coder avec Huffman', pages: '17–20' },
      { id: 'L50', title: 'Questions oui/non et arbres', pages: '33–44' },
      { id: 'L51', title: 'Kraft–McMillan', pages: '44–45' },
      { id: 'L52', title: 'Logarithme et lemme de Gibbs', pages: '46–48' },
      { id: 'L53', title: 'Démontrer la borne d’entropie', pages: '49–54' },
      { id: 'L54', title: 'Blocs et théorème de Shannon', pages: '55–60' },
    ],
    goals: 'Ce que vous apprendrez',
    objectives: [
      'Représenter un message par un code binaire et expliquer comment il se décode.',
      'Reconnaître une ambiguïté de décodage et calculer une longueur moyenne pondérée.',
      'Interpréter une probabilité et l’entropie de Shannon sans confondre les deux.',
      'Relier les arbres de questions aux codes, démontrer la borne d’entropie et comparer les coûts par bloc et par symbole.',
    ],
    practice: 'S’entraîner après connexion',
    practiceText:
      'Chaque leçon propose 15 questions avec correction côté serveur après authentification. Les cahiers de 700 exercices et leurs corrigés sont disponibles séparément.',
    review: 'Une progression sans faux raccourcis',
    reviewText:
      'Les nouvelles leçons L50–L54 et les révisions L48–L49 ont fait l’objet d’une auto-vérification de l’auteur, sans revue indépendante. Les autres banques conservent leur exception de revue documentée. Les exercices nécessitent une connexion.',
  },
  en: {
    title: 'Information theory',
    titleLines: ['Information', 'theory'],
    eyebrow: 'Chapter 04 / Information theory',
    subtitle: ['From bits to messages,', 'then to entropy.'],
    intro:
      'How can we encode a message, decode it unambiguously and measure the information it carries?',
    status: 'Twelve lessons available · sign in to practise',
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
      'Twelve bilingual lessons, from alphabets to Shannon blocks, aligned with the updated 60-page PDF. Sign in to practise 15 exercises per lesson.',
    upcoming: 'Read now',
    pages: 'PDF pages',
    lessons: [
      { id: 'L43', title: 'Bits and messages', pages: '2–6' },
      { id: 'L44', title: 'Substitution coding', pages: '7–9' },
      { id: 'L45', title: 'Unique decoding', pages: '9–10' },
      { id: 'L46', title: 'Symbol probabilities', pages: '11–13' },
      { id: 'L47', title: 'Average codeword length', pages: '14–16' },
      { id: 'L48', title: 'Shannon entropy', pages: '22–32' },
      { id: 'L49', title: 'Huffman coding', pages: '17–20' },
      { id: 'L50', title: 'Yes/no questions and trees', pages: '33–44' },
      { id: 'L51', title: 'Kraft–McMillan', pages: '44–45' },
      { id: 'L52', title: 'Logarithms and Gibbs’ lemma', pages: '46–48' },
      { id: 'L53', title: 'Proving the entropy bound', pages: '49–54' },
      { id: 'L54', title: 'Blocks and Shannon’s theorem', pages: '55–60' },
    ],
    goals: 'What you will learn',
    objectives: [
      'Represent a message using binary code and explain how to decode it.',
      'Recognise decoding ambiguity and calculate a weighted average length.',
      'Interpret probability and Shannon entropy without conflating them.',
      'Connect question trees to codes, prove the entropy bound and compare block and per-symbol costs.',
    ],
    practice: 'Practise after signing in',
    practiceText:
      'Each lesson has 15 signed-in questions, graded on the server. The separate A4 workbooks now cover 700 exercises and worked solutions.',
    review: 'A learning path without shortcuts',
    reviewText:
      'New lessons L50–L54 and revised L48–L49 have author self-checks, without independent review. Other banks retain their documented review exceptions. Exercises require sign-in.',
  },
} as const;
