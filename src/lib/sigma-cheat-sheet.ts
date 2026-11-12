import type { Locale } from './i18n';

type Bilingual = Record<Locale, string>;

export type SigmaPart = {
  id: string;
  symbol: string;
  name: Bilingual;
  meaning: Bilingual;
};

export const sigmaParts: SigmaPart[] = [
  {
    id: 'operator',
    symbol: '\\sum',
    name: { fr: 'Opérateur de somme (sigma)', en: 'Summation operator (sigma)' },
    meaning: {
      fr: 'Additionne les termes indiqués.',
      en: 'Adds the indicated terms together.',
    },
  },
  {
    id: 'index',
    symbol: 'i',
    name: { fr: 'Indice de sommation', en: 'Index of summation' },
    meaning: {
      fr: 'Compteur qui change à chaque terme : i, j ou k, par exemple.',
      en: 'The counter that changes for each term, such as i, j or k.',
    },
  },
  {
    id: 'lower',
    symbol: 'i=m',
    name: { fr: 'Borne inférieure', en: 'Lower limit' },
    meaning: {
      fr: 'Première valeur entière de l’indice.',
      en: 'First integer value of the index.',
    },
  },
  {
    id: 'upper',
    symbol: 'n',
    name: { fr: 'Borne supérieure', en: 'Upper limit' },
    meaning: {
      fr: 'Dernière valeur entière de l’indice, incluse.',
      en: 'Last integer value of the index, included.',
    },
  },
  {
    id: 'term',
    symbol: 'a_i',
    name: { fr: 'Terme général', en: 'Summand / General term' },
    meaning: {
      fr: 'Expression calculée pour chaque valeur de l’indice.',
      en: 'Expression evaluated at each index value.',
    },
  },
];

export type SigmaPattern = {
  id: string;
  notation: string;
  reading: Bilingual;
  expansion: string;
  note?: Bilingual;
};

export const sigmaPatterns: SigmaPattern[] = [
  {
    id: 'count',
    notation: '\\sum_{i=1}^{n} i',
    reading: {
      fr: 'La somme pour i allant de 1 à n de i.',
      en: 'The sum from i equals 1 to n of i.',
    },
    expansion: '1+2+3+\\cdots+n',
  },
  {
    id: 'powers',
    notation: '\\sum_{k=0}^{4}2^k',
    reading: {
      fr: 'La somme pour k allant de 0 à 4 de 2 puissance k.',
      en: 'The sum from k equals 0 to 4 of 2 to the k.',
    },
    expansion: '2^0+2^1+2^2+2^3+2^4=31',
  },
  {
    id: 'indexed',
    notation: '\\sum_{j=1}^{m}x_j',
    reading: {
      fr: 'La somme pour j allant de 1 à m de x indice j.',
      en: 'The sum from j equals 1 to m of x sub j.',
    },
    expansion: 'x_1+x_2+\\cdots+x_m',
  },
  {
    id: 'set',
    notation: '\\sum_{i\\in S}f(i)',
    reading: {
      fr: 'La somme pour i appartenant à S de f de i.',
      en: 'The sum over all i in S of f of i.',
    },
    expansion: 'f(s_1)+f(s_2)+\\cdots+f(s_r)',
    note: {
      fr: 'Ici, S = {s₁, …, sᵣ} est un ensemble fini ; chaque élément est compté une fois.',
      en: 'Here, S = {s₁, …, sᵣ} is finite; each element is counted once.',
    },
  },
  {
    id: 'infinite',
    notation: '\\sum_{i=1}^{\\infty}a_i',
    reading: {
      fr: 'La somme pour i allant de 1 à l’infini de a indice i.',
      en: 'The sum from i equals 1 to infinity of a sub i.',
    },
    expansion: 'a_1+a_2+a_3+\\cdots',
    note: {
      fr: 'Somme infinie : elle n’a une valeur finie que si la série converge.',
      en: 'Infinite series: it has a finite value only if the series converges.',
    },
  },
];

export type SigmaRule = {
  id: string;
  formula: string;
  explanation: Bilingual;
};

