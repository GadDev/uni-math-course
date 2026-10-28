// Public teaching examples only; no graded exercise-bank answers.
export type AlgebraKind =
  | 'precedence'
  | 'area'
  | 'domain'
  | 'inequality'
  | 'system'
  | 'mean'
  | 'distance';

export const initialAlgebraState = {
  precedence: [2, 3, 4, 0],
  area: [2, 3],
  domain: [2],
  inequality: [-2, 4, 0, 0],
  system: [-1, 3],
  mean: [3, 2, 5, 8, 5],
  distance: [0, 0, 3, 4],
} satisfies Record<AlgebraKind, number[]>;

export function realInput(raw: string, min: number, max: number) {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

export function domainValues(x: number) {
  return {
    quotient: x === 3 ? null : x + 3,
    root: x < 0 ? null : Math.sqrt(x),
    rootSquare: Math.abs(x),
    reciprocal: x === 0 ? null : 1 / x,
  };
}

export function inequality(a: number, c: number, inclusive: boolean) {
  if (a === 0)
    return { kind: (inclusive ? c >= 0 : c > 0) ? 'all' : 'none' } as const;
  return {
    kind: a < 0 ? 'left' : 'right',
    boundary: -c / a,
    inclusive,
  } as const;
}

// Intersection of y = x + 1 and y = m x + b.
export function lineSystem(m: number, b: number) {
  if (m === 1) return { kind: b === 1 ? 'same' : 'parallel' } as const;
  const x = (b - 1) / (1 - m);
  return { kind: 'unique', x, y: x + 1 } as const;
}

export function meanData(values: number[]) {
  if (!values.length || !values.every(Number.isFinite)) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  const mean = total / values.length;
  return { total, mean, deviations: values.map((value) => value - mean) };
}

export function pointGeometry(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  return {
    dx,
    dy,
    distance: Math.hypot(dx, dy),
    mx: (ax + bx) / 2,
    my: (ay + by) / 2,
  };
}
