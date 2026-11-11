// Server only: selection and grading keep the answer-bearing bank on the server.
import { equivalentNumber } from '../training-exams/grading.ts';
import { bank } from './bank.ts';
import {
  BANK_VERSION,
  DURATION_MS,
  blueprint,
  type History,
  type Paper,
  type Question,
  type Responses,
  type Result,
  type Mark,
} from './types.ts';

function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: T[], rng: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}
export function selectQuestions(
  history: History,
  seed: number,
  source = bank,
): Question[] {
  const rng = random(seed);
  const seen = new Map<string, number>();
  const families = new Map<string, number>();
  for (const item of history) {
    const q = source.find((q) => q.id === item.id);
    if (!q) continue;
    seen.set(q.id, Math.max(seen.get(q.id) ?? 0, item.seen));
    families.set(q.family, Math.max(families.get(q.family) ?? 0, item.seen));
  }
  const used = new Set<string>();
  return blueprint.map((slot) => {
    const candidates = shuffled(
      source.filter((q) => q.slot === slot.slot),
      rng,
    );
    candidates.sort(
      (a, b) =>
        Number(used.has(a.family)) - Number(used.has(b.family)) ||
        (families.get(a.family) ?? 0) - (families.get(b.family) ?? 0) ||
        (seen.get(a.id) ?? 0) - (seen.get(b.id) ?? 0),
    );
    const selected = candidates[0];
    if (!selected || used.has(selected.family))
      throw new Error(`No distinct family for ${slot.slot}`);
    used.add(selected.family);
    return selected;
  });
}
export function projectPaper(
  questions: Question[],
  seed: number,
  startedAt: number,
): Paper {
  const rng = random(seed);
  return {
    version: BANK_VERSION,
    seed,
    startedAt,
    deadline: startedAt + DURATION_MS,
    ids: questions.map((q) => q.id),
    questions: questions.map((q) => {
      const {
        id,
        family,
        slot,
        topic,
        objective,
        lessonId,
        prerequisites,
        difficulty,
        marks,
        minutes,
        prompt,
        type,
        graph,
      } = q;
      const base = {
        id,
        family,
        slot,
        topic,
        objective,
        lessonId,
        prerequisites,
        difficulty,
        marks,
        minutes,
        prompt,
        type,
        ...(graph ? { graph } : {}),
      };
      if (q.type === 'numeric')
        return {
          ...base,
          fields: q.fields.map(({ id, label, tolerance }) => ({
            id,
            label,
            ...(tolerance === undefined ? {} : { tolerance }),
          })),
        };
      if (q.type === 'written') return base;
      return {
        ...base,
        options: shuffled(
          q.options.map(({ id, label }) => ({ id, label })),
          rng,
        ),
      };
    }),
  };
}
export function reconstruct(
  ids: unknown,
  seed: unknown,
  startedAt: unknown,
): Paper | null {
  if (
    !Array.isArray(ids) ||
    ids.length !== blueprint.length ||
    new Set(ids).size !== ids.length ||
    typeof seed !== 'number' ||
    !Number.isInteger(seed) ||
    seed < 0 ||
    seed > 0xffffffff ||
    typeof startedAt !== 'number' ||
    !Number.isSafeInteger(startedAt) ||
    startedAt <= 0 ||
    startedAt > Date.now() + 60_000
  )
    return null;
  const questions: Question[] = [];
  for (const [i, id] of ids.entries()) {
    const q = bank.find((q) => q.id === id);
    if (
      !q ||
      q.slot !== blueprint[i]!.slot ||
      questions.some((old) => old.family === q.family)
    )
      return null;
    questions.push(q);
  }
  return projectPaper(questions, seed, startedAt);
}
function approximate(given: string, expected: string, tolerance: number) {
  // Same bounded rational syntax as the existing exact parser, never eval.
  const parse = (s: string) => {
    const t = s.trim().replaceAll('−', '-').replace(',', '.');
    if (
      t.length > 64 ||
      !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?\d+)?$/.test(t)
    )
      return NaN;
    const [a, b] = t.split('/').map(Number);
    return a! / (b ?? 1);
  };
  const a = parse(given),
    b = parse(expected);
  return (
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    Math.abs(a - b) <= tolerance + 1e-12
  );
}
export function grade(paper: Paper, responses: Responses): Result {
  const marks: Mark[] = paper.ids.map((id) => {
    const q = bank.find((q) => q.id === id)!;
    const base = {
      id,
      topic: q.topic,
      maximum: q.marks,
      explanation: q.explanation,
      pitfall: q.pitfall,
    };
    if (q.type === 'written')
      return { ...base, earned: null, rubric: q.rubric };
    if (q.type === 'numeric') {
      const values = (responses[id] ?? {}) as Record<string, string>;
      const fields = Object.fromEntries(
        q.fields.map((f) => [
          f.id,
          f.tolerance === undefined
            ? equivalentNumber(values[f.id] ?? '', f.answer)
            : approximate(values[f.id] ?? '', f.answer, f.tolerance),
        ]),
      );
      return {
        ...base,
        earned:
          (q.marks * Object.values(fields).filter(Boolean).length) /
          q.fields.length,
        fields,
        answer: Object.fromEntries(q.fields.map((f) => [f.id, f.answer])),
      };
    }
    const values = (responses[id] ?? []) as string[];
    const correct =
      values.length === q.answer.length &&
      q.answer.every((a) => values.includes(a));
    return {
      ...base,
      earned: correct ? q.marks : 0,
      answer: q.answer,
      feedback: q.options.map((o) => ({
        id: o.id,
        text: o.feedback,
        correct: q.answer.includes(o.id),
      })),
    };
  });
  return {
    version: BANK_VERSION,
    marks,
    automatic: marks.reduce((sum, m) => sum + (m.earned ?? 0), 0),
    automaticMaximum: marks
      .filter((m) => m.earned !== null)
      .reduce((sum, m) => sum + m.maximum, 0),
    manualMaximum: marks
      .filter((m) => m.earned === null)
      .reduce((sum, m) => sum + m.maximum, 0),
  };
}
