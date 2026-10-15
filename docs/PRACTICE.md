# Practice, grading and progress

Status: implemented locally for the reviewed L05 pilot; hosted acceptance pending.

## Scope

A signed-in learner can open the L05 practice section, answer six exercises, receive server-graded feedback, and see saved attempts, open mistakes and mastery evidence on a private progress page. Only L05 is released; add a lesson to `RELEASED_LESSONS` in `src/lib/exercises/bank.ts` only after its exercises pass mathematical and bilingual review.

## Contract

| Route | Behaviour |
| --- | --- |
| GET /api/exercises/L05/ | Verified identity required. Returns prompts, options, rows and hints. Never returns answers, feedback or explanations. |
| POST /api/attempts/ | Verified identity, same origin, JSON up to 8 KiB. Validates the shape, grades on the server, saves the attempt and returns feedback, explanation and per-row results. Grade-like fields in the body are ignored. |
| /fr/progress/, /en/progress/ | Verified identity required. Attempts, open mistakes, mastery evidence and recent history. Reads own rows through the signed-in session under row-level security. |

- **Idempotency.** `(user_id, submission_id)` is unique. Resubmitting a submission ID returns the stored attempt; a changed response cannot overwrite it, and reusing the ID for another exercise is rejected.
- **Evidence.** Reading, attempts and mastery evidence are separate. Only a first, correct, unaided response is independent evidence. Retries and hinted answers are saved as practice. The browser reports whether a hint was shown; a learner who understates it only affects their own record.
- **Open mistakes.** An exercise is listed for review while the learner's latest attempt on it is incorrect.
- **Public reading.** Lesson pages stay prerendered and make no account request; they link to the practice page.
- **Practice page.** `/fr/lessons/L05/practice/` and `/en/lessons/L05/practice/` are prerendered shells (layouts from design proposals 05 and 06). One exercise is shown at a time; after grading the same page switches to the feedback layout. The exercises request starts when the page opens, so a signed-out visitor sees the sign-in gate.
- **Drafts.** Unfinished answers live in sessionStorage for the tab, scoped to the learner and exercise version. They hold no tokens and are discarded when the account or version differs.

## Data and keys

Migration: `supabase/migrations/20261014120000_attempts.sql`. The table has row-level security with an owner-only select policy; browser-facing roles have no insert, update or delete privilege. Attempts are written by the server with a server-only secret key (`SUPABASE_SECRET_KEY`, an `sb_secret_` key), which bypasses row-level security. Every write is scoped to the verified user ID. The key must never be committed, exposed to the browser or used in the session client.

Server-held answers stay in `src/lib/exercises/`. A repository test fails if client components or prerendered pages import them; only the API routes and the on-demand progress page may.

## Evidence and limits

Unit tests cover grading, strict response shapes, forged grades, duplicates, learner separation, evidence rules and the progress summary. No browser test or hosted check of the practice flow exists yet, and the e2e fixture has no attempts store. Before classmates use it, verify on the deployed origin: two-account isolation through the Data API, that browser-facing roles cannot write attempts, and that sign-in, answer, reload and later sign-in show the saved attempt. Define retention, deletion and export for attempt records.
