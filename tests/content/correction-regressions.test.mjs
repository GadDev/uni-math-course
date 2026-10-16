import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBank, itemOf } from '../support/logic.mjs';

const keyOption = (item) => item.options.find((o) => o.id === item.answer);

test('L03 separates a false formula row from an incorrectly written row', async () => {
  const item = itemOf(await loadBank('L03'), 'L03-E05');
  const correct = [1, 0, 1, 1];
  const written = [1, 0, 1, 0];
  const rows = ['00', '01', '10', '11'];
  assert.deepEqual(
    rows.filter((_, i) => !correct[i]),
    ['01'],
  );
  assert.deepEqual(
    rows.filter((_, i) => correct[i] !== written[i]),
    ['11'],
  );
  assert.match(item.prompt.fr, /valeur écrite.*incorrecte/);
  assert.match(keyOption(item).label.en, /11/);
});

test('L19 general adjacent-pair count includes zero and singleton lengths', async () => {
  const item = itemOf(await loadBank('L19'), 'L19-E03');
  assert.match(keyOption(item).label.en, /max\(n-1,0\)/);
  for (let n = 0; n <= 12; n++) {
    const indices = Array.from({ length: n }, (_, i) => i);
    const starts = indices.filter((i) => i + 1 < n);
    assert.equal(starts.length, Math.max(n - 1, 0));
  }
});

test('L19 maximum certificate rejects a fixed nonmaximal index', async () => {
  const item = itemOf(await loadBank('L19'), 'L19-E05');
  assert.match(item.prompt.en, /fixed index/);
  assert.match(keyOption(item).label.en, /forall j.*t\[j\].*leq.*t\[i\]/);
  const t = [1, 3, 2];
  const certificate = (i) => t.every((value) => value <= t[i]);
  assert.equal(certificate(0), false);
  assert.equal(certificate(1), true);
  assert.equal(
    t.some((value) => value <= t[0]),
    true,
  );
  assert.equal(
    t.every((value) => value >= t[0]),
    true,
  );
  assert.equal(
    t.every((value) => value < t[1]),
    false,
  );
});

test('L19 displayed correct positions vary while semantic option IDs stay stable', async () => {
  const bank = await loadBank('L19');
  const positions = bank.exercises.map((item) =>
    item.options.findIndex((option) => option.id === item.answer),
  );
  assert.ok(new Set(positions).size >= 3);
});
