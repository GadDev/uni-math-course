import assert from 'node:assert/strict';
import test from 'node:test';
import {
  derivative,
  quadratic,
  secantSlope,
  tangent,
  vertexX,
  plotLimit,
} from '../../src/lib/l38-math.ts';

test('L38 original secant values and punctured domain', () => {
  const model = { a: 0.5, b: 0, c: 0 };
  for (const [h, slope] of [
    [2, 2],
    [1, 1.5],
    [0.5, 1.25],
    [0.25, 1.125],
    [0.1, 1.05],
    [-0.2, 0.9],
    [-0.1, 0.95],
  ])
    assert.ok(Math.abs(secantSlope(model, 1, h!)! - slope!) < 1e-12);
  assert.equal(secantSlope(model, 1, 0), null);
  for (const h of [-1e-12, 1e-12])
    assert.ok(Math.abs(secantSlope(model, 1, h)! - 1) < 1e-11);
});

test('L38 exact tangent anchor: x² at 1 gives 2x−1', () => {
  assert.deepEqual(tangent({ a: 1, b: 0, c: 0 }, 1), {
    y0: 1,
    slope: 2,
    intercept: -1,
  });
  assert.deepEqual(tangent({ a: 0.5, b: 0, c: 0 }, 1), {
    y0: 0.5,
    slope: 1,
    intercept: -0.5,
  });
});

test('L38 positive/negative/zero slopes agree with independent finite differences', () => {
  for (const model of [
    { a: 2, b: -3, c: 1 },
    { a: -1, b: 2, c: -3 },
    { a: 0, b: -2, c: 3 },
    { a: 0, b: 0, c: -1 },
  ]) {
    for (const x0 of [-3, -0.5, 0, 1, 3]) {
      const epsilon = 1e-4;
      const numerical =
        (quadratic(model, x0 + epsilon) - quadratic(model, x0 - epsilon)) /
        (2 * epsilon);
      assert.ok(Math.abs(derivative(model, x0) - numerical) < 1e-8);
      const line = tangent(model, x0);
      assert.ok(
        Math.abs(line.slope * x0 + line.intercept - quadratic(model, x0)) <
          1e-10,
      );
      for (const h of [-2, -0.1, 0.1, 2.5]) {
        const direct = (quadratic(model, x0 + h) - quadratic(model, x0)) / h;
        assert.ok(Math.abs(secantSlope(model, x0, h)! - direct) < 1e-10);
      }
    }
  }
});

test('L38 vertical translation preserves derivative and translates tangent', () => {
  const base = { a: -0.5, b: 2, c: 0 };
  const translated = { ...base, c: 3 };
  for (const x of [-3, 0, 2, 3]) {
    assert.equal(derivative(base, x), derivative(translated, x));
    assert.equal(
      tangent(translated, x).intercept - tangent(base, x).intercept,
      3,
    );
  }
});

test('L38 vertex and affine/constant cases', () => {
  const downward = { a: -1, b: 2, c: 3 };
  assert.equal(vertexX(downward), 1);
  assert.equal(derivative(downward, vertexX(downward)!), 0);
  for (const b of [-2, 0, 3]) {
    const affine = { a: 0, b, c: 1 };
    assert.equal(vertexX(affine), null);
    assert.deepEqual(tangent(affine, -1), {
      y0: 1 - b,
      slope: b,
      intercept: 1,
    });
  }
});

test('L38 plot ranges are finite and contain the sampled curve and origin', () => {
  for (const values of [[0], [0, 0.1], [-47, 47], [-0.5, 8], [-15, 9]]) {
    const limit = plotLimit(values);
    assert.ok(Number.isFinite(limit) && limit > 0);
    assert.ok(values.every((value) => Math.abs(value) < limit));
  }
});
