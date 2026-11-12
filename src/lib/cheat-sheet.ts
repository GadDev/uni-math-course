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

export type TruthRow = {
  p: boolean;
  q: boolean;
  and: boolean;
  or: boolean;
  implies: boolean;
  iff: boolean;
};

export const truthTableRows: TruthRow[] = [
  { p: true, q: true, and: true, or: true, implies: true, iff: true },
  { p: true, q: false, and: false, or: true, implies: false, iff: false },
  { p: false, q: true, and: false, or: true, implies: true, iff: false },
  { p: false, q: false, and: false, or: false, implies: true, iff: true },
];

export type MappingProperty = {
  id: 'injective' | 'surjective' | 'bijective';
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  formula: string;
  arrows: Record<Locale, string>;
  diagram: {
    source: string[];
    target: string[];
    pairs: [number, number][];
  };
};

export const mappingProperties: MappingProperty[] = [
  {
    id: 'injective',
    title: { fr: 'Injective', en: 'Injective / One-to-one' },
    description: {
      fr: 'Deux éléments distincts de A ne peuvent pas avoir la même image dans B.',
      en: 'Two different elements of A cannot have the same image in B.',
    },
    formula: '\\forall x_1,x_2\\in A,\\; f(x_1)=f(x_2)\\Rightarrow x_1=x_2',
    arrows: {
      fr: 'Chaque élément de B reçoit au plus une flèche (zéro ou une).',
      en: 'Each element of B receives at most one arrow (zero or one).',
    },
    diagram: {
      source: ['1', '2'],
      target: ['a', 'b', 'c'],
      pairs: [
        [0, 0],
        [1, 1],
      ],
    },
  },
  {
    id: 'surjective',
    title: { fr: 'Surjective', en: 'Surjective / Onto' },
    description: {
      fr: 'Tout élément de B est atteint par au moins un élément de A.',
      en: 'Every element of B is reached by at least one element of A.',
    },
    formula: '\\forall y\\in B,\\;\\exists x\\in A : f(x)=y',
    arrows: {
      fr: 'Chaque élément de B reçoit au moins une flèche (une ou plus).',
      en: 'Each element of B receives at least one arrow (one or more).',
    },
    diagram: {
      source: ['1', '2', '3'],
      target: ['a', 'b'],
      pairs: [
        [0, 0],
        [1, 1],
        [2, 1],
      ],
    },
  },
  {
    id: 'bijective',
    title: { fr: 'Bijective', en: 'Bijective' },
    description: {
      fr: 'L’application est à la fois injective et surjective.',
      en: 'The mapping is both injective and surjective.',
    },
    formula: '\\forall y\\in B,\\;\\exists!x\\in A : f(x)=y',
    arrows: {
      fr: 'Chaque élément de B reçoit exactement une flèche.',
      en: 'Every element of B receives exactly one arrow.',
    },
    diagram: {
      source: ['1', '2', '3'],
      target: ['a', 'b', 'c'],
      pairs: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    },
  },
];

