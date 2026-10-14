import type { APIRoute } from 'astro';
import { localeOf, sameOriginPost, smallForm } from '../../lib/auth/policy';
export const prerender = false;
export const GET: APIRoute = () =>
  new Response('Method not allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
export const POST: APIRoute = async (context) => {
  const auth = context.locals.auth;
  if (!auth) return new Response('Sign-in is not configured.', { status: 503 });
  if (!sameOriginPost(context.request, auth.config))
    return new Response('Forbidden', { status: 403 });
  const form = await smallForm(context.request);
  if (!form) return new Response('Invalid form', { status: 400 });
  const locale = localeOf(form.get('locale'));
  try {
    const { error } = await auth.client.auth.signOut({ scope: 'local' });
    auth.clearCookies();
    if (error) return context.redirect(`/${locale}/sign-in/?error=logout`, 303);
    return context.redirect(`/${locale}/sign-in/?signedOut=1`, 303);
  } catch {
    auth.clearCookies();
    return context.redirect(`/${locale}/sign-in/?error=logout`, 303);
  }
};
