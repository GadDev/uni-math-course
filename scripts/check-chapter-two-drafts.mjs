import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import katex from 'katex';
import { validateBank } from './check-content.mjs';
const root = 'exercises/drafts';
const mathStrings = (t) => [...t.matchAll(/\$([^$\n]+)\$/g)].map((m) => m[1]);
function pairs(v) {
  if (!v || typeof v !== 'object') return [];
  if (typeof v.fr === 'string' && typeof v.en === 'string') return [v];
  return Object.values(v).flatMap(pairs);
}
const ids = (await fs.readdir(root))
  .filter((x) => /^L(2[1-9]|3[0-6])$/.test(x))
  .sort();
assert.equal(ids.length, 16, 'Chapter 2 requires all 16 lesson drafts');
for (const id of ids) {
  const dir = `${root}/${id}`;
  const bank = validateBank(
    JSON.parse(await fs.readFile(`${dir}/v1.draft.json`, 'utf8')),
  );
  assert.equal(bank.exerciseCount, 15);
  for (const d of ['easy', 'medium', 'hard'])
    assert.equal(bank.exercises.filter((e) => e.difficulty === d).length, 5);
  const spec = JSON.parse(await fs.readFile(`${dir}/lesson-spec.json`, 'utf8'));
  const lessons = await Promise.all(
    ['fr', 'en'].map((l) => fs.readFile(`${dir}/${l}.md`, 'utf8')),
  );
  assert.deepEqual(
    mathStrings(lessons[0]),
    mathStrings(lessons[1]),
    `${id} lesson notation`,
  );
  assert.equal(
    (lessons[0].match(/^## /gm) || []).length,
    (lessons[1].match(/^## /gm) || []).length,
  );
  for (const text of lessons) {
    assert.ok(text.includes(`lessonId: ${id}`));
    assert.ok(text.includes(`sourcePages: [${spec.pages.join(', ')}]`));
    for (const formula of mathStrings(text))
      katex.renderToString(formula, { throwOnError: true });
  }
  for (const p of pairs(bank)) {
    assert.deepEqual(mathStrings(p.fr), mathStrings(p.en), `${id}: ${p.fr}`);
    for (const formula of mathStrings(p.fr))
      katex.renderToString(formula, { throwOnError: true });
  }
  for (const lang of ['fr', 'en'])
    for (const e of bank.exercises) {
      assert.equal(new Set(e.options.map((o) => o.label[lang])).size, 3);
      assert.ok(e.hint[lang].length > 15);
    }
  const checks = JSON.parse(
    await fs.readFile(`${dir}/answer-checks.json`, 'utf8'),
  );
  assert.deepEqual(
    checks.map((x) => x.id),
    bank.exercises.map((x) => x.id),
  );
  console.log(`${id}: 15 items, 5/5/5, bilingual notation and KaTeX valid.`);
}
console.log(
  `Validated ${ids.length} lesson drafts; keys require separate mathematical checking.`,
);
