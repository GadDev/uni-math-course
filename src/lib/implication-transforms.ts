import { assignments, bit, implies, type Bit } from './l07-logic.ts';

export const transforms = {
  converse: {
    label: 'B ⇒ A',
    name: { fr: 'Réciproque', en: 'Converse' },
    reason: { fr: 'Échanger A et B.', en: 'Swap A and B.' },
  },
  contrapositive: {
    label: '¬B ⇒ ¬A',
    name: { fr: 'Contraposée', en: 'Contrapositive' },
    reason: { fr: 'Échanger et nier les deux.', en: 'Swap and negate both.' },
  },
  inverse: {
    label: '¬A ⇒ ¬B',
    name: { fr: 'Inverse', en: 'Inverse' },
    reason: { fr: 'Nier sans échanger.', en: 'Negate without swapping.' },
  },
  negation: {
    label: 'A ∧ ¬B',
    name: { fr: 'Négation', en: 'Negation' },
    reason: {
      fr: 'Décrire le seul échec de la règle.',
      en: 'Describe the only failure of the rule.',
    },
  },
} as const;

export type Transform = keyof typeof transforms;
export const transformIds = Object.keys(transforms) as Transform[];

export function transformRow(id: Transform, a: Bit, b: Bit) {
  const original = implies(a, b);
  const notA = bit(!a);
  const notB = bit(!b);
  const value =
    id === 'converse'
      ? implies(b, a)
      : id === 'contrapositive'
        ? implies(notB, notA)
        : id === 'inverse'
          ? implies(notA, notB)
          : bit(!original);
  return { a, b, original, value };
}

export function transformEvidence(id: Transform, seen: readonly number[]) {
  const indices = [...new Set(seen)].filter(
    (i) => Number.isInteger(i) && i >= 0 && i < assignments.length,
  );
  const rows = indices.map((i) => transformRow(id, ...assignments[i]!));
  const counterexample = rows.find((row) => row.original !== row.value);
  return {
    count: indices.length,
    counterexample,
    state: counterexample
      ? 'refuted'
      : indices.length === assignments.length
        ? 'proved'
        : 'pending',
  } as const;
}
