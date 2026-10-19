import type { APIRoute } from 'astro';
import { sameOriginPost, smallJson } from '../../lib/auth/policy';
import { lessonReleases } from '../../lib/released-lessons';
export const prerender = false;
const json = (status: number, value: unknown) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const handle: APIRoute = async ({ locals, request }) => {
  const auth = locals.auth;
  if (!auth) return json(503, { error: 'auth_unavailable' });
  if (request.method === 'POST' && !sameOriginPost(request, auth.config))
    return json(403, { error: 'forbidden' });
  try {
    const user = await auth.verifiedUser();
    if (!user) return json(401, { error: 'unauthenticated' });
    if (request.method === 'GET') {
      const { data, error } = await auth.client
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', user.id)
        .in('lesson_id', Object.keys(lessonReleases));
      if (error || !Array.isArray(data))
        return json(503, { error: 'storage_unavailable' });
      return json(200, {
        learnerId: user.id,
        completedLessonIds: data.map((row) => row.lesson_id),
      });
    }
    const body = await smallJson(request);
    if (!body || typeof body !== 'object' || Array.isArray(body))
      return json(400, { error: 'invalid_body' });
    const { expectedLearnerId, lessonId, completed } = body as Record<
      string,
      unknown
    >;
    if (typeof expectedLearnerId !== 'string' || !expectedLearnerId)
      return json(400, { error: 'invalid_learner_context' });
    if (expectedLearnerId !== user.id)
      return json(409, { error: 'learner_context_changed' });
    if (
      typeof lessonId !== 'string' ||
      !Object.hasOwn(lessonReleases, lessonId) ||
      typeof completed !== 'boolean'
    )
      return json(400, { error: 'invalid_completion' });
    // Use the verified session and owner-only RLS; no privileged key is needed.
    // Setting an explicit state is idempotent, including a lost-response retry.
    const table = auth.client.from('lesson_completions');
    const { error } = completed
      ? await table.upsert(
          { user_id: user.id, lesson_id: lessonId },
          {
            onConflict: 'user_id,lesson_id',
            ignoreDuplicates: true,
          },
        )
      : await table.delete().eq('user_id', user.id).eq('lesson_id', lessonId);
    if (error) return json(503, { error: 'storage_unavailable' });
    return json(200, { learnerId: user.id, lessonId, completed });
  } catch {
    return json(503, { error: 'completion_unavailable' });
  }
};
export const GET = handle;
export const POST = handle;
