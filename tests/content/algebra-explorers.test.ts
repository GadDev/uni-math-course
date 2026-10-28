import test from 'node:test';
import assert from 'node:assert/strict';
import {
  domainValues,
  inequality,
  lineSystem,
  meanData,
  pointGeometry,
  realInput,
} from '../../src/lib/algebra-explorers.ts';

test('domain comparisons retain holes and distinguish real roots from root of a square', () => {
  assert.equal(domainValues(3).quotient, null);
  assert.equal(domainValues(0).reciprocal, null);
  assert.equal(domainValues(-2).root, null);
  assert.equal(domainValues(-2).rootSquare, 2);
  for (let x = -5; x <= 5; x += 0.25) {
    const d = domainValues(x);
    if (x !== 3)
      assert.ok(Math.abs(d.quotient! * (x - 3) - (x * x - 9)) < 1e-12);
    assert.equal(d.rootSquare ** 2, x ** 2);
    assert.ok(d.rootSquare >= 0);
  }
  for (const raw of ['', ' ', 'abc', 'Infinity', 'NaN', '6', '-6'])
    assert.equal(realInput(raw, -5, 5), null);
  assert.equal(realInput('-2.5', -5, 5), -2.5);
});

test('inequality sets agree with direct substitution for every offered coefficient and boundary type', () => {
  for (let a = -4; a <= 4; a++)
    for (let c = -4; c <= 4; c++)
      for (const inclusive of [false, true]) {
        const result = inequality(a, c, inclusive);
        const candidates = [-7, -2, 0, 2, 7];
        if ('boundary' in result && result.boundary !== undefined)
          candidates.push(
            result.boundary,
            result.boundary - 0.01,
            result.boundary + 0.01,
          );
        for (const x of candidates) {
          const expected = inclusive ? a * x + c >= -1e-14 : a * x + c > 1e-14;
          const actual =
            result.kind === 'all'
              ? true
              : result.kind === 'none'
                ? false
                : result.kind === 'left'
                  ? inclusive
                    ? x <= result.boundary!
                    : x < result.boundary!
                  : inclusive
                    ? x >= result.boundary!
                    : x > result.boundary!;
          assert.equal(
            actual,
            expected,
            `${a}x + ${c}, x=${x}, inclusive=${inclusive}`,
          );
        }
      }
});

test('all offered line-system states satisfy both equations or the documented contradiction', () => {
  for (let m = -2; m <= 3; m++)
    for (let b = -3; b <= 3; b++) {
      const s = lineSystem(m, b);
      if (s.kind === 'unique') {
        assert.ok(Math.abs(s.y - s.x - 1) < 1e-12);
        assert.ok(Math.abs(s.y - m * s.x - b) < 1e-12);
        assert.ok(
          Math.abs(s.x) <= 6 && Math.abs(s.y) <= 6,
          'intersection fits the plot',
        );
      } else if (s.kind === 'same') {
        for (const x of [-10, 0, 10]) assert.equal(x + 1, m * x + b);
      } else {
        assert.equal(m, 1);
        assert.notEqual(b, 1);
      }
    }
});

test('mean conserves total, centers observations, and responds to a unit change by 1/n', () => {
  assert.equal(meanData([]), null);
  assert.equal(meanData([Infinity]), null);
  for (const values of [[2, 5, 8], [1, 2, 6], [-5], [-5, 10, -3, 9], [0, 0]]) {
    const d = meanData(values)!;
    assert.ok(Math.abs(d.mean * values.length - d.total) < 1e-12);
    assert.ok(Math.abs(d.deviations.reduce((s, x) => s + x, 0)) < 1e-12);
    const changed = [...values];
    changed[0]! += 1;
    assert.ok(
      Math.abs(meanData(changed)!.mean - d.mean - 1 / values.length) < 1e-12,
    );
  }
});

test('distance is symmetric, translation invariant and has an equidistant midpoint', () => {
  for (const [ax, ay, bx, by] of [
    [0, 0, 3, 4],
    [-4, 4, 4, -4],
    [2, -1, 2, 4],
    [1, 1, 1, 1],
  ]) {
    const d = pointGeometry(ax!, ay!, bx!, by!);
    assert.ok(d.distance >= 0);
    assert.equal(d.distance, pointGeometry(bx!, by!, ax!, ay!).distance);
    assert.equal(
      d.distance,
      pointGeometry(ax! + 5, ay! - 2, bx! + 5, by! - 2).distance,
    );
    assert.ok(
      Math.abs(pointGeometry(ax!, ay!, d.mx, d.my).distance - d.distance / 2) <
        1e-12,
    );
  }
  assert.equal(pointGeometry(0, 0, 3, 4).distance, 5);
});
