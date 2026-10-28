import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readLessonSource } from '../../scripts/lesson-files.ts';
import { loadCourse } from '../../.claude/skills/math-course-studio/scripts/course-map.ts';
import test from 'node:test';
import { polynomial, rational } from '../../src/lib/l37-math.ts';

test('L37 reading calculations agree with worked anchors and an alternative expression', () => {
  for (const [x, expected] of [
    [-2, -9],
    [-1, 0],
    [0, 3],
    [1, 6],
    [2, 15],
    [0.25, 3.515625],
    [-0.5, 1.875],
  ]) {
    assert.equal(polynomial(x!), expected);
  }
  for (let quarter = -4; quarter <= 12; quarter++) {
    const x = quarter / 4;
    const { value } = rational(x);
    if (x === 0 || x === 2) {
      assert.equal(value, null, `No image at forbidden input ${x}`);
    } else {
      // The numerator is the denominator plus 2, independently of evaluation.
      assert.ok(Math.abs(value! - (1 + 2 / (x * (x - 2)))) < 1e-12);
      assert.ok(Number.isFinite(value));
    }
  }
});

test('L37 static graph is a sampled polynomial, including all worked points', async () => {
  for (const locale of ['fr', 'en']) {
    const svg = await readFile(
      `public/diagrams/functions/l37-polynomial-${locale}.svg`,
      'utf8',
    );
    const coordinates = [...svg.matchAll(/[ML]([\d.]+),([\d.]+)/g)];
    assert.equal(coordinates.length, 201);
    for (const point of coordinates) {
      // Recover maths coordinates from the independently specified axis window.
      const x = (Number(point[1]) - 215) / 75;
      const y = (185 - Number(point[2])) / 7.5;
      assert.ok(Math.abs(y - x * (x * x + 2) - 3) < 0.00001);
    }
  }
});

test('lesson-authoring helpers can read L37 MDX and preserve its metadata', async () => {
  const source = await readLessonSource('content/lessons/L37', 'fr');
  assert.match(source, /lessonId: L37/);
  assert.match(source, /client:visible/);
  const lesson = (await loadCourse()).get('L37')!;
  for (const locale of ['fr', 'en'] as const) {
    const data = lesson.locales[locale];
    assert.ok(!('error' in data));
    assert.equal(data.fields.version, '2');
  }
});
