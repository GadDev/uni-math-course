import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

for (const folder of ['exercises/L05', 'exercises/exams/C03']) {
  test(`release gate protects ${folder} and accepts a new version`, () => {
    const cwd = mkdtempSync(join(tmpdir(), 'course-versions-'));
    const script = resolve('scripts/check-immutable-exercises.ts');
    const git = (...args: string[]) =>
      execFileSync('git', args, {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }).trim();
    try {
      git('init');
      git('config', 'user.name', 'Contract test');
      git('config', 'user.email', 'test@example.invalid');
      mkdirSync(join(cwd, folder), { recursive: true });
      const v1 = join(cwd, folder, 'v1.json');
      writeFileSync(v1, '{"version":1}');
      git('add', '.');
      git('commit', '-m', 'Initial version');
      const base = git('rev-parse', 'HEAD');
      writeFileSync(join(cwd, folder, 'v2.json'), '{"version":2}');
      git('add', '.');
      git('commit', '-m', 'New version');
      const check = () =>
        spawnSync(process.execPath, [script], {
          cwd,
          encoding: 'utf8',
          env: { ...process.env, CONTENT_BASE_REF: base },
        });
      assert.equal(check().status, 0);
      writeFileSync(v1, '{"version":1,"answer":"changed"}');
      git('add', '.');
      git('commit', '-m', 'Rewrite old version');
      const rejected = check();
      assert.notEqual(rejected.status, 0);
      assert.match(
        rejected.stderr,
        /Published exercise versions are immutable/,
      );
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
}
