// Server only: answers and feedback are projected explicitly after submission.
import type {
  ExamResponse,
  ExamResponses,
  ExamResult,
  PublicExam,
  TrainingExam,
} from './types.ts';

export { parseExamResponses } from './responses.ts';

export function publicExam(exam: TrainingExam): PublicExam {
  return {
    id: exam.id,
    version: exam.version,
    chapterId: exam.chapterId,
    title: exam.title,
    suggestedMinutes: exam.suggestedMinutes,
    questions: exam.questions.map((q) => {
      const {
        id,
        lessonId,
        objective,
        difficulty,
        prerequisites,
        prompt,
        graph,
        type,
      } = q;
      const base = {
        id,
        lessonId,
        objective,
        difficulty,
        prerequisites,
        prompt,
        ...(graph ? { graph } : {}),
      };
      return type === 'numeric'
        ? {
            ...base,
            type,
            fields: q.fields.map(({ id, label }) => ({ id, label })),
          }
        : {
            ...base,
            type,
            options: q.options.map(({ id, label }) => ({ id, label })),
          };
    }),
  };
}

// Exact rational arithmetic avoids rounding tolerances and accepts French commas.
// This is a numeric parser, never an expression evaluator.
function rational(raw: string): [bigint, bigint] | null {
  const text = raw.trim().replaceAll('−', '-').replace(',', '.');
  if (text.length > 64) return null;
  const fraction = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if (fraction) {
    const denominator = BigInt(fraction[2]!);
    return denominator === 0n ? null : [BigInt(fraction[1]!), denominator];
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
  const [whole, decimal = ''] = text.split('.');
  const sign = text.startsWith('-') ? -1n : 1n;
  const digits = (whole!.replace(/^[+-]/, '') || '0') + decimal;
  return [sign * BigInt(digits), 10n ** BigInt(decimal.length)];
}

export function equivalentNumber(given: string, expected: string): boolean {
  const a = rational(given);
  const b = rational(expected);
  return !!a && !!b && a[0] * b[1] === b[0] * a[1];
}

export function gradeExam(
  exam: TrainingExam,
  responses: ExamResponses,
): ExamResult {
  const questions = exam.questions.map((q) => {
    const response: ExamResponse | undefined = responses[q.id];
    const base = { id: q.id, explanation: q.explanation, pitfall: q.pitfall };
    if (q.type === 'numeric') {
      const values = (response ?? {}) as Record<string, string>;
      const fields = Object.fromEntries(
        q.fields.map((f) => [
          f.id,
          equivalentNumber(values[f.id] ?? '', f.answer),
        ]),
      );
      return {
        ...base,
        correct: Object.values(fields).every(Boolean),
        skipped: q.fields.every((f) => !(values[f.id] ?? '').trim()),
        answer: Object.fromEntries(q.fields.map((f) => [f.id, f.answer])),
        fields,
      };
    }
    const chosen = (response ?? []) as string[];
    return {
      ...base,
      correct:
        chosen.length === q.answer.length &&
        q.answer.every((id) => chosen.includes(id)),
      skipped: chosen.length === 0,
      answer: q.answer,
      feedback: q.options.map((o) => ({
        id: o.id,
        correct: q.answer.includes(o.id),
        text: o.feedback,
      })),
    };
  });
  return {
    examId: exam.id,
    version: exam.version,
    score: questions.filter((q) => q.correct).length,
    total: questions.length,
    questions,
  };
}
