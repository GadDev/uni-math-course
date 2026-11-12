import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  binaryBlocks,
  canonicalPrefix,
  entropy,
  entropyBound,
  gibbs,
  kraft,
  probabilities,
  questionTree,
  weightedHuffman,
} from '../../src/lib/information-theory.ts';
import { isPrefixFree } from '../../src/lib/information-labs.ts';
import { validateBank } from '../../scripts/check-content.ts';
import type { ExerciseBank } from '../../scripts/content-types.ts';

const near = (a: number, b: number) =>
  assert.ok(Math.abs(a - b) < 1e-10, `${a} ≠ ${b}`);
const tuples = (n: number, max: number): number[][] =>
  n === 0
    ? [[]]
    : tuples(n - 1, max).flatMap((t) =>
        Array.from({ length: max }, (_, i) => [...t, i + 1]),
      );
const bank = (id: number, version = 1): ExerciseBank =>
  JSON.parse(readFileSync(`exercises/L${id}/v${version}.json`, 'utf8'));
const answer = (id: number, item: number, version = 1) => {
  const q = bank(id, version).exercises[item - 1]!;
  assert.equal(q.type, 'single-choice');
  if (q.type !== 'single-choice') throw Error('Unexpected format');
  return q.options.find((o) => o.id === q.answer)!.label.en;
};

test('bounded teaching models reject invalid domains instead of producing NaN or crashing', () => {
  for (const w of [
    [],
    [1],
    [1, 0],
    [1, -1],
    [1, Infinity],
    [1, NaN],
    Array(17).fill(1),
  ]) {
    assert.equal(probabilities(w), null);
    assert.equal(weightedHuffman(w), null);
  }
  for (const lengths of [[], [0, 1], [1.5, 2], [13, 1], [NaN, 2]])
    assert.equal(kraft(lengths), null);
  assert.equal(canonicalPrefix([1, 1, 1]), null);
  assert.equal(gibbs([1, 0], [0.5, 0.5]), null);
  assert.equal(gibbs([0.5, 0.5], [0.25, 0.25]), null);
  assert.equal(gibbs([0.5, 0.5], [1]), null);
  for (const n of [0, 4, 1.5, Infinity])
    assert.equal(binaryBlocks([2, 1], n), null);
  assert.equal(binaryBlocks([1, 1, 1], 2), null);
  assert.equal(binaryBlocks([1e6, 1e6], 3), null);
  assert.equal(weightedHuffman([1, 1], ['A', 'A']), null);
});

test('canonical construction realises every feasible small length list and preserves input order', () => {
  for (const lengths of tuples(4, 4)) {
    const sum = lengths.reduce((s, l) => s + 1 / 2 ** l, 0),
      code = canonicalPrefix(lengths);
    near(kraft(lengths)!.value, sum);
    if (sum > 1) assert.equal(code, null);
    else {
      assert.ok(code);
      assert.deepEqual(
        code.map((w) => w.length),
        lengths,
      );
      assert.ok(
        isPrefixFree(Object.fromEntries(code.map((w, i) => [String(i), w]))),
      );
    }
  }
  // Satisfying Kraft does not certify an arbitrary assignment.
  near(kraft([1, 2, 2])!.value, 1);
  const ambiguous = { A: '0', B: '01', C: '10' };
  assert.equal(ambiguous.A + ambiguous.C, ambiguous.B + ambiguous.A);
});

test('Huffman matches independent exhaustive length optimisation including ties', () => {
  const candidates = tuples(4, 3).filter(
    (ls) => ls.reduce((s, l) => s + 2 ** -l, 0) <= 1,
  );
  for (const weights of tuples(4, 3)) {
    const result = weightedHuffman(weights)!;
    const optimum = Math.min(
      ...candidates.map((ls) => ls.reduce((s, l, i) => s + l * weights[i]!, 0)),
    );
    assert.equal(result.cost, optimum);
    assert.equal(
      result.merges.reduce((s, m) => s + m.sum, 0),
      result.cost,
    );
    assert.ok(isPrefixFree(result.code));
  }
  assert.equal(weightedHuffman([5, 2, 2, 1, 1])!.cost, 23);
  near(weightedHuffman([8, 4, 2, 1, 1])!.mean, 15 / 8);
  // Alternative tied trees may have different length assignments but the same cost.
  const alternative = { A: '0', B: '100', R: '101', C: '110', D: '111' };
  assert.ok(isPrefixFree(alternative));
  assert.equal(
    [5, 2, 2, 1, 1].reduce(
      (s, w, i) => s + w * Object.values(alternative)[i]!.length,
      0,
    ),
    23,
  );
});

