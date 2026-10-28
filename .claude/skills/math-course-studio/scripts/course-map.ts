#!/usr/bin/env node
type LocaleData = { fields: Record<string, string>; body: string } | { error: string };
type Lesson = { id: string; locales: Record<'fr' | 'en', LocaleData> };
type Course = Map<string, Lesson>;
// Mechanical cross-lesson facts for a course-level review: prerequisite graph,
// source-page coverage, objective/status parity, stale availability claims.
// It reports facts; judging them is the reviewer's job.
//
// Usage (from any directory):
//   node .claude/skills/math-course-studio/scripts/course-map.ts [--pages 96]
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readLessonSource } from '../../../../scripts/lesson-files.ts';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const lessonIdPattern = /^L\d{2}$/;

export function parseFrontmatter(text: string) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error('Missing frontmatter');
  const fields: Record<string, string> = {};
  for (const line of match[1]!.split('\n')) {
    const index = line.indexOf(': ');
    if (index > 0) fields[line.slice(0, index)] = line.slice(index + 2);
  }
  return { fields, body: text.slice(match[0].length) };
}

export const listValue = (value = '[]') =>
  value
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// Collapse sorted page numbers into "3-5, 9" style ranges.
export function ranges(pages: number[]) {
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (sorted[j + 1] === sorted[j]! + 1) j++;
    out.push(i === j ? `${sorted[i]}` : `${sorted[i]}-${sorted[j]}`);
    i = j + 1;
  }
  return out.join(', ') || 'none';
}

// A lesson text that says some lesson "is planned / not yet available" while
// that lesson's folder exists is probably stale.
const availabilityClaim =
  /planned|not lessons already available|not yet available|programme prévu|pas des leçons déjà disponibles|pas encore disponibles?/i;

export async function loadCourse(contentRoot = `${root}content/lessons/`) {
  const ids = (await readdir(contentRoot)).filter((name) => lessonIdPattern.test(name)).sort();
  const lessons: Course = new Map();
  for (const id of ids) {
    const lesson = { id, locales: {} as Lesson['locales'] };
    for (const locale of ['fr', 'en'] as const) {
      try {
        const { fields, body } = parseFrontmatter(
          await readLessonSource(`${contentRoot}${id}/`, locale),
        );
        lesson.locales[locale] = { fields, body };
      } catch (error) {
        lesson.locales[locale] = { error: (error instanceof Error ? error.message : String(error)) };
      }
    }
    lessons.set(id, lesson);
  }
  return lessons;
}

export function analyse(lessons: Course, totalPages = 96) {
  const findings = [];
  const ids = [...lessons.keys()];
  const prereqs = new Map<string, string[]>();
  const coverage = new Map<number, string[]>();
  let minutes = 0;

  for (const [id, lesson] of lessons) {
    const { fr, en } = lesson.locales;
    for (const [locale, data] of Object.entries(lesson.locales))
      if ('error' in data) findings.push(`${id}/${locale}: ${'error' in data ? data.error : ''}`);
    if ('error' in fr || 'error' in en) continue;
    for (const key of ['status', 'objectives', 'sourcePages', 'minutes'])
      if (fr.fields[key] !== en.fields[key])
        findings.push(`${id}: frontmatter "${key}" differs between fr and en (${fr.fields[key]} vs ${en.fields[key]})`);
    // Prerequisites may be lesson IDs or free text (translated, so not compared).
    const lessonIds = (value: string | undefined) => listValue(value).filter((item) => lessonIdPattern.test(item));
    if (lessonIds(fr.fields.prerequisites).join() !== lessonIds(en.fields.prerequisites).join())
      findings.push(`${id}: prerequisite lesson IDs differ between fr and en`);
    prereqs.set(id, lessonIds(fr.fields.prerequisites));
    minutes += Number(fr.fields.minutes) || 0;
    for (const page of listValue(fr.fields.sourcePages).map(Number)) {
      if (!coverage.has(page)) coverage.set(page, []);
      coverage.get(page)!.push(id);
    }
    // Stale availability claims about lessons that now exist.
    for (const [locale, data] of Object.entries(lesson.locales))
      ('body' in data ? data.body : '').split('\n').forEach((line, index) => {
        if (!availabilityClaim.test(line)) return;
        const mentioned = (line.match(/\bL\d{2}\b/g) ?? []).filter((m) => lessons.has(m));
        if (mentioned.length)
          findings.push(`${id}/${locale} body line ${index + 1}: says ${mentioned.join(', ')} planned/unavailable, but ${mentioned.length > 1 ? 'they exist' : 'it exists'} — check for staleness`);
      });
  }

  // Prerequisite graph: unknown prerequisites, forward references, cycles.
  for (const [id, list] of prereqs)
    for (const prerequisite of list) {
      if (!lessons.has(prerequisite)) findings.push(`${id}: prerequisite ${prerequisite} has no lesson`);
      else if (prerequisite >= id) findings.push(`${id}: prerequisite ${prerequisite} is not earlier in the sequence`);
    }
  const visiting = new Set();
  const done = new Set();
  const visit = (id: string, path: string[]): void => {
    if (done.has(id)) return;
    if (visiting.has(id)) {
      findings.push(`prerequisite cycle: ${[...path, id].join(' -> ')}`);
      return;
    }
    visiting.add(id);
    for (const next of prereqs.get(id) ?? []) if (lessons.has(next)) visit(next, [...path, id]);
    visiting.delete(id);
    done.add(id);
  };
  ids.forEach((id) => visit(id, []));

  const covered = [...coverage.keys()];
  const uncovered = [];
  for (let page = 2; page <= totalPages; page++) if (!coverage.has(page)) uncovered.push(page);
  const overlaps = [...coverage].filter(([, owners]) => owners.length > 1).map(([page]) => page);
  const outOfRange = covered.filter((page) => page < 1 || page > totalPages);
  if (outOfRange.length) findings.push(`sourcePages outside 1-${totalPages}: ${outOfRange.join(', ')}`);

  return { ids, prereqs, minutes, covered, uncovered, overlaps, findings };
}

function report(lessons: Course, totalPages: number) {
  const result = analyse(lessons, totalPages);
  const lines = [`# Course map (${result.ids.length} lessons, ${result.minutes} minutes)`, ''];
  lines.push('## Lessons', '| Lesson | Status | Minutes | Prerequisites | Source pages |', '| --- | --- | --- | --- | --- |');
  for (const [id, lesson] of lessons) {
    const f = ('fields' in lesson.locales.fr ? lesson.locales.fr.fields : {});
    lines.push(`| ${id} | ${f.status ?? '?'} | ${f.minutes ?? '?'} | ${listValue(f.prerequisites).join(', ') || '-'} | ${ranges(listValue(f.sourcePages).map(Number))} |`);
  }
  lines.push('', '## Source-page coverage (page 1 is the title page)');
  lines.push(`- Covered: ${ranges(result.covered)}`);
  lines.push(`- Not covered by any lesson: ${ranges(result.uncovered)}`);
  lines.push(`- Covered by more than one lesson: ${ranges(result.overlaps)}`);
  lines.push('', '## Mechanical findings (to be judged, not automatically errors)');
  lines.push(...(result.findings.length ? result.findings.map((f) => `- ${f}`) : ['- none']));
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf('--pages');
  const totalPages = index > 0 ? Number(process.argv[index + 1]) : 96;
  console.log(report(await loadCourse(), totalPages));
}
