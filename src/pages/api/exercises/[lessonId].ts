import type { APIRoute } from 'astro';
import { RELEASED_LESSONS } from '../../../lib/released-lessons';
import { publicExercises } from '../../../lib/exercises/public-bank';
export const prerender = false;
const json = (status: number, value: unknown) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.auth) return json(503, { error: 'auth_unavailable' });
  let user;
  try {
    user = await locals.auth.verifiedUser();
  } catch {
    return json(503, { error: 'auth_unavailable' });
  }
  if (!user) return json(401, { error: 'unauthenticated' });
  const lessonId = params.lessonId ?? '';
  if (!RELEASED_LESSONS.includes(lessonId))
    return json(404, { error: 'unknown_lesson' });
  const exercises = publicExercises(lessonId);
  return json(200, { learner: user.id, lessonId, exercises });
};
