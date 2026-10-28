import test from 'node:test';
import assert from 'node:assert/strict';
import {
  logPoint,
  logSecant,
  logTangent,
  type LogCurve,
} from '../../src/lib/logarithm-explorer.ts';

test('L41: secants approach 1/a from both sides, including small increments', () => {
  for (const a of [0.25, 1, Math.E, 4]) {
    for (const h of [0.1, -0.1]) {
      const coarse = logSecant(a, h)!;
      const fine = logSecant(a, h / 100)!;
      const finer = logSecant(a, h / 10000)!;
      assert.ok(Math.abs(fine - 1 / a) < Math.abs(coarse - 1 / a));
      assert.ok(Math.abs(finer - 1 / a) < Math.abs(fine - 1 / a));
      assert.ok(h > 0 ? coarse < 1 / a : coarse > 1 / a);
    }
    assert.ok(Math.abs(logSecant(a, 1e-12)! - 1 / a) < 1e-10);
  }
  assert.ok(Math.abs(logSecant(1, 1)! - Math.LN2) < 1e-14);
});

test('L41: undefined logarithms and zero increments have no numerical result', () => {
  for (const x of [0, -1, NaN, Infinity]) {
    assert.equal(logPoint('ln', x), null);
    assert.equal(logPoint('square', x), null);
  }
  for (const [a, h] of [
    [1, 0],
    [1, -1],
    [1, -2],
    [0, 1],
    [NaN, 1],
    [1, Infinity],
  ])
    assert.equal(logSecant(a!, h!), null);
  assert.equal(logTangent('ln', 0, 1), null);
});

test('L41: analytic slopes agree with independent central differences', () => {
  const functions = {
    ln: Math.log,
    negative: (x: number) => -Math.log(x),
    square: (x: number) => Math.log(x) ** 2,
  };
  for (const curve of Object.keys(functions) as LogCurve[]) {
    for (const a of [0.25, 0.5, 1, Math.E, 4]) {
      const f = functions[curve];
      const numerical = (f(a + 1e-6) - f(a - 1e-6)) / 2e-6;
      const point = logPoint(curve, a)!;
      assert.ok(Math.abs(point.slope - numerical) < 1e-8);
      assert.equal(logTangent(curve, a, a), f(a));
      assert.ok(
        Math.abs(logTangent(curve, a, a + 1)! - f(a) - numerical) < 1e-8,
      );
    }
  }
  assert.equal(logPoint('square', 1)!.slope, 0);
  assert.ok(logPoint('square', 0.5)!.slope < 0);
  assert.ok(logPoint('square', 2)!.slope > 0);
});
