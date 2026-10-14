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
    return user
      ? json(200, { user: { id: user.id } })
      : json(401, { error: 'unauthenticated' });
  } catch {
    return json(503, { error: 'auth_unavailable' });
  }
};
