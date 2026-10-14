import { timingSafeEqual } from 'node:crypto';
import type { APIRoute } from 'astro';
import { localeOf, safeReturn } from '../../lib/auth/policy';
export const prerender = false;
export const GET: APIRoute = async (context) => {
  const auth = context.locals.auth;
  if (!auth) return new Response('Sign-in is not configured.', { status: 503 });
  let locale: 'fr' | 'en' = 'fr';
  let exchanged = false;
  try {
    const flow = context.cookies.get('um-auth-flow')?.json();
    locale = localeOf(flow?.locale);
    const nonce = context.url.searchParams.get('flow');
    if (
      context.url.origin !== auth.config.origin ||
      !nonce ||
      !/^[a-f0-9]{64}$/.test(nonce) ||
      !/^[a-f0-9]{64}$/.test(flow?.nonce ?? '') ||
      !timingSafeEqual(Buffer.from(nonce), Buffer.from(flow.nonce))
    )
      throw new Error('Invalid flow');
    const code = context.url.searchParams.get('code');
    if (context.url.searchParams.has('error') || !code || code.length > 2048)
      throw new Error('Invalid callback');
    const flowId = context.url.searchParams.get('sb_flow_id');
    const { data, error } = await auth.client.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );
    if (error || !data.session) throw new Error('Invalid session');
    exchanged = true;
    if (!(await auth.verifiedUser())) throw new Error('Invalid session');
    context.cookies.delete('um-auth-flow', { path: '/' });
    return context.redirect(safeReturn(flow.next, locale), 303);
  } catch {
    // An unrelated/malformed callback must not sign out an existing user.
    if (exchanged) auth.clearCookies();
    else context.cookies.delete('um-auth-flow', { path: '/' });
    return context.redirect(`/${locale}/sign-in/?error=callback`, 303);
  }
};
