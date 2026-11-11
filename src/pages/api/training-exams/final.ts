import type { APIRoute } from 'astro';
import { randomInt } from 'node:crypto';
import { sameOriginPost, smallJson } from '../../../lib/auth/policy';
import {
  grade,
  projectPaper,
  reconstruct,
  selectQuestions,
} from '../../../lib/final-exam/engine';
import {
  isObject,
  parseHistory,
  parseResponses,
} from '../../../lib/final-exam/responses';
import { BANK_VERSION } from '../../../lib/final-exam/types';
export const prerender = false;
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
export const GET: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: 'POST' } });
export const POST: APIRoute = async ({ locals, request }) => {
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
  const body = await smallJson(request, 65_536);
  if (!isObject(body)) return json(400, { error: 'invalid_body' });
  if (body.expectedLearnerId !== user.id)
    return json(409, { error: 'learner_context_changed' });
  if (body.version !== BANK_VERSION)
    return json(409, { error: 'exam_version_changed' });
  if (body.action === 'start') {
    if (Object.keys(body).length !== 4)
      return json(400, { error: 'invalid_body' });
    const history = parseHistory(body.history);
    if (!history) return json(400, { error: 'invalid_history' });
    const seed = randomInt(0x100000000);
    return json(
      200,
      projectPaper(selectQuestions(history, seed), seed, Date.now()),
    );
  }
  if (body.action !== 'grade' || Object.keys(body).length !== 7)
    return json(400, { error: 'invalid_body' });
  const paper = reconstruct(body.ids, body.seed, body.startedAt);
  if (!paper) return json(400, { error: 'invalid_paper' });
  const responses = parseResponses(paper, body.responses);
  if (!responses) return json(400, { error: 'invalid_responses' });
  return json(200, grade(paper, responses));
};
