import { practiceHref, practiceTarget } from '../practice-navigation.ts';

export type AuthConfig = {
  url: string;
  key: string;
  origin: string;
  // Lower-cased emails permitted to sign in; null means no extra restriction.
  allowedEmails: ReadonlySet<string> | null;
};
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
  // Accounts are created by the course owner; there is no public sign-up.
  if (env.AUTH_PROVIDER !== 'password') return null;
  const listed = (env.AUTH_ALLOWED_EMAILS ?? '')
    .split(/[,\s;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const url = safeOrigin(env.SUPABASE_URL ?? '');
  const site = safeOrigin(env.AUTH_SITE_URL ?? '');
  const key = env.SUPABASE_PUBLISHABLE_KEY ?? '';
  // Never accept a privileged key in the application session client.
  if (!url || !site || !key.startsWith('sb_publishable_') || /\s/.test(key))
    return null;
  return {
    url: url.origin,
    key,
    origin: site.origin,
    allowedEmails: listed.length ? new Set(listed) : null,
  };
}

export function emailAllowed(
  config: AuthConfig,
  email: string | null | undefined,
): boolean {
  if (!config.allowedEmails) return true;
  return !!email && config.allowedEmails.has(email.trim().toLowerCase());
}

export function safeReturn(value: unknown, locale: AuthLocale): string {
  const fallback = `/${locale}/account/`;
  if (typeof value !== 'string' || value.length > 300 || value !== value.trim())
    return fallback;
  // Validate the raw path before parsing query parameters: URL normalization
  // must not turn an encoded or traversal destination into an allowed route.
  const hash = value.indexOf('#');
  const fragment = hash < 0 ? '' : value.slice(hash);
  const [path = '', query, extra] = (
    hash < 0 ? value : value.slice(0, hash)
  ).split('?');
  if (
    extra !== undefined ||
    !/^\/(fr|en)\/(?:account\/|progress\/|(?:lessons\/L(?:0[1-9]|1[0-9]|20)\/(?:practice\/)?)?)(?:#[a-zA-Z0-9_-]+)?$/.test(
      path + fragment,
    )
  )
    return fallback;
  if (query === undefined) return value;
  const lessonId = path.match(/lessons\/(L\d{2})\/practice\/$/)?.[1];
  if (!lessonId || value.includes('%')) return fallback;
  const target = practiceTarget(new URLSearchParams(query), lessonId);
  return target
    ? practiceHref(path.startsWith('/en/') ? 'en' : 'fr', lessonId, target) +
        fragment
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
  return /^\/(?:auth\/(?:login|logout)|api\/(?:auth\/session|attempts|exercises\/L[0-9]{2})|(?:fr|en)\/(?:sign-in|account|progress|lessons\/L[0-9]{2}\/practice))\/?$/.test(
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

// Reads a small JSON body; undefined when the type, size or syntax is wrong.
export async function smallJson(
  request: Request,
  limit = 8192,
): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json')
    return undefined;
  const reader = request.body?.getReader();
  if (!reader) return undefined;
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return undefined;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(
      new TextDecoder().decode(Buffer.concat(chunks)),
    ) as unknown;
  } catch {
    return undefined;
  }
}
