import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
  assert.equal(state.updated, 1);
  messages.unshift('fix: clarify the saved feedback');
  await run();
  assert.equal(state.created, 1);
  assert.equal(state.updated, 2);
});

test('the archived manual changelog is byte-for-byte the bootstrap source', async () => {
  const archived = await read('docs/releases/PRE_AUTOMATION.md');
  const digest = createHash('sha256').update(archived).digest('hex');
  assert.equal(
    digest,
    '0fc39cb3e16e251bcc443c965f29acd84d820211e62f673b828a0132541bb6bf',
  );
});

test('release credentials and mutations require successful preflight output', async () => {
  const yaml = require('js-yaml');
  const workflow = yaml.load(
    await read('.github/workflows/release-please.yml'),
  );
  const steps = workflow.jobs.release.steps;
  const preflight = steps.find((step) => step.id === 'preflight');
  assert.ok(preflight.run.includes('require_docs'));
  assert.notEqual(preflight['continue-on-error'], true);
  const mutations = steps.filter(
    (step) => step.id === 'app' || step.id === 'release',
  );
  assert.equal(mutations.length, 2);
  for (const step of mutations) {
    assert.equal(step.if, "steps.preflight.outputs.release == 'true'");
    assert.ok(steps.indexOf(step) > steps.indexOf(preflight));
  }
});

test('release preflight skips superseded revisions and fails closed on unchecked SHAs', async (t) => {
  const yaml = require('js-yaml');
  const workflow = yaml.load(
    await read('.github/workflows/release-please.yml'),
  );
  const script = workflow.jobs.release.steps.find((step) =>
    step.run?.includes('require_docs'),
  ).run;
  const directory = await mkdtemp(join(tmpdir(), 'release-preflight-'));
  try {
    await writeFile(
      join(directory, 'gh'),
      `#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
const args = process.argv.join(' ');
appendFileSync(process.env.PREFLIGHT_TRACE, args + '\\n');
if (args.includes('git/ref/heads/main')) {
  if (process.env.MAIN_LOOKUP_FAILURE === 'true') process.exit(2);
  console.log('a'.repeat(40));
}
else if (args.includes('/pulls?')) console.log('b'.repeat(40));
else if (args.includes('/commits/')) console.log(args.includes(process.env.UNCHECKED_SHA || 'not-a-sha') ? process.env.DOCS_RESULT : 'true');
else process.exit(2);
`,
      { mode: 0o755 },
    );
    const run = async (extra = {}) => {
      for (const name of ['output', 'summary', 'trace'])
        await writeFile(join(directory, name), '');
      const result = spawnSync('bash', ['-c', script], {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          PATH: directory + ':' + process.env.PATH,
          GITHUB_REPOSITORY: 'GadDev/uni-math-course',
          GITHUB_SHA: 'a'.repeat(40),
          GH_TOKEN: '',
          GITHUB_OUTPUT: join(directory, 'output'),
          GITHUB_STEP_SUMMARY: join(directory, 'summary'),
          PREFLIGHT_TRACE: join(directory, 'trace'),
          UNCHECKED_SHA: '',
          DOCS_RESULT: 'false',
          MAIN_LOOKUP_FAILURE: 'false',
          ...extra,
        },
      });
      return {
        ...result,
        output: await readFile(join(directory, 'output'), 'utf8'),
        summary: await readFile(join(directory, 'summary'), 'utf8'),
        calls: (await readFile(join(directory, 'trace'), 'utf8'))
          .trim()
          .split('\n'),
      };
    };
    await t.test(
      'superseded revision succeeds without release permission or further API calls',
      async () => {
        const stale = await run({ GITHUB_SHA: 'c'.repeat(40) });
        assert.equal(stale.status, 0, stale.stdout + stale.stderr);
        assert.equal(stale.output, 'release=false\n');
        assert.match(stale.stdout, /::notice::Superseded revision/);
        assert.match(stale.summary, /skipped release work/);
        assert.equal(stale.calls.length, 1);
        assert.match(stale.calls[0], /git\/ref\/heads\/main/);
      },
    );
    for (const result of ['false', 'null']) {
      await t.test(
        'current main with unsuccessful or missing docs: ' + result,
        async () => {
          const unchecked = await run({
            UNCHECKED_SHA: 'a'.repeat(40),
            DOCS_RESULT: result,
          });
          assert.notEqual(unchecked.status, 0);
          assert.match(
            unchecked.stdout,
            /successful docs check for exact SHA a/,
          );
          assert.equal(unchecked.output, '');
        },
      );
    }
    await t.test(
      'unchecked pending release cannot borrow newer main checks',
      async () => {
        const unchecked = await run({ UNCHECKED_SHA: 'b'.repeat(40) });
        assert.notEqual(unchecked.status, 0);
        assert.match(unchecked.stdout, /successful docs check for exact SHA b/);
        assert.equal(unchecked.output, '');
      },
    );
    await t.test(
      'API lookup failure remains an error rather than a superseded skip',
      async () => {
        const failed = await run({ MAIN_LOOKUP_FAILURE: 'true' });
        assert.notEqual(failed.status, 0);
        assert.equal(failed.output, '');
        assert.doesNotMatch(failed.stdout, /Superseded revision/);
      },
    );
    await t.test(
      'checked current main and pending release authorize release work',
      async () => {
        const checked = await run();
        assert.equal(checked.status, 0, checked.stdout + checked.stderr);
        assert.equal(checked.output, 'release=true\n');
        assert.match(checked.stdout, /Release policy checked/);
        assert.equal(checked.calls.length, 4);
      },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
