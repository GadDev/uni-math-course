/** Public teaching models only; no graded exercise-bank data. */
export const HALVING_MAX = 1_048_576;

export function halvingTrace(n: number): number[] {
  if (!Number.isInteger(n) || n < 1 || n > HALVING_MAX) return [];
  const values = [n];
  while (n > 1) {
    n = Math.floor(n / 2);
    values.push(n);
  }
  return values;
}

export function logBase(a: number, x: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(x) || a <= 0 || a === 1 || x <= 0)
    return null;
  const value = Math.log(x) / Math.log(a);
  // log_a(1) is zero even when a < 1; do not expose floating-point -0.
  return Number.isFinite(value) ? (value === 0 ? 0 : value) : null;
}

export const costFamilies = [
  { id: 'constant', label: '1', color: '#57457e', dash: '2 4' },
  { id: 'log', label: 'log₂(n)', color: '#006d77', dash: '8 3' },
  { id: 'sqrt', label: '√n', color: '#6b5900', dash: '3 3' },
  { id: 'linear', label: 'n', color: '#174ea6', dash: '' },
  { id: 'nlog', label: 'n log₂(n)', color: '#933567', dash: '10 3 2 3' },
  { id: 'square', label: 'n²', color: '#a34200', dash: '6 4' },
  { id: 'exp', label: '2ⁿ', color: '#bc1534', dash: '' },
  { id: 'factorial', label: 'n!', color: '#222222', dash: '12 4' },
] as const;
export type CostId = (typeof costFamilies)[number]['id'];

export function cost(id: CostId, n: number): number {
  // The comparison is intentionally bounded, including the factorial model.
  if (!Number.isInteger(n) || n < 1 || n > 64) return NaN;
  switch (id) {
    case 'constant':
      return 1;
    case 'log':
      return Math.log2(n);
    case 'sqrt':
      return Math.sqrt(n);
    case 'linear':
      return n;
    case 'nlog':
      return n * Math.log2(n);
    case 'square':
      return n * n;
    case 'exp':
      return 2 ** n;
    case 'factorial': {
      let product = 1;
      for (let i = 2; i <= n; i++) product *= i;
      return product;
    }
  }
}

export type FunctionId = 'square' | 'exp' | 'log';
export function functionValue(id: FunctionId, x: number): number {
  if (id === 'square') return x * x;
  if (id === 'exp') return 2 ** x;
  return x > 0 ? Math.log2(x) : NaN;
}
export function derivative(id: FunctionId, x: number): number {
  if (id === 'square') return 2 * x;
  if (id === 'exp') return Math.LN2 * 2 ** x;
  return x > 0 ? 1 / (x * Math.LN2) : NaN;
}
export function secantSlope(
  id: FunctionId,
  x: number,
  h: number,
): number | null {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(h) ||
    h === 0 ||
    (id === 'log' && (x <= 0 || x + h <= 0))
  )
    return null;
  // Equivalent expressions avoid subtracting nearly equal floating-point values.
  const slope =
    id === 'square'
      ? 2 * x + h
      : id === 'exp'
        ? (2 ** x * Math.expm1(h * Math.LN2)) / h
        : Math.log1p(h / x) / (h * Math.LN2);
  return Number.isFinite(slope) ? slope : null;
}

export function formatNumber(n: number, locale: 'fr' | 'en'): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    Math.abs(n) >= 1e7 || (n !== 0 && Math.abs(n) < 1e-4)
      ? { notation: 'scientific', maximumFractionDigits: 4 }
      : { maximumFractionDigits: 6 },
  );
}
