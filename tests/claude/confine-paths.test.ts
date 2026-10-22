import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { homedir, userInfo } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const hook = join(project, '.claude', 'hooks', 'confine-paths.ts');
const outside = ['', 'etc', 'hosts'].join('/');
const elsewhere = join(homedir(), 'Downloads');
const outsidePdf = join(elsewhere, 'notes.pdf');
const session = 'test-session';
const scratch = join(
  '/tmp',
  `claude-${userInfo().uid}`,
  project.replace(/[^A-Za-z0-9]/g, '-'),
  session,
);

// process.execPath: a bare "node" is not executable from inside the sandbox.
const verdict = (
  tool: string,
  input: Record<string, unknown>,
  raw?: string,
) => {
  const run = spawnSync(process.execPath, [hook], {
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
  assert.equal(run.status, 0, run.stderr || String(run.error));
  return run.stdout.includes('"deny"') ? 'deny' : 'allow';
};

const allowed: [string, string, Record<string, unknown>][] = [
  ['Read in project', 'Read', { file_path: join(project, 'package.json') }],
  ['Read .env.example', 'Read', { file_path: join(project, '.env.example') }],
  ['Write new file in project', 'Write', { file_path: join(project, 'x.md') }],
  ['Glob in project', 'Glob', { pattern: 'src/**/*.ts' }],
  ['Write to session scratchpad', 'Write', { file_path: join(scratch, 'a') }],
  [
    'MCP tool with a project path',
    'mcp__x__upload',
    { source: join(project, 'README.md') },
  ],
  ['Bash in project', 'Bash', { command: 'ls src && pnpm check:content' }],
  ['Bash with a URL', 'Bash', { command: 'curl https://example.com/a/b' }],
  ['Bash system executable', 'Bash', { command: '/usr/bin/env node -v' }],
  ['Bash cd into a subdirectory', 'Bash', { command: 'cd src && ls' }],
  ['Bash $TMPDIR path', 'Bash', { command: 'ls $TMPDIR/probe' }],
  [
    'Bash redirect to /dev/null',
    'Bash',
    { command: 'ls src > /dev/null 2>&1' },
  ],
  ['Bash redirect inside project', 'Bash', { command: 'ls > out.txt' }],
  ['Bash arrow in text', 'Bash', { command: 'echo "a -> b"' }],
  ['Bash arrow in code', 'Bash', { command: 'node -e "const f = (x) => x"' }],
];
const denied: [string, string, Record<string, unknown>][] = [
  ['Read outside', 'Read', { file_path: outside }],
  ['Read a PDF outside', 'Read', { file_path: outsidePdf }],
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
    'MCP tool, unknown key, absolute path',
    'mcp__x__upload',
    { source: outsidePdf },
  ],
  [
    'MCP tool, nested home path',
    'mcp__x__read',
    { args: { list: ['~/a.pdf'] } },
  ],
  ['MCP tool, climbing path', 'mcp__x__read', { target: '../../a.pdf' }],
  ['IDE kernel', 'mcp__ide__executeCode', { code: '1+1' }],
  ['Remote agent', 'Agent', { prompt: 'x', isolation: 'remote' }],
  ['Read .env', 'Read', { file_path: join(project, '.env') }],
  ['Write .env', 'Write', { file_path: join(project, '.env') }],
  ['Edit .env.local', 'Edit', { file_path: join(project, '.env.local') }],
  ['Artifact upload of .env', 'Artifact', { file_path: join(project, '.env') }],
  [
    'ArtifactData from .env',
    'ArtifactData',
    { action: 'update', file_path: join(project, '.env') },
  ],
  ['Write a private key', 'Write', { file_path: join(project, 'a.pem') }],
  ...[
    '.claude/settings.json',
    '.claude/settings.local.json',
    '.claude/skills/x/SKILL.md',
    '.claude/commands/x.md',
    '.claude/agents/x.md',
    '.mcp.json',
    '.git/config',
    '.git/hooks/pre-commit',
    '.vscode/tasks.json',
    '.github/workflows/check.yml',
    'tests/claude/confine-paths.test.ts',
  ].map((file): [string, string, Record<string, unknown>] => [
    `Write ${file}`,
    'Write',
    { file_path: join(project, file) },
  ]),
  ['Write the guard hook', 'Write', { file_path: hook }],
  ['Bash absolute path', 'Bash', { command: `cat ${outside}` }],
  ['Bash PDF in Downloads', 'Bash', { command: 'cat ~/Downloads/notes.pdf' }],
  ['Bash tilde path', 'Bash', { command: 'ls ~/Downloads' }],
  ['Bash $HOME', 'Bash', { command: 'ls $HOME/Downloads' }],
  ['Bash ${HOME}', 'Bash', { command: 'ls ${HOME}/Downloads' }],
  ['Bash brace expansion', 'Bash', { command: `cat {${outside},x}` }],
  ['Bash climbing with ..', 'Bash', { command: 'ls ../../../../..' }],
  ['Bash $PWD/..', 'Bash', { command: 'ls $PWD/..' }],
  ['Bash cd $PWD/..', 'Bash', { command: 'cd $PWD/.. && ls' }],
  ['Bash $TMPDIR/..', 'Bash', { command: 'ls $TMPDIR/..' }],
  [
    'Bash repeated cd ..',
    'Bash',
    { command: 'cd .. && cd .. && cd .. && cd .. && ls' },
  ],
  ['Bash bare cd', 'Bash', { command: 'cd && ls' }],
  ['Bash node home lookup', 'Bash', { command: 'node -e "os.homedir()"' }],
  [
    'Bash python Path.home',
    'Bash',
    { command: 'python3 -c "from pathlib import Path; Path.home()"' },
  ],
  ['Bash node env[]', 'Bash', { command: `node -e "process.env['HOME']"` }],
  [
    'Bash base64 decode',
    'Bash',
    { command: 'cat $(echo L2V0Yy9o | base64 -d)' },
  ],
  ['Bash eval', 'Bash', { command: 'eval "ls"' }],
  [
    'Bash redirect to /opt/homebrew',
    'Bash',
    { command: 'echo x > /opt/homebrew/bin/node' },
  ],
  [
    'Bash tee into /opt/homebrew',
    'Bash',
    { command: 'echo x | tee /opt/homebrew/bin/node' },
  ],
  ['Bash cp into /usr/local', 'Bash', { command: 'cp a /usr/local/bin/a' }],
  [
    'Bash read keychain',
    'Bash',
    { command: 'cat /Library/Keychains/System.keychain' },
  ],
  ['Bash cat .env', 'Bash', { command: 'cat .env' }],
  ['Bash append to .env', 'Bash', { command: 'echo X=1 >> .env' }],
  ['Monitor command', 'Monitor', { command: `ls ${elsewhere}` }],
];

for (const [name, tool, input] of allowed)
  test(`allows: ${name}`, () => assert.equal(verdict(tool, input), 'allow'));
for (const [name, tool, input] of denied)
  test(`denies: ${name}`, () => assert.equal(verdict(tool, input), 'deny'));
test('denies unreadable hook input', () =>
  assert.equal(verdict('Read', {}, 'not json'), 'deny'));
test('denies empty hook input', () =>
  assert.equal(verdict('Read', {}, ''), 'deny'));
test('denies null hook input', () =>
  assert.equal(verdict('Read', {}, 'null'), 'deny'));
test('denies when the hook itself throws', () =>
  assert.equal(
    verdict(
      'Read',
      {},
      JSON.stringify({ tool_name: 'Read', tool_input: {}, cwd: 5 }),
    ),
    'deny',
  ));
test('treats a null tool_input as empty', () =>
  assert.equal(
    verdict(
      'Read',
      {},
      JSON.stringify({ tool_name: 'Read', tool_input: null, cwd: project }),
    ),
    'allow',
  ));
