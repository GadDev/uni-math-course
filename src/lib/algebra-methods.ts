// Small, bounded teaching calculations, independent of graded exercise banks.
export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';
export type Rational = { numerator: number; denominator: number };

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export function rational(numerator: number, denominator: number): Rational {
  if (
    !Number.isSafeInteger(numerator) ||
    !Number.isSafeInteger(denominator) ||
    denominator === 0
  )
    throw new RangeError(
      'A rational requires safe integer terms and a nonzero denominator',
    );
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return {
    numerator: (numerator / divisor) * sign || 0,
    denominator: Math.abs(denominator / divisor),
  };
}

export function fractionCalculation(
  operation: FractionOperation,
  a: number,
  b: number,
  c: number,
  d: number,
) {
  if (
    ![a, b, c, d].every((n) => Number.isInteger(n) && Math.abs(n) <= 12) ||
    b === 0 ||
    d === 0
  )
    return { error: 'input' } as const;
  if (operation === 'divide' && c === 0)
    return { error: 'zero-divisor' } as const;
  // Normalize signs without reducing, so the learner's chosen denominators remain visible.
  const first = { numerator: b < 0 ? -a : a, denominator: Math.abs(b) };
  const second = { numerator: d < 0 ? -c : c, denominator: Math.abs(d) };
  const common =
    (first.denominator * second.denominator) /
    gcd(first.denominator, second.denominator);
  const left = first.numerator * (common / first.denominator);
  const right = second.numerator * (common / second.denominator);
  const raw =
    operation === 'add' || operation === 'subtract'
      ? {
          numerator: operation === 'add' ? left + right : left - right,
          denominator: common,
        }
      : operation === 'multiply'
        ? {
            numerator: first.numerator * second.numerator,
            denominator: first.denominator * second.denominator,
          }
        : {
            numerator: first.numerator * second.denominator,
            denominator: first.denominator * second.numerator,
          };
  const result = rational(raw.numerator, raw.denominator);
  return {
    first,
    second,
    common,
    left,
    right,
    raw,
    result,
    divisor: gcd(raw.numerator, raw.denominator),
  } as const;
}

export type MethodKind =
  'powers' | 'factor' | 'equation' | 'elimination' | 'sigma' | 'scales';
export const methodDefaults = {
  powers: [3, 2],
  factor: [0, 2],
  equation: [3, 5, 11],
  elimination: [7, 1, 0],
  sigma: [2, 4, 0, 5],
  scales: [3, 4, 1, 1],
} satisfies Record<MethodKind, number[]>;

export function signedPowers(magnitude: number, exponent: number) {
  return {
    outside: -(magnitude ** exponent) || 0,
    inside: (-magnitude) ** exponent || 0,
  };
}

export function factorValues(pattern: number, x: number) {
  return pattern === 0
    ? { expanded: 6 * x * x - 9 * x, factored: 3 * x * (2 * x - 3) }
    : pattern === 1
      ? { expanded: x * x - 9, factored: (x - 3) * (x + 3) }
      : { expanded: x * x + 6 * x + 9, factored: (x + 3) ** 2 };
}

export function linearEquation(a: number, b: number, target: number) {
  if (a === 0) return { kind: b === target ? 'all' : 'none' } as const;
  return { kind: 'unique', result: rational(target - b, a) } as const;
}

export function sumDifference(total: number, difference: number) {
  return { x: (total + difference) / 2, y: (total - difference) / 2 };
}

export function indexedSum(
  lower: number,
  upper: number,
  constant: number | null,
) {
  if (
    !Number.isInteger(lower) ||
    !Number.isInteger(upper) ||
    lower < 0 ||
    upper > 6 ||
    lower > upper
  )
    return null;
  const terms = Array.from({ length: upper - lower + 1 }, (_, j) => ({
    index: lower + j,
    value: constant === null ? 2 * (lower + j) - 1 : constant,
  }));
  return { terms, total: terms.reduce((sum, term) => sum + term.value, 0) };
}

export function physicalDistance(
  dx: number,
  dy: number,
  horizontalUnit: number,
  verticalUnit: number,
) {
  const horizontal = dx * horizontalUnit;
  const vertical = dy * verticalUnit;
  return {
    horizontal,
    vertical,
    distance: Math.hypot(horizontal, vertical),
    coordinateLength: Math.hypot(dx, dy),
  };
}
