import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { APIContext } from 'astro';
import { authConfig, type AuthConfig } from './policy';

export type RequestAuth = {
  config: AuthConfig;
  client: SupabaseClient;
  verifiedUser: () => Promise<User | null>;
  clearCookies: () => void;
};

export function createRequestAuth(context: APIContext): RequestAuth | null {
  const config = authConfig({
    SUPABASE_URL: process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY:
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      import.meta.env.SUPABASE_PUBLISHABLE_KEY,
    AUTH_SITE_URL: process.env.AUTH_SITE_URL ?? import.meta.env.AUTH_SITE_URL,
    AUTH_PROVIDER: process.env.AUTH_PROVIDER ?? import.meta.env.AUTH_PROVIDER,
  });
  if (!config) return null;
  const jar = new Map(
    parseCookieHeader(context.request.headers.get('cookie') ?? '').map(
      ({ name, value }) => [name, value ?? ''],
    ),
  );
  const prefix = `sb-${new URL(config.url).hostname.split('.')[0]}-auth-token`;
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: config.origin.startsWith('https:'),
    sameSite: 'lax' as const,
  };
  const client = createServerClient(config.url, config.key, {
    cookieOptions,
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) {
          jar.set(name, value);
          context.cookies.set(name, value, {
            ...options,
            ...cookieOptions,
            maxAge: value
              ? name.includes('-code-verifier')
                ? 600
                : 7 * 24 * 60 * 60
              : 0,
          });
        }
        // Middleware adds no-store headers to every auth response, including redirects.
      },
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.any([
            AbortSignal.timeout(8000),
            ...(init?.signal ? [init.signal] : []),
          ]),
        }),
    },
  });
  let userPromise: Promise<User | null> | undefined;
  return {
    config,
    client,
    verifiedUser: () =>
      (userPromise ??= (async () => {
        // A fresh server-confirmed lookup also checks the current account/session.
        const { data, error } = await client.auth.getUser();
        if (error) {
          if (
            error.name === 'AuthSessionMissingError' ||
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          )
            return null;
          throw new Error('Authentication service unavailable');
        }
        return data.user;
      })()),
    clearCookies: () => {
      for (const name of jar.keys()) {
        if (
          name === prefix ||
          name.startsWith(`${prefix}.`) ||
          name.startsWith(`${prefix}-`)
        ) {
          context.cookies.set(name, '', { ...cookieOptions, maxAge: 0 });
          jar.delete(name);
        }
      }
      context.cookies.set('um-auth-flow', '', { ...cookieOptions, maxAge: 0 });
    },
  };
}
