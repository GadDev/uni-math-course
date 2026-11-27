import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { equationTasks } from '../../src/lib/exp-log-practice.ts';

const close = (a: number, b: number) => Math.abs(a - b) < 1e-10;

test('public equation choices agree with original equations and their domains', () => {
  const checks: Record<string, boolean[]> = {
    'equal-exponents': [8 / 3, 2, 6].map((x) =>
      close(Math.exp(3 * x + 1), Math.exp(7)),
    ),
    'positive-output': [false, false, true], // exp(2x)>0 for every real x; ln(-1) is undefined.
    'moving-exponents': [4, 2, -4].map((x) =>
      close(Math.exp(2 * x - 3), Math.exp(x + 1)),
    ),
    'combine-logs': [11, 6, 4].map(
      (x) => x > 2 && close(Math.log(x - 2) + Math.log(3), Math.log(12)),
    ),
    'negative-input-trap': [false, false, true],
    'square-log-domain': [true, false, false],
    'isolate-power': [16, 4, Math.log(80) / Math.log(2)].map((x) =>
      close(5 * 2 ** x, 80),
    ),
    'exact-base-change': [
      Math.log(7) / Math.log(2),
      Math.log(2) / Math.log(7),
      3.5,
    ].map((x) => close(2 ** x, 7)),
    'decreasing-base': [3, NaN, -3].map(
      (x) => Number.isFinite(x) && close(0.5 ** x, 8),
    ),
  };
  // Independent root/domain checks for the two solution-set questions.
  const logProduct = (x: number) =>
    x > 1 && close(Math.log(x - 1) + Math.log(x + 1), Math.log(3));
  assert.deepEqual([-2, 2].filter(logProduct), [2]);
  assert.deepEqual(
    [-3, 0, 3, 9].filter((x) => x !== 0 && close(Math.log(x * x), Math.log(9))),
    [-3, 3],
  );
  for (const task of Object.values(equationTasks).flat()) {
    assert.deepEqual(
      task.choices.map((choice) => Boolean(choice.correct)),
      checks[task.id],
      task.id,
    );
    assert.equal(task.choices.filter((choice) => choice.correct).length, 1);
    assert.equal(
      new Set(task.choices.map((choice) => choice.feedback.fr)).size,
      3,
    );
    assert.equal(
      new Set(task.choices.map((choice) => choice.feedback.en)).size,
      3,
    );
    for (const locale of ['fr', 'en'] as const) {
      assert.ok(task.prompt[locale] && task.solution[locale]);
    }
  }
});

test('equation exact values, valid absolute-value identity and mixed retrieval anchors', () => {
  for (const x of [-10, -2, -0.1, 0.1, 2, 10]) {
    assert.ok(close(Math.log(x * x), 2 * Math.log(Math.abs(x))));
    const h = 1e-6;
    const slope = (Math.log((x + h) ** 2) - Math.log((x - h) ** 2)) / (2 * h);
    assert.ok(Math.abs(slope - 2 / x) < 1e-6);
  }
  assert.ok(Number.isNaN(Math.log(-2)));
  assert.ok(close(3 ** (Math.log(7) / Math.log(3)), 7));
  assert.ok(close(2 ** (Math.log(10) / Math.log(2)), 10));
  const f = (x: number) => (x * x + 1) * Math.exp(2 * x);
  assert.ok(Math.abs((f(1e-6) - f(-1e-6)) / 2e-6 - 2) < 1e-8);
  assert.ok(close((0.8 ** 2 / 2 - 0.5) / -0.2, 0.9));
  assert.equal(Math.floor(Math.log2(17)), 4);
  assert.equal(Math.ceil(Math.log2(17)), 5);
});

test('L40–L42 paired reading math and six-stage headings remain aligned', async () => {
  const math = (s: string) =>
    s.match(/\$\$[\s\S]*?\$\$|(?<!\$)\$(?!\$).*?(?<!\$)\$(?!\$)/g);
  for (const lesson of ['L40', 'L41', 'L42']) {
    const [fr, en] = await Promise.all(
      ['fr', 'en'].map((locale) =>
        readFile(`content/lessons/${lesson}/${locale}.mdx`, 'utf8'),
      ),
    );
    assert.ok(fr);
    assert.ok(en);
    assert.deepEqual(math(fr), math(en), lesson);
    for (const reading of [fr, en]) {
      assert.equal((reading.match(/^## [1-6]\. /gm) || []).length, 6);
      assert.match(reading, /version: 3/);
      assert.match(reading, /c03-revision/);
    }
  }
});
