import type { BankExercise } from '../../scripts/content-types.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const skill = new URL(
  '../../.claude/skills/math-course-studio/',
  import.meta.url,
);
const script = (name: string) =>
  fileURLToPath(new URL(`scripts/${name}`, skill));
const logic =
  await import('../../.claude/skills/math-course-studio/scripts/logic-check.ts');
const course =
  await import('../../.claude/skills/math-course-studio/scripts/course-map.ts');
const { loadSelectedBanks } =
  await import('../../.claude/skills/math-course-studio/scripts/released-banks.ts');
const bank = fileURLToPath(
  new URL('../../exercises/L05/v1.json', import.meta.url),
);

test('formula parser honours precedence and associativity', () => {
  const value = (formula: string, assignment: Record<string, boolean>) =>
    logic.evaluate(logic.parseFormula(formula), assignment);
  assert.equal(value('A | B & C', { A: true, B: false, C: false }), true);
  assert.equal(value('!A & B', { A: true, B: true }), false);
  // => is right-associative: A => (B => C)
  assert.equal(value('A => B => C', { A: true, B: true, C: false }), false);
  assert.equal(value('A => B => C', { A: false, B: true, C: false }), true);
  assert.equal(value('(A ⇒ B) ⇔ (¬A ∨ B)', { A: true, B: false }), true);
});

test('formula parser rejects malformed input', () => {
  for (const bad of ['A &', '(A | B', 'A B', '=> A', 'A @ B'])
    assert.throws(() => logic.parseFormula(bad), bad);
});

test('classification and equivalence use every assignment', () => {
  assert.equal(logic.classify('A | !A'), 'tautology');
  assert.equal(logic.classify('A & !A'), 'contradiction');
  assert.equal(logic.classify('A => B'), 'contingent');
  assert.ok(logic.equivalent('A => B', '!B => !A'));
  assert.ok(!logic.equivalent('A => B', 'B => A'));
});

test('truth-table keys are compared row by row', async () => {
  const published = JSON.parse(await readFile(bank, 'utf8'));
  const item = published.exercises.find(
    (e: BankExercise) => e.type === 'truth-table',
  );
  assert.deepEqual(logic.checkTable(item, 'A => B'), []);
  assert.ok(logic.checkTable(item, 'B => A').length > 0);
});

test('Chapter 1 course map retains source-specific page coverage', async () => {
  const lessons = await course.loadCourse();
  // Each chapter has its own PDF and page numbering. Filtering Chapter 1
  // avoids treating Chapter 3 source page 2 as coverage of the Logic PDF.
  const logicLessons = new Map(
    [...lessons].filter(([id]) => id >= 'L01' && id <= 'L20'),
  );
  const result = course.analyse(logicLessons, 96);
  const registry = JSON.parse(
    await readFile(
      new URL('../../content/releases.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(result.ids.length, Object.keys(registry.lessons).length);
  assert.ok(result.covered.includes(2), 'source page 2 is covered');
  assert.equal(course.ranges([3, 4, 5, 9]), '3-5, 9');
  assert.ok(
    result.findings.every((finding) => !/cycle/.test(finding)),
    'no prerequisite cycle',
  );
});

test('draft validator accepts a published bank and rejects broken drafts', async () => {
  const validator = script('validate-draft.ts');
  const ok = spawnSync('node', [validator, bank], { encoding: 'utf8' });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /NOT verified/);

  const dir = await mkdtemp(join(tmpdir(), 'draft-'));
  try {
    const broken = JSON.parse(await readFile(bank, 'utf8'));
    broken.exercises[0].prompt.en = 'Which row makes $A \\land B$ false?';
    broken.exercises[0].prompt.fr = 'Quelle ligne rend $A \\lor B$ fausse ?';
    const path = join(dir, 'bad.json');
    await writeFile(path, JSON.stringify(broken));
    const bad = spawnSync('node', [validator, path], { encoding: 'utf8' });
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /notation differs/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('draft validator lists reusable misconception tags from any directory', () => {
  const output = execFileSync(
    'node',
    [script('validate-draft.ts'), '--list-tags'],
    {
      cwd: tmpdir(),
      encoding: 'utf8',
    },
  );
  assert.match(output, /\tdomain-ignored/);
});

test('selected-bank reader follows the registry, including withdrawn practice, without archive fallback', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'selected-banks-'));
  try {
    await mkdir(join(dir, 'content'));
    await mkdir(join(dir, 'exercises/L05'), { recursive: true });
    const original = await readFile(bank, 'utf8');
    await writeFile(join(dir, 'exercises/L05/v1.json'), original);
    const versioned = (version: number) => {
      const next = JSON.parse(original);
      next.version = version;
      for (const exercise of next.exercises) {
        exercise.version = version;
        exercise.misconceptions = [`version-${version}-tag`];
      }
      return next;
    };
    for (const version of [2, 3])
      await writeFile(
        join(dir, `exercises/L05/v${version}.json`),
        JSON.stringify(versioned(version)),
      );
    const registry = { lessons: { L05: { version: 2, practice: false } } };
    const registryPath = join(dir, 'content/releases.json');
    await writeFile(registryPath, JSON.stringify(registry));

    const selected = await loadSelectedBanks(dir);
    assert.deepEqual(
      selected.map((item) => item.version),
      [2],
    );
    assert.deepEqual(selected[0]!.exercises[0]!.misconceptions, [
      'version-2-tag',
    ]);
    assert.equal(
      await readFile(join(dir, 'exercises/L05/v1.json'), 'utf8'),
      original,
    );

    // A selected version cannot silently resolve to a different bank.
    await writeFile(
      join(dir, 'exercises/L05/v2.json'),
      JSON.stringify(versioned(3)),
    );
    await assert.rejects(
      loadSelectedBanks(dir),
      /Expected values to be strictly equal/,
    );
    await rm(join(dir, 'exercises/L05/v2.json'));
    await assert.rejects(loadSelectedBanks(dir), /ENOENT/);
    registry.lessons.L05.version = 0;
    await writeFile(registryPath, JSON.stringify(registry));
    await assert.rejects(loadSelectedBanks(dir));
    await rm(registryPath);
    await assert.rejects(loadSelectedBanks(dir), /ENOENT/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validating a v2 correction draft leaves the selected release and v1 archive unchanged', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'draft-version-'));
  const registry = new URL('../../content/releases.json', import.meta.url);
  const original = await readFile(bank, 'utf8');
  const releaseBefore = await readFile(registry, 'utf8');
  try {
    const next = JSON.parse(original);
    next.version = 2;
    next.exercises.forEach((exercise: BankExercise) => {
      exercise.version = 2;
    });
    const path = join(dir, 'v2.draft.json');
    await writeFile(path, JSON.stringify(next));
    const result = spawnSync('node', [script('validate-draft.ts'), path], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readFile(bank, 'utf8'), original);
    assert.equal(await readFile(registry, 'utf8'), releaseBefore);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
