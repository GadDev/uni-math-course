import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

type DraftItem = {
  id: string;
  difficulty: string;
  prompt: { fr: string; en: string };
  solution: { fr: string; en: string };
  answer?: string;
  codebook?: { x: string; y: string; z: string };
  sourceWord?: string;
  bitLength?: number;
  uniquelyDecodable?: boolean;
  prefixFree?: boolean;
  distributionDenominators?: number[];
};
type DraftBank = {
  draft: boolean;
  chapterId: string;
  topicId: string;
  origin: string;
  itemCount: number;
  sourcePages: number[];
  items: DraftItem[];
};
const bankOf = (topic: string): DraftBank =>
  JSON.parse(
    readFileSync(
      new URL(`../../exercises/drafts/chapter-04/${topic}.json`, import.meta.url),
      'utf8',
    ),
  ) as DraftBank;
const fraction = (n: number, d: number) => {
  const gcd = (a: number, b: number): number =>
    b === 0 ? Math.abs(a) : gcd(b, a % b);
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const isPrefix = (book: Record<string, string>) =>
  Object.values(book).every((word, i, all) =>
    all.every((other, j) => i === j || !other.startsWith(word)),
  );

test('Chapter 4 draft bank metadata and bilingual answers', () => {
  for (let n = 1; n <= 6; n++) {
    const topic = `T0${n}`;
    const bank = bankOf(topic);
    assert.equal(bank.draft, true);
    assert.equal(bank.chapterId, 'C04');
    assert.equal(bank.topicId, topic);
    assert.equal(bank.origin, 'original-project-work');
    assert.ok(bank.sourcePages.length);
    assert.equal(bank.itemCount, 100);
    assert.equal(bank.items.length, 100);
    assert.equal(new Set(bank.items.map((item) => item.id)).size, 100);
    for (let i = 0; i < 100; i++) {
      const exercise = bank.items[i]!;
      assert.equal(exercise.id, `C04-${topic}-E${String(i + 1).padStart(3, '0')}`);
      assert.ok(['easy', 'medium', 'hard'].includes(exercise.difficulty));
      for (const locale of ['fr', 'en'] as const) {
        assert.ok(exercise.prompt[locale].trim(), exercise.id);
        assert.ok(exercise.solution[locale].trim(), exercise.id);
      }
    }
    for (const locale of ['fr', 'en'] as const) {
      const manuscript = readFileSync(
        new URL(`../../docs/content/chapter-04/drafts/${topic}/${locale}.md`, import.meta.url),
        'utf8',
      );
      assert.ok(manuscript.startsWith('# '), `${topic} ${locale}`);
      assert.ok(manuscript.includes('## 01'), `${topic} ${locale}`);
      assert.ok(manuscript.includes('## 02'), `${topic} ${locale}`);
      assert.ok(manuscript.length > 2500, `${topic} ${locale}`);
    }
  }
});

test('Encoding answers are exact concatenations', () => {
  for (const exercise of bankOf('T02').items) {
    const book = exercise.codebook!;
    const expected = [...exercise.sourceWord!]
      .map((symbol) => book[symbol as keyof typeof book])
      .join('');
    assert.equal(exercise.answer, expected, exercise.id);
    assert.equal(exercise.bitLength, expected.length, exercise.id);
    assert.ok(exercise.solution.fr.includes(expected));
    assert.ok(exercise.solution.en.includes(expected));
  }
});

test('Prefix claims and decoding examples are consistent', () => {
  const expected = [false, false, true, true, true, true, false, false, false, true];
  const prefix = [false, false, false, true, true, false, false, false, false, true];
  const items = bankOf('T03').items;
  for (let i = 0; i < 10; i++) {
    const sample = items[i * 10]!;
    assert.equal(sample.uniquelyDecodable, expected[i]);
    assert.equal(sample.prefixFree, prefix[i]);
    assert.equal(isPrefix(sample.codebook!), prefix[i]);
  }
  const collisions = [
    ['z', 'yx'],
    ['x', 'zy'],
    null,
    null,
    null,
    null,
    ['y', 'xx'],
    ['y', 'xx'],
    ['x', 'yz'],
    null,
  ] as const;
  for (let i = 0; i < 10; i++) {
    const witness = collisions[i];
    if (!witness) continue;
    const book = items[i * 10]!.codebook!;
    const code = (word: string) =>
      [...word].map((x) => book[x as keyof typeof book]).join('');
    assert.notEqual(witness[0], witness[1]);
    assert.equal(code(witness[0]), code(witness[1]));
  }
});

test('Average lengths use expected rational weights and prefix codes', () => {
  const items = bankOf('T05').items;
  for (let i = 0; i < 10; i++) {
    const first = items[i * 10]!;
    const book = first.codebook!;
    assert.equal(isPrefix(book), true);
    const x = i + 3;
    const y = i + 2;
    const z = i + 1;
    const weighted = x * book.x.length + y * book.y.length + z * book.z.length;
    assert.equal(first.answer, fraction(weighted, x + y + z));
    const total = items[i * 10 + 1]!;
    assert.equal(total.answer, String(weighted));
  }
});

test('Shannon entropy answers are exact for dyadic distributions', () => {
  const items = bankOf('T06').items;
  for (let i = 0; i < 10; i++) {
    const row = items[i * 10]!;
    const ds = row.distributionDenominators!;
    assert.ok(Math.abs(ds.reduce((s, d) => s + 1 / d, 0) - 1) < 1e-12);
    const common = Math.max(...ds);
    const h = ds.reduce((sum, d) => sum + (common / d) * Math.log2(d), 0);
    assert.equal(items[i * 10 + 3]!.answer, fraction(h, common));
    assert.equal(items[i * 10 + 8]!.answer, fraction(h, common));
  }
});
