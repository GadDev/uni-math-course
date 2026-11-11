# Authentication and sessions

## Implemented scope

M2 feature 2 adds French/English sign-in and account pages, email/password sign-in against Supabase Auth, server-confirmed identity, cookie refresh and local logout. Public reading stays prerendered; a signed-in header may verify its session hint. Practice, grading, attempt storage and private progress are implemented separately; see [PRACTICE.md](PRACTICE.md).

Access is limited to a closed group. The course owner creates each learner's account in the Supabase dashboard; public sign-up is disabled. There is no OAuth provider, anonymous account, magic link or custom SMTP dependency. Sign-in is disabled unless `AUTH_PROVIDER=password` and the Supabase settings are explicit. An optional `AUTH_ALLOWED_EMAILS` list (comma-separated) is a second safety net: when set, any other verified account is treated as anonymous.

Microsoft/uni.lu single sign-on was considered and dropped because an Entra app registration is not available to the maintainer. Revisit it only if uni.lu IT registers an application.

## Configure a development project

Use a separate Supabase Free development project and synthetic test accounts before involving classmates. No project, billing or account setting is created by this repository.

1. Create the project, then copy .env.example to .env. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from the project's Connect dialog. Only a modern sb_publishable_ key is accepted; never use a secret key or service-role JWT in the session client.
2. Set AUTH_PROVIDER=password and AUTH_SITE_URL to the exact browser origin, initially http://localhost:4321 (scheme and port, no path). Restart/rebuild after changing it: Astro's trusted host list is fixed at build time. Production requires HTTPS; loopback HTTP is allowed for local development.
3. In Supabase, open Authentication → Sign In / Providers. Keep Email enabled and turn **Allow new users to sign up** off. Under Email, leave email confirmation as you prefer; users created from the dashboard can be marked auto-confirmed.
4. Add each classmate under Authentication → Users → Add user → Create new user, with their email, an initial password, and Auto Confirm User checked. Share the password privately and ask them to keep it. Password resets are self-service: users request a one-time recovery link from the sign-in page. Do not edit `auth.users` directly.
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
| /fr/forgot-password/, /en/forgot-password/ | Public request form, generic confirmation (no account enumeration) |
| POST /auth/forgot-password/ | Same-origin bounded form, Supabase recovery email (allowlisted when configured) |
| GET /auth/recovery/ | Transport token hash to short-lived HttpOnly cookie without verifying it on GET |
| /fr/reset-password/, /en/reset-password/ | Public password-entry form; no tokens in HTML or JavaScript |
| POST /auth/reset-password/ | Same-origin bounded form, verify one-time recovery OTP, update password and require fresh sign-in |

Every auth route is on demand. Each request creates its own Supabase SSR client; no client or user state is shared between requests. The adapter handles all cookie chunks and writes rotated cookies to the outgoing response. getUser performs the server-confirmed identity lookup; embedded cookie user records and unverified getSession results are never authorization evidence.

The SDK runs only on the server. Cookies are HttpOnly, SameSite=Lax and Secure for HTTPS, with path / and no shared Domain, and a seven-day browser lifetime renewed when rotated. Provider token lifetimes and session policies still apply. Tokens are not stored in localStorage or serialized into page props. The password is sent once to the same-origin login endpoint and is never stored or logged by the app.

All auth responses, including redirects/errors, have Cache-Control: private, no-store plus CDN no-store and Pragma/Expires headers. Login/logout require POST and the configured Origin. Auth pages have no ISR. Redirect destinations are a small allowlist of released locale routes. A failed login cannot clear an existing signed-in session. Supabase applies its own rate limits to password attempts; confirm them in the dashboard before inviting the class.

Local logout ends this browser's session, not every device. Previously issued access JWTs can remain valid until expiry in other integrations; no immediate global token invalidation is promised. An outage clears browser credentials but cannot prove remote revocation. Future grading/data endpoints must independently use verified identity (which already applies the optional email allowlist) and enforce ownership.

## Returning tabs and browser history

The shared browser session lifecycle checks `/api/auth/session/` on visible-tab focus/visibility changes and persisted `pageshow` restoration. A short event coalescing window and a shared in-flight promise prevent duplicate header/activity checks. Initial public anonymous reading still makes no account request. The on-demand practice page uses its freshly server-verified learner ID for initial header state and answer-free exercise hydration, avoiding an immediate redundant session check. This marker is UI state, never authorization; focus, visibility and persisted-pageshow events still revalidate, and every API mutation independently verifies identity and learner context.

