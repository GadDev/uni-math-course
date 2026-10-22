// Format conversion only: preserve the selected artwork and native dimensions.
// Use an isolated tooling environment with sharp, not a new app dependency.
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const moduleRoot = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const sharp = require(moduleRoot ? resolve(moduleRoot, 'sharp') : 'sharp');
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const inputs = process.argv[2];
if (!inputs) throw new Error('Supply the directory containing the selected generated PNG originals.');
const screens: { source: string; file: string }[] = JSON.parse(await readFile(resolve(here, 'signal-screens.json'), 'utf8'));
const output = resolve(root, 'images');
await mkdir(output, { recursive: true });
const evidence = [];
for (const screen of screens) {
  const input = await readFile(resolve(inputs, screen.source));
  const original = await sharp(input).metadata();
  const result = await sharp(input).webp({ lossless: true }).toBuffer();
  const actual = await sharp(result).metadata();
  if (actual.format !== 'webp' || result.toString('ascii', 0, 4) !== 'RIFF' || result.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Invalid WebP: ' + screen.file);
  if (original.width !== actual.width || original.height !== actual.height) throw new Error('Dimensions changed: ' + screen.file);
  const sourcePixels = await sharp(input).ensureAlpha().raw().toBuffer();
  const outputPixels = await sharp(result).ensureAlpha().raw().toBuffer();
  if (!sourcePixels.equals(outputPixels)) throw new Error('Pixels changed: ' + screen.file);
  await writeFile(resolve(output, screen.file), result);
  evidence.push({ ...screen, width: actual.width, height: actual.height, bytes: result.length, sourceSha256: createHash('sha256').update(input).digest('hex'), sha256: createHash('sha256').update(result).digest('hex'), identicalDecodedPixels: true });
  console.log(`${screen.file}: ${actual.width}×${actual.height}, ${Math.round(result.length / 1024)} KiB; pixels preserved`);
}
// Remove only the superseded, explicitly known proposal filenames.
const legacy = ['01-overview-fr-1440.webp','02-lesson-fr-1440.webp','03-worked-example-fr-1440.webp','04-glossary-fr-1440.webp','05-practice-unanswered-fr-1440.webp','06-feedback-incorrect-fr-1440.webp','07-private-progress-fr-1440.webp','08-sign-in-gate-fr-1440.webp','09-lesson-fr-375.webp','10-practice-unanswered-fr-375.webp','11-feedback-incorrect-fr-375.webp','12-lesson-en-1440.webp','13-feedback-incorrect-en-1440.webp','14-practice-unanswered-fr-320.webp'];
for (const file of legacy) await unlink(resolve(output,file)).catch(e => { if(e.code !== 'ENOENT') throw e; });
const files = (await readdir(output)).filter(file => file.endsWith('.webp')).sort();
const expected = screens.map(s => s.file).sort();
if (JSON.stringify(files) !== JSON.stringify(expected)) throw new Error('Unexpected or missing WebP proposal files.');
await writeFile(resolve(root, 'asset-evidence.json'), JSON.stringify({ preparedAt: new Date().toISOString(), origin: 'Built-in image generation; selected Signal concepts from this conversation', conversion: 'sharp lossless WebP, native dimensions, decoded RGBA pixel equality', tooling: { node: process.version, sharp: require(moduleRoot ? resolve(moduleRoot, 'sharp/package.json') : 'sharp/package.json').version }, scope: 'Raster visual concepts only; no DOM geometry, responsive implementation, keyboard, contrast or assistive-technology pass claimed', screens: evidence }, null, 2) + '\n');
console.log('Verified exactly nine selected Signal images.');
