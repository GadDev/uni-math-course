# Authentication and sessions

## Implemented scope

M2 feature 2 adds French/English sign-in and account pages, Google OAuth initiation, a PKCE callback, server-confirmed identity, cookie refresh and local logout. Public reading stays prerendered and makes no account requests. Exercises, grading, attempt storage and private progress remain separate features.

Google is the initial implementation choice from the stack proposal, not a claim that all classmates have suitable accounts. Sign-in is disabled unless the provider and configuration are explicit. There is no email/password, anonymous-account flow or custom SMTP dependency in this feature.

## Configure a development project

Use a separate Supabase Free development project and synthetic test accounts before involving classmates. Confirm an available free project slot and region. No project, billing, account or provider setting is created by this PR.

1. Copy .env.example to .env. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from the project's Connect dialog. Only a modern sb_publishable_ key is accepted; never use a secret key, service-role JWT or Google client secret in the app.
2. Set AUTH_SITE_URL to the exact browser origin, initially http://localhost:4321. Set AUTH_PROVIDER to google once the provider is configured. Origin includes the scheme and port, but no path. Restart/rebuild after changing it: Astro's trusted host list is fixed at build time. Production requires HTTPS; loopback HTTP is allowed for local development.
3. In Google Auth Platform, configure a Web application client, appropriate audience/test users and only the identity scopes required by Supabase. Register the Supabase project's callback URL in Google. Put the Google client ID/secret in Supabase's provider settings, never in this repository or browser code.
4. In Supabase Auth URL Configuration, set Site URL to the app origin. Allow the app's exact origin and callback path /auth/callback/. The callback includes the app's flow nonce and the SDK's sb_flow_id query parameters. Where a query suffix requires a glob, restrict it to that origin's /auth/callback/ subtree rather than all paths or all Vercel previews; verify the actual redirect with a test account. Do not replace the app callback with Google's Supabase callback: they are different legs of the journey.
5. Run pnpm dev. Open /fr/sign-in/ or /en/sign-in/, complete sign-in, reload /account/, switch language and sign out. Verify direct /api/auth/session/ is 401 afterwards. Account/session lookups report a configured service outage as 503, not a fabricated signed-in page.

For a Vercel preview, use an explicitly selected HTTPS preview origin, rebuild with its AUTH_SITE_URL, and allow that callback on the development Supabase project. Changing only runtime configuration cannot change the built Astro host allowlist. Keep production identity/data separate; a broad wildcard across unrelated preview deployments is not the default.

## Request and session contract

| Route | Behaviour |
| --- | --- |
| /fr/sign-in/, /en/sign-in/ | Server-rendered sign-in; disabled when unconfigured; already verified users return to an allowed local destination |
| POST /auth/start/ | Same-origin form, bounded body, Google OAuth URL, short-lived flow cookie and SDK PKCE verifier |
| GET /auth/callback/ | Match browser flow nonce, select SDK PKCE flow, exchange code, verify identity, redirect to a released local route |
| /fr/account/, /en/account/ | Verified identity only; anonymous users go to sign-in; service/configuration failures are unavailable |
| GET /api/auth/session/ | 200 with verified user ID, 401 without valid identity, 503 when unavailable; no token or profile dump |
| POST /auth/logout/ | Same-origin form; revoke the current session with local scope, clear browser credentials, report uncertain revocation on failure |

Every auth route is on demand. Each request creates its own Supabase SSR client; no client or user state is shared between requests. The adapter handles all cookie chunks and writes rotated cookies to the outgoing response. getUser performs the server-confirmed identity lookup; embedded cookie user records and unverified getSession results are never authorization evidence.

The SDK runs only on the server. Cookies are HttpOnly, SameSite=Lax and Secure for HTTPS, with path / and no shared Domain. Session cookies have a seven-day browser lifetime renewed when rotated; flow/verifier cookies last ten minutes. Provider token lifetimes and session policies still apply. Tokens are not stored in localStorage or serialized into page props.

All auth responses, including redirects/errors, have Cache-Control: private, no-store plus CDN no-store and Pragma/Expires headers. Callback/API responses use no-referrer; form pages use same-origin so Chromium preserves their Origin header. Auth pages have no ISR. Sign-in/logout require POST and the configured Origin; callback is a GET protected by the flow nonce and PKCE. Redirect destinations are a small allowlist of released locale routes. Malformed unrelated callbacks cannot clear an existing signed-in session. Starting another login replaces the pending app flow; a stale tab should restart sign-in.

Local logout ends this browser's session, not every device. Previously issued access JWTs can remain valid until expiry in other integrations; no immediate global token invalidation is promised. An outage clears browser credentials but cannot prove remote revocation. Future grading/data endpoints must independently use verified identity and enforce ownership.

## Test evidence and limits

The native policy tests reject unsafe origins/privileged keys, external return targets, cross-site mutations and oversized forms. Browser tests run a standalone Node production build with the same routes and middleware. A loopback-only Auth protocol fixture exercises the real Supabase SDK, PKCE exchange, verified lookup, forged cookies, expired/chunked-cookie refresh, invalid refresh, user separation, logout and failure handling. A second unconfigured server verifies the disabled state. No test hook is imported into the app.

pnpm check builds the real Vercel output. pnpm test:e2e builds .test-build with the Node adapter, launches the fixture and both local app servers, then runs browser checks. This is credential-free CI evidence, not a live Google/Supabase or deployed Vercel acceptance result.

Before activating hosted sign-in for classmates, verify real consent/callback, refresh and expiry, secure cookie flags, uncached responses, logout and two-account isolation on the chosen Vercel origin. Define identity-data retention, deletion/export and notice/contact details; Google/Supabase store identity data even though this app creates no profile/attempt tables yet. Confirm provider suitability and free-project pause/recovery behaviour. No hosted acceptance or privacy policy is claimed complete.

## Primary references

Reviewed 2026-10-14: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [SSR sessions and caching](https://supabase.com/docs/guides/auth/server-side/advanced-guide), [Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [logout](https://supabase.com/docs/reference/javascript/auth-signout), and [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/).
