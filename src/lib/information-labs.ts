/** Public teaching examples only. Never import the authenticated exercise banks. */
export const codes = {
  c1: { x: '001', y: '01', z: '0' },
  c2: { x: '0', y: '01', z: '011' },
  d: { x: '0', y: '10', z: '11' },
} as const;
export type CodeName = keyof typeof codes;
export type Code = Record<string, string>;

export function binaryWords(n: number): string[] {
  if (!Number.isInteger(n) || n < 0 || n > 8) return [];
  return Array.from({ length: 2 ** n }, (_, i) =>
    n === 0 ? '' : i.toString(2).padStart(n, '0'),
  );
}

export function encode(message: string, code: Code) {
  if ([...message].some((symbol) => !Object.hasOwn(code, symbol))) return null;
  return [...message].map((symbol) => code[symbol]!).join('');
}

export function isPrefixFree(code: Code) {
  const words = Object.values(code);
  return words.every(
    (word, i) =>
      word.length > 0 &&
      words.every((other, j) => i === j || !other.startsWith(word)),
  );
}

/** Exhaust all parsings of this finite input; this is not a general UD test. */
export function decodings(bits: string, code: Code): string[] {
  if (!/^[01]{0,12}$/.test(bits)) return [];
  if (Object.values(code).some((word) => !/^[01]+$/.test(word))) return [];
  const memo = new Map<number, string[]>();
  const visit = (offset: number): string[] => {
    if (offset === bits.length) return [''];
    const cached = memo.get(offset);
    if (cached) return cached;
    const results: string[] = [];
    for (const [symbol, word] of Object.entries(code)) {
      if (bits.startsWith(word, offset))
        for (const suffix of visit(offset + word.length))
          results.push(symbol + suffix);
    }
    memo.set(offset, results);
    return results;
  };
  return visit(0);
}

export function distribution(counts: number[], minimum = 0) {
  if (
    !counts.length ||
    counts.some((n) => !Number.isInteger(n) || n < minimum || n > 20)
  )
    return null;
  const total = counts.reduce((sum, n) => sum + n, 0);
  return total > 0 ? counts.map((n) => n / total) : null;
}

export function averageLength(probabilities: number[], lengths: number[]) {
  return probabilities.reduce((sum, p, i) => sum + p * lengths[i]!, 0);
}

/** The zero contribution is a continuous extension, not log2(0). */
export function entropy(probabilities: number[]) {
  if (
    !probabilities.length ||
    probabilities.some((p) => !Number.isFinite(p) || p < 0 || p > 1) ||
    Math.abs(probabilities.reduce((sum, p) => sum + p, 0) - 1) > 1e-10
  )
    return null;
  return probabilities.reduce(
    (sum, p) => sum + (p === 0 ? 0 : -p * Math.log2(p)),
    0,
  );
}

export interface HuffmanNode {
  symbols: string;
  weight: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}
export interface HuffmanStep {
  forest: HuffmanNode[];
  pair?: [HuffmanNode, HuffmanNode];
}

/** Positive integer counts for the four-symbol activity; deterministic tie rule. */
export function huffman(counts: number[]) {
  if (counts.length !== 4 || !distribution(counts, 1)) return null;
  const compare = (a: HuffmanNode, b: HuffmanNode) =>
    a.weight - b.weight ||
    (a.symbols < b.symbols ? -1 : a.symbols > b.symbols ? 1 : 0);
  let forest: HuffmanNode[] = counts.map((weight, i) => ({
    symbols: 'ABCD'[i]!,
    weight,
  }));
  forest.sort(compare);
  const steps: HuffmanStep[] = [{ forest: [...forest] }];
  while (forest.length > 1) {
    const [left, right, ...rest] = forest;
    const parent: HuffmanNode = {
      symbols: [...left!.symbols, ...right!.symbols].sort().join(''),
      weight: left!.weight + right!.weight,
      left,
      right,
    };
    forest = [...rest, parent].sort(compare);
    steps.push({ forest: [...forest], pair: [left!, right!] });
  }
  const code: Code = {};
  const read = (node: HuffmanNode, path: string) => {
    if (!node.left || !node.right) code[node.symbols] = path;
    else {
      read(node.left, path + '0');
      read(node.right, path + '1');
    }
  };
  read(forest[0]!, '');
  return { steps, code, root: forest[0]! };
}
