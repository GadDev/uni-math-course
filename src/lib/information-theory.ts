/** Public teaching calculations only; no authenticated exercise answers. */
import { entropy, isPrefixFree } from './information-labs.ts';
export { entropy };
export type TheoryNode = {
  weight: number;
  labels: string[];
  symbol?: string;
  left?: TheoryNode;
  right?: TheoryNode;
};
const validWeights = (weights: number[]) =>
  weights.length >= 2 &&
  weights.length <= 16 &&
  weights.every((w) => Number.isFinite(w) && w > 0 && w <= 1_000_000);
export function probabilities(weights: number[]) {
  if (!validWeights(weights)) return null;
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / total);
}
export function readTree(root: TheoryNode) {
  const code: Record<string, string> = {};
  const visit = (node: TheoryNode, bits: string) => {
    if (node.symbol !== undefined) code[node.symbol] = bits;
    else {
      visit(node.left!, bits + '0');
      visit(node.right!, bits + '1');
    }
  };
  visit(root, '');
  return code;
}
export function weightedHuffman(
  weights: number[],
  labels = weights.map((_, i) => String.fromCharCode(65 + i)),
) {
  if (
    !validWeights(weights) ||
    labels.length !== weights.length ||
    new Set(labels).size !== labels.length ||
    labels.some((s) => !s || s.length > 12)
  )
    return null;
  const compare = (a: TheoryNode, b: TheoryNode) =>
    a.weight - b.weight ||
    a.labels.join('\0').localeCompare(b.labels.join('\0'), 'en');
  let forest: TheoryNode[] = weights
    .map((weight, i) => ({ weight, labels: [labels[i]!], symbol: labels[i]! }))
    .sort(compare);
  const merges: { a: number; b: number; sum: number }[] = [];
  while (forest.length > 1) {
    const [left, right, ...rest] = forest;
    const node: TheoryNode = {
      weight: left!.weight + right!.weight,
      labels: [...left!.labels, ...right!.labels].sort(),
      left: left!,
      right: right!,
    };
    merges.push({ a: left!.weight, b: right!.weight, sum: node.weight });
    forest = [...rest, node].sort(compare);
  }
  const root = forest[0]!,
    code = readTree(root);
  const cost = weights.reduce((s, w, i) => s + w * code[labels[i]!]!.length, 0);
  return {
    root,
    code,
    merges,
    cost,
    mean: cost / weights.reduce((a, b) => a + b, 0),
  };
}
export function questionTree(
  weights: number[],
  strategy: 'balanced' | 'sequential' | 'huffman',
) {
  if (!validWeights(weights)) return null;
  if (strategy === 'huffman') return weightedHuffman(weights);
  const make = (indices: number[]): TheoryNode => {
    if (indices.length === 1) {
      const i = indices[0]!;
      return {
        weight: weights[i]!,
        labels: [String.fromCharCode(65 + i)],
        symbol: String.fromCharCode(65 + i),
      };
    }
    const cut = strategy === 'sequential' ? 1 : Math.ceil(indices.length / 2);
    const left = make(indices.slice(0, cut)),
      right = make(indices.slice(cut));
    return {
      weight: left.weight + right.weight,
      labels: [...left.labels, ...right.labels],
      left,
      right,
    };
  };
  const root = make(weights.map((_, i) => i)),
    code = readTree(root);
  const cost = weights.reduce(
    (s, w, i) => s + w * code[String.fromCharCode(65 + i)]!.length,
    0,
  );
  return { root, code, cost, mean: cost / weights.reduce((a, b) => a + b, 0) };
}
export function kraft(lengths: number[]) {
  if (
    !lengths.length ||
    lengths.length > 16 ||
    lengths.some((l) => !Number.isInteger(l) || l < 1 || l > 12)
  )
    return null;
  const denominator = 2 ** Math.max(...lengths);
  const numerator = lengths.reduce(
    (s, l) => s + 2 ** (Math.max(...lengths) - l),
    0,
  );
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = gcd(numerator, denominator);
  return {
    value: numerator / denominator,
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}
/** Construct a prefix code for feasible lengths, not a test of an existing assignment. */
export function canonicalPrefix(lengths: number[]) {
  const k = kraft(lengths);
  if (!k || k.value > 1) return null;
  const ordered = lengths
    .map((length, index) => ({ length, index }))
    .sort((a, b) => a.length - b.length || a.index - b.index);
  let number = 0,
    previous = ordered[0]!.length;
  const words: string[] = Array(lengths.length);
  for (const { length, index } of ordered) {
    number *= 2 ** (length - previous);
    if (number >= 2 ** length) return null;
    words[index] = number.toString(2).padStart(length, '0');
    number++;
    previous = length;
  }
  return words;
}
export function gibbs(p: number[], q: number[]) {
  const h = entropy(p);
  if (
    h === null ||
    entropy(q) === null ||
    p.length !== q.length ||
    p.some((x) => x <= 0) ||
    q.some((x) => x <= 0)
  )
    return null;
  const cross = -p.reduce((s, x, i) => s + x * Math.log2(q[i]!), 0);
  return { entropy: h, cross, gap: cross - h };
}
export function entropyBound(weights: number[], lengths: number[]) {
  const p = probabilities(weights),
    k = kraft(lengths),
    code = canonicalPrefix(lengths);
  if (!p || !k || !code || p.length !== lengths.length) return null;
  const q = lengths.map((l) => 2 ** -l / k.value);
  const h = entropy(p)!,
    mean = p.reduce((s, x, i) => s + x * lengths[i]!, 0);
  return {
    p,
    q,
    k: k.value,
    code,
    entropy: h,
    mean,
    cross: mean + Math.log2(k.value),
    gap: mean - h,
  };
}
/** At most 2^3 blocks; product weights implement an explicitly iid binary model. */
export function binaryBlocks(weights: number[], n: number) {
  if (
    weights.length !== 2 ||
    !probabilities(weights) ||
    !Number.isInteger(n) ||
    n < 1 ||
    n > 3
  )
    return null;
  let blocks: { symbol: string; weight: number }[] = [
    { symbol: '', weight: 1 },
  ];
  for (let j = 0; j < n; j++)
    blocks = blocks.flatMap((b) =>
      weights.map((w, i) => ({
        symbol: b.symbol + ['a', 'b'][i],
        weight: b.weight * w,
      })),
    );
  const result = weightedHuffman(
    blocks.map((b) => b.weight),
    blocks.map((b) => b.symbol),
  );
  if (!result) return null;
  const p = probabilities(weights)!,
    h = entropy(p)!;
  const total = blocks.reduce((s, b) => s + b.weight, 0);
  return {
    ...result,
    blocks: blocks.map((b) => ({ ...b, probability: b.weight / total })),
    entropy: h,
    blockEntropy: entropy(blocks.map((b) => b.weight / total))!,
    perSymbol: result.mean / n,
    upper: h + 1 / n,
  };
}
export const validCode = isPrefixFree;
