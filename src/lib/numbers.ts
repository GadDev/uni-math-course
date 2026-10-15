// Original bilingual prerequisite support; not a new sourced course lesson.
// Shared IDs, mathematical symbols and examples keep both language versions aligned.
export const families = [
  {
    id: 'natural',
    symbol: '\\mathbb{N}',
    examples: '0,1,2,3,\\ldots',
    en: {
      name: 'Natural numbers',
      meaning: 'The counting numbers, including zero in this course.',
    },
    fr: {
      name: 'Nombres naturels',
      meaning: 'Les nombres pour compter, en incluant zéro dans ce cours.',
    },
  },
  {
    id: 'whole',
    symbol: '\\text{—}',
    examples: '0,1,2,3,\\ldots',
    en: {
      name: 'Whole numbers (English term)',
      meaning:
        'An informal English label for non-negative integers. Here they coincide with natural numbers; there is no universal separate symbol.',
    },
    fr: {
      name: 'Entiers naturels (terme anglais : whole numbers)',
      meaning:
        'Terme anglais désignant les entiers non négatifs. Ici, ils coïncident avec les naturels ; il n’existe pas de symbole distinct universel.',
    },
  },
  {
    id: 'integer',
    symbol: '\\mathbb{Z}',
    examples: '-5,-2,0,3,10',
    en: {
      name: 'Integers',
      meaning: 'Whole-number values that can be negative, zero or positive.',
    },
    fr: {
      name: 'Entiers relatifs',
      meaning: 'Nombres entiers négatifs, nuls ou positifs.',
    },
  },
  {
    id: 'rational',
    symbol: '\\mathbb{Q}',
    examples: '\\frac{1}{2},-\\frac{3}{4},0.75,5',
    en: {
      name: 'Rational numbers',
      meaning:
        'Ratios a/b of integers with b ≠ 0; decimal expansions terminate or eventually repeat.',
    },
    fr: {
      name: 'Nombres rationnels',
      meaning:
        'Quotients a/b de deux entiers avec b ≠ 0 ; leur écriture décimale est finie ou périodique à partir d’un certain rang.',
    },
  },
  {
    id: 'irrational',
    symbol: '\\mathbb{R}\\setminus\\mathbb{Q}',
    examples: '\\pi,\\sqrt{2},e',
    en: {
      name: 'Irrational numbers',
      meaning:
        'Real numbers that cannot be expressed as a ratio of two integers.',
    },
    fr: {
      name: 'Nombres irrationnels',
      meaning:
        'Réels qui ne peuvent pas s’écrire comme le quotient de deux entiers.',
    },
  },
  {
    id: 'real',
    symbol: '\\mathbb{R}',
    examples: '-3,0,1.5,\\pi',
    en: {
      name: 'Real numbers',
      meaning:
        'All rational and irrational numbers: the points on the number line.',
    },
    fr: {
      name: 'Nombres réels',
      meaning:
        'Tous les rationnels et irrationnels : les points de la droite numérique.',
    },
  },
  {
    id: 'imaginary',
    symbol: 'bi',
    examples: '2i,-5i',
    en: {
      name: 'Purely imaginary numbers',
      meaning:
        'Numbers bi with real b ≠ 0 and i² = −1. They are complex but not real.',
    },
    fr: {
      name: 'Nombres imaginaires purs',
      meaning:
        'Nombres bi avec b réel non nul et i² = −1. Ils sont complexes mais non réels.',
    },
  },
  {
    id: 'complex',
    symbol: '\\mathbb{C}',
    examples: '3+2i,5-i,7',
    en: {
      name: 'Complex numbers',
      meaning:
        'Numbers a + bi, where a and b are real and i² = −1. Real numbers have b = 0.',
    },
    fr: {
      name: 'Nombres complexes',
      meaning:
        'Nombres a + bi, où a et b sont réels et i² = −1. Pour les réels, b = 0.',
    },
  },
] as const;

export const properties = [
  {
    id: 'even',
    examples: '2,4,6,8',
    en: { name: 'Even', meaning: 'An integer divisible by 2.' },
    fr: { name: 'Pair', meaning: 'Un entier divisible par 2.' },
  },
  {
    id: 'odd',
    examples: '1,3,5,7',
    en: { name: 'Odd', meaning: 'An integer not divisible by 2.' },
    fr: { name: 'Impair', meaning: 'Un entier non divisible par 2.' },
  },
  {
    id: 'prime',
    examples: '2,3,5,7,11',
    en: {
      name: 'Prime',
      meaning: 'An integer greater than 1 with exactly two positive divisors.',
    },
    fr: {
      name: 'Premier',
      meaning:
        'Un entier supérieur à 1 ayant exactement deux diviseurs positifs.',
    },
  },
  {
    id: 'composite',
    examples: '4,6,8,9',
    en: {
      name: 'Composite',
      meaning:
        'An integer greater than 1 with more than two positive divisors.',
    },
    fr: {
      name: 'Composé',
      meaning: 'Un entier supérieur à 1 ayant plus de deux diviseurs positifs.',
    },
  },
  {
    id: 'positive',
    examples: '1,2.5,100',
    en: {
      name: 'Positive',
      meaning: 'A real number strictly greater than zero.',
    },
    fr: {
      name: 'Positif',
      meaning: 'Un nombre réel strictement supérieur à zéro.',
    },
  },
  {
    id: 'negative',
    examples: '-1,-2.5,-100',
    en: { name: 'Negative', meaning: 'A real number strictly less than zero.' },
    fr: {
      name: 'Négatif',
      meaning: 'Un nombre réel strictement inférieur à zéro.',
    },
  },
] as const;

