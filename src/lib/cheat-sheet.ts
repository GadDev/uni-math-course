import type { Locale } from './i18n';

export type CheatSheetSymbol = {
  notation: string;
  alternative?: string;
  english: string;
  french: string;
  meaning: Record<Locale, string>;
};

export const symbolGroups: {
  id: string;
  title: Record<Locale, string>;
  rows: CheatSheetSymbol[];
}[] = [
  {
    id: 'logic',
    title: { fr: 'Symboles de logique', en: 'Logic symbols' },
    rows: [
      {
        notation: '∀',
        english: 'For all / For every',
        french: 'Pour tout / Quel que soit',
        meaning: {
          fr: 'La propriété est vraie pour chaque élément du domaine.',
          en: 'The property holds for every element in the domain.',
        },
      },
      {
        notation: '∃',
        english: 'There exists',
        french: 'Il existe (au moins un)',
        meaning: {
          fr: 'Au moins un élément du domaine vérifie la propriété.',
          en: 'At least one element in the domain has the property.',
        },
      },
      {
        notation: '∃!',
        english: 'There exists a unique',
        french: 'Il existe un unique',
        meaning: {
          fr: 'Un seul et unique élément vérifie la propriété.',
          en: 'Exactly one element has the property.',
        },
      },
      {
        notation: '¬',
        alternative: '~',
        english: 'Not',
        french: 'Non / Négation',
        meaning: {
          fr: 'Inverse la valeur de vérité : vrai devient faux, et inversement.',
          en: 'Reverses the truth value: true becomes false and vice versa.',
        },
      },
      {
        notation: '∧',
        english: 'And',
        french: 'Et / Conjonction',
        meaning: {
          fr: 'Vrai uniquement lorsque les deux propositions sont vraies.',
          en: 'True only when both statements are true.',
        },
      },
      {
        notation: '∨',
        english: 'Or',
        french: 'Ou / Disjonction',
        meaning: {
          fr: 'Vrai si au moins une proposition est vraie (ou inclusif).',
          en: 'True when at least one statement is true (inclusive or).',
        },
      },
      {
        notation: '⇒',
        english: 'Implies / If… then',
        french: 'Implique / Si… alors',
        meaning: {
          fr: '« Si P, alors Q » : faux seulement si P est vrai et Q est faux.',
          en: '“If P, then Q”: false only when P is true and Q is false.',
        },
      },
      {
        notation: '⇔',
        english: 'If and only if (iff)',
        french: 'Si et seulement si (ssi)',
        meaning: {
          fr: 'Les deux propositions ont la même valeur de vérité.',
          en: 'Both statements have the same truth value.',
        },
      },
    ],
  },
  {
    id: 'sets',
    title: { fr: 'Symboles des ensembles', en: 'Set theory symbols' },
    rows: [
      {
        notation: '∈',
        english: 'Is an element of / Belongs to',
        french: 'Appartient à',
        meaning: {
          fr: 'L’objet fait partie de l’ensemble.',
          en: 'The object is a member of the set.',
        },
      },
      {
        notation: '∉',
        english: 'Is not an element of',
        french: 'N’appartient pas à',
        meaning: {
          fr: 'L’objet ne fait pas partie de l’ensemble.',
          en: 'The object is not a member of the set.',
        },
      },
      {
        notation: '∅',
        alternative: '{}',
        english: 'Empty set',
        french: 'Ensemble vide',
        meaning: {
          fr: 'L’ensemble qui ne contient aucun élément.',
          en: 'The set containing no elements.',
        },
      },
      {
        notation: '⊆',
        english: 'Is a subset of',
        french: 'Est inclus dans',
        meaning: {
          fr: 'Chaque élément du premier ensemble est dans le second ; l’égalité est possible.',
          en: 'Every element of the first set is in the second; equality is allowed.',
        },
      },
      {
        notation: '⊈',
        english: 'Is not a subset of',
        french: 'N’est pas inclus dans',
        meaning: {
          fr: 'Au moins un élément du premier ensemble manque dans le second.',
          en: 'At least one element of the first set is missing from the second.',
        },
      },
      {
        notation: '∪',
        english: 'Union',
        french: 'Union',
        meaning: {
          fr: 'Les éléments présents dans l’un ou l’autre ensemble, ou les deux.',
          en: 'Elements in either set or in both.',
        },
      },
      {
        notation: '∩',
        english: 'Intersection',
        french: 'Intersection',
        meaning: {
          fr: 'Uniquement les éléments communs aux deux ensembles.',
          en: 'Only the elements shared by both sets.',
        },
      },
      {
        notation: 'A ∖ B',
        english: 'Set difference / Minus',
        french: 'Différence / Privé de',
        meaning: {
          fr: 'Les éléments de A qui ne sont pas dans B.',
          en: 'Elements in A that are not in B.',
        },
      },
      {
        notation: '𝒫(A)',
        english: 'Power set of A',
        french: 'Ensemble des parties de A',
        meaning: {
          fr: 'L’ensemble de tous les sous-ensembles de A, y compris ∅ et A.',
          en: 'The set of every subset of A, including ∅ and A.',
        },
      },
      {
        notation: '|A|',
        alternative: 'Card(A)',
        english: 'Cardinality of A',
        french: 'Cardinal de A',
        meaning: {
          fr: 'Le nombre d’éléments distincts de A (si A est fini).',
          en: 'The number of distinct elements in A (when A is finite).',
        },
      },
      {
        notation: 'A × B',
        english: 'Cartesian product',
        french: 'Produit cartésien',
        meaning: {
          fr: 'L’ensemble des couples ordonnés (a, b) avec a ∈ A et b ∈ B.',
          en: 'All ordered pairs (a, b) where a ∈ A and b ∈ B.',
        },
      },
    ],
  },
];

