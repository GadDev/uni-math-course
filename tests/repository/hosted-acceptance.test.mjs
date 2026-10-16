import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { hostedSettings } from '../hosted/settings.ts';

const names = [
  'HOSTED_LOCAL_FIXTURE',
  'HOSTED_BASE_URL',
  'HOSTED_ALLOW_TEST_WRITES',
  'HOSTED_ACCOUNT_A_EMAIL',
  'HOSTED_ACCOUNT_A_PASSWORD',
  'HOSTED_ACCOUNT_B_EMAIL',
  'HOSTED_ACCOUNT_B_PASSWORD',
  'HOSTED_APP_SHA',
  'HOSTED_DEPLOYMENT_ID',
  'HOSTED_OPERATOR',
  'HOSTED_SUPABASE_URL',
  'HOSTED_SUPABASE_PUBLISHABLE_KEY',
];
const valid = {
  HOSTED_BASE_URL: 'https://acceptance.example.invalid',
  HOSTED_ALLOW_TEST_WRITES: '1',
  HOSTED_ACCOUNT_A_EMAIL: 'a@example.invalid',
  HOSTED_ACCOUNT_A_PASSWORD: 'synthetic-test-only-a',
  HOSTED_ACCOUNT_B_EMAIL: 'b@example.invalid',
  HOSTED_ACCOUNT_B_PASSWORD: 'synthetic-test-only-b',
  HOSTED_APP_SHA: 'a'.repeat(40),
  HOSTED_DEPLOYMENT_ID: 'synthetic-deployment',
  HOSTED_OPERATOR: 'test-operator',
};
function withEnv(env, run) {
  const before = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );
  for (const name of names) delete process.env[name];
  Object.assign(process.env, env);
  try {
    run();
  } finally {
    for (const name of names) {
      if (before[name] === undefined) delete process.env[name];
      else process.env[name] = before[name];
    }
  }
}

test('hosted runner requires target identity, two accounts and explicit write consent', () => {
  for (const name of Object.keys(valid)) {
    const env = { ...valid };
    delete env[name];
    withEnv(env, () => assert.throws(hostedSettings));
  }
  withEnv({ ...valid, HOSTED_ACCOUNT_B_EMAIL: 'A@example.invalid' }, () =>
    assert.throws(hostedSettings),
  );
  withEnv(valid, () => assert.equal(hostedSettings().localFixture, false));
});

test('hosted runner rejects ambiguous origins and privileged Data API credentials', () => {
  for (const url of [
    'http://acceptance.example.invalid',
    'https://user:pass@example.invalid',
    'https://example.invalid/fr/',
    'https://example.invalid/?token=private',
    'https://example.invalid/#fragment',
  ])
    withEnv({ ...valid, HOSTED_BASE_URL: url }, () =>
      assert.throws(hostedSettings),
    );
  for (const key of [
    'sb_secret_never-accepted',
    'eyJlegacy-service-role',
    'sb_publishable_ invalid',
  ])
    withEnv(
      {
        ...valid,
        HOSTED_SUPABASE_URL: 'https://data.example.invalid',
        HOSTED_SUPABASE_PUBLISHABLE_KEY: key,
      },
      () => assert.throws(hostedSettings),
    );
  withEnv(
    { ...valid, HOSTED_SUPABASE_URL: 'https://data.example.invalid' },
    () => assert.throws(hostedSettings),
  );
});

test('fixture mode never uses hosted credentials or a real Data API project', () => {
  withEnv({ HOSTED_LOCAL_FIXTURE: '1' }, () => {
    const result = hostedSettings();
    assert.equal(result.origin, 'http://127.0.0.1:4321');
    assert.equal(result.appSha, 'local-fixture');
    assert.match(result.a.email, /@example.invalid$/);
  });
  withEnv(
    {
      ...valid,
      HOSTED_LOCAL_FIXTURE: '1',
      HOSTED_SUPABASE_URL: 'https://data.example.invalid',
      HOSTED_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    },
    () => assert.throws(hostedSettings),
  );
});

test('acceptance reporter omits error values, attachments and browser output', () => {
  const directory = mkdtempSync(join(tmpdir(), 'hosted-report-'));
  const reporterUrl = new URL('../hosted/reporter.ts', import.meta.url).href;
  try {
    const script = `
      const { default: Reporter } = await import(${JSON.stringify(reporterUrl)});
      const reporter = new Reporter();
      reporter.onTestEnd({title:'H3 synthetic check'}, {status:'failed', errors:[{message:'PRIVATE_SENTINEL'}], attachments:[{body:'PRIVATE_SENTINEL'}], stdout:['PRIVATE_SENTINEL']});
      reporter.onError({message:'PRIVATE_SENTINEL'});
      reporter.onEnd({status:'failed'});
    `;
    const output = execFileSync(
      process.execPath,
      ['--input-type=module', '-e', script],
      {
        cwd: directory,
        env: {
          ...process.env,
          HOSTED_LOCAL_FIXTURE: '1',
          HOSTED_SUPABASE_URL: '',
          HOSTED_SUPABASE_PUBLISHABLE_KEY: '',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf8',
      },
    );
    const report = readFileSync(
      join(directory, 'private/hosted-acceptance/summary.json'),
      'utf8',
    );
    assert.ok(!report.includes('PRIVATE_SENTINEL'));
    assert.ok(!output.includes('PRIVATE_SENTINEL'));
    assert.equal(JSON.parse(report).status, 'failed');
    assert.equal(JSON.parse(report).mode, 'local-protocol-fixture');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