export const guidedChecks = [
  {
    id: 'negative-integer',
    en: {
      question:
        'What is the smallest standard number set in the chain containing −7?',
      options: 'Natural · Integer · Irrational',
      answer: 'Integer',
      explanation: '−7 is an integer, but is not a natural number.',
    },
    fr: {
      question: 'Quel est le plus petit ensemble de la chaîne contenant −7 ?',
      options: 'Naturels · Entiers relatifs · Irrationnels',
      answer: 'Entiers relatifs',
      explanation: '−7 est un entier relatif, mais pas un naturel.',
    },
  },
  {
    id: 'irrational-example',
    en: {
      question: 'Which of these numbers is irrational?',
      options: '0.5 · √2 · −4',
      answer: '√2',
      explanation:
        '√2 cannot be expressed as a fraction of two integers; 0.5 and −4 can.',
    },
    fr: {
      question: 'Lequel de ces nombres est irrationnel ?',
      options: '0,5 · √2 · −4',
      answer: '√2',
      explanation:
        '√2 ne peut pas s’écrire comme quotient de deux entiers ; 0,5 et −4 le peuvent.',
    },
  },
  {
    id: 'integer-rational',
    en: {
      question: 'Is every integer also a rational number?',
      options: 'Yes · No',
      answer: 'Yes',
      explanation: 'Every integer n can be written as the fraction n/1.',
    },
    fr: {
      question: 'Tout entier relatif est-il aussi un nombre rationnel ?',
      options: 'Oui · Non',
      answer: 'Oui',
      explanation:
        'Tout entier n peut s’écrire sous la forme de la fraction n/1.',
    },
  },
] as const;

