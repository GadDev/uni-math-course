import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  decodeLzw,
  encodeLzw,
  generateLzw,
  initialDictionary,
  parseCodes,
} from '../../src/lib/lzw.ts';
import { validateBank } from '../../scripts/check-content.ts';
import { publicExercise } from '../../src/lib/exercises/grading.ts';
import { chapterForPath } from '../../src/lib/chapters.ts';

test('all professor examples match their codes and completed dictionary additions', () => {
  const fixtures: [string, string, number[], string[]][] = [
    [
      'BANANABANANA',
      'ABN',
      [2, 1, 3, 5, 1, 4, 6, 6],
      ['BA', 'AN', 'NA', 'ANA', 'AB', 'BAN', 'NAN'],
    ],
    [
      'LALALALALA',
      'AL',
      [2, 1, 3, 5, 4, 1],
      ['LA', 'AL', 'LAL', 'LALA', 'ALA'],
    ],
    ['ABABABA', 'AB', [1, 2, 3, 5], ['AB', 'BA', 'ABA']],
    ['ANANAS', 'ANS', [1, 2, 4, 1, 3], ['AN', 'NA', 'ANA', 'AS']],
    ['AAAAAA', 'A', [1, 2, 3], ['AA', 'AAA']],
  ];
  for (const [message, alphabet, codes, additions] of fixtures) {
    const encoded = encodeLzw(message, alphabet);
    const decoded = decodeLzw(codes, alphabet);
    assert.deepEqual(encoded.codes, codes);
    assert.equal(decoded.message, message);
    assert.deepEqual(
      encoded.steps.flatMap((s) => (s.added ? [s.added.word] : [])),
      additions,
    );
    assert.deepEqual(
      decoded.steps.flatMap((s) => (s.added ? [s.added.word] : [])),
      additions,
    );
    assert.deepEqual(decoded.steps.at(-1)!.after, encoded.steps.at(-1)!.after);
    assert.equal(encoded.steps.at(-1)!.added, null);
    assert.ok(decoded.steps.at(-1)!.pending?.word.endsWith('?'));
    assert.equal(
      decoded.steps.at(-1)!.after.some((e) => e.word.includes('?')),
      false,
    );
  }
});

test('special decoding resolves precisely the pending entry, including repeated unary cases', () => {
  const decoded = decodeLzw([1, 2, 3, 5], 'AB');
  const special = decoded.steps[3]!;
  assert.equal(special.special, true);
  assert.deepEqual(special.pendingBefore, { code: 5, word: 'AB?' });
  assert.deepEqual(special.added, { code: 5, word: 'ABA' });
  assert.equal(special.phrase, 'ABA');
  assert.deepEqual(special.pending, { code: 6, word: 'ABA?' });
  assert.equal(
    decodeLzw([1, 2, 3], 'A').steps.filter((s) => s.special).length,
    2,
  );
  assert.equal(decodeLzw([1], 'AB').message, 'A');
});

/** Independent greedy implementation: search all dictionary words against the
 * remaining suffix rather than sharing the production character-by-character loop. */
function greedyCodes(message: string, alphabet: string) {
  const dictionary = [...alphabet];
  const codes: number[] = [];
  let offset = 0;
  while (offset < message.length) {
    const candidates = dictionary.filter((word) =>
      message.startsWith(word, offset),
    );
    const word = candidates.sort((a, b) => b.length - a.length)[0]!;
    codes.push(dictionary.indexOf(word) + 1);
    offset += word.length;
    if (offset < message.length) dictionary.push(word + message[offset]);
  }
  return codes;
}

test('all binary messages through length 10 agree with an independent greedy oracle and round-trip', () => {
  for (let size = 1; size <= 10; size++)
    for (let value = 0; value < 2 ** size; value++) {
      const message = value
        .toString(2)
        .padStart(size, '0')
        .replaceAll('0', 'A')
        .replaceAll('1', 'B');
      const encoded = encodeLzw(message, 'AB');
      assert.deepEqual(encoded.codes, greedyCodes(message, 'AB'));
      assert.equal(decodeLzw(encoded.codes, 'AB').message, message);
      // Earlier snapshots must not be mutated by future dictionary growth.
      assert.deepEqual(encoded.steps[0]!.before, [
        { code: 1, word: 'A' },
        { code: 2, word: 'B' },
      ]);
    }
});

