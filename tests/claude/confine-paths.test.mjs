import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { homedir, userInfo } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const hook = join(project, '.claude', 'hooks', 'confine-paths.mjs');
const outside = ['', 'etc', 'hosts'].join('/');
const elsewhere = join(homedir(), 'Downloads');
const session = 'test-session';
const scratch = join(
  '/tmp',
  `claude-${userInfo().uid}`,
  project.replace(/[^A-Za-z0-9]/g, '-'),
  session,
);

const verdict = (tool, input, raw) => {
  const run = spawnSync('node', [hook], {
    input:
      raw ??
      JSON.stringify({
        tool_name: tool,
        tool_input: input,
        cwd: project,
        session_id: session,
      }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: project },
  });
  assert.equal(run.status, 0, run.stderr);
  return run.stdout.includes('"deny"') ? 'deny' : 'allow';
};

const allowed = [
  ['Read in project', 'Read', { file_path: join(project, 'package.json') }],
  ['Write new file in project', 'Write', { file_path: join(project, 'x.md') }],
  ['Glob in project', 'Glob', { pattern: 'src/**/*.ts' }],
  ['Write to session scratchpad', 'Write', { file_path: join(scratch, 'a') }],
  ['Bash in project', 'Bash', { command: 'ls src && pnpm check:content' }],
  ['Bash with a URL', 'Bash', { command: 'curl https://example.com/a/b' }],
  ['Bash system executable', 'Bash', { command: '/usr/bin/env node -v' }],
  ['Bash cd into a subdirectory', 'Bash', { command: 'cd src && ls' }],
];
const denied = [
  ['Read outside', 'Read', { file_path: outside }],
  ['Write outside', 'Write', { file_path: join(elsewhere, 'x.txt') }],
  ['Glob path outside', 'Glob', { pattern: '*', path: elsewhere }],
  ['Glob absolute pattern', 'Glob', { pattern: '/etc/*' }],
  ['Grep absolute glob', 'Grep', { pattern: 'x', glob: outside }],
  ['Edit through ..', 'Edit', { file_path: join(project, '../../../../x') }],
  ['Write to /usr/local', 'Write', { file_path: '/usr/local/bin/evil' }],
  ['Another session scratchpad', 'Read', { file_path: scratch + '-2/a' }],
  ['Artifact upload of a local file', 'Artifact', { file_path: outside }],
  ['Artifact files map', 'Artifact', { files: { 'a.txt': { from: outside } } }],
  [
    'Edit settings.json',
    'Edit',
    { file_path: join(project, '.claude/settings.json') },
  ],
  ['Write the guard hook', 'Write', { file_path: hook }],
  ['Bash absolute path', 'Bash', { command: `cat ${outside}` }],
  ['Bash tilde path', 'Bash', { command: 'ls ~/Downloads' }],
  ['Bash $HOME', 'Bash', { command: 'ls $HOME/Downloads' }],
  ['Bash ${HOME}', 'Bash', { command: 'ls ${HOME}/Downloads' }],
  ['Bash brace expansion', 'Bash', { command: `cat {${outside},x}` }],
  ['Bash climbing with ..', 'Bash', { command: 'ls ../../../../..' }],
  [
    'Bash repeated cd ..',
    'Bash',
    { command: 'cd .. && cd .. && cd .. && cd .. && ls' },
  ],
  ['Bash bare cd', 'Bash', { command: 'cd && ls' }],
  ['Bash node home lookup', 'Bash', { command: 'node -e "os.homedir()"' }],
  ['Monitor command', 'Monitor', { command: `ls ${elsewhere}` }],
];

for (const [name, tool, input] of allowed)
  test(`allows: ${name}`, () => assert.equal(verdict(tool, input), 'allow'));
for (const [name, tool, input] of denied)
  test(`denies: ${name}`, () => assert.equal(verdict(tool, input), 'deny'));
test('denies unreadable hook input', () =>
  assert.equal(verdict('Read', {}, 'not json'), 'deny'));
