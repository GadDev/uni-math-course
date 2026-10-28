import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cost,
  costFamilies,
  derivative,
  functionValue,
  halvingTrace,
  logBase,
  secantSlope,
} from '../../src/lib/l42-math.ts';

test('halving matches an independent power-of-two count including adjacent integers', () => {
  for (const n of [
    1, 2, 3, 31, 32, 33, 63, 64, 65, 100, 1023, 1024, 1025, 1_048_576,
  ]) {
    const trace = halvingTrace(n);
    let count = 0;
    // Independent count: number of powers of two, starting at 2, at most n.
    for (let power = 2; power <= n; power *= 2) count++;
    assert.equal(trace.length - 1, count);
    assert.equal(trace.at(-1), 1);
    trace.forEach((value, k) => assert.equal(value, Math.floor(n / 2 ** k)));
    if (n > 1) assert.ok(trace.at(-2)! >= 2);
  }
  assert.deepEqual(halvingTrace(100), [100, 50, 25, 12, 6, 3, 1]);
  assert.equal(halvingTrace(63).length - 1, 5);
  assert.equal(halvingTrace(65).length - 1, 6);
  for (const bad of [0, -1, 1.5, NaN, Infinity, 1_048_577])
    assert.deepEqual(halvingTrace(bad), []);
});

test('change of base inverts powers for increasing and decreasing logarithms', () => {
  assert.equal(logBase(2, 8), 3);
  assert.equal(logBase(0.5, 8), -3);
  assert.equal(logBase(0.5, 1), 0);
  for (const a of [0.1, 0.5, 0.99, 1.01, 2, Math.E, 10]) {
    for (const exponent of [-3, -1, 0, 1, 2.5, 4]) {
      assert.ok(Math.abs(logBase(a, a ** exponent)! - exponent) < 1e-11);
    }
  }
  for (const [a, x] of [
    [1, 8],
    [0, 8],
    [-2, 8],
    [2, 0],
    [2, -1],
    [NaN, 1],
    [2, Infinity],
  ])
    assert.equal(logBase(a!, x!), null);
});

test('bounded growth models preserve anchors, zero values and finite factorials', () => {
  const expected = {
    constant: 1,
    log: 3,
    sqrt: Math.sqrt(8),
    linear: 8,
    nlog: 24,
    square: 64,
    exp: 256,
    factorial: 40320,
  };
  for (const family of costFamilies)
    assert.equal(cost(family.id, 8), expected[family.id]);
  assert.equal(cost('log', 1), 0);
  assert.equal(cost('nlog', 1), 0);
  assert.equal(cost('square', 4), cost('exp', 4));
  for (let n = 1; n <= 64; n++)
    for (const family of costFamilies)
      assert.ok(Number.isFinite(cost(family.id, n)));
  assert.ok(
    Math.abs(cost('factorial', 64) / 1.2688693218588417e89 - 1) < 1e-14,
  );
  for (const n of [0, 65, 1.5, Infinity, NaN])
    assert.ok(Number.isNaN(cost('factorial', n)));
});

test('stable secants agree with direct quotients and approach derivatives from both sides', () => {
  for (const id of ['square', 'exp', 'log'] as const) {
    for (const x of [0.5, 1, 2]) {
      for (const h of [-0.1, 0.1]) {
        const direct = (functionValue(id, x + h) - functionValue(id, x)) / h;
        assert.ok(Math.abs(secantSlope(id, x, h)! - direct) < 1e-12);
      }
      for (const h of [-1e-8, 1e-8])
        assert.ok(Math.abs(secantSlope(id, x, h)! - derivative(id, x)) < 1e-7);
      assert.equal(secantSlope(id, x, 0), null);
      // The point-slope line recovers f(x) exactly at its tangent point.
      assert.equal(
        functionValue(id, x) + derivative(id, x) * (x - x),
        functionValue(id, x),
      );
    }
  }
  assert.equal(secantSlope('log', 0.5, -0.5), null);
  assert.equal(secantSlope('log', 0.5, -1), null);
  assert.equal(secantSlope('log', 0, 1), null);
  assert.equal(secantSlope('square', 1, NaN), null);
  assert.equal(derivative('square', 0), 0);
  assert.equal(secantSlope('square', 1, -0.1), 1.9);
});
