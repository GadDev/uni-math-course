# Hosted pilot E2E checks

Run the opt-in Playwright suite against one already deployed application. It uses the existing real login, practice and progress routes; it does not deploy, apply migrations, create users, approve a release or mark [pilot acceptance](PILOT_ACCEPTANCE.md) complete.

## Prepare the target

Use a dedicated acceptance/preview environment with two existing synthetic accounts, both allowed by the app's access policy. The suite saves persistent attempts to those accounts, including intentionally wrong/hinted learning evidence; do not use learner accounts. Keep the accounts exclusive to the run so concurrent activity does not change progress totals. No cleanup is attempted: deletion and reset need their own authorized procedure. Repeated runs add attempts, so assertions compare totals before and after rather than assuming empty history.

Confirm the exact deployment origin and commit in the hosting dashboard, with the expected migrations applied. Use an immutable deployment URL where possible and do not redeploy during the run. The suite records the operator's declared revision/deployment; it cannot prove that the server serves that commit. A successful login alone is not H1 acceptance. Hosting protection must already permit this browser; the suite adds no bypass credential.

Install locked dependencies and Chromium using the README setup. Supply settings in the process environment through your local secret manager or shell; never commit them or paste passwords into a command history or public logs. This runner does not load .env automatically.

| Variable | Required value |
| --- | --- |
| HOSTED_BASE_URL | Bare HTTPS origin for the intended deployment, without credentials, path, query or fragment |
| HOSTED_ALLOW_TEST_WRITES | `1`, acknowledging writes to the two dedicated synthetic accounts |
| HOSTED_ACCOUNT_A_EMAIL / HOSTED_ACCOUNT_A_PASSWORD | First existing synthetic account credentials |
| HOSTED_ACCOUNT_B_EMAIL / HOSTED_ACCOUNT_B_PASSWORD | Different existing synthetic account credentials |
| HOSTED_APP_SHA | Full 40-character deployed application commit, checked by the operator |
| HOSTED_DEPLOYMENT_ID | Hosting deployment identifier checked by the operator |
| HOSTED_OPERATOR | Operator handle, avoiding unnecessary personal details |
| HOSTED_SUPABASE_URL / HOSTED_SUPABASE_PUBLISHABLE_KEY | Optional pair: target project's bare HTTPS origin and modern publishable key, for direct Data API checks. Never use a secret/service-role key |

```sh
pnpm test:e2e:hosted
```

Missing required settings fail before contacting the target. Direct Data API checks are explicitly skipped when the optional pair is absent; the run must not be described as complete H3 evidence. Use the project matching this deployment, not an unrelated Supabase instance. No credentials are added to ordinary PR CI, and this command is separate from `pnpm test:e2e`.

## Coverage and limits

| Acceptance | Automated evidence | Still separate |
| --- | --- | --- |
| H1 | Records operator-supplied origin, app SHA and deployment ID | Independent deployment identity, migration/settings audit, preview isolation |
| H2 | FR/EN real login/logout, secure HttpOnly SameSite cookies, no-store session/progress responses, two-tab logout/account replacement, same-account draft/selection preservation, language switching and actual Back navigation | Real token expiry/refresh, provider outage, guaranteed native BFCache restoration and other browser engines |
| H3 | Real UI save, feedback/reload, later sign-in persistence, returning-tab progress refresh; committed response loss and deadline recovery replay identical payload/UUID and add one lifetime attempt | Injected client faults do not prove a real provider/network outage. Direct Data API ownership/grants require the optional settings |
| H3 direct Data API | Owner-only history RPC, targeted foreign-row read isolation, denied anonymous history RPC and denied authenticated table insertion; stale learner submission rejected | Full privilege/migration inventory, update/delete/function grant audit and restoration remain SQL/operator checks |
| H4 / O1 / O2 / R1 / R2 | No automatic approval | Keyboard/screen-reader and visual review, privacy, costs, recovery, mathematical/bilingual review and rights decisions |

L05-E01 must remain available as a single-choice activity; the suite chooses the first displayed option without importing answer banks. If that teaching contract changes, update the test deliberately. Existing test-account mastery evidence is not reset.

Fault tests send a real write first, then suppress or delay its acknowledgement inside Playwright. The deadline check advances the browser clock after the server responds; it tests the deployed client's timeout/replay behavior, not a timed provider failure. Tab changes use real pages sharing a cookie jar plus explicit focus/visibility events for deterministic headless behavior. Back navigation may reload or use browser history caching; no BFCache eligibility claim is made.

## Evidence and diagnostics

The custom reporter writes `private/hosted-acceptance/summary.json` with static check names, statuses, time and declared deployment identity. It excludes raw errors, assertions, credentials, tokens, account IDs/emails and attempt payloads. Traces, screenshots, videos and storage-state files are disabled; temporary Playwright failure artifacts are discarded (`preserveOutput: never`) rather than published. Do not add a standard reporter or capture browser/network dumps when real credentials are present.

Read failures as incomplete evidence. Reproduce failures with the local protocol fixture or inspect privately before sharing diagnostics; do not publish raw provider responses. Review the sanitized report before copying selected results into a documentation PR. Link the tested revision and deployment and close only the specific checks completed; skipped Data API checks and human decisions stay pending. This suite does not edit the acceptance document or control application releases.

## Local runner verification

```sh
HOSTED_LOCAL_FIXTURE=1 pnpm test:e2e:hosted
```

This mode starts the existing isolated Auth/Data API fixture and Node application, seeds a second synthetic fixture identity and uses fixed test-only credentials. It also exercises the direct Data API paths against that protocol fixture, not real PostgreSQL grants. It ignores hosted account settings and labels evidence `local-protocol-fixture`; it is never hosted acceptance. Optional direct hosted Data API settings must be unset in this mode. It needs no cloud account and does not validate real PostgreSQL grants. The ordinary browser suite and disposable database suite remain separate checks.

## Playwright references

Configuration follows the official [TestConfig options](https://playwright.dev/docs/api/class-testconfig) and [custom reporter interface](https://playwright.dev/docs/api/class-reporter), checked 2026-10-16.
