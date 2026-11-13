import test from 'node:test';
import assert from 'node:assert/strict';
import {
  geometryCopy,
  geometryFormulae,
  geometryMethods,
  regressionSteps,
} from '../../src/lib/geometry-cheat-sheet.ts';

test('geometry reference keeps course slope-intercept notation in both languages', () => {
  const line = geometryFormulae.find((item) => item.id === 'line');
  assert.ok(line);
  assert.equal(line.formula, 'y=mx+p');
  assert.match(line.reading.fr, /plus p/);
  assert.match(line.reading.en, /plus p/);
  assert.match(geometryCopy.fr.intro, /y = mx \+ p/);
  assert.match(geometryCopy.en.intro, /y = mx \+ p/);
});

test('methods cover all forward and reverse Cartesian line tasks', () => {
  assert.deepEqual(
    geometryMethods.map((method) => method.id),
    [
      'chart-to-equation',
      'points-to-equation',
      'equation-to-chart',
      'coordinates',
      'point-test',
    ],
  );
  for (const method of geometryMethods) {
    assert.ok(method.title.fr && method.title.en);
    assert.ok(method.intro.fr && method.intro.en);
    assert.ok(method.steps.length);
    assert.ok(method.example.fr && method.example.en);
    for (const step of method.steps) {
      assert.ok(step.text.fr && step.text.en);
    }
  }
  assert.match(
    geometryMethods.find((method) => method.id === 'points-to-equation')!
      .example.fr,
    /verticale/,
  );
  assert.match(geometryCopy.fr.warning, /m ≠ 0/);
  assert.match(geometryCopy.en.warning, /m ≠ 0/);
});

test('all key formulas include accessible bilingual readings', () => {
  assert.deepEqual(
    geometryFormulae.map((item) => item.id),
    [
      'line',
      'slope',
      'intercept',
      'solve-x',
      'x-intercept',
      'mean-x',
      'mean-y',
      'regression-slope',
      'regression-intercept',
    ],
  );
  for (const item of geometryFormulae) {
    assert.ok(item.formula);
    assert.ok(item.reading.fr && item.reading.en);
    assert.ok(item.meaning.fr && item.meaning.en);
  }
});

test('worked line, vertical exception and regression numbers are consistent', () => {
  const A = { x: 0, y: 1 };
  const B = { x: 2, y: 5 };
  const slope = (B.y - A.y) / (B.x - A.x);
  assert.equal(slope, 2);
  assert.equal(A.y - slope * A.x, 1);
  assert.equal(slope * 2 + 1, B.y);
  assert.notEqual(slope * 2 + 1, 4);

  const x = [1, 2, 3];
  const y = [2, 2, 5];
  const xbar = x.reduce((sum, value) => sum + value, 0) / x.length;
  const ybar = y.reduce((sum, value) => sum + value, 0) / y.length;
  const numerator = x.reduce(
    (sum, value, index) => sum + (value - xbar) * (y[index]! - ybar),
    0,
  );
  const denominator = x.reduce((sum, value) => sum + (value - xbar) ** 2, 0);
  const m = numerator / denominator;
  const p = ybar - m * xbar;
  assert.equal(xbar, 2);
  assert.equal(ybar, 3);
  assert.equal(m, 1.5);
  assert.equal(p, 0);
  assert.equal(m * xbar + p, ybar);
  assert.equal(regressionSteps.length, 3);
  assert.match(geometryCopy.fr.regressionConstraint, /dénominateur est nul/);
});
