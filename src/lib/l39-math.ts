export type Curve = 'square' | 'cubic';

export const value = (curve: Curve, x: number) =>
  curve === 'square' ? x * x : x * x * x - 3 * x;

export const derivative = (curve: Curve, x: number) =>
  curve === 'square' ? 2 * x : 3 * x * x - 3;

export const tangent = (curve: Curve, a: number, x: number) =>
  value(curve, a) + derivative(curve, a) * (x - a);

// Only the square-function lab uses this quotient. The algebraic identity
// avoids subtracting nearly equal values for small h; it does not define h=0.
export const squareSecant = (a: number, h: number): number | null =>
  h === 0 ? null : 2 * a + h;

export const clampA = (a: number) =>
  Math.max(-2, Math.min(2, Math.round(a * 20) / 20));

export const plotX = (x: number) => 45 + ((x + 3.4) / 6.8) * 430;
// Includes every selected value and derivative for -2 <= a <= 2.
export const plotY = (y: number) => 305 - ((y + 5) / 15) * 270;
