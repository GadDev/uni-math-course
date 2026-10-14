export type AuthConfig = { url: string; key: string; origin: string };
export type AuthLocale = 'fr' | 'en';

export function localeOf(value: unknown): AuthLocale {
  return value === 'en' ? 'en' : 'fr';
}

export function safeOrigin(value: string): URL | null {
  try {
    const url = new URL(value);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (
      (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/'
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export function authConfig(
  env: Record<string, string | undefined>,
): AuthConfig | null {
  if (env.AUTH_PROVIDER !== 'google') return null;
  const url = safeOrigin(env.SUPABASE_URL ?? '');
  const site = safeOrigin(env.AUTH_SITE_URL ?? '');
  const key = env.SUPABASE_PUBLISHABLE_KEY ?? '';
  // Never accept a privileged key in the application session client.
  if (!url || !site || !key.startsWith('sb_publishable_') || /\s/.test(key))
    return null;
  return { url: url.origin, key, origin: site.origin };
}

export function safeReturn(value: unknown, locale: AuthLocale): string {
  const fallback = `/${locale}/account/`;
  if (typeof value !== 'string' || value.length > 300 || value !== value.trim())
    return fallback;
  // Explicit released routes only; reject encoding tricks and external origins.
  return /^\/(fr|en)\/(?:account\/|(?:lessons\/L05\/)?)(?:#[a-zA-Z0-9_-]+)?$/.test(
    value,
  )
    ? value
    : fallback;
}

export function sameOriginPost(request: Request, config: AuthConfig): boolean {
  return (
    request.method === 'POST' &&
    new URL(request.url).origin === config.origin &&
    request.headers.get('origin') === config.origin &&
    request.headers.get('sec-fetch-site') !== 'cross-site'
  );
}

export function authRoute(path: string): boolean {
  return /^\/(?:auth\/(?:start|callback|logout)|api\/auth\/session|(?:fr|en)\/(?:sign-in|account))\/?$/.test(
    path,
  );
}

export async function smallForm(
  request: Request,
): Promise<URLSearchParams | null> {
  if (
    request.headers.get('content-type')?.split(';')[0] !==
    'application/x-www-form-urlencoded'
  )
    return null;
  const reader = request.body?.getReader();
  if (!reader) return new URLSearchParams();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 2048) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new URLSearchParams(new TextDecoder().decode(data));
}
