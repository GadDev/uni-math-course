import type { ExerciseBank, Localized } from './content-types.ts';
// Reproducible structural/bilingual audit for the L03–L20 publication.
// This does not establish mathematical truth or translation quality.
import { readFile } from 'node:fs/promises';

const releases = JSON.parse(await readFile('content/releases.json', 'utf8'));
const problems: string[] = [];
const counts = {
  lessons: 0,
  items: 0,
  choices: 0,
  tables: 0,
  levels: {} as Record<string, number>,
  keyPositions: {} as Record<string, number>,
};
const maths = (value: string) =>
  [...value.matchAll(/\$([^$\n]+)\$/g)].map((match) => match[1]);

function bilingual(item: { id: string }, field: string, value: Localized) {
  if (typeof value?.fr !== 'string' || typeof value?.en !== 'string') {
    problems.push(`${item.id} ${field}: missing bilingual prose`);
    return;
  }
  if (JSON.stringify(maths(value.fr)) !== JSON.stringify(maths(value.en)))
    problems.push(
      `${item.id} ${field}: French/English mathematical notation differs`,
    );
  if (/\s(?:mais|et|sont|avec)\s/i.test(value.en.replace(/\$[^$]+\$/g, ' ')))
    problems.push(
      `${item.id} ${field}: possible untranslated French words in English`,
    );
}

for (let n = 3; n <= 20; n += 1) {
  const lesson = `L${String(n).padStart(2, '0')}`;
  const version = releases.lessons[lesson].version;
  const bank: ExerciseBank = JSON.parse(
    await readFile(`exercises/${lesson}/v${version}.json`, 'utf8'),
  );
  const candidates = bank.exercises.filter((item) => {
    const match = new RegExp(`^${lesson}-E(\\d+)$`).exec(item.id);
    return match && Number(match[1]) >= 7 && Number(match[1]) <= 21;
  });
  if (candidates.length !== 15)
    problems.push(
      `${lesson}: expected the fifteen E07–E21 additions, found ${candidates.length}`,
    );
  counts.lessons++;
  for (const item of candidates) {
    counts.items++;
    counts.levels[item.difficulty] = (counts.levels[item.difficulty] ?? 0) + 1;
    for (const field of ['prompt', 'hint', 'explanation'] as const)
      bilingual(item, field, item[field]);
    if (item.type === 'truth-table') {
      counts.tables++;
      bilingual(item, 'feedback', item.feedback);
    } else if (item.type === 'single-choice') {
      counts.choices++;
      counts.keyPositions[item.answer] =
        (counts.keyPositions[item.answer] ?? 0) + 1;
      for (const option of item.options) {
        bilingual(item, `option ${option.id}`, option.label);
        bilingual(item, `feedback ${option.id}`, option.feedback);
      }
      for (const locale of ['fr', 'en'] as const) {
        const labels = item.options.map((option) => option.label[locale]);
        if (new Set(labels).size !== labels.length)
          problems.push(`${item.id}: duplicate ${locale} option labels`);
      }
    } else problems.push('Unexpected exercise type');
  }
}

for (const level of ['easy', 'medium', 'hard'])
  if (counts.levels[level] !== 90)
    problems.push(`Expected 90 new ${level} items across 18 lessons`);
console.log(JSON.stringify(counts, null, 2));
console.log(
  problems.length
    ? problems.join('\n')
    : 'No bilingual expression or option-label structural findings.',
);
if (problems.length) process.exitCode = 1;
