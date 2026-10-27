import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { validateBank } from '../../scripts/check-content.ts';
import { publicExercise } from '../../src/lib/exercises/grading.ts';

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('all seven Chapter 4 practice banks have 15 exercises, six objectives and no client answer leakage', () => {
  const releases = readJson('content/releases.json').lessons;
  for (let number = 43; number <= 49; number++) {
    const id = `L${number}`;
    const version = number === 49 ? 1 : 2;
    assert.equal(releases[id].version, version);
    assert.equal(releases[id].practice, true);
    assert.equal(releases[id].review, 'unreviewed-exception');
    const bank = validateBank(readJson(`exercises/${id}/v${version}.json`));
    assert.equal(bank.exerciseCount, 15);
    assert.equal(bank.exercises.length, 15);
    assert.equal(new Set(bank.exercises.map((e) => e.id)).size, 15);
    assert.equal(new Set(bank.exercises.map((e) => e.objectiveId)).size, 6);
    assert.equal(new Set(bank.exercises.map((e) => e.answer)).size, 3);
    for (const exercise of bank.exercises) {
      assert.equal(exercise.type, 'single-choice');
      if (exercise.type !== 'single-choice') throw new Error('Unexpected item');
      const correct = exercise.options.find((o) => o.id === exercise.answer);
      assert.ok(correct, `${exercise.id}: answer option must exist`);
      const publicItem = publicExercise(exercise);
      assert.equal('answer' in publicItem, false);
      assert.equal('explanation' in publicItem, false);
      if (publicItem.type !== 'single-choice') throw new Error('Unexpected item');
      assert.equal('feedback' in publicItem.options[0]!, false);
    }
  }
});

test('Chapter 4 v2 choices agree with their bilingual worked exercise sources', () => {
  for (let n = 1; n <= 6; n++) {
    const bank = readJson(`exercises/L${n + 42}/v2.json`);
    const draft = readJson(`exercises/drafts/chapter-04/T0${n}.json`);
    for (const exercise of bank.exercises) {
      const original = draft.items.find(
        (item: { prompt: { fr: string } }) =>
          item.prompt.fr === exercise.prompt.fr,
      );
      assert.ok(original, `${exercise.id}: missing draft source`);
      const answerOption = exercise.options.find(
        (option: { id: string }) => option.id === exercise.answer,
      );
      assert.ok(answerOption);
      assert.deepEqual(answerOption.feedback, original.solution);
      if (n === 3) {
        const actual = original.prompt.fr.includes('préfixe')
          ? original.prefixFree
          : original.uniquelyDecodable;
        assert.equal(answerOption.label.fr, actual ? 'Oui' : 'Non');
      } else {
        const expected = String(original.answer);
        const expectedLabel =
          ({
            yes: 'Oui',
            no: 'Non',
            equal: 'Égalité',
            first: 'Le premier',
            last: 'Le dernier',
          } as Record<string, string>)[expected] ?? expected;
        assert.equal(
          answerOption.label.fr.replaceAll('
      }
    }
  }
});

test('the original Huffman example combines weights and yields a prefix code', () => {
  const bank = readJson('exercises/drafts/chapter-04/T07.json');
  assert.equal(bank.items.length, 100);
  assert.equal(
    new Set(bank.items.map((item: { id: string }) => item.id)).size,
    100,
  );
  const fixture = bank.items[0];
  assert.deepEqual(fixture.codebook, {
    A: '0',
    B: '10',
    C: '110',
    D: '111',
  });
  const codes = Object.values(fixture.codebook) as string[];
  for (const x of codes) {
    for (const y of codes) {
      if (x !== y) assert.equal(y.startsWith(x), false);
    }
  }
  const words = [8, 4, 2, 2];
  const lengths = codes.map((word) => word.length);
  assert.equal(
    words.reduce((sum, count, i) => sum + count * lengths[i]!, 0),
    28,
  );
  assert.equal(bank.items[7].answer, '7/4');
});
, ''),
          expectedLabel,
          exercise.id,
        );
      }
    }
  }
});

test('the original Huffman example combines weights and yields a prefix code', () => {
  const bank = readJson('exercises/drafts/chapter-04/T07.json');
  assert.equal(bank.items.length, 100);
  assert.equal(new Set(bank.items.map((item: { id: string }) => item.id)).size, 100);
  const fixture = bank.items[0];
  assert.deepEqual(fixture.codebook, {
    A: '0',
    B: '10',
    C: '110',
    D: '111',
  });
  const codes = Object.values(fixture.codebook) as string[];
  for (const x of codes) {
    for (const y of codes) {
      if (x !== y) assert.equal(y.startsWith(x), false);
    }
  }
  const words = [8, 4, 2, 2];
  const lengths = codes.map((word) => word.length);
  assert.equal(
    words.reduce((sum, count, i) => sum + count * lengths[i]!, 0),
    28,
  );
  assert.equal(bank.items[7].answer, '7/4');
});
