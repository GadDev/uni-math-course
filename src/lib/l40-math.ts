// Original reading activities, independent of authenticated exercise answers.
export type Curve = 'exp' | 'decay' | 'square';

export const formula: Record<Curve, string> = {
  exp: 'eˣ',
  decay: 'e⁻ˣ',
  square: 'x²',
};

export function value(curve: Curve, x: number) {
  return curve === 'square' ? x * x : Math.exp(curve === 'exp' ? x : -x);
}

export function derivative(curve: Curve, x: number) {
  if (curve === 'square') return 2 * x;
  return curve === 'exp' ? Math.exp(x) : -Math.exp(-x);
}

export function secantSlope(curve: Curve, a: number, h: number) {
  if (!Number.isFinite(a) || !Number.isFinite(h) || h === 0) return null;
  if (curve === 'square') return 2 * a + h;
  // expm1(t) evaluates exp(t) - 1 without subtracting almost equal numbers.
  return (value(curve, a) * Math.expm1(curve === 'exp' ? h : -h)) / h;
}

export function tangent(curve: Curve, a: number, x: number) {
  return value(curve, a) + derivative(curve, a) * (x - a);
}

// Fixed windows in every activity; controls ensure A and B remain visible.
export const plotX = (x: number) => 55 + ((x + 2.2) / 4.4) * 510;
export const plotY = (y: number) => 365 - ((y + 5) / 14) * 330;
