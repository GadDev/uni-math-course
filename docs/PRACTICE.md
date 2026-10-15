# Practice, grading and progress

Status: implemented locally for L01–L20; only L05 self-checked; hosted acceptance pending.

## Scope

A signed-in learner can open the L05 practice section, answer six exercises, receive server-graded feedback, and see saved attempts, open mistakes and mastery evidence on a private progress page. L01–L20 are served (selected versions and review states in `content/releases.json`, exposed by `src/lib/released-lessons.ts`). Only L05 has passed mathematical and bilingual review; the other banks were released at the maintainer's request before that review, and their practice pages say so. Remove a lesson from the list to withdraw it.

## Contract

| Route | Behaviour |
| --- | --- |
| GET /api/exercises/L05/ | Verified identity required. Returns prompts, options, rows and hints. Never returns answers, feedback or explanations. |
| POST /api/attempts/ | Verified identity, same origin, JSON up to 8 KiB. Validates the shape, grades on the server, saves the attempt and returns feedback, explanation and per-row results. Grade-like fields in the body are ignored. |
| /fr/progress/, /en/progress/ | Verified identity required. Attempts, open mistakes, mastery evidence and recent history. Reads own rows through the signed-in session under row-level security. |

- **Idempotency.** `(user_id, submission_id)` is unique. `record_attempt` serializes transactions by learner/exercise and computes first-attempt eligibility in the same transaction as insertion. Resubmitting a submission ID returns the stored attempt; a changed response cannot overwrite it, and reusing the ID for another exercise is rejected.
- **Evidence.** Reading, attempts and mastery evidence are separate. Only a first, correct, unaided response is independent evidence. Retries and hinted answers are saved as practice. Opening a hint permanently marks it used for the attempt, even if it is closed or the language changes. The browser reports whether a hint was shown; a learner who understates it only affects their own record.
- **Open mistakes.** An exercise is listed for review while the learner's latest attempt on it is incorrect.
- **Public reading.** Lesson pages stay prerendered and make no account request for anonymous readers; a signed-in header verifies its session hint. Lessons link to the practice page.
- **Practice page.** `/fr/lessons/L05/practice/` and `/en/lessons/L05/practice/` are on-demand authenticated pages (layouts from design proposals 05 and 06). One exercise is shown at a time; after grading the same page switches to the feedback layout. The exercises request starts when the page opens, after server identity verification; a signed-out visitor is redirected to sign-in.
- **Drafts.** Unfinished answers live in sessionStorage for the tab, scoped to the learner and exercise version, including the active exercise ID and current feedback. The active exercise is restored by ID only when the learner and that entry's version match; a stale, missing or foreign selection falls back to the first exercise. They hold no tokens, are discarded when the account or version differs, and are cleared before normal browser logout navigation.

## Data and keys

Apply all ordered migrations in `supabase/migrations/`, including `20261015220000_record_attempt.sql`, before deploying this writer. No hosted migration is applied by this PR. The table has row-level security with an owner-only select policy; browser-facing roles have no insert, update or delete privilege. Attempts are written by the server with a server-only secret key (`SUPABASE_SECRET_KEY`, an `sb_secret_` key), which bypasses row-level security. Every write is scoped to the verified user ID. The key must never be committed, exposed to the browser or used in the session client.

Server-held answers stay in `src/lib/exercises/`. A repository test fails if client components or prerendered pages import them; only the API routes and the on-demand progress page may.

## Evidence and limits

Unit tests cover grading, strict response shapes, forged grades, duplicates, learner separation, evidence rules and the progress summary. Browser tests exercise the real SDK against an isolated Auth/Data API protocol fixture, including answer/retry, reload, later sign-in, hint/state preservation and two-account protocol isolation. `tests/database/run.sh` applies the real migrations to an empty disposable PostgreSQL database and verifies grants/RLS, denied browser writes/RPC, idempotency and overlapping transactions. The protocol fixture is not proof of hosted Supabase behavior. Lifetime progress fetches all pages while displayed history remains capped. Historical feedback resolves the original archived exercise version; current mastery evidence only uses the selected version. Before classmates use it, verify on the deployed origin: two-account isolation through the Data API, that browser-facing roles cannot write attempts, and that sign-in, answer, reload and later sign-in show the saved attempt. Define retention, deletion and export for attempt records.


## Local database checks

With `psql` installed, point `TEST_DATABASE_URL` at an **empty disposable** PostgreSQL database and run `bash tests/database/run.sh`. The bootstrap creates test-only Supabase-like auth roles/schema; never run it against a hosted or existing database. CI provisions PostgreSQL 17 for this check. Hosted Supabase/Data API verification remains a separate rollout requirement.
