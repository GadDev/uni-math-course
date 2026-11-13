import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bresenhamExample,
  bresenhamGentle,
  intersectionCases,
  lineExtraCopy,
  pixelCopy,
  regressionCopy,
  regressionExample,
  regressionLeastSquares,
  regressionLimits,
} from '../../src/lib/lines-advanced-cheat-sheet.ts';

test('two nonvertical lines have three distinct intersection cases', () => {
  assert.deepEqual(
    intersectionCases.map((item) => item.id),
    ['secant', 'parallel', 'coincident'],
  );
  for (const row of intersectionCases) {
    assert.ok(row.name.fr && row.name.en);
    assert.ok(row.condition);
    assert.ok(row.result.fr && row.result.en);
  }

  const x = (7 - 1) / (2 - -1);
  assert.equal(x, 2);
  assert.equal(2 * x + 1, -x + 7);
  assert.equal(2 * x + 1, 5);
  assert.match(lineExtraCopy.fr.verticalException, /verticales/);
  assert.match(lineExtraCopy.en.shadeOnLine, /another point/);
});

test('screen pixel conversion flips vertical axis and scales both coordinates', () => {
  const center = { c: 100, r: 80 };
  const scale = 10;
  const x = 2;
  const y = 3;
  assert.equal(center.c + scale * x, 120);
  assert.equal(center.r - scale * y, 50);
  assert.match(pixelCopy.fr.coordinateCaution, /r − 1/);
  assert.match(pixelCopy.en.bresScope, /0 ≤ Δy ≤ Δx/);
});

test('Bresenham integer decision trace follows the requested E/NE convention', () => {
  assert.deepEqual(
    bresenhamExample.map(({ x, y }) => [x, y]),
    [
      [0, 0],
      [1, 1],
      [2, 1],
      [3, 2],
      [4, 2],
      [5, 3],
    ],
  );
  assert.deepEqual(
    bresenhamExample.map(({ decision }) => decision),
    [1, -3, 3, -1, 5, 1],
  );
  assert.deepEqual(
    bresenhamExample.map(({ move }) => move),
    ['NE', 'E', 'NE', 'E', 'NE', 'END'],
  );
  assert.equal(bresenhamExample.length, 6);
  assert.deepEqual(
    bresenhamGentle(0, 0, 2, 1).map(({ x, y }) => [x, y]),
    [
      [0, 0],
      [1, 1],
      [2, 1],
    ],
  );
  assert.throws(() => bresenhamGentle(0, 0, 1, 3), RangeError);
  assert.throws(() => bresenhamGentle(0.5, 0, 2, 1), RangeError);
  assert.throws(() => bresenhamGentle(1, 1, 1, 1), RangeError);
});

test('least squares means, centered columns, slope, intercept and SSR are exact', () => {
  const fit = regressionExample;
  assert.equal(fit.meanX, 2);
  assert.equal(fit.meanY, 3);
  assert.equal(fit.numerator, 3);
  assert.equal(fit.denominator, 2);
  assert.equal(fit.slope, 1.5);
  assert.equal(fit.intercept, 0);
  assert.deepEqual(
    fit.rows.map(({ dx, dy, product, squared }) => [dx, dy, product, squared]),
    [
      [-1, -1, 1, 1],
      [0, -1, 0, 0],
      [1, 2, 2, 1],
    ],
  );
  assert.equal(
    fit.rows.reduce((sum, row) => sum + row.dx, 0),
    0,
  );
  assert.equal(
    fit.rows.reduce((sum, row) => sum + row.dy, 0),
    0,
  );
  assert.deepEqual(
    fit.rows.map(({ residual }) => residual),
    [0.5, -1, 0.5],
  );
  assert.equal(fit.ssr, 1.5);
  assert.equal(fit.slope * fit.meanX + fit.intercept, fit.meanY);
  assert.equal((3 - fit.intercept) / fit.slope, 2);
  assert.throws(() => regressionLeastSquares([[1, 2]]), RangeError);
  assert.throws(
    () =>
      regressionLeastSquares([
        [1, 2],
        [1, 4],
      ]),
    RangeError,
  );
});

test('regression limits and all student-facing notes are bilingual', () => {
  assert.deepEqual(
    regressionLimits.map((limit) => limit.id),
    ['correlation', 'anscombe', 'outliers', 'extrapolation'],
  );
  for (const limit of regressionLimits) {
    assert.ok(limit.title.fr && limit.title.en);
    assert.ok(limit.meaning.fr && limit.meaning.en);
    assert.ok(limit.caution.fr && limit.caution.en);
  }
  assert.match(regressionCopy.fr.ssrExplain, /carré/);
  assert.match(regressionCopy.en.unique, /unique/);
  assert.match(regressionCopy.fr.flatCase, /m = 0/);
  assert.match(regressionCopy.en.predictionsExample, /observed range/);
});
