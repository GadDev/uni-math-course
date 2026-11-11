import type { APIRoute } from 'astro';
import {
  localeOf,
  RECOVERY_COOKIE,
  RECOVERY_COOKIE_PATH,
  validRecoveryToken,
} from '../../lib/auth/policy';

export const prerender = false;
export const POST: APIRoute = () =>
  new Response('Method not allowed', {
    status: 405,
    headers: { Allow: 'GET' },
  });

export const GET: APIRoute = (context) => {
  const auth = context.locals.auth;
  if (!auth) return new Response('Authentication unavailable', { status: 503 });
  if (new URL(context.request.url).origin !== auth.config.origin)
    return new Response('Forbidden', { status: 403 });
  const locale = localeOf(context.url.searchParams.get('locale'));
  const token = context.url.searchParams.get('token_hash');
  if (
    context.url.searchParams.get('type') !== 'recovery' ||
    !validRecoveryToken(token)
  ) {
    context.cookies.delete(RECOVERY_COOKIE, { path: RECOVERY_COOKIE_PATH });
    return context.redirect(`/${locale}/forgot-password/?sent=0`, 303);
  }
  // Safe against email scanners: GET only transports proof, never verifies it.
  context.cookies.set(RECOVERY_COOKIE, token, {
    path: RECOVERY_COOKIE_PATH,
    httpOnly: true,
    secure: auth.config.origin.startsWith('https:'),
    sameSite: 'strict',
    maxAge: 15 * 60,
  });
  // Strip token from URL before the page, scripts or analytics are rendered.
  return context.redirect(`/${locale}/reset-password/`, 303);
};
