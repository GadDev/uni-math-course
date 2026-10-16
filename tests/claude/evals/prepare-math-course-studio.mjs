import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../../../', import.meta.url));
const skillPath = '.claude/skills/math-course-studio';
export const cases = JSON.parse(
  await readFile(
    new URL('./math-course-studio/cases.json', import.meta.url),
    'utf8',
  ),
);

async function filesUnder(root, prefix = '') {
  const files = [];
  for (const entry of await readdir(join(root, prefix), {
    withFileTypes: true,
  })) {
    const path = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(root, path)));
    else if (entry.isFile()) files.push(path);
  }
  return files.sort();
}

// Materialize repository inputs, never evaluation expectations, in a disposable directory.
// This prepares fixtures only; it does not invoke a model or score its behaviour.
export async function prepareCase(id) {
  const fixture = cases.find((entry) => entry.id === id);
  if (!fixture) throw new Error(`Unknown evaluation case: ${id}`);
  const output = await mkdtemp(join(tmpdir(), `math-studio-${id}-`));
  const tracked = execFileSync('git', ['ls-files', '-z'], {
    cwd: repository,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean);
  const skillFiles = (await filesUnder(join(repository, skillPath))).map(
    (path) => join(skillPath, path),
  );
  const files = [...new Set([...tracked, ...skillFiles])].filter(
    (path) =>
      !path.startsWith('tests/claude/evals/') &&
      path !== 'tests/claude/math-course-studio-evals.test.mjs',
  );
  for (const path of files) {
    await mkdir(dirname(join(output, path)), { recursive: true });
    await copyFile(join(repository, path), join(output, path));
  }
  const digest = createHash('sha256');
  for (const path of skillFiles.sort()) {
    digest
      .update(path)
      .update('\0')
      .update(await readFile(join(repository, path)))
      .update('\0');
  }
  if (fixture.mutation) {
    const path = join(output, 'exercises/L05/v1.json');
    const bank = JSON.parse(await readFile(path, 'utf8'));
    const mutation = fixture.mutation;
    let target = bank.exercises.find((item) => item.id === mutation.item);
    for (const part of mutation.path.slice(0, -1)) target = target[part];
    target[mutation.path.at(-1)] = mutation.value;
    await writeFile(path, `${JSON.stringify(bank, null, 2)}\n`);
  }
  // Local-only Git baseline makes the immutable-bank gate usable without remotes.
  const git = (...args) =>
    execFileSync('git', args, { cwd: output, encoding: 'utf8' }).trim();
  git('init', '--quiet', '--initial-branch=fixture');
  git('add', '.');
  git(
    '-c',
    'user.name=Evaluation fixture',
    '-c',
    'user.email=fixture@example.invalid',
    'commit',
    '--quiet',
    '-m',
    'Synthetic evaluation input snapshot',
  );
  const fixtureBaseCommit = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', fixtureBaseCommit);
  return {
    fixtureBaseCommit,
    id,
    directory: output,
    prompt: fixture.prompt,
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repository,
      encoding: 'utf8',
    }).trim(),
    skillSha256: digest.digest('hex'),
    fixtureSha256: createHash('sha256')
      .update(JSON.stringify(fixture))
      .digest('hex'),
    mutation: fixture.mutation ?? null,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(JSON.stringify(await prepareCase(process.argv[2]), null, 2));
}
