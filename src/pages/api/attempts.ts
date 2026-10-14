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
  const body = await smallJson(request);
  if (body === undefined) return json(400, { error: 'invalid_body' });
  const store = createAttemptStore({
    SUPABASE_URL: process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY:
      process.env.SUPABASE_SECRET_KEY ?? import.meta.env.SUPABASE_SECRET_KEY,
  });
  if (!store) return json(503, { error: 'storage_unavailable' });
  try {
    const { status, body: payload } = await submitAttempt({
      userId: user.id,
      body,
      exercises: exerciseBank,
      store,
    });
    return json(status, payload);
  } catch {
    return json(503, { error: 'storage_unavailable' });
  }
};