test('generated challenges are deterministic, bounded, valid and advanced exercises include the special case', () => {
  for (const level of ['starter', 'intermediate', 'advanced'] as const) {
    for (const seed of [1, 2, 2026, 12345, 0xffffffff]) {
      const result = generateLzw(seed, level);
      assert.deepEqual(generateLzw(seed, level), result);
      assert.deepEqual(
        result.codes,
        greedyCodes(result.message, result.alphabet),
      );
      assert.equal(
        result.message.length,
        level === 'starter' ? 8 : level === 'intermediate' ? 20 : 40,
      );
      const decoded = decodeLzw(result.codes, result.alphabet);
      assert.equal(decoded.message, result.message);
      if (level === 'advanced') assert.ok(decoded.steps.some((s) => s.special));
    }
  }
  assert.notEqual(
    generateLzw(1, 'intermediate').message,
    generateLzw(2026, 'intermediate').message,
  );
});

test('invalid inputs fail explicitly, alphabet order is preserved, boundaries work', () => {
  for (const alphabet of ['', 'AA', 'aB', 'A B', 'ABCDEFGHI', '?'])
    assert.throws(() => initialDictionary(alphabet));
  for (const message of ['', 'a', 'AC', 'A'.repeat(97)])
    assert.throws(() => encodeLzw(message, 'AB'));
  assert.equal(encodeLzw('B', 'BA').codes[0], 1);
  assert.equal(encodeLzw('A'.repeat(96), 'A').message.length, 96);
  assert.equal(
    decodeLzw(encodeLzw('A'.repeat(96), 'A').codes, 'A').message.length,
    96,
  );
  for (const input of [
    '',
    '0',
    '-1',
    '1.5',
    'NaN',
    '1 x',
    '1,,',
    '9007199254740992',
  ]) {
    // A trailing separator is allowed by the UI only when whitespace; empty tokens are rejected.
    assert.throws(() => parseCodes(input));
  }
  assert.deepEqual(parseCodes(' 1, 2;3 5 '), [1, 2, 3, 5]);
  for (const codes of [
    [],
    [0],
    [1.1],
    [NaN],
    [Infinity],
    [3],
    [1, 4],
    [1, 2, 3, 6],
  ])
    assert.throws(() => decodeLzw(codes, 'AB'));
  assert.throws(() => decodeLzw(Array(97).fill(1), 'AB'));
  for (const seed of [0, -1, 1.5, NaN, Infinity, 0x100000000])
    assert.throws(() => generateLzw(seed, 'advanced'));
});

test('new banks cover all six objectives, preserve bilingual feedback, and keep answers server-side', () => {
  const correctLabels = [
    [
      'Un numéro associé à la chaîne BA',
      '2',
      'w devient AB ; aucune sortie ni ajout',
      'ABA=5',
      'Sortie 2 ; aucun ajout',
      '1 2 1 ; ajouts AB=3 et BA=4',
    ],
    [
      'B',
      'A puis B, donnant AB',
      'A?=3',
      'NA=6',
      'AB=3 complète ; B?=4 en attente',
      'La laisser incomplète, hors des entrées complètes',
    ],
    [
      '5 uniquement',
      'AB + A = ABA',
      'ABABABA',
      'Non : aucun morceau précédent',
      'Décoder puis réencoder avec le même dictionnaire initial',
      'LZW coûte 32 bits, soit 8 bits de plus',
    ],
  ];
  const releases = JSON.parse(
    readFileSync('content/releases.json', 'utf8'),
  ).lessons;
  for (const [index, id] of ['L55', 'L56', 'L57'].entries()) {
    const bank = validateBank(
      JSON.parse(
        readFileSync(`exercises/${id}/v${releases[id].version}.json`, 'utf8'),
      ),
    );
    for (const [n, exercise] of bank.exercises.entries()) {
      assert.equal(exercise.type, 'single-choice');
      if (exercise.type !== 'single-choice') throw new Error('Unexpected type');
      assert.equal(
        exercise.options.find((o) => o.id === exercise.answer)!.label.fr,
        correctLabels[index]![n],
      );
      const item = publicExercise(exercise);
      assert.equal('answer' in item, false);
      assert.equal('explanation' in item, false);
    }
  }
  assert.equal(chapterForPath('chapters/C04/lzw/')?.id, 'C04');
});

test('released ABA question matches final-flush behavior and preserves its archived identity', () => {
  const original = JSON.parse(readFileSync('exercises/L55/v1.json', 'utf8'));
  const revised = validateBank(
    JSON.parse(readFileSync('exercises/L55/v2.json', 'utf8')),
  );
  const result = encodeLzw('ABA', 'AB');
  assert.deepEqual(result.codes, [1, 2, 1]);
  assert.deepEqual(
    result.steps.flatMap((s) => (s.added ? [s.added] : [])),
    [
      { code: 3, word: 'AB' },
      { code: 4, word: 'BA' },
    ],
  );
  assert.equal(result.steps.at(-1)!.added, null);
  assert.deepEqual(
    revised.exercises.map((e) => [e.id, e.answer]),
    original.exercises.map((e: { id: string; answer: string }) => [
      e.id,
      e.answer,
    ]),
  );
});
