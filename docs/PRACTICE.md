# Practice, grading and progress

Status: implemented locally for L01–L20; L05 and L07 self-checked; hosted acceptance pending.

## Scope

A signed-in learner can open the L05 practice section, answer six exercises, receive server-graded feedback, and see saved attempts, open mistakes and mastery evidence on a private progress page. L01–L20 are served (selected versions and review states in `content/releases.json`, exposed by `src/lib/released-lessons.ts`). L05 and L07 have documented mathematical and bilingual author self-checks (not independent review); the other banks were released at the maintainer's request before that review, and their practice pages say so. Set `practice: false` in its release record to withdraw practice while keeping reading freshness checks.

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

Submission waiting is bounded to 15 seconds, including response-body reading. A timeout or lost acknowledgement means the save is **unconfirmed**, not definitely absent: the server may have committed after the browser stopped waiting. The bilingual notice offers exact-snapshot replay with the original submission ID; no automatic retry or new ID is introduced. The deadline timer is cleared when the request settles.

A `409 version_mismatch` has a separate bilingual explanation and disables repeat submission of that stale version. An explicit current-version action reloads exercise data, keeps the selected exercise by ID where available, discards incompatible versioned answers, and preserves compatible drafts for other exercises. It never automatically submits an old answer to the current version. Persisted attempt history is unaffected.

A submission `401` keeps the sign-in action and the existing activity snapshot while that activity remains open. Same-learner renewal can retry that snapshot. This does not override the privacy policy: confirmed anonymous/logout tab revalidation or an account change clears private drafts; restoration through a sign-in navigation is not guaranteed. The visible footnote distinguishes tab-local unfinished answers from persisted history and explains that closing the tab or unavailable browser storage can lose unfinished work.

Legacy cached feedback without a recorded response is resolved against its existing submission ID before being shown. Storage remains best-effort: if sessionStorage is blocked or the tab is closed, the local snapshot may be unavailable; an already saved attempt remains in server history. Navigating away does not guarantee that an in-flight request was cancelled or saved. Hosted acceptance remains separate.

## Data and keys

Apply all ordered migrations in `supabase/migrations/`, including `20261015220000_record_attempt.sql` and `20261016050000_attempt_history_snapshot.sql`, before deploying this writer. Applying hosted migrations is an explicit deployment step; no hosted database is changed by repository checks. The table has row-level security with an owner-only select policy; browser-facing roles have no insert, update or delete privilege. Attempts are written by the server with a server-only secret key (`SUPABASE_SECRET_KEY`, an `sb_secret_` key), which bypasses row-level security. Every write is scoped to the verified user ID. The key must never be committed, exposed to the browser or used in the session client.

Server-held answers stay in `src/lib/exercises/`. A repository test fails if client components or prerendered pages import them; only the API routes and the on-demand progress page may.

## Evidence and limits

Unit tests cover grading, strict response shapes, forged grades, duplicates, learner separation, evidence rules and the progress summary. Browser tests exercise the real SDK against an isolated Auth/Data API protocol fixture, including answer/retry, reload, later sign-in, hint/state preservation and two-account protocol isolation. `tests/database/run.sh` applies the real migrations to an empty disposable PostgreSQL database and verifies grants/RLS, denied browser writes/RPC, idempotency and overlapping transactions. The protocol fixture is not proof of hosted Supabase behavior. Lifetime progress uses one RLS-protected `read_attempt_history` database statement snapshot, returned as a single JSON value to avoid Data API row truncation. It has no application-clock cutoff or offset-paging race. The 20 most recent records are displayed, while totals include every saved attempt, including withdrawn/unknown exercise versions. This full-history payload is suitable for the small pilot; re-evaluate payload size before larger-scale use. Historical feedback resolves the original archived exercise version; current mastery evidence only uses the selected version. Archived records are explicitly labelled and never link to retired practice. Missing archives retain their recorded grade with an unavailable-explanation notice. Before classmates use it, verify on the deployed origin: two-account isolation through the Data API, that browser-facing roles cannot write attempts, and that sign-in, answer, reload and later sign-in show the saved attempt. Define retention, deletion and export for attempt records.


## Local database checks

With `psql` installed, point `TEST_DATABASE_URL` at an **empty disposable** PostgreSQL database and run `bash tests/database/run.sh`. The bootstrap creates test-only Supabase-like auth roles/schema; never run it against a hosted or existing database. CI provisions PostgreSQL 17 for this check. Hosted Supabase/Data API verification remains a separate rollout requirement.

## Manual lesson completion

Reading completion is an explicit, reversible learner choice, independent of exercise attempts and mastery. Signed-in learners use “Mark as completed” / “Marquer comme terminée” at the end of a lesson. Opening, scrolling or practising never marks it automatically. Undo removes only completion; answers and attempt history remain unchanged. One language-independent lesson ID is shared by French and English. The chapter overview and lesson outline display checkmarks, and each chapter counts only its own published lessons. Existing learners start without inferred completions.

`GET /api/lesson-completions/` returns the verified learner ID and completed lesson IDs. `POST` requires the configured same origin, bounded JSON, `expectedLearnerId`, a published `lessonId` and boolean `completed`. An old account context is rejected with 409 before persistence. Explicit true/false writes are idempotent. Session changes clear the old completion UI; focus and restored history reload confirmed state. Failed or uncertain saves offer a reload and never claim success. Public anonymous reading makes no initial account/completion request. JavaScript is required for completion controls.

Apply `supabase/migrations/20261019120000_lesson_completions.sql` to your development Supabase database before reviewing this feature locally, then use the existing authentication configuration and `pnpm dev`. The separate `lesson_completions` table uses the signed-in session with owner-only SELECT/INSERT/DELETE RLS; no service key is needed for completion. An account deletion cascades to its completion rows. Apply the same migration to the target database before deploying the feature; this PR does not change a hosted database. Without it, reading still works and completion reports unavailable. Completion does not reset on ordinary lesson edits.

Local review: sign in, open L01, mark it completed, reload, switch language, check the Chapter 1 counter and checkmark, then undo. Repeat with L21 and Chapter 2 (separate total). Check another browser/device with the same account to confirm persistence. Hosted Supabase acceptance remains separate from protocol-fixture browser tests.
