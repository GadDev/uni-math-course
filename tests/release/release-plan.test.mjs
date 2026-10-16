import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { test } from 'node:test';

const require = createRequire(
  new URL('../../tools/release/package.json', import.meta.url),
);
const { Manifest, setLogger } = require('release-please');
setLogger({ debug() {}, info() {}, warn() {}, error() {} });
const root = new URL('../../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const config = JSON.parse(await read('release-please-config.json'));
const pkg = JSON.parse(await read('package.json'));
const changelog =
  '# Changelog\n\nRelease history.\n\n## [Unreleased]\n\nPending notes.\n';
const manifestText = '{".":"0.0.0"}';

function commit(message, sha = 'a'.repeat(40)) {
  return { sha, message, files: ['src/example.ts'] };
}

async function plan(messages, previous) {
  const state = { created: 0, updated: 0, pr: null };
  const files = {
    'release-please-config.json': JSON.stringify(config),
    '.release-please-manifest.json': previous
      ? JSON.stringify({ '.': previous })
      : manifestText,
    'package.json': JSON.stringify({ ...pkg, version: previous ?? '0.0.0' }),
    'CHANGELOG.md': changelog,
  };
  // This in-memory SCM has no credentials or network methods. Exercise the real
  // Manifest/config parser and release strategy, not a duplicate bump algorithm.
  const github = {
    repository: { owner: 'GadDev', repo: 'uni-math-course' },
    async getFileJson(path) {
      assert.ok(path in files, 'Unexpected JSON read: ' + path);
      return JSON.parse(files[path]);
    },
    async getFileContentsOnBranch(path) {
      assert.ok(path in files, 'Unexpected file read: ' + path);
      return {
        parsedContent: files[path],
        content: Buffer.from(files[path]).toString('base64'),
        sha: 'fixture',
      };
    },
    async *releaseIterator() {
      if (previous)
        yield {
          tagName: 'v' + previous,
          sha: 'b'.repeat(40),
          notes: 'previous release',
        };
    },
    async *tagIterator() {},
    async *pullRequestIterator(_branch, status) {
      if (status === 'OPEN' && state.pr) yield state.pr;
    },
    async createPullRequest(pr) {
      state.created++;
      state.pr = { ...pr, number: 901 };
      return 901;
    },
    async updatePullRequest(number, candidate) {
      state.updated++;
      state.pr.body = candidate.body.toString();
      return number;
    },
    async *mergeCommitIterator() {
      for (const message of messages) yield commit(message);
      if (previous)
        yield commit('chore(main): release ' + previous, 'b'.repeat(40));
      yield commit(
        'feat: historical content already archived',
        config['bootstrap-sha'],
      );
      yield commit('feat: older content must not be replayed', 'c'.repeat(40));
    },
  };
  const manifest = await Manifest.fromManifest(github, 'main');
  return {
    candidates: await manifest.buildPullRequests(),
    files,
    github,
    state,
  };
}

function update(candidate, path, content) {
  const change = candidate.updates.find((item) => item.path === path);
  assert.ok(change, 'Missing update: ' + path);
  return change.updater.updateContent(content);
}

test('bootstrap proposes 0.1.0, preserves private package and excludes archived commits', async () => {
  const { candidates, files } = await plan([
    'fix: preserve the saved response',
  ]);
  assert.equal(candidates.length, 1);
  const candidate = candidates[0];
  assert.equal(candidate.version.toString(), '0.1.0');
  const nextPackage = JSON.parse(
    update(candidate, 'package.json', files['package.json']),
  );
  assert.equal(nextPackage.version, '0.1.0');
  assert.equal(nextPackage.private, true);
  assert.equal(
    JSON.parse(
      update(candidate, '.release-please-manifest.json', manifestText),
    )['.'],
    '0.1.0',
  );
  const notes = update(candidate, 'CHANGELOG.md', changelog);
  assert.match(notes, /preserve the saved response/);
  assert.doesNotMatch(
    notes,
    /historical content already archived|older content must not be replayed/,
  );
  assert.ok(
    notes.endsWith(changelog.slice(changelog.indexOf('\n## [Unreleased]'))),
  );
  assert.equal(notes.match(/^# Changelog$/gm).length, 1);
});

test('pre-1.0 fixes, features and breaking changes follow the project policy', async () => {
  for (const [message, expected] of [
    ['fix: correct feedback', '0.1.1'],
    ['feat: add a lesson', '0.2.0'],
    [
      'fix!: change the attempt contract\n\nBREAKING CHANGE: clients must reload',
      '0.2.0',
    ],
  ]) {
    const { candidates } = await plan([message], '0.1.0');
    assert.equal(candidates[0].version.toString(), expected);
  }
});

test('ordinary documentation and maintenance commits do not create release PRs', async () => {
  const { candidates } = await plan([
    'docs: explain setup',
    'ci: refresh checks',
    'chore: tidy tooling',
  ]);
  assert.deepEqual(candidates, []);
});

test('repeated planning uses one stable release branch', async () => {
  const first = await plan(['feat: add another lesson']);
  const second = await plan([
    'feat: add another lesson',
    'fix: clarify feedback',
  ]);
  assert.equal(first.candidates.length, 1);
  assert.equal(second.candidates.length, 1);
  assert.equal(
    first.candidates[0].headRefName,
    second.candidates[0].headRefName,
  );
});

test('retries reuse the open PR and later eligible commits update it', async () => {
  const messages = ['feat: add a lesson'];
  const { github, state } = await plan(messages);
  const run = async () =>
    (await Manifest.fromManifest(github, 'main')).createPullRequests();
  await run();
  await run();
  assert.equal(state.created, 1);
  assert.equal(state.updated, 0);
  messages.unshift('fix: clarify the saved feedback');
  await run();
  assert.equal(state.created, 1);
  assert.equal(state.updated, 1);
});

test('the archived manual changelog is byte-for-byte the bootstrap source', async () => {
  const archived = await read('docs/releases/PRE_AUTOMATION.md');
  const digest = createHash('sha256').update(archived).digest('hex');
  assert.equal(
    digest,
    '0fc39cb3e16e251bcc443c965f29acd84d820211e62f673b828a0132541bb6bf',
  );
});
