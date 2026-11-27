// Bounded public demonstrations; these helpers never import graded banks.
export const even = (x: number) => x % 2 === 0;
export function predicateSummary(domain: readonly number[]) {
  const witnesses = domain.filter(even);
  const counterexamples = domain.filter((x) => !even(x));
  return {
    witnesses,
    counterexamples,
    all: counterexamples.length === 0,
    some: witnesses.length > 0,
  };
}
export function powerSet<T>(values: readonly T[]): T[][] {
  return values.reduce<T[][]>(
    (sets, value) => [...sets, ...sets.map((set) => [...set, value])],
    [[]],
  );
}
export type SetOperation =
  'union' | 'intersection' | 'outside-union' | 'outside-intersection';
export function setResult(
  ambient: readonly number[],
  a: readonly number[],
  b: readonly number[],
  operation: SetOperation,
) {
  return ambient.filter((x) => {
    const inA = a.includes(x),
      inB = b.includes(x);
    if (operation === 'union') return inA || inB;
    if (operation === 'intersection') return inA && inB;
    if (operation === 'outside-union') return !(inA || inB);
    return !(inA && inB);
  });
}
