# Practice, grading and progress

Status: implemented locally for L01–L20; only L05 self-checked; hosted acceptance pending.

## Scope

A signed-in learner can open the L05 practice section, answer six exercises, receive server-graded feedback, and see saved attempts, open mistakes and mastery evidence on a private progress page. L01–L20 are served (selected versions and review states in `content/releases.json`, exposed by `src/lib/released-lessons.ts`). Only L05 has passed mathematical and bilingual review; the other banks were released at the maintainer's request before that review, and their practice pages say so. Set `practice: false` in its release record to withdraw practice while keeping reading freshness checks.

## Contract

| Route | Behaviour |
| --- | --- |
| GET /api/exercises/L05/ | Verified identity required. Returns prompts, options, rows and hints. Never returns answers, feedback or explanations. |
| POST /api/attempts/ | Verified identity, same origin, JSON up to 8 KiB. Requires `expectedLearnerId` to match the verified session, validates the shape, grades on the server, saves the attempt and returns feedback, explanation and per-row results. Grade-like fields in the body are ignored. |
| /fr/progress/, /en/progress/ | Verified identity required. Attempts, open mistakes, mastery evidence and recent history. Reads own rows through the signed-in session under row-level security. |

- **Idempotency.** `(user_id, submission_id)` is unique. `record_attempt` serializes transactions by learner/exercise and computes first-attempt eligibility in the same transaction as insertion. Resubmitting a submission ID returns the stored attempt; a changed response cannot overwrite it, and reusing the ID for another exercise is rejected.
- **Evidence.** Reading, attempts and mastery evidence are separate. Only a first, correct, unaided response is independent evidence. Retries and hinted answers are saved as practice. Opening a hint permanently marks it used for the attempt, even if it is closed or the language changes. The browser reports whether a hint was shown; a learner who understates it only affects their own record.
- **Open mistakes.** An active exercise is listed for review while the learner's latest attempt on its current version is incorrect. A late older-version attempt cannot close it. Archived reviews are labelled separately.
- **Public reading.** Lesson pages stay prerendered and make no account request for anonymous readers; a signed-in header verifies its session hint. Lessons link to the practice page.
- **Practice page.** `/fr/lessons/L05/practice/` and `/en/lessons/L05/practice/` are on-demand authenticated pages (layouts from design proposals 05 and 06). One exercise is shown at a time; after grading the same page switches to the feedback layout. The exercises request starts when the page opens, after server identity verification; a signed-out visitor is redirected to sign-in.
- **Drafts.** Unfinished answers live in sessionStorage for the tab, scoped to the learner and exercise version, including the active exercise ID and current feedback. The active exercise is restored by ID only when the learner and that entry's version match; a stale, missing or foreign selection falls back to the first exercise. They hold no tokens, are discarded when the account or version differs, and are cleared before normal browser logout navigation.

## Navigation intent

Review links carry an exercise ID and version (`?exercise=L05-E01&version=1`). A target matching a currently delivered exercise takes precedence over the tab's active selection; other compatible answers and feedback are retained. Unknown, mismatched or stale targets fall back to ordinary learner/version-scoped draft restoration. Practice without a target continues to resume the saved selection. Archived reviews do not link to retired practice.

The bounded target survives anonymous redirects to sign-in, failed-login retries and language changes. Login return paths accept only existing route shapes and these two validated practice parameters; external, encoded, duplicate, cross-lesson and arbitrary query destinations remain rejected. Expired-session links identify the exercise currently open.

## Learner context

Each submission includes `expectedLearnerId`, the learner returned when the activity loaded. The API requires this precondition (`400 invalid_learner_context` when missing/invalid) and rejects another learner with `409 learner_context_changed` before attempt lookup, duplicate replay or persistence. It always derives the saved owner from server-verified identity; the expected ID never authorizes access.

When another tab replaces the browser session, the old activity cannot submit its answers to the new account. On a mismatch it removes its old answers/feedback and all practice drafts in that tab, then offers a bilingual action to load the current account with fresh state. The server precondition remains the final request-time protection. Visible-tab session revalidation also removes old work proactively; ordinary focus under the same learner preserves the draft and does not reload exercises. Older open clients without the precondition must reload before submitting.

## Submission and recovery

Before sending an answer, the activity snapshots its choices and hint flag under the existing submission ID and persists them in the tab draft. Choices and hints stay locked until a save is confirmed, including after a network failure, reload or language change. “Check saved response” retries the same snapshot and ID; it does not create a distinct attempt. The API returns the stored response/version/hint flag for both new and duplicate submissions, and feedback displays those recorded choices. A learner can start a distinct attempt through the feedback retry action, which allocates a new submission ID.

Legacy cached feedback without a recorded response is resolved against its existing submission ID before being shown. Storage remains best-effort: if sessionStorage is blocked or the tab is closed, the local snapshot may be unavailable; an already saved attempt remains in server history. Navigating away does not guarantee that an in-flight request was cancelled or saved. Hosted acceptance remains separate.

## Data and keys

Apply all ordered migrations in `supabase/migrations/`, including `20261015220000_record_attempt.sql` and `20261016050000_attempt_history_snapshot.sql`, before deploying this writer. Applying hosted migrations is an explicit deployment step; no hosted database is changed by repository checks. The table has row-level security with an owner-only select policy; browser-facing roles have no insert, update or delete privilege. Attempts are written by the server with a server-only secret key (`SUPABASE_SECRET_KEY`, an `sb_secret_` key), which bypasses row-level security. Every write is scoped to the verified user ID. The key must never be committed, exposed to the browser or used in the session client.

Server-held answers stay in `src/lib/exercises/`. A repository test fails if client components or prerendered pages import them; only the API routes and the on-demand progress page may.

## Evidence and limits

Unit tests cover grading, strict response shapes, forged grades, duplicates, learner separation, evidence rules and the progress summary. Browser tests exercise the real SDK against an isolated Auth/Data API protocol fixture, including answer/retry, reload, later sign-in, hint/state preservation and two-account protocol isolation. `tests/database/run.sh` applies the real migrations to an empty disposable PostgreSQL database and verifies grants/RLS, denied browser writes/RPC, idempotency and overlapping transactions. The protocol fixture is not proof of hosted Supabase behavior. Lifetime progress uses one RLS-protected `read_attempt_history` database statement snapshot, returned as a single JSON value to avoid Data API row truncation. It has no application-clock cutoff or offset-paging race. The 20 most recent records are displayed, while totals include every saved attempt, including withdrawn/unknown exercise versions. This full-history payload is suitable for the small pilot; re-evaluate payload size before larger-scale use. Historical feedback resolves the original archived exercise version; current mastery evidence only uses the selected version. Archived records are explicitly labelled and never link to retired practice. Missing archives retain their recorded grade with an unavailable-explanation notice. Before classmates use it, verify on the deployed origin: two-account isolation through the Data API, that browser-facing roles cannot write attempts, and that sign-in, answer, reload and later sign-in show the saved attempt. Define retention, deletion and export for attempt records.


## Local database checks

With `psql` installed, point `TEST_DATABASE_URL` at an **empty disposable** PostgreSQL database and run `bash tests/database/run.sh`. The bootstrap creates test-only Supabase-like auth roles/schema; never run it against a hosted or existing database. CI provisions PostgreSQL 17 for this check. Hosted Supabase/Data API verification remains a separate rollout requirement.
