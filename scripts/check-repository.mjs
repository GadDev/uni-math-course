// Markdown validation adapted from the GadDev repository playbook (MIT; copyright 2026 GadDev).
import { readdir, readFile, stat, realpath } from 'node:fs/promises';
import { resolve, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignored = new Set([
  '.git',
  'node_modules',
  '.astro',
  '.test-build',
  '.vercel',
  'dist',
  'coverage',
  'playwright-report',
  'test-results',
]);
const required = [
  'README.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'AGENTS.md',
  'CLAUDE.md',
  'CONTENT_LICENSE.md',
  '.github/CODEOWNERS',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/workflows/check.yml',
  '.github/dependabot.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/content_correction.yml',
  'docs/REPOSITORY_SETUP.md',
];
const tick = String.fromCharCode(96);
const fencePattern = new RegExp('^ {0,3}(' + tick + '{3,}|~{3,})(.*)$');
const codePattern = new RegExp('(' + tick + '+).*?\\1', 'g');
const definitionPattern = /^ {0,3}\[([^\]]+)\]:\s*(<[^>]+>|\S+)/;
const inlineLink =
  /!?\[[^\]\n]+\]\((<[^>\n]+>|[^\s)]+)(?:\s+["'][^\n]*?["'])?\)/g;
const referenceLink = /!?\[([^\]\n]+)\]\[([^\]\n]*)\]/g;
const labelKey = (text) => text.trim().replace(/\s+/g, ' ').toLowerCase();
async function walk(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = resolve(path, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile() && extname(full).toLowerCase() === '.md')
      files.push(full);
  }
  return files.sort();
}
export async function validateRepository(
  requested = root,
  mandatory = required,
) {
  // Resolve once so every path comparison uses real paths (macOS temp dirs are symlinks).
  const directory = await realpath(requested);
  const errors = [];
  const exists = async (path) => {
    try {
      return await stat(path);
    } catch {
      return null;
    }
  };
  for (const name of mandatory)
    if (!(await exists(resolve(directory, name)))?.isFile())
      errors.push(name + ': required file is missing');
  const planning = ['MISSION', 'CONSTITUTION', 'ROADMAP', 'TECHSTACK'].map(
    (name) => resolve(directory, 'docs', name + '.md'),
  );
  if ((await Promise.all(planning.map(exists))).some(Boolean)) {
    for (const path of planning)
      if (
        !(await exists(path))?.isFile() ||
        !(await readFile(path, 'utf8')).trim()
      )
        errors.push(
          relative(directory, path) + ': planning file missing or empty',
        );
  }
  const files = await walk(directory);
  const documents = new Map();
  for (const path of files) {
    const text = await readFile(path, 'utf8');
    const name = relative(directory, path);
    if (!text.endsWith('\n')) errors.push(name + ': missing final newline');
    const anchors = new Set(),
      definitions = new Map(),
      visible = [];
    let fence = null,
      h1 = 0;
    for (const [index, line] of text.split('\n').entries()) {
      const number = index + 1;
      const marker = line.match(fencePattern);
      if (fence) {
        if (
          marker &&
          marker[1][0] === fence.char &&
          marker[1].length >= fence.length &&
          !marker[2].trim()
        )
          fence = null;
        continue;
      }
      if (marker) {
        fence = { char: marker[1][0], length: marker[1].length, number };
        continue;
      }
      if (line.includes('\t'))
        errors.push(name + ':' + number + ': tab outside a code fence');
      const spaces = line.length - line.trimEnd().length;
      if (spaces && spaces !== 2)
        errors.push(name + ':' + number + ': trailing whitespace');
      visible.push([number, line]);
      for (const explicit of line.matchAll(
        /<[a-z][^>]*\bid=(["'])([^"']+)\1/gi,
      ))
        anchors.add(explicit[2]);
      const heading = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*$/);
      if (heading) {
        if (heading[1].length === 1) h1++;
        const title = heading[2]
          .replace(/\s+#+\s*$/, '')
          .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
        const base = title
          .toLowerCase()
          .replace(/[^\p{L}\p{N}_\- ]/gu, '')
          .replaceAll(' ', '-');
        let slug = base,
          suffix = 0;
        while (anchors.has(slug)) slug = base + '-' + ++suffix;
        anchors.add(slug);
      }
      const definition = line.match(definitionPattern);
      if (definition)
        definitions.set(
          labelKey(definition[1]),
          definition[2].replace(/^<|>$/g, ''),
        );
    }
    if (fence) errors.push(name + ':' + fence.number + ': unclosed code fence');
    if (h1 !== 1)
      errors.push(name + ': expected one top-level heading, found ' + h1);
    documents.set(path, { anchors, definitions, visible });
  }
  async function checkTarget(path, number, target) {
    target = target.replace(/^<|>$/g, '');
    if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//')) return;
    const location = relative(directory, path) + ':' + number + ': ';
    const hash = target.indexOf('#');
    const fragment = hash < 0 ? '' : target.slice(hash + 1);
    const raw = (hash < 0 ? target : target.slice(0, hash)).split('?')[0];
    let urlPath, anchor;
    try {
      urlPath = decodeURIComponent(raw);
      anchor = decodeURIComponent(fragment);
    } catch {
      errors.push(location + 'malformed link: ' + target);
      return;
    }
    let dest = !urlPath
      ? path
      : resolve(
          urlPath.startsWith('/') ? directory : dirname(path),
          urlPath.replace(/^\/+/, ''),
        );
    const present = await exists(dest);
    if (present) dest = await realpath(dest);
    const rel = relative(directory, dest);
    if (rel === '..' || rel.startsWith('../'))
      errors.push(location + 'link leaves repository: ' + target);
    else if (!present) errors.push(location + 'missing link target: ' + target);
    else if (
      anchor &&
      extname(dest).toLowerCase() === '.md' &&
      !documents.get(dest)?.anchors.has(anchor)
    )
      errors.push(location + 'missing heading anchor: ' + target);
  }
  for (const [path, { visible, definitions }] of documents) {
    for (const [number, line] of visible) {
      if (definitionPattern.test(line)) continue;
      const clean = line.replace(codePattern, '');
      for (const match of clean.matchAll(inlineLink))
        await checkTarget(path, number, match[1]);
      for (const match of clean.matchAll(referenceLink)) {
        const key = labelKey(match[2] || match[1]);
        if (!definitions.has(key))
          errors.push(
            relative(directory, path) +
              ':' +
              number +
              ': undefined link reference: ' +
              key,
          );
        else await checkTarget(path, number, definitions.get(key));
      }
    }
    for (const target of definitions.values())
      await checkTarget(path, 1, target);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return files.length;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(
    'Validated ' +
      (await validateRepository()) +
      ' Markdown files: structure and internal links passed.',
  );
}
