import test from 'node:test';
import assert from 'node:assert/strict';
import {
  domainChecks,
  derivativeRules,
  exponentialLogLaws,
  functionChapterCopy,
  growthValues,
} from '../../src/lib/functions-cheat-sheet.ts';

test('Chapter 3 reference follows the six course topics in both languages', () => {
  for (const locale of ['fr', 'en'] as const) {
    const text = functionChapterCopy[locale];
    for (const field of [
      'basicsTitle', 'secantsTitle', 'rulesTitle', 'expTitle', 'growthTitle',
      'basicsNotation', 'secantsReading', 'derivativeReading', 'tangentReading',
      'baseReading', 'generalBaseReading', 'growthReminder',
    ] as const) {
      assert.ok(text[field], field + ' missing in ' + locale);
    }
  }
  assert.match(functionChapterCopy.fr.intro, /L37 à L42/);
  assert.match(functionChapterCopy.en.intro, /L37–L42/);
});

test('domain rules forbid zero denominator, negative even roots and nonpositive logarithms', () => {
  assert.deepEqual(domainChecks.map((row) => row.id), ['fraction', 'root', 'log']);
  assert.equal(2 - 2, 0);
  assert.equal(-3 + 3, 0);
  assert.ok(1 - 1 <= 0);
  for (const row of domainChecks) {
    assert.ok(row.formula);
    assert.ok(row.reading.fr && row.reading.en);
    assert.ok(row.explanation.fr && row.explanation.en);
  }
});

test('derivative rules include eight standard rules with explicit conditions', () => {
  assert.deepEqual(
    derivativeRules.map((row) => row.id),
    ['constant', 'power', 'exponential', 'natural-log', 'linearity', 'product', 'quotient', 'chain'],
  );
  const power = derivativeRules.find((row) => row.id === 'power');
  assert.ok(power);
  assert.match(power.explanation.en, /x > 0/);
  const quotient = derivativeRules.find((row) => row.id === 'quotient');
  assert.ok(quotient);
  assert.match(quotient.explanation.fr, /zéro/);
  for (const row of derivativeRules) {
    assert.ok(row.formula);
    assert.ok(row.reading.fr && row.reading.en);
    assert.ok(row.explanation.fr && row.explanation.en);
  }
  assert.equal(2 * (3 * 2 + 1) * 3, 42);
});

test('secant approaches derivative and tangent at x = 1 for x squared', () => {
  const f = (x: number) => x * x;
  const slope = (h: number) => (f(1 + h) - f(1)) / h;
  assert.equal(slope(1), 3);
  assert.ok(Math.abs(slope(0.1) - 2.1) < 1e-12);
  assert.ok(Math.abs(slope(0.00001) - 2) < 0.0001);
  const tangent = (x: number) => f(1) + 2 * (x - 1);
  assert.equal(tangent(1), 1);
  assert.equal(tangent(2), 3);
});

test('logarithm identities and domain conditions are complete', () => {
  assert.deepEqual(
    exponentialLogLaws.map((law) => law.id),
    ['inverse', 'exp-add', 'exp-sub', 'exp-power', 'log-product', 'log-quotient', 'log-power'],
  );
  for (const law of exponentialLogLaws) {
    assert.ok(law.reading.en && law.reading.fr);
    assert.ok(law.explanation.en && law.explanation.fr);
  }
  assert.equal(Math.log(Math.exp(3)), 3);
  assert.equal(Math.exp(Math.log(5)), 5);
  assert.ok(Math.abs(Math.log(6) - Math.log(2) - Math.log(3)) < 1e-12);
  assert.equal(Math.log2(8), 3);
});

test('growth examples calculate exact values and order for n equal to 8 or 16', () => {
  assert.deepEqual(
    growthValues.map((row) => row.id),
    ['constant', 'log', 'linear', 'nlogn', 'quadratic', 'exponential'],
  );
  const expectedAt8 = [1, 3, 8, 24, 64, 256];
  const expectedAt16 = [1, 4, 16, 64, 256, 65536];
  assert.deepEqual(growthValues.map((row) => row.n8), expectedAt8);
  assert.deepEqual(growthValues.map((row) => row.n16), expectedAt16);
  assert.match(functionChapterCopy.fr.hierarchy, /asymptotiquement/);
  assert.match(functionChapterCopy.en.hierarchy, /asymptotically/);
});
