import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { validateBank } from '../../scripts/check-content.ts';
import { publicExercise } from '../../src/lib/exercises/grading.ts';

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('all twelve Chapter 4 practice banks have 15 exercises, six objectives and no client answer leakage', () => {
  const releases = readJson('content/releases.json').lessons;
  for (let number = 43; number <= 54; number++) {
    const id = `L${number}`;
    const version = number >= 50 ? 1 : number === 48 || number === 44 ? 3 : 2;
    assert.equal(releases[id].version, version);
    assert.equal(releases[id].practice, true);
    assert.equal(
      releases[id].review,
      number >= 48 || number === 44 ? 'self-checked' : 'unreviewed-exception',
    );
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
      if (publicItem.type !== 'single-choice')
        throw new Error('Unexpected item');
      assert.equal('feedback' in publicItem.options[0]!, false);
    }
  }
});

test('archived Chapter 4 v2 choices preserve historical draft transcriptions (not a correctness oracle)', () => {
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
          (
            {
              yes: 'Oui',
              no: 'Non',
              equal: 'Égalité',
              first: 'Le premier',
              last: 'Le dernier',
            } as Record<string, string>
          )[expected] ?? expected;
        assert.equal(
          answerOption.label.fr.replaceAll(String.fromCharCode(36), ''),
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

test('released substitution choices assess both encoding and bit length with one valid pair', () => {
  const release = readJson('content/releases.json').lessons.L44;
  assert.equal(release.version, 3);
  const bank = validateBank(readJson(`exercises/L44/v${release.version}.json`));
  for (const item of bank.exercises) {
    assert.equal(item.type, 'single-choice');
    if (item.type !== 'single-choice') throw Error('Unexpected item');
    const table = Object.fromEntries(
      [...item.prompt.fr.matchAll(/([xyz])→([01]+)/g)].map((m) => [m[1], m[2]]),
    );
    const message = item.prompt.fr.match(/mot source ([xyz]+)/)![1]!;
    // Reconstruct from the stated table rather than trusting the stored key.
    const bits = [...message].map((s) => table[s]).join('');
    const valid = item.options.filter((o) => {
      const match = o.label.fr.match(/^([01]+) ; (\d+) bits$/);
      assert.ok(match, `${item.id}: both requested outputs must be offered`);
      assert.equal(o.label.en, o.label.fr);
      return match[1] === bits && Number(match[2]) === bits.length;
    });
    assert.deepEqual(
      valid.map((o) => o.id),
      [item.answer],
      item.id,
    );
    assert.ok(
      item.options.some(
        (o) => o.label.fr === `${bits} ; ${message.length} bits`,
      ),
      `${item.id}: distinguish source length from transmitted length`,
    );
    const projected = publicExercise(item);
    assert.equal('answer' in projected, false);
    assert.equal('explanation' in projected, false);
  }
});
