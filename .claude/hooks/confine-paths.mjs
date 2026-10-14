#!/usr/bin/env node
// PreToolUse guard: keep Claude Code's file access inside this project.
//
// Layer 2 of the confinement described in AGENTS.md. Layer 1 is the sandbox
// and permission rules in .claude/settings.json (the OS-enforced boundary).
// This hook adds early, readable refusals for tools the sandbox does not
// cover (Read, Write, Edit, Glob, Grep, Artifact uploads, MCP tools) and a
// best-effort check of Bash command text. The Bash check is a heuristic on
// path-like tokens, not a security boundary.
//
// Allowed: the project checkout, its own auto-memory directory and this
// session's scratchpad. Writes to the guardrail files themselves, to files
// that run outside the sandbox (git, MCP, IDE tasks, CI) and to secrets are
// refused. Any error inside the hook refuses the call.
import { readFileSync, realpathSync } from 'node:fs';
import { homedir, userInfo } from 'node:os';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';

const HOME = homedir();
const sanitize = (path) => path.replace(/[^A-Za-z0-9]/g, '-');

// Read-only system locations that ordinary Bash tooling needs. Writes to
// them are refused separately (see checkWrites).
const SYSTEM_PREFIXES = [
  '/usr/',
  '/bin/',
  '/sbin/',
  '/opt/homebrew/',
  '/System/',
  '/dev/null',
  '/dev/stdin',
  '/dev/stdout',
  '/dev/stderr',
  '/dev/tty',
];
const DEVICES = new Set([
  '/dev/null',
  '/dev/stdin',
  '/dev/stdout',
  '/dev/stderr',
  '/dev/tty',
]);
const WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit']);
const WRITE_COMMANDS = new Set([
  'tee',
  'cp',
  'mv',
  'rm',
  'rmdir',
  'ln',
  'install',
  'touch',
  'mkdir',
  'chmod',
  'chown',
  'sed',
  'dd',
  'rsync',
  'truncate',
]);
const PATH_KEYS = [
  'file_path',
  'notebook_path',
  'path',
  'paths',
  'file_paths',
  'files',
  'root',
  'out_dir',
  'scriptPath',
  'directory',
  'dir',
];
// Free-text fields: never treated as paths.
const TEXT_KEYS = new Set([
  'content',
  'new_string',
  'old_string',
  'prompt',
  'description',
  'query',
  'url',
  'code',
  'text',
  'message',
  'body',
  'data',
  'intent',
  'title',
  'label',
  'summary',
  'pattern',
  'glob',
  'command',
]);
const HOME_VARIABLES = /\$\{?(HOME|OLDPWD|USERPROFILE|XDG_[A-Z_]+)\b/;
const INLINE_HOME_LOOKUP =
  /homedir|expanduser|os\.environ|getenv\(|process\.env\.HOME|process\.env\[|Path\.home|\.home\(\)|getpw(uid|nam)|userInfo\(|\bUSERPROFILE\b|\bHOME\b/;
const OBFUSCATED_COMMAND =
  /\beval\b|\b(base64|xxd)\b[^|;&\n]*\s-+(d|D|r|decode)\b/;
const ENV_FILE = /^\.env(\..+)?$/;
const KEY_FILE = /^([^.].*\.(pem|key)|id_(rsa|ed25519|ecdsa)(\.pub)?)$/;

const deny = (reason) => {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Confinement guard: ${reason}`,
      },
    }),
  );
  process.exit(0);
};

// Resolve symlinks; for a path that does not exist yet, resolve the nearest
// existing ancestor and re-append the rest.
const canonical = (path) => {
  const absolute = resolve(path);
  let existing = absolute;
  let rest = '';
  for (;;) {
    try {
      return join(realpathSync(existing), rest);
    } catch {
      const parent = dirname(existing);
      if (parent === existing) return absolute;
      rest = join(existing.slice(parent.length + 1), rest);
      existing = parent;
    }
  }
};
const expand = (token) =>
  token === '~' || token.startsWith('~/') ? HOME + token.slice(1) : token;
const isSecret = (path) => {
  const name = basename(path);
  return name !== '.env.example' && (ENV_FILE.test(name) || KEY_FILE.test(name));
};

const run = async () => {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    deny('unreadable hook input, refusing by default.');
  }
  if (!event || typeof event !== 'object')
    deny('unreadable hook input, refusing by default.');
  const { tool_name: tool, session_id: session } = event;
  const input =
    event.tool_input && typeof event.tool_input === 'object'
      ? event.tool_input
      : {};
  const projectDir = canonical(
    process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd(),
  );
  const cwd = event.cwd ? canonical(event.cwd) : projectDir;

  // A linked worktree keeps its scratchpad and memory under the main checkout.
  let mainRoot = projectDir;
  try {
    const pointer = readFileSync(join(projectDir, '.git'), 'utf8');
    const match = pointer.match(
      /^gitdir:\s*(.+?)\/\.git\/worktrees\/[^/\n]+\s*$/m,
    );
    if (match) mainRoot = canonical(match[1]);
  } catch {
    // A normal checkout has a .git directory, not a pointer file.
  }

  const uniqueRoots = new Set([projectDir]);
  for (const base of new Set([projectDir, mainRoot])) {
    const name = sanitize(base);
    uniqueRoots.add(
      canonical(join(HOME, '.claude', 'projects', name, 'memory')),
    );
    if (!session) continue;
    for (const tmp of ['/private/tmp', '/tmp'])
      uniqueRoots.add(
        canonical(join(tmp, `claude-${userInfo().uid}`, name, session)),
      );
  }
  const roots = [...uniqueRoots];
  // Guardrails, plus files that run outside the sandbox (git, MCP, IDE tasks,
  // CI) or hold the guard's own tests: change these by hand.
  const protectedFiles = [
    '.claude/settings.json',
    '.claude/settings.local.json',
    '.claude/hooks',
    '.claude/skills',
    '.claude/commands',
    '.claude/agents',
    '.claude/workflows',
    '.mcp.json',
    '.git',
    '.vscode',
    '.github/workflows',
    'tests/claude',
  ].map((file) => join(projectDir, file));
  const under = (path, root) => path === root || path.startsWith(root + '/');
  const inside = (path, { system = false } = {}) => {
    const target = canonical(path);
    return (
      roots.some((root) => under(target, root)) ||
      (system && SYSTEM_PREFIXES.some((prefix) => target.startsWith(prefix)))
    );
  };

  // Path-like values in a non-Bash tool call.
  const pathValues = (value) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(pathValues);
    if (value && typeof value === 'object') {
      // Artifact `files` maps published paths to local sources.
      const own = [value.path, value.from].filter((v) => typeof v === 'string');
      return own.length ? own : Object.values(value).flatMap(pathValues);
    }
    return [];
  };
  // Any other string that looks like a local path (MCP tools name their own
  // keys, so the known key list is not enough).
  const looksLikePath = (value) =>
    value.length < 1024 &&
    !value.includes('\n') &&
    (/^[/~]/.test(value) || value.split('/').includes('..'));
  const looseValues = (value, depth = 0) => {
    if (depth > 6) return [];
    if (typeof value === 'string') return looksLikePath(value) ? [value] : [];
    if (Array.isArray(value))
      return value.flatMap((v) => looseValues(v, depth + 1));
    if (value && typeof value === 'object')
      return Object.entries(value)
        .filter(([key]) => !TEXT_KEYS.has(key))
        .flatMap(([, v]) => looseValues(v, depth + 1));
    return [];
  };
  // Static directory prefix of a glob that is absolute, ~ or climbs with "..".
  const globPrefix = (pattern) => {
    if (typeof pattern !== 'string') return [];
    const expanded = expand(pattern);
    if (!isAbsolute(expanded) && !expanded.split('/').includes('..')) return [];
    return [expanded.split(/[*?[{]/)[0] || '/'];
  };

  const checkFileTool = () => {
    if (tool === 'mcp__ide__executeCode')
      deny('the IDE kernel runs outside the sandbox and is not allowed.');
    if (tool === 'Agent' && input.isolation === 'remote')
      deny('remote agents would copy the project off this machine.');
    const candidates = [
      ...PATH_KEYS.flatMap((key) => pathValues(input[key])),
      ...globPrefix(input.pattern),
      ...globPrefix(input.glob),
      ...looseValues(
        Object.fromEntries(
          Object.entries(input).filter(([key]) => !PATH_KEYS.includes(key)),
        ),
      ),
    ];
    for (const value of candidates) {
      const path = resolve(cwd, expand(value));
      if (!inside(path))
        deny(`${tool} refused: ${path} is outside the project.`);
      if (isSecret(path))
        deny(`${tool} refused: ${path} looks like a secret file.`);
      if (
        WRITE_TOOLS.has(tool) &&
        protectedFiles.some((file) => under(canonical(path), file))
      )
        deny(`${tool} refused: ${path} is a guardrail file; edit it by hand.`);
    }
  };

  // Writes may not land in the read-only system locations that reads allow.
  const checkWrites = (command, tokens, where) => {
    for (const match of command.matchAll(/\d?>>?\s*([^\s;&|<>()]+)/g)) {
      const target = expand(match[1].replace(/^["'`]|["'`]$/g, ''));
      if (!isAbsolute(target) && !target.split('/').includes('..')) continue;
      if (!DEVICES.has(target) && !inside(resolve(where, target)))
        deny(`redirection to ${target} writes outside the project.`);
    }
    if (!tokens.slice(0, 3).some((token) => WRITE_COMMANDS.has(token))) return;
    for (const token of tokens) {
      const value = expand(token);
      if (!isAbsolute(value) && !value.split('/').includes('..')) continue;
      if (!DEVICES.has(value) && !inside(resolve(where, value)))
        deny(`${tokens[0]} would write to ${token}, outside the project.`);
    }
  };

  const checkCommand = (command) => {
    if (INLINE_HOME_LOOKUP.test(command))
      deny('inline code looks up the home directory.');
    if (OBFUSCATED_COMMAND.test(command))
      deny('command text is built at run time (eval or decoding).');
    let where = cwd;
    // Segments end at ; & | or a newline, so `cd` never takes the next command
    // as its target. `where` follows cd across segments.
    const segments = command.split(/[;&|\n]+/).map((segment) =>
      segment.split(/[\s"'`=()<>{},]+/).filter(Boolean),
    );
    if (!inside(where)) {
      const [first, target] = segments.find((tokens) => tokens.length) ?? [];
      if (first !== 'cd' || !target || !inside(resolve(where, expand(target))))
        deny(`shell is in ${where}, outside the project; cd back first.`);
    }
    for (const tokens of segments) {
      checkWrites(command, tokens, where);
      tokens.forEach((token, index) => {
        if (HOME_VARIABLES.test(token))
          deny(`${token} expands to a directory outside the project.`);
        if (/^\$/.test(token) && token.split('/').includes('..'))
          deny(`${token} climbs out of a variable, which may be outside.`);
        if (/^~[A-Za-z0-9_.-]/.test(token))
          deny(`${token} is another user's home directory.`);
        if (!token.startsWith('-') && isSecret(token))
          deny(`${token} looks like a secret file.`);
        if (index === 0 && (token === 'cd' || token === 'pushd')) {
          const target = tokens[1];
          if (!target || target.startsWith('-'))
            deny(`${token} without an explicit in-project target.`);
          where = resolve(where, expand(target));
          if (!inside(where)) deny(`${token} ${target} leaves the project.`);
          return;
        }
        const value = expand(token);
        if (!isAbsolute(value) && !value.split('/').includes('..')) return;
        if (!inside(resolve(where, value), { system: true }))
          deny(`${token} resolves outside the project.`);
      });
    }
  };

  if (typeof input.command === 'string') checkCommand(input.command);
  else checkFileTool();
};

try {
  await run();
} catch (error) {
  deny(`hook error (${error?.message ?? error}), refusing by default.`);
}
process.exit(0);
