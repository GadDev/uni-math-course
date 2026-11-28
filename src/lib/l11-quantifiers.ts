export const universe = [0, 1, 2, 3, 4, 5, 6] as const;
export type PredicateId = 'even' | 'greater' | 'square';

export const predicates = {
  even: ['x est pair', 'x is even'],
  greater: ['x > 2', 'x > 2'],
  square: ['x² = 4', 'x² = 4'],
} as const;

export function evaluatePredicate(id: PredicateId, x: number): boolean {
  switch (id) {
    case 'even':
      return x % 2 === 0;
    case 'greater':
      return x > 2;
    case 'square':
      return x * x === 4;
  }
}

export function evaluateDomain(id: PredicateId, domain: readonly number[]) {
  const witnesses = domain.filter((x) => evaluatePredicate(id, x));
  const counterexamples = domain.filter((x) => !evaluatePredicate(id, x));
  return {
    universal: counterexamples.length === 0,
    existential: witnesses.length > 0,
    witnesses,
    counterexamples,
  };
}

export function checkEvidence(
  id: PredicateId,
  domain: readonly number[],
  kind: 'witness' | 'counterexample',
  candidate: number | null,
): boolean {
  if (candidate === null) {
    const result = evaluateDomain(id, domain);
    return kind === 'witness'
      ? result.witnesses.length === 0
      : result.counterexamples.length === 0;
  }
  return (
    domain.includes(candidate) &&
    evaluatePredicate(id, candidate) === (kind === 'witness')
  );
}