export const sigmaRules: SigmaRule[] = [
  {
    id: 'count',
    formula: '\\#\\text{termes}=n-m+1',
    explanation: {
      fr: 'Pour m et n entiers avec m ≤ n, les deux bornes comptent. De 1 à 5 : 5 termes ; de 0 à 5 : 6 termes.',
      en: 'For integer limits m ≤ n, count both endpoints. From 1 to 5: 5 terms; from 0 to 5: 6 terms.',
    },
  },
  {
    id: 'constant',
    formula: '\\sum_{i=m}^{n}c=(n-m+1)c',
    explanation: {
      fr: 'Une constante c est ajoutée une fois par terme. Pour i allant de 1 à n, cela donne nc.',
      en: 'A constant c is added once per term. From i equals 1 to n, this becomes nc.',
    },
  },
  {
    id: 'factor',
    formula: '\\sum_{i=m}^{n}ca_i=c\\sum_{i=m}^{n}a_i',
    explanation: {
      fr: 'Un facteur constant ne dépendant pas de i peut sortir du symbole somme.',
      en: 'A constant factor independent of i can be moved outside the summation.',
    },
  },
  {
    id: 'split',
    formula:
      '\\sum_{i=m}^{n}(a_i+b_i)=\\sum_{i=m}^{n}a_i+\\sum_{i=m}^{n}b_i',
    explanation: {
      fr: 'On peut séparer une somme de deux expressions en deux sommes ayant les mêmes bornes.',
      en: 'A sum of two expressions can be split into two sums with the same limits.',
    },
  },
  {
    id: 'dummy',
    formula: '\\sum_{i=1}^{3}i^2=\\sum_{k=1}^{3}k^2=14',
    explanation: {
      fr: 'L’indice est une variable muette : changer son nom ne change pas le résultat (1² + 2² + 3² = 14).',
      en: 'The index is a dummy variable: renaming it does not change the result (1² + 2² + 3² = 14).',
    },
  },
];

export const sigmaCopy = {
  fr: {
    title: 'Notation sigma : lire et calculer une somme',
    intro:
      'Le symbole ∑ signifie « additionner les termes ». Une somme à bornes entières contient cinq éléments à repérer.',
    partsTitle: 'Anatomie d’une somme',
    partName: 'Partie',
    partSymbol: 'Symbole',
    partMeaning: 'Signification',
    patternTitle: 'Comment lire les notations courantes',
    notation: 'Notation',
    reading: 'Lecture',
    expanded: 'Développement',
    rulesTitle: 'Règles essentielles et raccourcis',
    exampleTitle: 'Exemple pas à pas',
    exampleLead: 'Remplacer l’indice successivement par 2, 3 puis 4 :',
    exampleExplanation:
      'Il y a 4 − 2 + 1 = 3 termes. Ne pas oublier la borne inférieure ni la borne supérieure.',
    caution:
      'Les règles de ce mémo concernent les sommes finies. Pour les sommes infinies, la convergence doit être vérifiée avant de manipuler ou réorganiser les termes.',
  },
  en: {
    title: 'Sigma notation: reading and evaluating a sum',
    intro:
      'The symbol ∑ means “add the terms together”. A sum with integer limits has five parts to identify.',
    partsTitle: 'Anatomy of a sum',
    partName: 'Part',
    partSymbol: 'Symbol',
    partMeaning: 'Meaning',
    patternTitle: 'How to read common patterns',
    notation: 'Notation',
    reading: 'Read aloud',
    expanded: 'Expanded form',
    rulesTitle: 'Essential rules and shortcuts',
    exampleTitle: 'Step-by-step example',
    exampleLead: 'Substitute 2, 3, then 4 for the index:',
    exampleExplanation:
      'There are 4 − 2 + 1 = 3 terms. Include both the lower and upper limits.',
    caution:
      'The rules on this sheet apply to finite sums. For infinite series, check convergence before manipulating or rearranging terms.',
  },
} as const satisfies Record<Locale, {
  title: string;
  intro: string;
  partsTitle: string;
  partName: string;
  partSymbol: string;
  partMeaning: string;
  patternTitle: string;
  notation: string;
  reading: string;
  expanded: string;
  rulesTitle: string;
  exampleTitle: string;
  exampleLead: string;
  exampleExplanation: string;
  caution: string;
}>;