A verified `200` updates the header. If identity is unchanged, practice drafts and pending submission snapshots remain untouched. A confirmed `401` clears practice drafts and removes old private UI; an account change does the same before a protected account/progress page is re-rendered. Practice offers the existing current-account loading action instead of submitting or silently transferring old answers. Requests from a discarded activity cannot restore old feedback after the change.

A `503`, other unexpected response, timeout or network failure shows a bilingual verification-unavailable notice and preserves drafts and the last confirmed UI. It is not treated as logout; a subsequent return event retries verification. Existing server checks and the submission learner precondition remain authoritative.

A returning progress page fetches its current server-rendered HTML without cache and replaces only its private progress region, after checking the response owner. It never reloads a practice island or overwrites unfinished answers. Account changes and redirected progress responses first clear private HTML, then navigate through the existing protected route. No polling, Realtime subscription, shared draft store or new infrastructure is introduced.

Browser tests include real multi-tab cookie/session changes, actual back/forward navigation, and deterministic persisted-pageshow event coverage. Headless event simulation is not proof that every browser will admit these private pages to BFCache; hosted browser acceptance remains separate.

## Test evidence and limits

The native policy tests reject unsafe origins/privileged keys, external return targets, cross-site mutations and oversized forms, and cover the email allowlist. Browser tests run a standalone Node production build with the same routes and middleware. A loopback-only Auth protocol fixture exercises the real Supabase SDK for password sign-in, verified lookup, forged cookies, expired/chunked-cookie refresh, invalid refresh, user separation, logout and failure handling. A second unconfigured server verifies the disabled state. No test hook is imported into the app.

pnpm check builds the real Vercel output. pnpm test:e2e builds .test-build with the Node adapter, launches the fixture and both local app servers, then runs browser checks. This is credential-free CI evidence, not a live Supabase or deployed Vercel acceptance result.

Before activating hosted sign-in for classmates, verify on the chosen Vercel origin: sign-up is disabled, a created user can sign in, refresh/expiry, secure cookie flags, uncached responses, logout, and two-account isolation. Define identity-data retention, deletion/export and notice/contact details; Supabase stores emails and password hashes and this app stores attempt records. Confirm free-project pause/recovery behaviour. No hosted acceptance or privacy policy is claimed complete.

## Primary references

Reviewed 2026-10-14: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [SSR sessions and caching](https://supabase.com/docs/guides/auth/server-side/advanced-guide), [password auth](https://supabase.com/docs/guides/auth/passwords), [logout](https://supabase.com/docs/reference/javascript/auth-signout), and [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/).

## Password recovery deployment (manual Supabase settings)

The code does not edit a hosted Supabase project's settings. In **Authentication → Email Templates → Reset Password**, replace the default `{{ .ConfirmationURL }}` link with:

```html
<a href="{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=recovery">Reset your password</a>
```

`resetPasswordForEmail` always supplies `RedirectTo` as the trusted `AUTH_SITE_URL` origin plus `/auth/recovery/?locale=fr` or `locale=en`. In **Authentication → URL Configuration**, allow the exact production `https://YOUR_DOMAIN/auth/recovery/**` path (and your explicitly selected development/preview origins as needed). Keep the Site URL on the intended production HTTPS domain; remove stale `localhost:3000` entries from production configuration. Emails generated before changing the template will not work with this server-side flow: request a fresh one. Confirm the new template actually appears in a delivered test email.

The GET landing does **not** redeem the recovery proof: email/link scanners cannot consume it by prefetching. The token is carried in an HttpOnly, SameSite=Strict, host-only, path-scoped, 15-minute cookie before redirecting to a clean URL. Only the same-origin POST verifies it with Supabase and changes the password. The recovery session uses an isolated server client and never reaches the browser; success clears old local credentials and requires a new sign-in. Provider OTP expiry and single-use semantics still apply. Do not put the reset token in logs, analytics, support screenshots or client storage. Configure reasonable **Authentication → Rate Limits** and SMTP deliverability and test with synthetic accounts.

Security checks: anonymous account/progress/API requests remain protected by `verifiedUser()`; recovery pages are intentionally public, but mutations need both the recovery proof and the existing same-origin POST validation. Responses remain uncached and the PWA does not cache auth URLs. Test unknown emails, scanners that GET the email URL, replay/expired proofs, cross-site POSTs and after-reset login before enabling this for learners. These local checks are not hosted Supabase acceptance.
