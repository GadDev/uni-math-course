# Authentication and sessions

## Implemented scope

M2 feature 2 adds French/English sign-in and account pages, email/password sign-in against Supabase Auth, server-confirmed identity, cookie refresh and local logout. Public reading stays prerendered and makes no account requests. Exercises, grading, attempt storage and private progress remain separate features.

Access is limited to a closed group. The course owner creates each learner's account in the Supabase dashboard; public sign-up is disabled. There is no OAuth provider, anonymous account, magic link or custom SMTP dependency. Sign-in is disabled unless `AUTH_PROVIDER=password` and the Supabase settings are explicit. An optional `AUTH_ALLOWED_EMAILS` list (comma-separated) is a second safety net: when set, any other verified account is treated as anonymous.

Microsoft/uni.lu single sign-on was considered and dropped because an Entra app registration is not available to the maintainer. Revisit it only if uni.lu IT registers an application.

## Configure a development project

Use a separate Supabase Free development project and synthetic test accounts before involving classmates. No project, billing or account setting is created by this repository.

1. Create the project, then copy .env.example to .env. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from the project's Connect dialog. Only a modern sb_publishable_ key is accepted; never use a secret key or service-role JWT in the session client.
2. Set AUTH_PROVIDER=password and AUTH_SITE_URL to the exact browser origin, initially http://localhost:4321 (scheme and port, no path). Restart/rebuild after changing it: Astro's trusted host list is fixed at build time. Production requires HTTPS; loopback HTTP is allowed for local development.
3. In Supabase, open Authentication → Sign In / Providers. Keep Email enabled and turn **Allow new users to sign up** off. Under Email, leave email confirmation as you prefer; users created from the dashboard can be marked auto-confirmed.
4. Add each classmate under Authentication → Users → Add user → Create new user, with their email, an initial password, and Auto Confirm User checked. Share the password privately and ask them to keep it. Password resets are manual: delete or edit the user's password in the dashboard.
5. Optionally set AUTH_ALLOWED_EMAILS to the same list so that accounts created by mistake cannot enter.
6. Run pnpm dev. Open /fr/sign-in/ or /en/sign-in/, sign in, reload /account/, switch language and sign out. Verify direct /api/auth/session/ is 401 afterwards. Account/session lookups report a configured service outage as 503, not a fabricated signed-in page.

For a Vercel preview, use an explicitly selected HTTPS preview origin and rebuild with its AUTH_SITE_URL. Keep production identity/data separate from development.

## Request and session contract

| Route | Behaviour |
| --- | --- |
| /fr/sign-in/, /en/sign-in/ | Server-rendered email/password form; disabled when unconfigured; already verified users return to an allowed local destination |
| POST /auth/login/ | Same-origin form, bounded body; wrong or unknown credentials give one generic error; success sets session cookies and redirects to a released local route |
| /fr/account/, /en/account/ | Verified identity only; anonymous users go to sign-in; service/configuration failures are unavailable |
| GET /api/auth/session/ | 200 with verified user ID, 401 without valid identity, 503 when unavailable; no token or profile dump |
| POST /auth/logout/ | Same-origin form; revoke the current session with local scope, clear browser credentials, report uncertain revocation on failure |

Every auth route is on demand. Each request creates its own Supabase SSR client; no client or user state is shared between requests. The adapter handles all cookie chunks and writes rotated cookies to the outgoing response. getUser performs the server-confirmed identity lookup; embedded cookie user records and unverified getSession results are never authorization evidence.

The SDK runs only on the server. Cookies are HttpOnly, SameSite=Lax and Secure for HTTPS, with path / and no shared Domain, and a seven-day browser lifetime renewed when rotated. Provider token lifetimes and session policies still apply. Tokens are not stored in localStorage or serialized into page props. The password is sent once to the same-origin login endpoint and is never stored or logged by the app.

All auth responses, including redirects/errors, have Cache-Control: private, no-store plus CDN no-store and Pragma/Expires headers. Login/logout require POST and the configured Origin. Auth pages have no ISR. Redirect destinations are a small allowlist of released locale routes. A failed login cannot clear an existing signed-in session. Supabase applies its own rate limits to password attempts; confirm them in the dashboard before inviting the class.

Local logout ends this browser's session, not every device. Previously issued access JWTs can remain valid until expiry in other integrations; no immediate global token invalidation is promised. An outage clears browser credentials but cannot prove remote revocation. Future grading/data endpoints must independently use verified identity (which already applies the optional email allowlist) and enforce ownership.

## Test evidence and limits

The native policy tests reject unsafe origins/privileged keys, external return targets, cross-site mutations and oversized forms, and cover the email allowlist. Browser tests run a standalone Node production build with the same routes and middleware. A loopback-only Auth protocol fixture exercises the real Supabase SDK for password sign-in, verified lookup, forged cookies, expired/chunked-cookie refresh, invalid refresh, user separation, logout and failure handling. A second unconfigured server verifies the disabled state. No test hook is imported into the app.

pnpm check builds the real Vercel output. pnpm test:e2e builds .test-build with the Node adapter, launches the fixture and both local app servers, then runs browser checks. This is credential-free CI evidence, not a live Supabase or deployed Vercel acceptance result.

Before activating hosted sign-in for classmates, verify on the chosen Vercel origin: sign-up is disabled, a created user can sign in, refresh/expiry, secure cookie flags, uncached responses, logout, and two-account isolation. Define identity-data retention, deletion/export and notice/contact details; Supabase stores emails and password hashes even though this app creates no profile/attempt tables yet. Confirm free-project pause/recovery behaviour. No hosted acceptance or privacy policy is claimed complete.

## Primary references

Reviewed 2026-10-14: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [SSR sessions and caching](https://supabase.com/docs/guides/auth/server-side/advanced-guide), [password auth](https://supabase.com/docs/guides/auth/passwords), [logout](https://supabase.com/docs/reference/javascript/auth-signout), and [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/).
