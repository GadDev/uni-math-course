import { defineMiddleware } from 'astro:middleware';
import { authRoute } from './lib/auth/policy';
import { createRequestAuth } from './lib/auth/server';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || !authRoute(context.url.pathname)) return next();
  context.locals.auth = createRequestAuth(context);
  const response = await next();
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Vercel-CDN-Cache-Control', 'no-store');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  // no-referrer on a form page makes Chromium send Origin: null.
  // Every localized page can contain the profile logout form, including
  // progress and practice. APIs/redirect endpoints need no referrer.
  response.headers.set(
    'Referrer-Policy',
    /^\/(fr|en)\//.test(context.url.pathname) ? 'same-origin' : 'no-referrer',
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
});
