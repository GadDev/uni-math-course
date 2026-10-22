#!/usr/bin/env node
import type { ExerciseBank, BankExercise, Localized } from './content-types.ts';
type BilingualInput = string | string[] | Localized;
type AuthoringSpec = {
  lessonId: string;
  version: number;
  items: {
    id?: string;
    objectiveId?: string;
    objective: number;
    difficulty?: string;
    misconceptions?: string[];
    type?: 'truth-table' | 'single-choice';
    prompt: BilingualInput;
    hint: BilingualInput;
    feedback?: BilingualInput;
    explanation?: BilingualInput;
    wrong?: BilingualInput;
    variables?: string[];
    rows?: ({ id: string } & Record<string, string | boolean>)[];
    answer?: Record<string, boolean>;
    correct?: number;
    options?: (
      string | string[] | { label: BilingualInput; feedback: BilingualInput }
    )[];
  }[];
};
// Expand compact bilingual single-choice authoring specs into the repository's
// full, immutable-version-aware draft format. The authored prompts, options,
// feedback and answer keys are never inferred by this script.
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { validateBank } from './check-content.ts';

const specPath = process.argv[2];
if (!specPath) {
  console.error(
    'Usage: node scripts/assemble-exercise-draft.ts exercises/drafts/Lxx/spec.json',
  );
  process.exit(2);
}

const spec: AuthoringSpec = JSON.parse(await readFile(specPath, 'utf8'));
assert.match(spec.lessonId, /^L\d{2}$/);
assert.ok(Number.isInteger(spec.version) && spec.version > 0);
assert.ok(Array.isArray(spec.items));
const releases = JSON.parse(
  await readFile('content/releases.json', 'utf8'),
).lessons;
const selectedVersion = releases[spec.lessonId]?.version;
assert.ok(selectedVersion, `No selected bank for ${spec.lessonId}`);
const archivePath = join('exercises', spec.lessonId);
const archivedFiles = (await readdir(archivePath)).filter((name) =>
  /^v\d+\.json$/.test(name),
);
const archivedBanks: ExerciseBank[] = await Promise.all(
  archivedFiles.map(async (name) =>
    JSON.parse(await readFile(join(archivePath, name), 'utf8')),
  ),
);
assert.ok(
  !archivedBanks.some((bank) => bank.version === spec.version),
  'Draft must use an unused version',
);
const selectedBank = archivedBanks.find(
  (bank) => bank.version === selectedVersion,
);
assert.ok(selectedBank, 'Selected bank archive is missing');
const oldIds = new Set(
  archivedBanks.flatMap((bank) => bank.exercises.map((item) => item.id)),
);
const examplesByObjective = new Map(
  selectedBank.exercises.map((item) => [item.objectiveId, item]),
);

const bilingual = (value: BilingualInput): Localized => {
  if (typeof value === 'string') {
    assert.ok(value.trim());
    return { fr: value, en: value };
  }
  if (Array.isArray(value)) {
    assert.equal(value.length, 2, 'Bilingual pair needs French then English');
    value = { fr: value[0]!, en: value[1]! };
  }
  assert.deepEqual(Object.keys(value).sort(), ['en', 'fr']);
  assert.ok(value.fr.trim() && value.en.trim());
  return value;
};

const exercises = spec.items.map<BankExercise>((item, index) => {
  const id =
    item.id ?? `${spec.lessonId}-E${String(index + 7).padStart(2, '0')}`;
  const objectiveId =
    item.objectiveId ??
    `${spec.lessonId}-O${String(item.objective).padStart(2, '0')}`;
  assert.ok(!oldIds.has(id), `New exercise ID was used in an archive: ${id}`);
  const base = examplesByObjective.get(objectiveId);
  assert.ok(base, `No lesson objective matches ${objectiveId}`);
  const common = {
    id,
    objectiveId,
    difficulty:
      item.difficulty ?? (index < 5 ? 'easy' : index < 10 ? 'medium' : 'hard'),
    misconceptions: item.misconceptions ?? base.misconceptions,
  };
  const metadata = {
    lessonId: spec.lessonId,
    version: spec.version,
    prerequisites: base.prerequisites,
    provenance: base.provenance,
  };
  if (item.type === 'truth-table') {
    assert.ok(Array.isArray(item.variables));
    assert.ok(Array.isArray(item.rows));
    assert.ok(item.answer && typeof item.answer === 'object');
    return {
      ...common,
      type: 'truth-table',
      prompt: bilingual(item.prompt),
      hint: bilingual(item.hint),
      variables: item.variables!,
      rows: item.rows!,
      answer: item.answer!,
      feedback: bilingual(item.feedback!),
      explanation: bilingual(item.explanation ?? item.feedback!),
      ...metadata,
      grading: { kind: 'labelled-boolean-cells', rejectUnknownFields: true },
      evidence: base.evidence,
    };
  }
  assert.ok(!item.type || item.type === 'single-choice');
  assert.ok(item.options!.length >= 3);
  assert.ok(
    Number.isInteger(item.correct) &&
      item.correct! >= 0 &&
      item.correct! < item.options!.length,
  );
  return {
    ...common,
    type: 'single-choice',
    prompt: bilingual(item.prompt),
    hint: bilingual(item.hint),
    options: item.options!.map((option, index) => ({
      id: String.fromCharCode(97 + index),
      label: bilingual(
        Array.isArray(option)
          ? option.slice(0, 2)
          : typeof option === 'string'
            ? option
            : option.label,
      ),
      feedback: bilingual(
        Array.isArray(option)
          ? option.length === 2
            ? index === item.correct
              ? item.explanation!
              : item.wrong!
            : option.slice(2, 4)
          : typeof option === 'string'
            ? index === item.correct
              ? item.explanation!
              : item.wrong!
            : option.feedback,
      ),
    })),
    answer: String.fromCharCode(97 + item.correct!),
    explanation: bilingual(item.explanation!),
    ...metadata,
    grading: { kind: 'exact-option-id', rejectUnknownFields: true },
    evidence: base.evidence,
  };
});

const bank = {
  lessonId: spec.lessonId,
  version: spec.version,
  status: 'review-candidate',
  exerciseCount: exercises.length,
  exercises,
};
validateBank(bank);
const output = join(dirname(specPath), `v${spec.version}.draft.json`);
await writeFile(output, `${JSON.stringify(bank, null, 2)}\n`);
console.log(`Assembled ${exercises.length} unreviewed questions in ${output}`);