export const cheatSheetCopy = {
  fr: {
    nav: 'Fiche mémo',
    title: 'Fiche mémo : logique et ensembles',
    kicker: 'À GARDER SOUS LA MAIN',
    intro:
      'Les 19 symboles essentiels du chapitre « Logique et ensembles » : leur nom en français, en anglais, et leur sens en une phrase.',
    contents: 'Accès rapide',
    symbol: 'Symbole',
    english: 'Anglais',
    french: 'Français',
    meaning: 'Signification simple',
    alternatives: 'ou',
    print: 'Imprimer cette fiche',
    tipsTitle: 'Trois pièges à éviter',
    tips: [
      '« Ou » (∨) est inclusif : les deux propositions peuvent être vraies en même temps.',
      'A ⊆ B autorise A = B. Pour dire qu’un ensemble est strictement inclus dans un autre, il faut le préciser.',
      'P ⇒ Q n’affirme pas que P est vrai : l’implication échoue seulement lorsque P est vrai et Q est faux.',
    ],
    footnote:
      'Cette fiche est un aide-mémoire : pour les démonstrations et les exemples détaillés, consultez le glossaire et les leçons.',
    glossary: 'Voir le glossaire complet',
    home: 'Retour au cours',
  },
  en: {
    nav: 'Cheat sheet',
    title: 'Logic and sets cheat sheet',
    kicker: 'KEEP THIS HANDY',
    intro:
      'The 19 essential symbols from the Logic and Sets chapter: their names in French and English, plus a one-sentence explanation.',
    contents: 'Jump to a section',
    symbol: 'Symbol',
    english: 'English',
    french: 'French',
    meaning: 'Simple meaning',
    alternatives: 'or',
    print: 'Print this sheet',
    tipsTitle: 'Three common traps',
    tips: [
      '“Or” (∨) is inclusive: both statements can be true at the same time.',
      'A ⊆ B allows A = B. State explicitly when you mean a proper subset.',
      'P ⇒ Q does not claim that P is true: it fails only when P is true and Q is false.',
    ],
    footnote:
      'This is a quick reference, not a proof guide. For full examples and reasoning, see the glossary and lessons.',
    glossary: 'Explore the full glossary',
    home: 'Back to the course',
  },
} as const satisfies Record<Locale, {
  nav: string;
  title: string;
  kicker: string;
  intro: string;
  contents: string;
  symbol: string;
  english: string;
  french: string;
  meaning: string;
  alternatives: string;
  print: string;
  tipsTitle: string;
  tips: readonly string[];
  footnote: string;
  glossary: string;
  home: string;
}>;
