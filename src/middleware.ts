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
  // Keep same-origin form origins while hiding callback codes on redirects.
  response.headers.set(
    'Referrer-Policy',
    /^\/(fr|en)\/(sign-in|account)\/?$/.test(context.url.pathname)
      ? 'same-origin'
      : 'no-referrer',
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
});
