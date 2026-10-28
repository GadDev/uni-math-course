/** Original L41 demonstrations; no exercise-bank answers or expression parser. */
export type LogCurve = 'ln' | 'negative' | 'square';

export const logLabels: Record<LogCurve, string> = {
  ln: 'f(x) = ln(x)',
  negative: 'g(x) = −ln(x)',
  square: 'k(x) = (ln(x))²',
};

export function logPoint(curve: LogCurve, x: number) {
  if (!Number.isFinite(x) || x <= 0) return null;
  const logarithm = Math.log(x);
  if (curve === 'negative') return { value: -logarithm, slope: -1 / x };
  if (curve === 'square')
    return { value: logarithm ** 2, slope: (2 * logarithm) / x };
  return { value: logarithm, slope: 1 / x };
}

export function logSecant(a: number, h: number) {
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(h) ||
    a <= 0 ||
    a + h <= 0 ||
    h === 0
  )
    return null;
  // Avoid cancellation in ln(a+h) − ln(a) when h is small.
  return Math.log1p(h / a) / h;
}

export function logTangent(curve: LogCurve, a: number, x: number) {
  const point = logPoint(curve, a);
  return point && Number.isFinite(x)
    ? point.value + point.slope * (x - a)
    : null;
}

/** Fixed window: x ∈ [−0.5, 6.2], y ∈ [−3.5, 4]. */
export const logPlotX = (x: number) => 54 + ((x + 0.5) * 510) / 6.7;
export const logPlotY = (y: number) => 32 + (4 - y) * 42;
