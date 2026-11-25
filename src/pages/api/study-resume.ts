import type { APIRoute } from 'astro';
import { loadAttempts } from '../../lib/exercises/history';
import { exerciseBank } from '../../lib/exercises/bank';
import { loadReadingCompletions, studyResume } from '../../lib/study-progress';

export const prerender = false;
const json = (status: number, value: unknown) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.auth) return json(503, { error: 'auth_unavailable' });
  try {
    const user = await locals.auth.verifiedUser();
    if (!user) return json(401, { error: 'unauthenticated' });
    const [reading, attempts] = await Promise.all([
      loadReadingCompletions(locals.auth.client, user.id),
      loadAttempts(locals.auth.client, user.id),
    ]);
    // No responses, grades, solutions or learner-supplied URLs leave this API.
    return json(200, {
      learnerId: user.id,
      resume: studyResume(reading, attempts, exerciseBank),
    });
  } catch {
    return json(503, { error: 'progress_unavailable' });
  }
};
