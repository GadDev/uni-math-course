import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const ids = ['L37', 'L38', 'L39', 'L40', 'L41', 'L42'];

for (const id of ids) {
  test(`${id} — six objectives, bilingual practice, 5/5/5 difficulties`, async () => {
    const bank = JSON.parse(
      await readFile(
        new URL(`../../exercises/${id}/v1.json`, import.meta.url),
        'utf8',
      ),
    );
    assert.equal(bank.version, 1);
    assert.equal(bank.exerciseCount, 15);
    assert.deepEqual(
      bank.exercises.reduce(
        (out: Record<string, number>, item: { difficulty: string }) => {
          out[item.difficulty] = (out[item.difficulty] ?? 0) + 1;
          return out;
        },
        {},
      ),
      { easy: 5, medium: 5, hard: 5 },
    );
    assert.equal(
      new Set(bank.exercises.map((item: { id: string }) => item.id)).size,
      15,
    );
    assert.equal(
      new Set(
        bank.exercises.map((item: { objectiveId: string }) => item.objectiveId),
      ).size,
      6,
    );
    for (const item of bank.exercises) {
      assert.equal(item.type, 'single-choice');
      assert.ok(
        item.options.some(
          (option: { id: string }) => option.id === item.answer,
        ),
      );
      assert.deepEqual(
        item.options.map(
          (option: { label: { fr: string; en: string } }) => option.label.fr,
        ),
        item.options.map(
          (option: { label: { fr: string; en: string } }) => option.label.en,
        ),
      );
      assert.ok(item.provenance.coveragePages.length > 0);
      assert.ok(item.explanation.fr && item.explanation.en);
    }
  });
}

test('L38 secant series reproduces source values and zero limit', async () => {
  const f = (x: number) => (x * x) / 2;
  const secant = (h: number) => (f(1 + h) - f(1)) / h;
  const samples: [number, number][] = [
    [2, 2],
    [1, 1.5],
    [0.5, 1.25],
    [0.25, 1.125],
    [0.1, 1.05],
    [-0.2, 0.9],
  ];
  for (const [h, slope] of samples) {
    assert.ok(
      Math.abs(secant(h) - slope) < 1e-9,
      `Unexpected slope for h=${h}`,
    );
  }
  assert.ok(Math.abs(secant(1e-5) - 1) < 1e-4);
  assert.ok(Math.abs(secant(-1e-5) - 1) < 1e-4);
  assert.ok(Number.isNaN(secant(0)), 'The quotient at h=0 is undefined, not 1');
});

test('Chapter 3 rational-function domain is explicit', async () => {
  const bank = JSON.parse(
    await readFile(
      new URL('../../exercises/L37/v1.json', import.meta.url),
      'utf8',
    ),
  );
  assert.match(bank.exercises[3].prompt.fr, /x\\(x-2\\)/);
  assert.equal(
    bank.exercises[3].options.find(
      (option: { id: string }) => option.id === bank.exercises[3].answer,
    ).label.fr,
    '$\\{0,2\\}$',
  );
});
