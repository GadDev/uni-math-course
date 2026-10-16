import test from 'node:test';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { cases, prepareCase } from './evals/prepare-math-course-studio.mjs';
import { validateBank } from '../../scripts/check-content.mjs';

const sourcePath = new URL('../../exercises/L05/v1.json', import.meta.url);

test('behavioural fixtures preserve the source and isolate meaningful semantic faults', async () => {
  const before = await readFile(sourcePath, 'utf8');
  assert.equal(new Set(cases.map((entry) => entry.id)).size, 6);
  for (const id of ['bilingual-mismatch', 'wrong-key']) {
    const prepared = await prepareCase(id);
    try {
      const bank = JSON.parse(
        await readFile(
          join(prepared.directory, 'exercises/L05/v1.json'),
          'utf8',
        ),
      );
      validateBank(bank); // Both faults deliberately pass schema validation.
      const validated = execFileSync(
        'node',
        [
          join(
            prepared.directory,
            '.claude/skills/math-course-studio/scripts/validate-draft.mjs',
          ),
          join(prepared.directory, 'exercises/L05/v1.json'),
        ],
        { cwd: prepared.directory, encoding: 'utf8' },
      );
      assert.match(validated, /NOT verified/);
      assert.match(prepared.skillSha256, /^[a-f0-9]{64}$/);
      assert.equal(
        execFileSync('git', ['rev-parse', 'origin/main'], {
          cwd: prepared.directory,
          encoding: 'utf8',
        }).trim(),
        prepared.fixtureBaseCommit,
      );
      assert.equal(
        execFileSync(
          'git',
          ['diff', '--name-only', 'origin/main', '--', 'exercises', 'content'],
          { cwd: prepared.directory, encoding: 'utf8' },
        ),
        '',
      );
      await assert.rejects(
        stat(
          join(
            prepared.directory,
            'tests/claude/evals/math-course-studio/cases.json',
          ),
        ),
        { code: 'ENOENT' },
      );
      if (id === 'bilingual-mismatch') {
        assert.match(bank.exercises[0].prompt.fr, /fausse/);
        assert.match(bank.exercises[0].prompt.en, /true/);
      } else {
        const row = bank.exercises[1].rows.find((entry) => entry.id === '10');
        assert.notEqual(bank.exercises[1].answer[row.id], !row.A || row.B);
      }
    } finally {
      await rm(prepared.directory, { recursive: true, force: true });
    }
  }
  assert.equal(await readFile(sourcePath, 'utf8'), before);
});
