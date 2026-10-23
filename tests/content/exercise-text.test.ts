import test from 'node:test';
import assert from 'node:assert/strict';
import {
  exerciseTextBlocks,
  inlineTokens,
} from '../../src/lib/exercise-text.ts';
import { coreFirst, exerciseScope } from '../../src/lib/exercise-scope.ts';
import { readFileSync } from 'node:fs';

test('authored truth-table prompts retain four rows and prose around the table', () => {
  for (const id of ['L03', 'L08']) {
    const release = JSON.parse(readFileSync('content/releases.json', 'utf8'))
      .lessons[id];
    const bank = JSON.parse(
      readFileSync(`exercises/${id}/v${release.version}.json`, 'utf8'),
    );
    const exercise = bank.exercises.find(
      (e: { id: string }) => e.id === (id === 'L03' ? 'L03-E05' : 'L08-E01'),
    );
    for (const locale of ['fr', 'en']) {
      const blocks = exerciseTextBlocks(exercise.prompt[locale]);
      const tables = blocks.filter((block) => block.kind === 'table');
      assert.equal(tables.length, 1);
      assert.equal(tables[0]!.rows.length, 4);
      assert.equal(tables[0]!.headers.length, 3);
      assert.deepEqual(
        tables[0]!.rows.map((row) => row.slice(0, 2)),
        [
          ['0', '0'],
          ['0', '1'],
          ['1', '0'],
          ['1', '1'],
        ],
      );
      assert.ok(
        blocks.some((block) => block.kind === 'text' && block.text.trim()),
      );
    }
  }
});

test('code is literal, math remains a separate token, and HTML is never parsed', () => {
  assert.deepEqual(
    inlineTokens('`x < y` and $x^2$ **why** <img onerror=bad>'),
    [
      { kind: 'code', text: 'x < y' },
      { kind: 'text', text: ' and ' },
      { kind: 'math', text: 'x^2' },
      { kind: 'text', text: ' ' },
      { kind: 'strong', text: 'why' },
      { kind: 'text', text: ' <img onerror=bad>' },
    ],
  );
  assert.equal(
    exerciseTextBlocks('| x | y |\n| not a separator | here |\n| 0 | 1 |')[0]!
      .kind,
    'text',
  );
});

test('core-first ordering retains every ID and lets explicit extension targets survive', () => {
  const items = ['L35-E01', 'L35-E02', 'L35-E15', 'L35-E05'].map((id) => ({
    id,
    lessonId: 'L35',
  }));
  assert.deepEqual(
    coreFirst(items).map((e) => e.id),
    ['L35-E02', 'L35-E05', 'L35-E01', 'L35-E15'],
  );
  assert.equal(items[0]!.id, 'L35-E01');
  assert.equal(
    coreFirst(items).find((e) => e.id === 'L35-E15'),
    items[2],
  );
  assert.equal(exerciseScope('L36', 'L36-E11'), 'extension');
  assert.equal(exerciseScope('L05', 'L05-E01'), 'core');
});
