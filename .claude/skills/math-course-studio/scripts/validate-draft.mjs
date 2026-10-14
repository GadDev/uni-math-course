#!/usr/bin/env node
// Validate a draft exercise bank with the repository's own checker, then run
// extra checks the checker lacks (lesson alignment, bilingual parity,
// distractor quality). It checks structure and notation only: it cannot tell
// whether an answer key is mathematically right. Use logic-check.mjs and a
// second hand derivation for that.
//
// Usage (works from any directory):
//   node .claude/skills/math-course-studio/scripts/validate-draft.mjs <draft.json>
//   node .claude/skills/math-course-studio/scripts/validate-draft.mjs --list-tags
import { readFile, readdir } from 'node:fs/promises';
import { basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const argument = process.argv[2];

if (argument === '--list-tags') {
  // Existing misconception tags with their use counts: reuse before inventing.
  const counts = new Map();
  for (const name of (await readdir(`${root}exercises`)).filter((n) => /^L\d{2}$/.test(n))) {
    const bank = JSON.parse(await readFile(`${root}exercises/${name}/v1.json`, 'utf8'));
    for (const exercise of bank.exercises)
      for (const tag of exercise.misconceptions) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  for (const [tag, count] of [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])))
    console.log(`${count}\t${tag}`);
  process.exit(0);
}

if (!argument) {
  console.error('Usage: validate-draft.mjs <draft.json> | --list-tags');
  process.exit(2);
}

const { validateBank } = await import(`${root}scripts/check-content.mjs`);

let bank;
try {
  bank = JSON.parse(await readFile(argument, 'utf8'));
} catch (error) {
  console.error(`Cannot read draft as JSON: ${error.message}`);
  process.exit(2);
}

const errors = [];
const warnings = [];

try {
  validateBank(bank);
} catch (error) {
  errors.push(`checker: ${error.message}`);
}

// The lesson's frontmatter must match the bank, or promotion will fail.
const listValue = (value = '[]') =>
  value.replace(/^\[|\]$/g, '').split(',').map((item) => item.trim()).filter(Boolean);
for (const locale of ['fr', 'en']) {
  try {
    const text = await readFile(`${root}content/lessons/${bank.lessonId}/${locale}.md`, 'utf8');
    const front = Object.fromEntries(
      (text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '')
        .split('\n')
        .map((line) => [line.slice(0, line.indexOf(': ')), line.slice(line.indexOf(': ') + 2)]),
    );
    const objectives = [...new Set(bank.exercises.map((e) => e.objectiveId))].sort();
    if (JSON.stringify(listValue(front.objectives).sort()) !== JSON.stringify(objectives))
      errors.push(`lesson ${locale}: frontmatter objectives differ from the draft's objective IDs`);
    const pages = bank.exercises[0]?.provenance?.coveragePages ?? [];
    if (JSON.stringify(listValue(front.sourcePages).map(Number)) !== JSON.stringify(pages))
      errors.push(`lesson ${locale}: frontmatter sourcePages differ from the draft's coveragePages`);
  } catch (error) {
    errors.push(`lesson ${bank.lessonId}/${locale}: cannot read lesson (${error.code ?? error.message})`);
  }
}

const folder = basename(dirname(argument));
if (/^L\d{2}$/.test(folder) && folder !== bank.lessonId)
  errors.push(`draft sits in folder ${folder} but declares lessonId ${bank.lessonId}`);

const mathStrings = (text) => [...text.matchAll(/\$([^$\n]+)\$/g)].map((match) => match[1].trim());
const symbols = (text) =>
  (text.match(/[\d∧∨¬⇒⇔⇐∀∃∈∉⊆⊂∪∩∅ℕℤℝℚ≤≥≠<>=\]\[]/gu) ?? []).sort().join('');

// Every { fr, en } pair anywhere in an item: compare notation.
function* bilingualPairs(value, path) {
  if (!value || typeof value !== 'object') return;
  const keys = Object.keys(value);
  if (keys.length === 2 && keys.includes('fr') && keys.includes('en') && typeof value.fr === 'string') {
    yield [path, value];
    return;
  }
  for (const [key, child] of Object.entries(value)) yield* bilingualPairs(child, `${path}.${key}`);
}

for (const exercise of bank.exercises ?? []) {
  for (const [path, pair] of bilingualPairs(exercise, exercise.id)) {
    if (JSON.stringify(mathStrings(pair.fr)) !== JSON.stringify(mathStrings(pair.en)))
      errors.push(`${path}: $...$ notation differs between fr and en`);
    else if (symbols(pair.fr) !== symbols(pair.en))
      warnings.push(`${path}: digits/logic symbols differ between fr and en`);
  }

  if (exercise.type === 'single-choice') {
    const labels = exercise.options.map((option) => option.label.en.trim());
    if (new Set(labels).size !== labels.length) warnings.push(`${exercise.id}: duplicate option labels`);
    for (const option of exercise.options) {
      const text = `${option.label.en} ${option.label.fr}`.toLowerCase();
      if (/(all|none) of the above|toutes? (les )?(r[ée]ponses|propositions)|aucune des/.test(text))
        warnings.push(`${exercise.id}/${option.id}: "all/none of the above" option`);
    }
    if (exercise.options.length < 3) warnings.push(`${exercise.id}: fewer than 3 options`);
  }
}

// The correct option should not always sit in the same position.
const positions = (bank.exercises ?? [])
  .filter((exercise) => exercise.type === 'single-choice')
  .map((exercise) => exercise.options.findIndex((option) => option.id === exercise.answer));
if (positions.length >= 3 && new Set(positions).size === 1)
  warnings.push(`correct option always at position ${positions[0] + 1}`);

if (/(^|\/)exercises\/L\d{2}\/[^/]+$/.test(argument))
  warnings.push('path is inside a published bank folder; drafts belong in exercises/drafts/<Lxx>/');

for (const warning of warnings) console.warn(`warning: ${warning}`);
for (const error of errors) console.error(`error: ${error}`);

if (errors.length) {
  console.error(`FAILED: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(
  `OK: ${bank.lessonId} draft is structurally valid (${warnings.length} warning(s)). Answer keys are NOT verified by this script: run logic-check.mjs where applicable and record a second derivation. Author self-check only; not mathematical peer review.`,
);
