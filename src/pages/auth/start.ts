import { randomBytes } from 'node:crypto';
import type { APIRoute } from 'astro';
import {
  localeOf,
  safeReturn,
  sameOriginPost,
  smallForm,
} from '../../lib/auth/policy';
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
  const nonce = randomBytes(32).toString('hex');
  const next = safeReturn(form.get('next'), locale);
  const callback = new URL('/auth/callback/', auth.config.origin);
  callback.searchParams.set('flow', nonce);
  try {
    const { data, error } = await auth.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callback.href, skipBrowserRedirect: true },
    });
    if (error || !data.url) throw new Error('OAuth failed');
    const target = new URL(data.url);
    if (
      target.origin !== auth.config.url ||
      target.pathname !== '/auth/v1/authorize'
    )
      throw new Error('Unexpected authorization URL');
    context.cookies.set(
      'um-auth-flow',
      JSON.stringify({ nonce, next, locale }),
      {
        path: '/',
        httpOnly: true,
        secure: auth.config.origin.startsWith('https:'),
        sameSite: 'lax',
        maxAge: 600,
      },
    );
    return context.redirect(target.href, 303);
  } catch {
    auth.clearCookies();
    return context.redirect(`/${locale}/sign-in/?error=unavailable`, 303);
  }
};
