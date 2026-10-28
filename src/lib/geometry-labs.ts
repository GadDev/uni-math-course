/** Original teaching calculations. No imports from the served exercise banks. */
export type Point = { x: number; y: number };
export type Curve =
  'line' | 'circle' | 'parabola' | 'sideways' | 'squared' | 'multiplied';
export function equationTest(curve: Curve, { x, y }: Point) {
  switch (curve) {
    case 'line':
      return { left: y, right: 2 * x + 1 };
    case 'circle':
      return { left: x * x + y * y, right: 4 };
    case 'parabola':
      return { left: y, right: x * x };
    case 'sideways':
      return { left: x, right: y * y };
    case 'squared':
      return { left: y * y, right: x * x };
    case 'multiplied':
      return { left: x * y, right: x * x };
  }
}
export function throughPoints(a: Point, b: Point) {
  if (a.x === b.x)
    return a.y === b.y
      ? { kind: 'repeated' as const }
      : { kind: 'vertical' as const, x: a.x };
  const m = (b.y - a.y) / (b.x - a.x);
  return { kind: 'affine' as const, m, p: a.y - m * a.x };
}
export function intersection(m1: number, p1: number, m2: number, p2: number) {
  if (m1 === m2)
    return {
      kind: p1 === p2 ? ('coincident' as const) : ('parallel' as const),
    };
  const x = (p2 - p1) / (m1 - m2);
  return { kind: 'unique' as const, x, y: m1 * x + p1 };
}
export function regionTest(point: Point, kind: 'closed' | 'open' | 'triangle') {
  const { x, y } = point;
  const f = x + 2 * y - 6;
  const values = kind === 'triangle' ? [x, y, 12 - 3 * x - 4 * y] : [f];
  return {
    values,
    inside:
      kind === 'triangle'
        ? values.every((v) => v >= 0)
        : kind === 'open'
          ? f < 0
          : f <= 0,
  };
}
export function toScreen(
  point: Point,
  sx: number,
  sy: number,
  u0 = 200,
  v0 = 150,
) {
  if (![sx, sy].every((s) => Number.isFinite(s) && s > 0)) return null;
  return { u: u0 + sx * point.x, v: v0 - sy * point.y };
}
export function fromScreen(
  u: number,
  v: number,
  sx: number,
  sy: number,
  u0 = 200,
  v0 = 150,
) {
  if (![sx, sy].every((s) => Number.isFinite(s) && s > 0)) return null;
  return { x: (u - u0) / sx, y: (v0 - v) / sy };
}
export type RasterStep = Point & { d: number; choice: 'E' | 'NE' | 'end' };
export function bresenham(u2: number, v2: number): RasterStep[] | null {
  // Bounded educational window; the mathematical octant also requires integers.
  if (
    !Number.isInteger(u2) ||
    !Number.isInteger(v2) ||
    u2 < 1 ||
    u2 > 12 ||
    v2 < 0 ||
    v2 > u2
  )
    return null;
  const steps: RasterStep[] = [];
  let y = 0,
    d = 2 * v2 - u2;
  for (let x = 0; x <= u2; x++) {
    const choice = x === u2 ? 'end' : d > 0 ? 'NE' : 'E';
    steps.push({ x, y, d, choice });
    if (choice === 'NE') {
      y++;
      d -= 2 * u2;
    }
    d += 2 * v2;
  }
  return steps;
}
export function sampleSegment(
  x2: number,
  y2: number,
  axis: 'x' | 'y',
): Point[] | null {
  if (![x2, y2].every((n) => Number.isInteger(n) && n >= 0 && n <= 12))
    return null;
  if (x2 === 0 && y2 === 0) return [{ x: 0, y: 0 }];
  const major = axis === 'x' ? x2 : y2,
    minor = axis === 'x' ? y2 : x2;
  if (major === 0) return null;
  return Array.from({ length: major + 1 }, (_, i) => {
    const rounded = Math.floor((minor * i) / major + 0.5);
    return axis === 'x' ? { x: i, y: rounded } : { x: rounded, y: i };
  });
}
export const observations: Point[] = [
  { x: 0, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
];
export function residualTable(
  m: number,
  p: number,
  data: Point[] = observations,
) {
  const rows = data.map(({ x, y }) => {
    const predicted = m * x + p,
      e = y - predicted;
    return { x, y, predicted, e, square: e * e };
  });
  const sum = rows.reduce((s, r) => s + r.e, 0);
  const loss = rows.reduce((s, r) => s + r.square, 0);
  return { rows, sum, loss, mse: rows.length ? loss / rows.length : null };
}
export function centredSums(data: Point[]) {
  if (!data.length) return null;
  const meanX = data.reduce((s, p) => s + p.x, 0) / data.length;
  const meanY = data.reduce((s, p) => s + p.y, 0) / data.length;
  return {
    meanX,
    meanY,
    xx: data.reduce((s, p) => s + (p.x - meanX) ** 2, 0),
    xy: data.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0),
    yy: data.reduce((s, p) => s + (p.y - meanY) ** 2, 0),
  };
}
