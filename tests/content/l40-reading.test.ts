import assert from 'node:assert/strict';
import test from 'node:test';
import {
  value,
  derivative,
  secantSlope,
  tangent,
  type Curve,
} from '../../src/lib/l40-math.ts';

const close = (actual: number, expected: number, tolerance = 1e-12) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${actual} differs from ${expected}`,
  );

test('L40 exponential, negative exponent and square agree with independent anchors', () => {
  close(value('exp', 0), 1);
  close(value('exp', 1), Math.E);
  close(value('decay', 1), 1 / Math.E);
  close(derivative('decay', 1), -1 / Math.E);
  assert.equal(derivative('square', 0), 0);
  assert.equal(derivative('square', -1), -2);
  assert.equal(derivative('square', 1), 2);
});

test('L40 secants approach the exponential derivative from both sides without defining 0/0', () => {
  for (const a of [-1, 0, 1]) {
    let previousError = Infinity;
    for (const magnitude of [1, 0.1, 0.01, 1e-8, 1e-12]) {
      for (const h of [-magnitude, magnitude]) {
        const slope = secantSlope('exp', a, h)!;
        assert.ok(Number.isFinite(slope));
        assert.ok(h > 0 ? slope > Math.exp(a) : slope < Math.exp(a));
        const error = Math.abs(slope - Math.exp(a));
        assert.ok(error < previousError);
      }
      previousError = Math.max(
        ...[-magnitude, magnitude].map((h) =>
          Math.abs(secantSlope('exp', a, h)! - Math.exp(a)),
        ),
      );
    }
  }
  // A Taylor expansion is independent of expm1 and remains valid near zero.
  for (const h of [-1e-8, 1e-8]) {
    close(secantSlope('exp', 0, h)!, 1 + h / 2 + (h * h) / 6, 1e-15);
    close(secantSlope('decay', 0, h)!, -1 + h / 2 - (h * h) / 6, 1e-15);
  }
  for (const h of [0, NaN, Infinity, -Infinity])
    assert.equal(secantSlope('exp', 0, h), null);
  assert.equal(secantSlope('exp', NaN, 1), null);
  close(secantSlope('exp', 0, 1)!, Math.E - 1);
});

test('L40 tangents pass through A and have the stated slope over the whole control range', () => {
  for (const curve of ['exp', 'decay', 'square'] as Curve[]) {
    for (let tenth = -10; tenth <= 10; tenth++) {
      const a = tenth / 10;
      close(tangent(curve, a, a), value(curve, a));
      close(
        (tangent(curve, a, 1) - tangent(curve, a, -1)) / 2,
        derivative(curve, a),
      );
      for (const x of [-2, 0, 2]) {
        const expected =
          curve === 'square'
            ? 2 * a * x - a * a
            : curve === 'exp'
              ? Math.exp(a) * (1 + x - a)
              : Math.exp(-a) * (1 - x + a);
        close(tangent(curve, a, x), expected);
      }
    }
  }
  close(tangent('exp', 0, 0.1), 1.1);
  close(tangent('decay', 0, 1), 0);
  assert.equal(tangent('square', 0, 1), 0);
  assert.ok(Math.abs(value('exp', 0.1) - 1.1) < Math.abs(value('exp', 1) - 2));
});
