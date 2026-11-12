import type { APIRoute } from 'astro';
import { createRequestAuth } from '../../lib/auth/server';
import {
  emailAllowed,
  localeOf,
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
  if (!auth) return new Response('Authentication unavailable', { status: 503 });
  if (!sameOriginPost(context.request, auth.config))
    return new Response('Forbidden', { status: 403 });
  const form = await smallForm(context.request);
  if (!form) return new Response('Invalid form', { status: 400 });
  const locale = localeOf(form.get('locale'));
  const email = (form.get('email') ?? '').trim();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return new Response('Invalid form', { status: 400 });

  // Do not reveal whether the account exists, is allowlisted or received mail.
  // Use Supabase's email rate limits; no extra public signup endpoint is added.
  if (emailAllowed(auth.config, email)) {
    const candidate = createRequestAuth(context, { isolated: true });
    try {
      const result = await candidate?.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${auth.config.origin}/auth/recovery/?locale=${locale}`,
      });
      if (result?.error) {
        // Only non-identifying metadata; never log email, token or provider payload.
        console.warn('[auth-recovery] Provider rejected reset request', {
          status: result.error.status ?? 0,
          code: result.error.code ?? 'unspecified',
        });
      }
    } catch {
      // Provider network failures must not turn into account-enumeration leaks.
      console.warn('[auth-recovery] Recovery provider unavailable');
    }
  }
  return context.redirect(`/${locale}/forgot-password/?sent=1`, 303);
};
