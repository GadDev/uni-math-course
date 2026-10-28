/** Real quadratic family; difference quotients retain their punctured domain. */
export type Quadratic = { a: number; b: number; c: number };

export function quadratic({ a, b, c }: Quadratic, x: number) {
  return (a * x + b) * x + c;
}

export function derivative({ a, b }: Quadratic, x: number) {
  return 2 * a * x + b;
}

export function tangent(model: Quadratic, x0: number) {
  const y0 = quadratic(model, x0);
  const slope = derivative(model, x0);
  return { y0, slope, intercept: y0 - slope * x0 };
}

export function secantSlope(model: Quadratic, x0: number, h: number) {
  // Algebraic evaluation avoids subtracting nearly equal floating-point values.
  return h === 0 ? null : derivative(model, x0) + model.a * h;
}

export function vertexX({ a, b }: Quadratic) {
  return a === 0 ? null : -b / (2 * a);
}

/** A symmetric labelled viewport; clipped lines continue beyond the drawing. */
export function plotLimit(values: number[]) {
  const extent = Math.max(2, ...values.map(Math.abs)) * 1.15;
  const unit = 10 ** Math.floor(Math.log10(extent / 3));
  const step = [1, 2, 5, 10].find((n) => n * unit >= extent / 3)! * unit;
  return step * 3;
}
