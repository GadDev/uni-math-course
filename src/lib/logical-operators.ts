import { evaluate, type Formula } from './l04-boolean.ts';

type Example = {
  id: string;
  label: string;
  formula: Formula;
  reason: { fr: string; en: string };
};

const not = (term: Formula): Formula => ({ op: 'not', term });
const and = (left: Formula, right: Formula): Formula => ({
  op: 'and',
  left,
  right,
});
const or = (left: Formula, right: Formula): Formula => ({
  op: 'or',
  left,
  right,
});

/** Explicit formula trees; do not assume precedence between AND and OR. */
export const operatorExamples: readonly Example[] = [
  {
    id: 'and',
    label: 'A ∧ B',
    formula: and('A', 'B'),
    reason: {
      fr: 'ET vaut 1 exactement quand les deux entrées valent 1.',
      en: 'AND is 1 exactly when both inputs are 1.',
    },
  },
  {
    id: 'or',
    label: 'A ∨ B',
    formula: or('A', 'B'),
    reason: {
      fr: 'OU vaut 1 dès qu’au moins une entrée vaut 1, même les deux.',
      en: 'OR is 1 when at least one input is 1, including both.',
    },
  },
  {
    id: 'not',
    label: '¬A',
    formula: not('A'),
    reason: {
      fr: 'NON inverse A, indépendamment de B.',
      en: 'NOT flips A, independently of B.',
    },
  },
  {
    id: 'xor',
    label: 'A XOR B',
    formula: or(and('A', not('B')), and(not('A'), 'B')),
    reason: {
      fr: 'XOR vaut 1 exactement quand une seule entrée vaut 1.',
      en: 'XOR is 1 exactly when just one input is 1.',
    },
  },
  {
    id: 'top',
    label: '⊤',
    formula: true,
    reason: {
      fr: 'La constante vraie vaut toujours 1.',
      en: 'The true constant is always 1.',
    },
  },
  {
    id: 'not-first',
    label: '(¬A) ∨ B',
    formula: or(not('A'), 'B'),
    reason: {
      fr: 'Inverser A seulement, puis appliquer OU avec B.',
      en: 'Flip A alone, then apply OR with B.',
    },
  },
  {
    id: 'not-group',
    label: '¬(A ∨ B)',
    formula: not(or('A', 'B')),
    reason: {
      fr: 'Calculer OU sur A et B, puis inverser le résultat.',
      en: 'Apply OR to A and B, then flip the result.',
    },
  },
];

export function operatorValue(example: Example, A: boolean, B: boolean) {
  return Number(evaluate(example.formula, { A, B, C: false }));
}
