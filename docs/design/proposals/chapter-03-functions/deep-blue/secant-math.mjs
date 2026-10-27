export function f(x) { return x * x / 2; }
export function derivative(x) { return x; }
// Undefined for h=0. Never substitute the derivative as the quotient's value.
export function secantSlope(x0, h) {
  if (!Number.isFinite(x0) || !Number.isFinite(h) || h === 0) return null;
  return (f(x0 + h) - f(x0)) / h;
}
