import type { APIRoute } from 'astro';
import { sameOriginPost, smallJson } from '../../../lib/auth/policy';
import { examBank } from '../../../lib/training-exams/bank';
import {
  gradeExam,
  parseExamResponses,
} from '../../../lib/training-exams/grading';
export const prerender = false;

const json = (status: number, value: unknown) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: 'POST' } });

export const POST: APIRoute = async ({ locals, request, params }) => {
  const exam = examBank.get(params.chapterId ?? '');
  if (!exam) return json(404, { error: 'unknown_exam' });
  const auth = locals.auth;
  if (!auth) return json(503, { error: 'auth_unavailable' });
  if (!sameOriginPost(request, auth.config))
    return json(403, { error: 'forbidden' });
  let user;
  try {
    user = await auth.verifiedUser();
  } catch {
    return json(503, { error: 'auth_unavailable' });
  }
  if (!user) return json(401, { error: 'unauthenticated' });
  const body = await smallJson(request, 16_384);
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return json(400, { error: 'invalid_body' });
  const data = body as Record<string, unknown>;
  if (
    Object.keys(data).length !== 4 ||
    !['examId', 'version', 'expectedLearnerId', 'responses'].every((key) =>
      Object.hasOwn(data, key),
    )
  )
    return json(400, { error: 'invalid_body' });
  // A tab-consistency precondition; authorization always comes from verifiedUser.
  if (data.expectedLearnerId !== user.id)
    return json(409, { error: 'learner_context_changed' });
  if (data.examId !== exam.id || data.version !== exam.version)
    return json(409, { error: 'exam_version_changed' });
  const responses = parseExamResponses(exam, data.responses);
  if (!responses) return json(400, { error: 'invalid_responses' });
  return json(200, gradeExam(exam, responses));
};