export const cheatSheetCopy = {
  fr: {
    nav: 'Fiche mémo',
    title: 'Fiche mémo : notations et méthodes',
    kicker: 'À GARDER SOUS LA MAIN',
    intro:
      'Logique, ensembles, notation sigma, droites, pixels et régression : formules et méthodes en français et en anglais.',
    contents: 'Accès rapide',
    symbol: 'Symbole',
    english: 'Anglais',
    french: 'Français',
    meaning: 'Signification simple',
    alternatives: 'ou',
    print: 'Imprimer cette fiche',
    truthTitle: 'Tables de vérité et implications logiques',
    truthIntro:
      'Chaque proposition P ou Q est vraie (V) ou fausse (F). Les connecteurs combinent ces propositions.',
    truthTableLabel: 'Table de vérité des connecteurs',
    trueLabel: 'V',
    falseLabel: 'F',
    implicationOnlyFalse: 'Seul cas faux pour l’implication',
    falseImpliesAnything: 'Le faux implique tout',
    truthTakeawayTitle: 'Ce qu’il faut retenir par cœur',
    implicationTitle: 'L’implication (P ⇒ Q)',
    implicationTakeaway:
      '« Si P, alors Q » (If P, then Q). Elle est fausse uniquement quand P est vrai et Q est faux. Si P est faux, P ⇒ Q est vrai par définition, quelle que soit la valeur de Q.',
    biconditionalTitle: 'La biconditionnelle (P ⇔ Q)',
    biconditionalTakeaway:
      '« P si et seulement si Q » (P if and only if Q). Elle est vraie quand P et Q ont la même valeur de vérité : V/V ou F/F.',
    equivalenceNote:
      'Attention : le connecteur P ⇔ Q est une proposition. Deux formules sont logiquement équivalentes si leur biconditionnelle est vraie pour toutes les valeurs possibles.',
    mappingTitle: 'Fonctions et applications',
    mappingIntro:
      'Une application f : A → B associe à chaque x de A exactement un élément f(x) de B. A est l’ensemble de départ et B l’ensemble d’arrivée.',
    mappingDiagramLabel: 'Schéma de flèches de A vers B',
    mappingDefinition: 'Définition intuitive',
    mappingFormula: 'Formule mathématique',
    mappingArrows: 'Image mentale',
    mappingProperty: 'Propriété',
    mappingSource: 'Départ A',
    mappingTarget: 'Arrivée B',
    mappingReminder:
      'On compte les flèches qui arrivent dans B : au plus une (injective), au moins une (surjective), exactement une (bijective). Une application doit toujours donner exactement une image à chaque élément de A.',
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
    title: 'Math cheat sheet: symbols and methods',
    kicker: 'KEEP THIS HANDY',
    intro:
      'Logic, sets, Sigma notation, straight lines, pixels and regression: a bilingual reference for methods and formulas.',
    contents: 'Jump to a section',
    symbol: 'Symbol',
    english: 'English',
    french: 'French',
    meaning: 'Simple meaning',
    alternatives: 'or',
    print: 'Print this sheet',
    truthTitle: 'Truth tables and logical implications',
    truthIntro:
      'Every statement P or Q is true (T) or false (F). Logical connectives combine these statements.',
    truthTableLabel: 'Truth table for logical connectives',
    trueLabel: 'T',
    falseLabel: 'F',
    implicationOnlyFalse: 'The only false implication',
    falseImpliesAnything: 'False implies anything',
    truthTakeawayTitle: 'What to remember',
    implicationTitle: 'Implication (P ⇒ Q)',
    implicationTakeaway:
      '“If P, then Q” (Si P, alors Q). This is false only if P is true and Q is false. When P is false, P ⇒ Q is true by definition, regardless of Q.',
    biconditionalTitle: 'Biconditional (P ⇔ Q)',
    biconditionalTakeaway:
      '“P if and only if Q” (P si et seulement si Q). This is true when P and Q have the same truth value: T/T or F/F.',
    equivalenceNote:
      'Note: P ⇔ Q is a compound statement. Two formulas are logically equivalent when their biconditional is true for every possible valuation.',
    mappingTitle: 'Functions and mappings',
    mappingIntro:
      'A mapping f : A → B assigns each x in A exactly one element f(x) in B. A is the domain and B is the codomain.',
    mappingDiagramLabel: 'Arrow diagram from A to B',
    mappingDefinition: 'Intuitive definition',
    mappingFormula: 'Mathematical formula',
    mappingArrows: 'Arrow intuition',
    mappingProperty: 'Property',
    mappingSource: 'Domain A',
    mappingTarget: 'Codomain B',
    mappingReminder:
      'Count incoming arrows in B: at most one (injective), at least one (surjective), exactly one (bijective). Every element of A must always have exactly one image.',
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
} as const satisfies Record<
  Locale,
  {
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
    truthTitle: string;
    truthIntro: string;
    truthTableLabel: string;
    trueLabel: string;
    falseLabel: string;
    implicationOnlyFalse: string;
    falseImpliesAnything: string;
    truthTakeawayTitle: string;
    implicationTitle: string;
    implicationTakeaway: string;
    biconditionalTitle: string;
    biconditionalTakeaway: string;
    equivalenceNote: string;
    mappingTitle: string;
    mappingIntro: string;
    mappingDiagramLabel: string;
    mappingDefinition: string;
    mappingFormula: string;
    mappingArrows: string;
    mappingProperty: string;
    mappingSource: string;
    mappingTarget: string;
    mappingReminder: string;
    tipsTitle: string;
    tips: readonly string[];
    footnote: string;
    glossary: string;
    home: string;
  }
>;
