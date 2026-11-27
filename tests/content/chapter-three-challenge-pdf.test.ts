import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

type Question = { id: string; prompt: string };
const source = JSON.parse(
  readFileSync('scripts/data/chapter-03-challenges-en.json', 'utf8'),
) as { exams: { number: number; questions: Question[] }[] };

test('English Chapter 3 challenge PDF contains all original questions, without worked answers', () => {
  const pdf = readFileSync(
    'public/pdfs/exercises/chapter-03-challenge-exercises-en.pdf',
    'latin1',
  );
  // The reproducible builder deliberately uses uncompressed text streams.
  // Inspect the delivered PDF, not merely its filename, ID count or hash.
  const text = [...pdf.matchAll(/\(((?:\\.|[^\\)])*)\) Tj/g)]
    .map((match) =>
      match[1]!
        .replace(/\\([0-7]{1,3})/g, (_, octal: string) =>
          String.fromCharCode(parseInt(octal, 8)),
        )
        .replace(/\\([\\()])/g, '$1'),
    )
    .join(' ')
    .replace(/\s+/g, ' ');
  const ids = text.match(/L\d{2}-P\d{3}/g) ?? [];
  const expected = source.exams.flatMap((exam) => exam.questions);
  assert.equal(source.exams.length, 3);
  assert.equal(expected.length, 72);
  assert.equal(new Set(expected.map((question) => question.id)).size, 72);
  assert.deepEqual(
    ids,
    expected.map((question) => question.id),
  );
  for (const exam of source.exams) {
    assert.equal(exam.questions.length, 24);
    for (let lesson = 37; lesson <= 42; lesson++) {
      assert.equal(
        exam.questions.filter((question) =>
          question.id.startsWith(`L${lesson}`),
        ).length,
        4,
      );
    }
  }
  for (const question of expected) {
    assert.ok(
      text.includes(question.prompt.replaceAll('’', "'")),
      'Missing or replaced question stem: ' + question.id,
    );
  }
  assert.doesNotMatch(
    text,
    /The denominator is zero for x|By the chain rule D|Hence f|Domain: all real numbers|exponential is one-to-one, so/,
    'The question document must not contain the previously substituted answers',
  );
  assert.equal((pdf.match(/\/Type\s*\/Page\b/g) ?? []).length, 22);
});
