// Reading examples only; never import the authenticated exercise bank here.
export const polynomial = (x: number) => x ** 3 + 2 * x + 3;

export function rational(x: number) {
  const numerator = x * x - 2 * x + 2;
  const denominator = x * (x - 2);
  return {
    numerator,
    denominator,
    value: denominator === 0 ? null : numerator / denominator,
  };
}

// Shared with the authored graph geometry: x ∈ [−2.2, 2.2], y ∈ [−12, 18].
export const graphX = (x: number) => 50 + (x + 2.2) * 75;
export const graphY = (y: number) => 275 - (y + 12) * 7.5;
export const domainX = (x: number) => 50 + (x + 1) * 95;
