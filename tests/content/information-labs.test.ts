import assert from 'node:assert/strict';
import test from 'node:test';
import {
  averageLength,
  binaryWords,
  codes,
  decodings,
  distribution,
  encode,
  entropy,
  huffman,
  isPrefixFree,
} from '../../src/lib/information-labs.ts';

test('binary capacity includes epsilon and preserves leading zeros', () => {
  assert.deepEqual(binaryWords(0), ['']);
  for (let n = 1; n <= 8; n++) {
    const words = binaryWords(n);
    assert.equal(words.length, 2 ** n);
    assert.equal(new Set(words).size, 2 ** n);
    assert.ok(words.every((w) => w.length === n));
    assert.equal(words[0], '0'.repeat(n));
    assert.equal(words.at(-1), '1'.repeat(n));
  }
  for (const n of [-1, 1.5, 9, NaN]) assert.deepEqual(binaryWords(n), []);
  assert.deepEqual([...new TextEncoder().encode('Hé')], [72, 195, 169]);
});

test('substitution and exhaustive finite decoding distinguish collisions from invalid streams', () => {
  assert.equal(encode('xyzx', codes.c2), '0010110');
  assert.equal(encode('zyx', codes.c2), '011010');
  assert.equal(encode('', codes.c2), '');
  assert.equal(encode('x y', codes.d), null);
  assert.deepEqual(decodings('001', codes.c1).sort(), ['x', 'zy']);
  assert.deepEqual(decodings('01011', codes.d), ['xyz']);
  assert.deepEqual(decodings('1', codes.d), []);
  assert.deepEqual(decodings('111', codes.c2), []);
  assert.deepEqual(decodings('', codes.d), ['']);
  assert.deepEqual(decodings('2', codes.d), []);
  assert.deepEqual(decodings('0'.repeat(13), codes.d), []);
  assert.deepEqual(decodings('0', { a: '' }), []);
  assert.equal(isPrefixFree(codes.d), true);
  assert.equal(isPrefixFree(codes.c2), false);
  assert.equal(isPrefixFree({ a: '0', b: '0' }), false);
  assert.equal(isPrefixFree({ a: '' }), false);
  // All messages up to six symbols: a finite regression, not a proof of UD.
  let messages = [''];
  for (let size = 0; size <= 6; size++) {
    for (const message of messages) {
      for (const code of [codes.d, codes.c2]) {
        const bits = encode(message, code)!;
        if (bits.length <= 12)
          assert.deepEqual(decodings(bits, code), [message]);
      }
    }
    messages = messages.flatMap((message) =>
      [...'xyz'].map((s) => message + s),
    );
  }
});

test('normalisation and weighted length retain domains and units', () => {
  assert.deepEqual(distribution([6, 3, 1]), [0.6, 0.3, 0.1]);
  assert.deepEqual(distribution([0, 3, 1]), [0, 0.75, 0.25]);
  for (const counts of [
    [0, 0, 0],
    [-1, 1, 1],
    [0.5, 2, 2],
    [NaN, 1, 1],
    [21, 1, 1],
  ])
    assert.equal(distribution(counts), null);
  assert.equal(distribution([0, 3, 1], 1), null);
  const ps = distribution([2, 1, 1], 1)!;
  assert.equal(averageLength(ps, [3, 2, 1]), 9 / 4);
  assert.equal(averageLength(ps, [1, 2, 3]), 7 / 4);
  assert.equal(averageLength(ps, [1, 2, 2]), 3 / 2);
});

test('entropy separates rare-symbol surprise, weighted contribution and zero limit', () => {
  assert.equal(entropy([0, 1]), 0);
  assert.equal(entropy([1, 0]), 0);
  assert.equal(entropy([0.5, 0.5]), 1);
  assert.equal(entropy([0.5, 0.25, 0.25]), 1.5);
  assert.equal(entropy([0.5, 0.25, 0.125, 0.125]), 1.75);
  assert.ok(Math.abs(entropy([0.25, 0.75])! - 0.8112781244591328) < 1e-12);
  assert.ok(entropy([1e-12, 1 - 1e-12])! < 1e-9);
  for (let i = 0; i <= 100; i++) {
    const p = i / 100,
      h = entropy([p, 1 - p])!;
    assert.ok(h >= 0 && h <= 1);
    assert.ok(Math.abs(h - entropy([1 - p, p])!) < 1e-12);
  }
  for (const ps of [[0.5, 0.6], [-0.1, 1.1], [NaN, 1], []])
    assert.equal(entropy(ps), null);
});

/** Independently enumerate every binary partition of a four-leaf tree. */
function optimalTreeCost(weights: number[]) {
  const memo = new Map<number, number>();
  const solve = (mask: number): number => {
    if ((mask & (mask - 1)) === 0) return 0;
    if (memo.has(mask)) return memo.get(mask)!;
    let best = Infinity;
    const sum = weights.reduce((s, n, i) => s + (mask & (1 << i) ? n : 0), 0);
    for (let subset = (mask - 1) & mask; subset; subset = (subset - 1) & mask) {
      const other = mask ^ subset;
      if (other) best = Math.min(best, solve(subset) + solve(other) + sum);
    }
    memo.set(mask, best);
    return best;
  };
  return solve((1 << weights.length) - 1);
}

test('Huffman tie rule, examples and cost agree with an independent exhaustive optimum', () => {
  const example = huffman([8, 4, 2, 2])!;
  assert.deepEqual(example.code, { A: '0', B: '10', C: '110', D: '111' });
  assert.deepEqual(
    example.steps.slice(1).map((s) => s.pair!.map((n) => n.weight)),
    [
      [2, 2],
      [4, 4],
      [8, 8],
    ],
  );
  assert.equal(encode('ABCD', example.code), '010110111');
  assert.deepEqual(huffman([1, 1, 1, 1])!.code, {
    A: '00',
    B: '01',
    C: '10',
    D: '11',
  });
  const cases = [
    [8, 4, 2, 2],
    [20, 1, 1, 1],
    [20, 20, 20, 20],
  ];
  for (let a = 1; a <= 4; a++)
    for (let b = 1; b <= 4; b++)
      for (let c = 1; c <= 4; c++)
        for (let d = 1; d <= 4; d++) cases.push([a, b, c, d]);
  for (const counts of cases) {
    const result = huffman(counts)!;
    const cost = counts.reduce(
      (s, n, i) => s + n * result.code['ABCD'[i]!]!.length,
      0,
    );
    assert.equal(cost, optimalTreeCost(counts));
    assert.equal(
      cost,
      result.steps
        .slice(1)
        .reduce(
          (s, step) => s + step.pair![0].weight + step.pair![1].weight,
          0,
        ),
    );
    assert.equal(
      result.root.weight,
      counts.reduce((a, b) => a + b),
    );
    assert.equal(isPrefixFree(result.code), true);
    assert.deepEqual(decodings(encode('ABCD', result.code)!, result.code), [
      'ABCD',
    ]);
  }
  for (const counts of [
    [0, 1, 1, 1],
    [1, 2],
    [21, 1, 1, 1],
  ])
    assert.equal(huffman(counts), null);
});
