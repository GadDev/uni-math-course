import assert from 'node:assert/strict';
import test from 'node:test';
import {
  derivative,
  plotY,
  squareSecant,
  tangent,
  value,
} from '../../src/lib/l39-math.ts';
import type { Curve } from '../../src/lib/l39-math.ts';

test('L39 derivatives agree with independently computed difference quotients', () => {
  for (const curve of ['square', 'cubic'] as Curve[]) {
    for (let i = -40; i <= 40; i++) {
      const a = i / 20;
      const h = 0.0001;
      const central = (value(curve, a + h) - value(curve, a - h)) / (2 * h);
      assert.ok(Math.abs(central - derivative(curve, a)) < 2e-8);
      assert.equal(tangent(curve, a, a), value(curve, a));
      // Both linked markers must fit entirely within the plotted SVG window.
      for (const selected of [value(curve, a), derivative(curve, a)]) {
        assert.ok(plotY(selected) > 44 && plotY(selected) < 296);
      }
    }
  }
});

test('L39 secant has two-sided convergence but remains undefined at zero', () => {
  assert.equal(squareSecant(1, 0), null);
  for (const a of [-2, -0.5, 0, 1, 2]) {
    for (const h of [-1, -0.1, -0.001, 0.001, 0.1, 1]) {
      const actual = (value('square', a + h) - value('square', a)) / h;
      assert.ok(Math.abs(squareSecant(a, h)! - actual) < 1e-11);
    }
    assert.ok(
      Math.abs(squareSecant(a, 1e-10)! - derivative('square', a)) < 2e-10,
    );
    assert.ok(
      Math.abs(squareSecant(a, -1e-10)! - derivative('square', a)) < 2e-10,
    );
  }
});

test('L39 tangent examples distinguish zero slope, nonzero height and crossing', () => {
  assert.equal(value('cubic', 1), -2);
  assert.equal(derivative('cubic', 1), 0);
  assert.equal(tangent('cubic', 1, -2), -2);
  assert.equal(tangent('square', 1, 0), -1);
  assert.ok(Math.abs(tangent('square', 1, 1.1) - 1.2) < 1e-12);
  for (const x of [-0.5, 0.5]) {
    assert.equal(
      Math.sign(value('cubic', x) - tangent('cubic', 0, x)),
      Math.sign(x),
    );
  }
});
