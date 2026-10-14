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
// session's scratchpad. Writes to the guardrail files themselves are refused.
import { readFileSync, realpathSync } from 'node:fs';
import { homedir, userInfo } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';

const HOME = homedir();
const sanitize = (path) => path.replace(/[^A-Za-z0-9]/g, '-');

// Read-only system locations that ordinary Bash tooling needs.
const SYSTEM_PREFIXES = [
  '/usr/',
  '/bin/',
  '/sbin/',
  '/opt/homebrew/',
  '/System/',
  '/Library/',
  '/private/var/folders/',
  '/var/folders/',
  '/dev/null',
  '/dev/stdin',
  '/dev/stdout',
  '/dev/stderr',
  '/dev/tty',
];
const WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit']);
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
const HOME_VARIABLES = /\$\{?(HOME|OLDPWD|USERPROFILE|XDG_[A-Z_]+)\b/;
const INLINE_HOME_LOOKUP =
  /homedir|expanduser|os\.environ|process\.env\.HOME|getenv\(\s*['"]HOME/;

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

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
let event;
try {
  event = JSON.parse(raw);
} catch {
  deny('unreadable hook input, refusing by default.');
}
const { tool_name: tool, tool_input: input = {}, session_id: session } = event;
const projectDir = canonical(
  process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd(),
);
const cwd = event.cwd ? canonical(event.cwd) : projectDir;

// A linked worktree keeps its scratchpad and memory under the main checkout.
let mainRoot = projectDir;
try {
  const pointer = readFileSync(join(projectDir, '.git'), 'utf8');
  const match = pointer.match(/^gitdir:\s*(.+?)\/\.git\/worktrees\/[^/\n]+\s*$/m);
  if (match) mainRoot = canonical(match[1]);
} catch {
  // A normal checkout has a .git directory, not a pointer file.
}

const uniqueRoots = new Set([projectDir]);
for (const base of new Set([projectDir, mainRoot])) {
  const name = sanitize(base);
  uniqueRoots.add(canonical(join(HOME, '.claude', 'projects', name, 'memory')));
  if (!session) continue;
  for (const tmp of ['/private/tmp', '/tmp'])
    uniqueRoots.add(
      canonical(join(tmp, `claude-${userInfo().uid}`, name, session)),
    );
}
const roots = [...uniqueRoots];
const protectedFiles = [
  join(projectDir, '.claude', 'settings.json'),
  join(projectDir, '.claude', 'settings.local.json'),
  join(projectDir, '.claude', 'hooks'),
];
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
// Static directory prefix of a glob that is absolute, ~ or climbs with "..".
const globPrefix = (pattern) => {
  if (typeof pattern !== 'string') return [];
  const expanded = expand(pattern);
  if (!isAbsolute(expanded) && !expanded.split('/').includes('..')) return [];
  return [expanded.split(/[*?[{]/)[0] || '/'];
};

const checkFileTool = () => {
  const candidates = [
    ...PATH_KEYS.flatMap((key) => pathValues(input[key])),
    ...globPrefix(input.pattern),
    ...globPrefix(input.glob),
  ];
  for (const value of candidates) {
    const path = resolve(cwd, expand(value));
    if (!inside(path)) deny(`${tool} refused: ${path} is outside the project.`);
    if (
      WRITE_TOOLS.has(tool) &&
      protectedFiles.some((file) => under(canonical(path), file))
    )
      deny(`${tool} refused: ${path} is a guardrail file; edit it by hand.`);
  }
};

const checkCommand = (command) => {
  if (INLINE_HOME_LOOKUP.test(command))
    deny('inline code looks up the home directory.');
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
  for (const tokens of segments)
    tokens.forEach((token, index) => {
      if (HOME_VARIABLES.test(token))
        deny(`${token} expands to a directory outside the project.`);
      if (/^~[A-Za-z0-9_.-]/.test(token))
        deny(`${token} is another user's home directory.`);
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
};

if (typeof input.command === 'string') checkCommand(input.command);
else checkFileTool();
process.exit(0);
