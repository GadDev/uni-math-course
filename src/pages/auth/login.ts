import type { APIRoute } from 'astro';
import { createRequestAuth } from '../../lib/auth/server';
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
  if (!sameOriginPost(context.request, auth.config)) {
    return new Response('Forbidden', { status: 403 });
  }
  const form = await smallForm(context.request);
  if (!form) return new Response('Invalid form', { status: 400 });
  const locale = localeOf(form.get('locale'));
  const next = safeReturn(form.get('next'), locale);
  const back = (error: string) =>
    context.redirect(
      `/${locale}/sign-in/?${new URLSearchParams({ error, ...(next !== `/${locale}/account/` ? { next } : {}) })}`,
      303,
    );
  const email = (form.get('email') ?? '').trim();
  const password = form.get('password') ?? '';
  if (!email || email.length > 254 || !password || password.length > 256)
    return back('invalid');
  // A failed replacement login must not mutate the current browser session.
  const candidate = createRequestAuth(context, { isolated: true });
  if (!candidate) return back('unavailable');
  try {
    const { data, error } = await candidate.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session) {
      // Wrong credentials are indistinguishable from an unknown account.
      return back(
        error && (error.status === 400 || error.status === 401)
          ? 'invalid'
          : 'unavailable',
      );
    }
    if (!emailAllowed(auth.config, data.session.user.email)) {
      await candidate.client.auth.signOut({ scope: 'local' }).catch(() => null);
      return back('denied');
    }
    auth.clearCookies();
    candidate.setSessionHint();
    candidate.commitCookies();
    return context.redirect(next, 303);
  } catch {
    return back('unavailable');
  }
};
