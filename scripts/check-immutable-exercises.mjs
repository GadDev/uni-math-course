import { execFileSync } from 'node:child_process';

const base = process.env.CONTENT_BASE_REF ?? 'origin/main';
if (/^0+$/.test(base)) process.exit(0);
// Bank versions already present on the base revision are immutable, even when
// the release manifest is deliberately renewed. Add a new version for corrections.
const changes = execFileSync(
  'git',
  ['diff', '--no-renames', '--name-status', base, 'HEAD', '--', 'exercises/'],
  { encoding: 'utf8' },
);
const invalid = changes
  .trim()
  .split('\n')
  .filter((line) => {
    const [status, path] = line.split('\t');
    return (
      path && /^exercises\/L\d{2}\/v\d+\.json$/.test(path) && status !== 'A'
    );
  });
if (invalid.length)
  throw new Error(
    `Published exercise versions are immutable; add vN.json instead:\n${invalid.join('\n')}`,
  );
console.log('Existing exercise versions remain immutable.');
