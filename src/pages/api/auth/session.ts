import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = async ({ locals }) => {
  const json = (status: number, value: unknown) =>
    new Response(JSON.stringify(value), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  if (!locals.auth) return json(503, { error: 'auth_unavailable' });
  try {
    const user = await locals.auth.verifiedUser();
    if (user) return json(200, { user: { id: user.id } });
    // A stale hint would make every page ask again.
    locals.auth.clearSessionHint();
    return json(401, { error: 'unauthenticated' });
  } catch {
    return json(503, { error: 'auth_unavailable' });
  }
};
