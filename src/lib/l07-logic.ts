// Public worked examples only; never import the authenticated exercise bank.
export type Bit = 0 | 1;
export const assignments: readonly (readonly [Bit, Bit])[] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];
export const bit = (value: boolean): Bit => (value ? 1 : 0);
export const implies = (a: Bit, b: Bit): Bit => bit(!a || Boolean(b));
export const biconditional = (a: Bit, b: Bit): Bit =>
  bit(Boolean(implies(a, b) && implies(b, a)));

export const pairs = {
  converse: { p: 'A ⇒ B', q: 'B ⇒ A' },
  implication: { p: 'A ⇒ B', q: '¬A ∨ B' },
  deMorgan: { p: '¬(A ∧ B)', q: '¬A ∨ ¬B' },
  wrongMorgan: { p: '¬(A ∧ B)', q: '¬A ∧ ¬B' },
  doubleNegation: { p: 'A', q: '¬¬A' },
} as const;
export type PairId = keyof typeof pairs;
export const isPairId = (value: string): value is PairId =>
  Object.hasOwn(pairs, value);

export function compareRow(pair: PairId, a: Bit, b: Bit) {
  let p: Bit, q: Bit;
  switch (pair) {
    case 'converse':
      p = implies(a, b);
      q = implies(b, a);
      break;
    case 'implication':
      p = implies(a, b);
      q = bit(!a || Boolean(b));
      break;
    case 'deMorgan':
      p = bit(!(a && b));
      q = bit(!a || !b);
      break;
    case 'wrongMorgan':
      p = bit(!(a && b));
      q = bit(!a && !b);
      break;
    case 'doubleNegation':
      p = a;
      q = bit(!!a);
      break;
  }
  return { a, b, p, q, agreement: biconditional(p, q) };
}

// A missing row is unknown, never silently counted as agreement.
export function evidence(pair: PairId, seen: readonly number[]) {
  const indices = [...new Set(seen)].filter(
    (i) => Number.isInteger(i) && i >= 0 && i < assignments.length,
  );
  const rows = indices.map((i) => compareRow(pair, ...assignments[i]!));
  const counterexample = rows.find((row) => row.agreement === 0);
  return {
    count: indices.length,
    counterexample,
    state: counterexample
      ? ('refuted' as const)
      : indices.length === assignments.length
        ? ('proved' as const)
        : ('incomplete' as const),
  };
}
