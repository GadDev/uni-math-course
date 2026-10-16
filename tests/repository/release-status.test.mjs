import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  releaseStatus,
  replaceStatus,
} from '../../scripts/sync-release-status.mjs';

const registry = {
  lessons: {
    L01: {
      review: 'unreviewed-exception',
      translation: { review: 'unreviewed-exception' },
    },
    L05: { review: 'self-checked', translation: { review: 'self-checked' } },
  },
};

test('status reports mathematical and translation review separately without changing release policy', () => {
  const copy = structuredClone(registry);
  copy.lessons.L05.translation.review = 'unreviewed-exception';
  const status = releaseStatus(copy);
  assert.match(status, /2 public bilingual lessons; 2 served practice banks/);
  assert.match(
    status,
    /Mathematical author self-check: L05; explicit unreviewed release exceptions: 1 banks/,
  );
  assert.match(
    status,
    /Translation self-check: none; explicit unreviewed translation exceptions: 2 lesson pairs/,
  );
  assert.equal(copy.lessons.L01.review, 'unreviewed-exception');
});

test('withdrawal changes the generated practice scope without dropping public translation status', () => {
  const copy = structuredClone(registry);
  copy.lessons.L01.practice = false;
  assert.match(
    releaseStatus(copy),
    /2 public bilingual lessons; 1 served practice banks/,
  );
  assert.match(
    releaseStatus(copy),
    /unreviewed translation exceptions: 1 lesson pairs/,
  );
});

test('stale summaries are replaced without rewriting surrounding documentation', () => {
  const previous = releaseStatus(registry);
  const updated = structuredClone(registry);
  updated.lessons.L01.review = 'self-checked';
  const text = `Before\n${previous}\nAfter\n`;
  const result = replaceStatus(text, releaseStatus(updated));
  assert.notEqual(result, text);
  assert.equal(result, `Before\n${releaseStatus(updated)}\nAfter\n`);
  assert.equal(replaceStatus(result, releaseStatus(updated)), result);
});

test('removing, duplicating or reversing generated status markers cannot bypass the gate', () => {
  const status = releaseStatus(registry);
  assert.throws(() => replaceStatus('No block', status), /start marker/);
  assert.throws(() => replaceStatus(status + status, status), /start marker/);
  assert.throws(
    () => replaceStatus('<!-- release-status:start -->', status),
    /end marker/,
  );
  assert.throws(
    () =>
      replaceStatus(
        '<!-- release-status:end --><!-- release-status:start -->',
        status,
      ),
    /reversed/,
  );
});

test('documentation gate fails on registry drift and explicit sync repairs only status blocks', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'release-status-'));
  const script = fileURLToPath(
    new URL('../../scripts/sync-release-status.mjs', import.meta.url),
  );
  const run = (...args) =>
    promisify(execFile)(process.execPath, [script, ...args], {
      cwd: directory,
    });
  try {
    await mkdir(join(directory, 'content'));
    await mkdir(join(directory, 'docs'));
    await writeFile(
      join(directory, 'content/releases.json'),
      JSON.stringify(registry),
    );
    const original = `Before\n${releaseStatus(registry)}\nAfter\n`;
    for (const path of ['README.md', 'AGENTS.md', 'docs/ROADMAP.md'])
      await writeFile(join(directory, path), original);
    await run();
    const updated = structuredClone(registry);
    updated.lessons.L01.practice = false;
    await writeFile(
      join(directory, 'content/releases.json'),
      JSON.stringify(updated),
    );
    await assert.rejects(run(), /stale release status/);
    assert.equal(
      await readFile(join(directory, 'README.md'), 'utf8'),
      original,
    );
    await run('--write');
    await run();
    assert.equal(
      await readFile(join(directory, 'README.md'), 'utf8'),
      `Before\n${releaseStatus(updated)}\nAfter\n`,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
