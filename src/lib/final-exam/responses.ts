import {
  BANK_VERSION,
  DURATION_MS,
  blueprint,
  type History,
  type Paper,
  type Responses,
} from './types.ts';
export const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export function parseResponses(paper: Paper, raw: unknown): Responses | null {
  if (!isObject(raw) || Object.keys(raw).some((id) => !paper.ids.includes(id)))
    return null;
  const result: Responses = {};
  for (const q of paper.questions) {
    if (!Object.hasOwn(raw, q.id)) continue;
    const value = raw[q.id];
    if (q.type === 'written') {
      if (typeof value !== 'string' || value.length > 2000) return null;
    } else if (q.type === 'numeric') {
      if (
        !isObject(value) ||
        Object.keys(value).some((id) => !q.fields!.some((f) => f.id === id)) ||
        Object.values(value).some((v) => typeof v !== 'string' || v.length > 64)
      )
        return null;
    } else if (
      !Array.isArray(value) ||
      new Set(value).size !== value.length ||
      value.length > (q.type === 'single' ? 1 : q.options!.length) ||
      value.some(
        (id) => typeof id !== 'string' || !q.options!.some((o) => o.id === id),
      )
    )
      return null;
    result[q.id] = value as Responses[string];
  }
  return result;
}
export function parseHistory(raw: unknown): History | null {
  if (
    !Array.isArray(raw) ||
    raw.length > 180 ||
    raw.some(
      (v) =>
        !isObject(v) ||
        typeof v.id !== 'string' ||
        v.id.length > 50 ||
        typeof v.seen !== 'number' ||
        !Number.isSafeInteger(v.seen) ||
        v.seen <= 0 ||
        v.seen > Date.now() + 60_000,
    )
  )
    return null;
  return raw as History;
}
export function validStoredPaper(value: unknown): value is Paper {
  if (
    !isObject(value) ||
    value.version !== BANK_VERSION ||
    typeof value.seed !== 'number' ||
    !Number.isInteger(value.seed) ||
    value.seed < 0 ||
    value.seed > 0xffffffff ||
    typeof value.startedAt !== 'number' ||
    !Number.isSafeInteger(value.startedAt) ||
    value.startedAt <= 0 ||
    value.startedAt > Date.now() + 60_000 ||
    value.deadline !== value.startedAt + DURATION_MS ||
    !Array.isArray(value.ids) ||
    !Array.isArray(value.questions) ||
    value.ids.length !== blueprint.length ||
    value.questions.length !== blueprint.length ||
    new Set(value.ids).size !== blueprint.length
  )
    return false;
  return value.questions.every((q, i) => {
    const slot = blueprint[i]!;
    if (
      !isObject(q) ||
      typeof q.id !== 'string' ||
      q.id !== (value.ids as string[])[i] ||
      q.slot !== slot.slot ||
      q.topic !== slot.topic ||
      q.marks !== slot.marks ||
      q.minutes !== slot.minutes ||
      q.difficulty !== slot.difficulty ||
      typeof q.prompt !== 'string' ||
      typeof q.lessonId !== 'string' ||
      typeof q.family !== 'string'
    )
      return false;
    if (
      q.graph !== undefined &&
      (!isObject(q.graph) ||
        typeof q.graph.description !== 'string' ||
        !Array.isArray(q.graph.points) ||
        q.graph.points.some(
          (p) =>
            !Array.isArray(p) ||
            p.length !== 2 ||
            p.some((n) => typeof n !== 'number' || !Number.isFinite(n)),
        ))
    )
      return false;
    if (q.type === 'written') return true;
    const entries = q.type === 'numeric' ? q.fields : q.options;
    if (
      !['numeric', 'single', 'multi'].includes(String(q.type)) ||
      !Array.isArray(entries) ||
      !entries.length ||
      entries.length > 10 ||
      entries.some(
        (e) =>
          !isObject(e) ||
          typeof e.id !== 'string' ||
          typeof e.label !== 'string',
      ) ||
      new Set(entries.map((e) => e.id)).size !== entries.length
    )
      return false;
    return (
      q.type !== 'numeric' ||
      entries.every(
        (e) =>
          e.tolerance === undefined ||
          (typeof e.tolerance === 'number' &&
            Number.isFinite(e.tolerance) &&
            e.tolerance > 0),
      )
    );
  });
}
export function completed(paper: Paper, responses: Responses, id: string) {
  const q = paper.questions.find((q) => q.id === id)!;
  const v = responses[id];
  if (q.type === 'written') return typeof v === 'string' && !!v.trim();
  if (q.type === 'numeric')
    return (
      isObject(v) &&
      q.fields!.every(
        (f) => typeof v[f.id] === 'string' && !!(v[f.id] as string).trim(),
      )
    );
  return Array.isArray(v) && v.length > 0;
}
