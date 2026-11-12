import type { ExamResponses, PublicExam } from './types.ts';

const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/** Safe to share with the client: validates input shape without any answer keys. */
export function parseExamResponses(
  exam: PublicExam,
  raw: unknown,
): ExamResponses | null {
  if (!object(raw)) return null;
  if (Object.keys(raw).some((id) => !exam.questions.some((q) => q.id === id)))
    return null;
  const responses: ExamResponses = {};
  for (const q of exam.questions) {
    if (!Object.hasOwn(raw, q.id)) continue;
    const value = raw[q.id];
    if (q.type === 'numeric') {
      if (
        !object(value) ||
        Object.keys(value).some((id) => !q.fields.some((f) => f.id === id)) ||
        Object.values(value).some((v) => typeof v !== 'string' || v.length > 64)
      )
        return null;
      responses[q.id] = value as Record<string, string>;
    } else {
      if (
        !Array.isArray(value) ||
        value.length > (q.type === 'single' ? 1 : q.options.length) ||
        new Set(value).size !== value.length ||
        value.some(
          (id) => typeof id !== 'string' || !q.options.some((o) => o.id === id),
        )
      )
        return null;
      responses[q.id] = value as string[];
    }
  }
  return responses;
}
