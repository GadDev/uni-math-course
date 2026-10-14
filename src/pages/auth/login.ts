import type { APIRoute } from 'astro';
import {
  emailAllowed,
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
  const back = (error: string) =>
    context.redirect(`/${locale}/sign-in/?error=${error}`, 303);
  const email = (form.get('email') ?? '').trim();
  const password = form.get('password') ?? '';
  if (!email || email.length > 254 || !password || password.length > 256)
    return back('invalid');
  try {
    const { data, error } = await auth.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session) {
      auth.clearCookies();
      // Wrong credentials are indistinguishable from an unknown account.
      return back(
        error && (error.status === 400 || error.status === 401)
          ? 'invalid'
          : 'unavailable',
      );
    }
    if (!emailAllowed(auth.config, data.session.user.email)) {
      await auth.client.auth.signOut({ scope: 'local' }).catch(() => null);
      auth.clearCookies();
      return back('denied');
    }
    return context.redirect(safeReturn(form.get('next'), locale), 303);
  } catch {
    auth.clearCookies();
    return back('unavailable');
  }
};
