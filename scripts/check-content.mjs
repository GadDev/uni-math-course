import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function validateBank(bank) {
  assert.equal(bank.lessonId, 'L05');
  assert.equal(bank.version, 1);
  assert.equal(bank.exerciseCount, 6);
  assert.equal(bank.exercises.length, 6);
  const ids = new Set();
  const bilingual = (value) => {
    assert.deepEqual(Object.keys(value).sort(), ['en', 'fr']);
    for (const text of Object.values(value))
      assert.ok(typeof text === 'string' && text.trim());
  };
  for (const exercise of bank.exercises) {
    assert.ok(/^L05-E0[1-6]$/.test(exercise.id));
    assert.ok(!ids.has(exercise.id), 'Duplicate exercise ID');
    ids.add(exercise.id);
    assert.equal(exercise.lessonId, bank.lessonId);
    assert.equal(exercise.version, bank.version);
    assert.ok(/^L05-O0[1-6]$/.test(exercise.objectiveId));
    assert.ok(['foundation', 'application'].includes(exercise.difficulty));
    assert.ok(exercise.prerequisites.length && exercise.misconceptions.length);
    assert.equal(exercise.provenance.origin, 'original-project-work');
    assert.deepEqual(exercise.provenance.coveragePages, [20, 21, 22, 23]);
    assert.equal(exercise.grading.rejectUnknownFields, true);
    assert.equal(exercise.evidence.hintsOrRevealedSolutionsEligible, false);
    assert.equal(exercise.evidence.retriesEligible, false);
    bilingual(exercise.prompt);
    bilingual(exercise.hint);
    bilingual(exercise.explanation);
    if (exercise.type === 'single-choice') {
      assert.equal(exercise.grading.kind, 'exact-option-id');
      const options = exercise.options.map((option) => option.id);
      assert.equal(new Set(options).size, options.length);
      assert.ok(options.length >= 2 && options.includes(exercise.answer));
      for (const option of exercise.options) {
        bilingual(option.label);
        bilingual(option.feedback);
      }
    } else {
      assert.equal(exercise.type, 'truth-table');
      assert.equal(exercise.grading.kind, 'labelled-boolean-cells');
      assert.deepEqual(
        exercise.rows.map((row) => row.id),
        ['00', '01', '10', '11'],
      );
      assert.deepEqual(Object.keys(exercise.answer).sort(), [
        '00',
        '01',
        '10',
        '11',
      ]);
      for (const row of exercise.rows) {
        assert.equal(typeof row.A, 'boolean');
        assert.equal(typeof row.B, 'boolean');
        assert.equal(typeof exercise.answer[row.id], 'boolean');
        assert.equal(row.id, String(Number(row.A)) + String(Number(row.B)));
      }
      bilingual(exercise.feedback);
    }
  }
  assert.equal(new Set(bank.exercises.map((e) => e.objectiveId)).size, 6);
  return bank;
}

export async function checkContent() {
  const bank = validateBank(
    JSON.parse(
      await readFile(
        new URL('../exercises/L05/v1.json', import.meta.url),
        'utf8',
      ),
    ),
  );
  const lessons = await Promise.all(
    ['fr', 'en'].map((locale) =>
      readFile(
        new URL('../content/lessons/L05/' + locale + '.md', import.meta.url),
        'utf8',
      ),
    ),
  );
  for (let i = 0; i < lessons.length; i++) {
    const text = lessons[i];
    assert.ok(text.startsWith('---\n'));
    assert.ok(text.includes('lessonId: L05\n'));
    assert.ok(text.includes('locale: ' + ['fr', 'en'][i] + '\n'));
    assert.ok(text.includes('version: 1\n'));
    assert.ok(
      text.includes(
        'objectives: [L05-O01, L05-O02, L05-O03, L05-O04, L05-O05, L05-O06]',
      ),
    );
    assert.ok(text.includes('sourcePages: [20, 21, 22, 23]'));
  }
  const math = (text) =>
    [...text.matchAll(/\2([^$]+)\2/g)].map((match) => match[1].trim());
  assert.deepEqual(
    math(lessons[0]),
    math(lessons[1]),
    'French/English mathematical notation diverged',
  );
  console.log(
    'Validated L05 in French/English and six versioned exercise contracts.',
  );
  return bank;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await checkContent();
}