export const numberCopy = {
  en: {
    nav: 'Number families',
    breadcrumbLabel: 'Breadcrumb',
    kicker: 'FOUNDATIONS / THE NUMBER SYSTEM',
    title: 'The number family',
    description:
      'Natural, integer, rational, real and complex: discover how mathematical numbers fit together.',
    intro:
      'Think of number sets as nested families. Every natural number is an integer, but not every integer is natural.',
    toc: 'On this page',
    sectionOne: '01 / CLASSIFY',
    sectionTwo: '02 / CONNECT',
    sectionThree: '03 / RECOGNISE',
    sectionFour: '04 / REASON',
    familiesTitle: 'The main types of numbers',
    setsIntro:
      'Different sets describe different kinds of numbers. A number can belong to several sets at once.',
    tableLabel: 'Types of numbers; scroll horizontally if necessary',
    columnSymbol: 'Symbol',
    columnName: 'Name',
    columnExamples: 'Examples',
    columnMeaning: 'Meaning',
    convention:
      'Course convention: ℕ = {0, 1, 2, …}. Some textbooks exclude zero. “Whole numbers” is an English-language term, not another set between ℕ and ℤ.',
    decimals:
      'A decimal such as 0.75 is rational (3/4). A repeating decimal such as 0.333… is also rational (1/3).',
    diagramTitle: 'The number family tree',
    diagramIntro:
      'Each box inside another belongs to the larger set. Irrationals are real but not rational. Complex numbers include real numbers and numbers with a nonzero imaginary part.',
    diagramAccessible:
      'Nested sets: natural numbers lie inside integers, inside rational numbers, inside real numbers, inside complex numbers. Irrational numbers also lie inside real numbers but outside rational numbers. Non-real complex numbers lie outside real numbers.',
    nonReal: 'Outside the real numbers, but still complex:',
    diagramCaption:
      'A visual inclusion diagram, with the course convention that zero is natural. “Whole” and “purely imaginary” are descriptions, not further layers in the main inclusion chain.',
    chainReading:
      'Natural numbers are a subset of integers, which are a subset of rational, real and complex numbers.',
    chainExplanation:
      'The symbol ⊆ means “is a subset of”. This chain does not say the sets are equal.',
    workedLabel: 'WORKED EXAMPLE',
    workedExample: 'Take the number 5. It belongs to every set in the chain:',
    workedExplanation:
      'It is natural and an integer, equals the rational fraction 5/1, is real, and is complex with imaginary part zero.',
    propertiesTitle: 'Other ways to classify numbers',
    propertiesIntro:
      'These descriptions are properties, not extra steps in the family tree.',
    zeroOneNote:
      'Zero is neither positive nor negative. One is neither prime nor composite. Two is the only even prime number.',
    checksTitle: 'Check your understanding',
    checksIntro:
      'Choose an answer in your head, then reveal the worked explanation. These are guided reading checks, not graded exercises.',
    reveal: 'Reveal explanation',
    noGrade:
      'Answers here are not saved or counted toward mastery. Independent graded practice requires sign-in.',
    nextTitle: 'Connect it to your course',
    programming:
      'In Java, int, long, float and double describe machine representations. Mathematical sets describe values; floating-point types can only approximate many real numbers.',
    lessonLink: 'Read L10: number sets and inclusion',
    provenance:
      'Original bilingual prerequisite support and enrichment. Number-set inclusion follows lesson L10 (source pages 41–43); irrational and complex numbers and the Java comparison are additional explanations, not claims about the PDF.',
  },
  fr: {
    nav: 'Familles de nombres',
    breadcrumbLabel: 'Fil d’Ariane',
    kicker: 'FONDATIONS / LES ENSEMBLES DE NOMBRES',
    title: 'La famille des nombres',
    description:
      'Naturels, entiers, rationnels, réels et complexes : découvrez comment les nombres s’organisent.',
    intro:
      'Imaginez des familles emboîtées. Tout naturel est un entier relatif, mais tout entier relatif n’est pas naturel.',
    toc: 'Sur cette page',
    sectionOne: '01 / CLASSER',
    sectionTwo: '02 / RELIER',
    sectionThree: '03 / RECONNAÎTRE',
    sectionFour: '04 / RAISONNER',
    familiesTitle: 'Les principaux types de nombres',
    setsIntro:
      'Chaque ensemble décrit une catégorie de nombres. Un même nombre peut appartenir à plusieurs ensembles.',
    tableLabel: 'Types de nombres ; défilement horizontal si nécessaire',
    columnSymbol: 'Symbole',
    columnName: 'Nom',
    columnExamples: 'Exemples',
    columnMeaning: 'Signification',
    convention:
      'Convention du cours : ℕ = {0, 1, 2, …}. Certains ouvrages excluent zéro. Le terme anglais « whole numbers » désigne ici les entiers naturels, pas un ensemble supplémentaire entre ℕ et ℤ.',
    decimals:
      'Le décimal 0,75 est rationnel (3/4). Un décimal périodique comme 0,333… est lui aussi rationnel (1/3).',
    diagramTitle: 'L’arbre des familles de nombres',
    diagramIntro:
      'Chaque boîte contenue dans une autre appartient au plus grand ensemble. Les irrationnels sont réels, mais non rationnels. Les complexes incluent les réels et les nombres à partie imaginaire non nulle.',
    diagramAccessible:
      'Ensembles emboîtés : les naturels sont inclus dans les entiers relatifs, inclus dans les rationnels, inclus dans les réels, inclus dans les complexes. Les irrationnels sont aussi réels, mais hors des rationnels. Les complexes non réels sont hors des réels.',
    nonReal: 'Hors des réels, mais toujours complexes :',
    diagramCaption:
      'Schéma d’inclusion respectant la convention du cours : zéro est naturel. « Whole numbers » et « imaginaires purs » ne sont pas des étapes supplémentaires de la chaîne.',
    chainReading:
      'Les naturels sont inclus dans les entiers relatifs, puis dans les rationnels, les réels et les complexes.',
    chainExplanation:
      'Le symbole ⊆ se lit « est inclus dans ». Cette chaîne ne signifie pas que les ensembles sont égaux.',
    workedLabel: 'EXEMPLE GUIDÉ',
    workedExample:
      'Prenons le nombre 5. Il appartient à tous les ensembles de la chaîne :',
    workedExplanation:
      'Il est naturel et entier relatif ; il est égal à la fraction rationnelle 5/1, il est réel et complexe de partie imaginaire nulle.',
    propertiesTitle: 'D’autres façons de classer les nombres',
    propertiesIntro:
      'Ces adjectifs décrivent des propriétés ; ils ne forment pas de nouvelles étapes dans l’arbre.',
    zeroOneNote:
      'Zéro n’est ni positif ni négatif. Un n’est ni premier ni composé. Deux est le seul nombre premier pair.',
    checksTitle: 'Vérifiez votre compréhension',
    checksIntro:
      'Choisissez mentalement une réponse, puis dévoilez son explication. Il s’agit d’un exercice guidé de lecture, non évalué.',
    reveal: 'Voir l’explication',
    noGrade:
      'Les réponses ne sont ni enregistrées ni prises en compte dans la maîtrise. Les exercices évalués indépendants nécessitent une connexion.',
    nextTitle: 'Lien avec votre cours',
    programming:
      'En Java, int, long, float et double décrivent des représentations en mémoire. Les ensembles mathématiques décrivent des valeurs ; les nombres à virgule flottante n’approchent que certains réels.',
    lessonLink: 'Lire L10 : ensembles de nombres et inclusion',
    provenance:
      'Appui préalable et enrichissement bilingue originaux. La chaîne d’inclusion suit la leçon L10 (pages sources 41–43) ; les irrationnels, les complexes et la comparaison avec Java sont des compléments, non des affirmations sur le PDF.',
  },
} as const;
