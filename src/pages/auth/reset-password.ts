import type { APIRoute } from 'astro';
import { createRequestAuth } from '../../lib/auth/server';
import {
  localeOf,
  RECOVERY_COOKIE,
  RECOVERY_COOKIE_PATH,
  sameOriginPost,
  smallForm,
  validNewPassword,
  validRecoveryToken,
} from '../../lib/auth/policy';

export const prerender = false;
export const GET: APIRoute = () =>
  new Response('Method not allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });

export const POST: APIRoute = async (context) => {
  const auth = context.locals.auth;
  if (!auth) return new Response('Authentication unavailable', { status: 503 });
  if (!sameOriginPost(context.request, auth.config))
    return new Response('Forbidden', { status: 403 });
  const form = await smallForm(context.request);
  if (!form) return new Response('Invalid form', { status: 400 });
  const locale = localeOf(form.get('locale'));
  const back = (reason: string) =>
    context.redirect(`/${locale}/reset-password/?error=${reason}`, 303);
  const password = form.get('password');
  if (!validNewPassword(password) || password !== form.get('confirm'))
    return back('invalid');
  const token = context.cookies.get(RECOVERY_COOKIE)?.value;
  if (!validRecoveryToken(token)) return back('expired');
  context.cookies.delete(RECOVERY_COOKIE, { path: RECOVERY_COOKIE_PATH });

  // A separate client prevents password recovery from changing the current
  // browser's session. Its auth cookies are never committed to the response.
  const candidate = createRequestAuth(context, { isolated: true });
  if (!candidate) return back('unavailable');
  let verified = false;
  try {
    const result = await candidate.client.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    });
    if (result.error || !result.data.session || !result.data.user)
      return back('expired');
    const user = await candidate.verifiedUser();
    if (!user || user.id !== result.data.user.id) return back('expired');
    verified = true;
    const changed = await candidate.client.auth.updateUser({ password });
    if (changed.error) return back('unavailable');
    // End the previous local session too; require a fresh password sign-in.
    auth.clearCookies();
    return context.redirect(`/${locale}/sign-in/?reset=1`, 303);
  } catch {
    return back(verified ? 'unavailable' : 'expired');
  } finally {
    await candidate.client.auth.signOut({ scope: 'local' }).catch(() => null);
  }
};