test('question-tree strategies preserve probabilities, prefix codes and fractional expectations', () => {
  near(questionTree([2, 1, 1], 'huffman')!.mean, 1.5);
  near(questionTree([2, 1, 1], 'balanced')!.mean, 1.75);
  near(questionTree([1, 1, 1, 1, 1, 1], 'huffman')!.mean, 8 / 3);
  near(questionTree([1, 1, 1, 1, 1, 1], 'sequential')!.mean, 10 / 3);
  for (const strategy of ['huffman', 'balanced', 'sequential'] as const)
    assert.ok(isPrefixFree(questionTree([3, 1, 2, 4], strategy)!.code));
});

test('Gibbs and the normalised entropy-bound chain hold over varied distributions', () => {
  for (const weights of tuples(3, 4))
    for (const qWeights of tuples(3, 3)) {
      const p = probabilities(weights)!,
        q = probabilities(qWeights)!;
      const g = gibbs(p, q)!;
      const direct = -p.reduce((s, x, i) => s + x * Math.log2(q[i]!), 0);
      near(g.cross, direct);
      assert.ok(g.gap > -1e-12);
      near(gibbs(p, p)!.gap, 0);
    }
  for (const weights of tuples(3, 3))
    for (const lengths of tuples(3, 3)) {
      const result = entropyBound(weights, lengths);
      if (kraft(lengths)!.value > 1) assert.equal(result, null);
      else {
        assert.ok(result);
        near(
          result.q.reduce((s, x) => s + x, 0),
          1,
        );
        near(
          result.cross,
          -result.p.reduce((s, x, i) => s + x * Math.log2(result.q[i]!), 0),
        );
        assert.ok(result.entropy <= result.cross + 1e-12);
        assert.ok(result.cross <= result.mean + 1e-12);
      }
    }
  const slack = entropyBound([1, 1], [2, 2])!;
  near(slack.entropy, 1);
  near(slack.cross, 1);
  near(slack.mean, 2);
  near(entropyBound([2, 1, 1], [1, 2, 2])!.gap, 0);
  assert.ok(entropyBound([2, 1], [1, 1])!.gap > 0);
  near(entropy([0, 1])!, 0);
  assert.equal(entropy([-0.1, 1.1]), null);
});

test('iid blocks respect units, entropy additivity and Shannon bounds for all UI inputs', () => {
  for (let a = 1; a <= 20; a++)
    for (let b = 1; b <= 20; b++)
      for (let n = 1; n <= 3; n++) {
        const model = binaryBlocks([a, b], n)!;
        assert.equal(model.blocks.length, 2 ** n);
        near(
          model.blocks.reduce((s, b) => s + b.probability, 0),
          1,
        );
        near(model.blockEntropy, n * model.entropy);
        near(model.perSymbol, model.mean / n);
        assert.ok(model.perSymbol >= model.entropy - 1e-12);
        assert.ok(model.perSymbol < model.entropy + 1 / n);
        assert.ok(isPrefixFree(model.code));
      }
  near(binaryBlocks([2, 1], 2)!.mean, 17 / 9);
  near(binaryBlocks([2, 1], 2)!.perSymbol, 17 / 18);
  near(binaryBlocks([3, 1], 2)!.perSymbol, 27 / 32);
});

test('75 new bilingual questions cover all objectives with unique alternatives and balanced answer positions', () => {
  for (let n = 50; n <= 54; n++) {
    const b = validateBank(bank(n));
    assert.equal(b.exerciseCount, 15);
    const positions = { a: 0, b: 0, c: 0 };
    for (const q of b.exercises) {
      if (q.type !== 'single-choice') throw Error('Unexpected format');
      positions[q.answer as keyof typeof positions]++;
      for (const locale of ['fr', 'en'] as const)
        assert.equal(
          new Set(q.options.map((o) => o.label[locale])).size,
          q.options.length,
        );
    }
    assert.deepEqual(positions, { a: 5, b: 5, c: 5 });
  }
  // Independent numerical answer-key audit; exact answers are kept separate from approximations.
  for (const [n, i, expected] of [
    [50, 3, '3/2'],
    [50, 6, '7/4'],
    [50, 7, '8/3'],
    [50, 8, '3'],
    [50, 9, '10/3'],
    [50, 12, '5/4'],
    [51, 1, '1'],
    [51, 11, '5/8'],
    [52, 8, '0'],
    [52, 9, '1 + (1/2)log₂(4/3)'],
    [52, 12, 'log₂ 3 − 3/2'],
    [53, 5, '0'],
    [53, 7, '(1/2,1/2)'],
    [53, 12, '5/2'],
    [54, 1, '9'],
    [54, 2, '2/9'],
    [54, 3, '17/18'],
    [54, 6, '1 + 2 = 3'],
    [54, 8, '17/9'],
    [54, 9, '2.4'],
    [54, 13, '0'],
    [54, 15, '4 + 7 + 16 = 27'],
  ] as const)
    assert.equal(answer(n, i), expected, `L${n}-E${i}`);
  for (const i of [6, 14]) assert.equal(answer(48, i, 3), 'The last');
});
