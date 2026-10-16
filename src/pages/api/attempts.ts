import type { APIRoute } from 'astro';
import { sameOriginPost, smallJson } from '../../lib/auth/policy';
import { exerciseBank } from '../../lib/exercises/bank';
import { createAttemptStore } from '../../lib/exercises/store';
import { submitAttempt } from '../../lib/exercises/submit';
export const prerender = false;
const json = (status: number, value: unknown) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
export const GET: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: 'POST' } });
export const POST: APIRoute = async ({ locals, request }) => {
  const auth = locals.auth;
  if (!auth) {
    console.error('attempts: 503 auth not configured (locals.auth is missing)');
    return json(503, { error: 'auth_unavailable' });
  }
  if (!sameOriginPost(request, auth.config))
    return json(403, { error: 'forbidden' });
  let user;
  try {
    user = await auth.verifiedUser();
  } catch (error) {
    console.error(
      'attempts: 503 session check failed:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return json(503, { error: 'auth_unavailable' });
  }
  if (!user) return json(401, { error: 'unauthenticated' });
  const body = await smallJson(request);
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return json(400, { error: 'invalid_body' });
  const expectedLearnerId = (body as Record<string, unknown>).expectedLearnerId;
  if (typeof expectedLearnerId !== 'string' || !expectedLearnerId)
    return json(400, { error: 'invalid_learner_context' });
  // A consistency precondition, never an authorization source. In particular,
  // check before lookup/replay so stale tabs cannot receive another learner's result.
  if (expectedLearnerId !== user.id)
    return json(409, { error: 'learner_context_changed' });
  const store = createAttemptStore({
    SUPABASE_URL: process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY:
      process.env.SUPABASE_SECRET_KEY ?? import.meta.env.SUPABASE_SECRET_KEY,
  });
  if (!store) {
    // Names the setting only, never its value.
    console.error(
      'attempts: store not configured (SUPABASE_URL missing, or SUPABASE_SECRET_KEY missing or not an sb_secret_ key)',
    );
    return json(503, { error: 'storage_unavailable' });
  }
  try {
    const { status, body: payload } = await submitAttempt({
      userId: user.id,
      body,
      exercises: exerciseBank,
      store,
    });
    return json(status, payload);
  } catch (error) {
    console.error(
      'attempts: store call failed:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return json(503, { error: 'storage_unavailable' });
  }
};
