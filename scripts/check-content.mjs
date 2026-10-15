import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { checkReleases } from './check-releases.mjs';

const lessonIdPattern = /^L\d{2}$/;

// Truth-table rows are keyed by their variable values, in standard order.
// L05 predates the `variables` field, so A and B remain the default.
export function truthRowIds(variables) {
  const count = 2 ** variables.length;
  return Array.from({ length: count }, (_, n) =>
    n.toString(2).padStart(variables.length, '0'),
  );
}

export function validateBank(bank) {
  assert.match(bank.lessonId, lessonIdPattern);
  assert.ok(Number.isInteger(bank.version) && bank.version > 0);
  assert.equal(bank.exerciseCount, 6);
  assert.equal(bank.exercises.length, 6);
  const ids = new Set();
  const objectives = new Set();
  const bilingual = (value) => {
    assert.deepEqual(Object.keys(value).sort(), ['en', 'fr']);
    for (const text of Object.values(value))
      assert.ok(typeof text === 'string' && text.trim());
  };
  for (const exercise of bank.exercises) {
    assert.ok(
      new RegExp(`^${bank.lessonId}-E0[1-6]$`).test(exercise.id),
      `Unexpected exercise ID ${exercise.id}`,
    );
    assert.ok(!ids.has(exercise.id), 'Duplicate exercise ID');
    ids.add(exercise.id);
    assert.equal(exercise.lessonId, bank.lessonId);
    assert.equal(exercise.version, bank.version);
    assert.ok(
      new RegExp(`^${bank.lessonId}-O0[1-6]$`).test(exercise.objectiveId),
      `Unexpected objective ID ${exercise.objectiveId}`,
    );
    assert.ok(!objectives.has(exercise.objectiveId), 'Duplicate objective');
    objectives.add(exercise.objectiveId);
    assert.ok(['foundation', 'application'].includes(exercise.difficulty));
    assert.ok(exercise.prerequisites.length && exercise.misconceptions.length);
    assert.equal(exercise.provenance.origin, 'original-project-work');
    assert.ok(
      Array.isArray(exercise.provenance.coveragePages) &&
        exercise.provenance.coveragePages.length,
    );
    assert.deepEqual(
      exercise.provenance.coveragePages,
      bank.exercises[0].provenance.coveragePages,
      'Exercises in one bank must cite the same source pages',
    );
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
      const variables = exercise.variables ?? ['A', 'B'];
      const rowIds = truthRowIds(variables);
      assert.deepEqual(
        exercise.rows.map((row) => row.id),
        rowIds,
      );
      assert.deepEqual(Object.keys(exercise.answer).sort(), [...rowIds].sort());
      for (const row of exercise.rows) {
        for (const variable of variables)
          assert.equal(typeof row[variable], 'boolean');
        assert.equal(typeof exercise.answer[row.id], 'boolean');
        assert.equal(
          row.id,
          variables.map((variable) => String(Number(row[variable]))).join(''),
        );
      }
      bilingual(exercise.feedback);
    }
  }
  assert.equal(objectives.size, 6);
  return bank;
}

const frontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'Missing frontmatter');
  return Object.fromEntries(
    match[1].split('\n').map((line) => {
      const index = line.indexOf(': ');
      return [line.slice(0, index), line.slice(index + 2)];
    }),
  );
};

const listValue = (value) => value.slice(1, -1).split(', ');
const headingCount = (text) => text.match(/^## /gm)?.length ?? 0;
const mathStrings = (text) => {
  const display = [...text.matchAll(/\$\$([\s\S]*?)\$\$/g)];
  const inline = [
    ...text.replace(/\$\$[\s\S]*?\$\$/g, '').matchAll(/\$([^$\n]+)\$/g),
  ];
  return [...display, ...inline].map((match) => match[1].trim());
};

async function checkLesson(lessonId, bank) {
  const pages = bank.exercises[0].provenance.coveragePages;
  const texts = await Promise.all(
    ['fr', 'en'].map((locale) =>
      readFile(
        new URL(`../content/lessons/${lessonId}/${locale}.md`, import.meta.url),
        'utf8',
      ),
    ),
  );
  for (const [index, text] of texts.entries()) {
    const locale = ['fr', 'en'][index];
    const meta = frontmatter(text);
    assert.equal(meta.lessonId, lessonId);
    assert.equal(meta.locale, locale);
    assert.ok(
      Number.isInteger(Number(meta.version)) && Number(meta.version) > 0,
    );
    assert.ok(['pilot', 'extended'].includes(meta.status));
    assert.deepEqual(
      listValue(meta.objectives).sort(),
      [...new Set(bank.exercises.map((e) => e.objectiveId))].sort(),
      `${lessonId} ${locale} objectives must match the exercise bank`,
    );
    assert.deepEqual(
      listValue(meta.sourcePages).map(Number),
      pages,
      `${lessonId} ${locale} sourcePages must match exercise provenance`,
    );
  }
  assert.equal(
    frontmatter(texts[0]).status,
    frontmatter(texts[1]).status,
    `${lessonId} French/English status diverged`,
  );
  assert.equal(
    headingCount(texts[0]),
    headingCount(texts[1]),
    `${lessonId} French/English section counts diverged`,
  );
  assert.deepEqual(
    mathStrings(texts[0]),
    mathStrings(texts[1]),
    `${lessonId} French/English mathematical notation diverged`,
  );
}

export async function checkContent() {
  await checkReleases();
  const releases = JSON.parse(
    await readFile('content/releases.json', 'utf8'),
  ).lessons;
  const lessonRoot = new URL('../content/lessons/', import.meta.url);
  const exerciseRoot = new URL('../exercises/', import.meta.url);
  const lessonIds = (await readdir(lessonRoot)).filter((name) =>
    lessonIdPattern.test(name),
  );
  const exerciseIds = (await readdir(exerciseRoot)).filter((name) =>
    lessonIdPattern.test(name),
  );
  assert.deepEqual(
    [...lessonIds].sort(),
    [...exerciseIds].sort(),
    'Every lesson needs an exercise bank and vice versa',
  );
  for (const lessonId of lessonIds.sort()) {
    const version = releases[lessonId]?.version ?? 1;
    for (const file of await readdir(
      new URL(`../exercises/${lessonId}/`, import.meta.url),
    )) {
      if (/^v\d+\.json$/.test(file)) {
        const archived = validateBank(
          JSON.parse(
            await readFile(
              new URL(`../exercises/${lessonId}/${file}`, import.meta.url),
              'utf8',
            ),
          ),
        );
        assert.equal(
          file,
          `v${archived.version}.json`,
          'Bank version must match its filename',
        );
        assert.equal(archived.lessonId, lessonId);
      }
    }
    const bank = validateBank(
      JSON.parse(
        await readFile(
          new URL(`../exercises/${lessonId}/v${version}.json`, import.meta.url),
          'utf8',
        ),
      ),
    );
    assert.equal(bank.lessonId, lessonId);
    assert.equal(
      bank.version,
      version,
      'Selected bank version must match release metadata',
    );
    await checkLesson(lessonId, bank);
  }
  console.log(
    `Validated ${lessonIds.length} lessons in French/English with versioned exercise contracts: ${lessonIds.sort().join(', ')}.`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await checkContent();
}
