# Pilot readiness and acceptance evidence

Reconciled: 2026-10-16 · Accountable owner: GadDev · Status: application implemented; hosted class acceptance pending.

This record separates repository evidence, hosted verification and human decisions. It does not certify mathematical peer review, translation fidelity, cloud configuration or class readiness. Publication decisions remain in `content/releases.json`; do not maintain a second lesson allowlist here. See [content release contracts](CONTENT_RELEASES.md).

## Recorded implementation and verification

| Evidence | Revision / result | Boundary |
| --- | --- | --- |
| Merged application corrections | [PR #22](https://github.com/GadDev/uni-math-course/pull/22) through [PR #28](https://github.com/GadDev/uni-math-course/pull/28), plus [PR #30](https://github.com/GadDev/uni-math-course/pull/30) | Mobile reading, learning/release contracts, native disclosure, submitted-answer feedback, navigation intent, stale learner protection, L05 guidance and returning-tab progress are implemented |
| Main application CI | [`22275e1639a3aed3fa60989dfe8cbb1c51489f4b`](https://github.com/GadDev/uni-math-course/commit/22275e1639a3aed3fa60989dfe8cbb1c51489f4b); [successful docs job](https://github.com/GadDev/uni-math-course/actions/runs/38879982744/job/116904102393) | Repository/application gate, immutable archives, disposable PostgreSQL contracts and browser suite; no production credentials |
| Independent local application checks | PR #30 revision `522e94a9b0110aa4dcdc28ad0f2b09358f71665e`: `pnpm check` passed, 235 tests; Playwright: 122 passed | Same Git tree as main `22275e1`; Chromium and isolated local Auth/Data API fixture, not live Supabase/Vercel |
| Learning history and release semantics | [Learning contract audit](LEARNING_CONTRACT_AUDIT.md) and [practice contract](PRACTICE.md) | Exact archived-version explanations, lifetime totals, owner-scoped snapshot and draft restoration; automated checks do not establish teaching quality |
| Authoring workflow | [PR #29](https://github.com/GadDev/uni-math-course/pull/29), merged after the application baseline | Version-aware skill workflow is implemented; its validation evidence is recorded in that PR and is separate from application acceptance |

These results apply to their recorded revisions, not every later commit. Inspect the current revision's CI before release. The original audit remains historical evidence; later fixes do not rewrite what it inspected.

## H1 checkpoint — reported production deployment

Recorded 2026-10-16. Evidence source: GadDev's Vercel dashboard report, cross-checked against the GitHub Vercel commit status. **H1 remains open**: deployment identity and reported database schema comparison are partially recorded; production-project binding, environment separation and migration provenance are pending. This is not independently reproduced hosted acceptance.

| Field | Recorded value | Evidence / limitation |
| --- | --- | --- |
| Reported production domain | https://uni-math-course.vercel.app/ | Domain association reported by GadDev; current alias routing was not independently inspected |
| Unique deployment URL | https://uni-math-course-fgvepgwnw-gaddevs-projects.vercel.app/ | Reported by GadDev |
| Deployment dashboard | https://vercel.com/gaddevs-projects/uni-math-course/GwF8kYj7PKvNPXQYPbmRzZnqztvA | Also the target of the successful GitHub Vercel status for the recorded commit |
| Dashboard deployment identifier | `GwF8kYj7PKvNPXQYPbmRzZnqztvA` | Dashboard URL locator; a separate API `dpl_…` identifier was not supplied |
| Status / creator | Ready / GadDev | Maintainer-reported; GitHub independently reports Vercel `success` for this commit |
| Git source | `main` at [`45a742978d68382c949016583243e82aa91ee4ee`](https://github.com/GadDev/uni-math-course/commit/45a742978d68382c949016583243e82aa91ee4ee) | Commit exists: `feat(skill): add difficulty guidance and behavioural evaluations (#35)`; later commits do not change this baseline |
| Exact deployment creation time | Pending | Dashboard report said “8m ago”; no exact timestamp inferred |
| Deployment environment and separation | Pending | Explicit Production environment label and preview/production Supabase separation still need confirmation; no secret configuration values recorded |
| Supabase project and applied schema | Reported schema comparison below | Project reference and binding to Vercel Production configuration remain unconfirmed; SQL output was supplied by the maintainer, not independently executed |

The repository migration baseline at that exact application commit is:

| Version | File under `supabase/migrations/` | Remote status |
| --- | --- | --- |
| `20261014120000` | `20261014120000_attempts.sql` | Reported columns, constraints, indexes and RLS match; migration execution history unavailable |
| `20261015120000` | `20261015120000_attempts_service_role_grant.sql` | Required effective select/insert permissions reported present; additional TRUNCATE privilege noted below |
| `20261015220000` | `20261015220000_record_attempt.sql` | Reported function definition, invoker security, search path and tested execute permissions match |
| `20261016050000` | `20261016050000_attempt_history_snapshot.sql` | Reported function definition, stable snapshot, invoker security and tested execute permissions match |

### Reported Supabase schema comparison

Date: 2026-10-16. Operator/evidence supplier: GadDev. Method: read-only SQL catalog queries and effective-privilege checks in the selected Supabase project's SQL editor; results supplied in the guided acceptance conversation. Comparison target: the four migration files at application commit `45a742978d68382c949016583243e82aa91ee4ee`. No learner records, credentials or row payloads were requested or recorded. The queried project's association with this Vercel deployment is still pending confirmation.

| Check | Reported observation | Assessment / boundary |
| --- | --- | --- |
| Migration history | `to_regclass('supabase_migrations.schema_migrations')` returned null | No migration history table resolved in the queried database. Applied migration versions/dates cannot be established from this result; manual SQL application is possible but unconfirmed |
| Table columns | All 12 columns, types, NOT NULL flags and defaults match the initial attempts migration | Structural comparison passes for the supplied output |
| Constraints | Primary key on `id`; foreign key to `auth.users(id)` with ON DELETE CASCADE; unique `(user_id, submission_id)`; four checks for lesson ID, exercise ID, positive version and FR/EN locale | All seven reported constraints match |
| RLS | Enabled; not forced; one permissive `attempts_select_own` SELECT policy for `authenticated`, using `auth.uid() = user_id`; no write policies reported | Matches the migration; not a substitute for two-account API isolation testing |
| Browser-role effective privileges | `anon`: all seven queried capabilities false. `authenticated`: SELECT and history execution true; INSERT/UPDATE/DELETE/TRUNCATE and grading execution false | Matches the expected browser-facing boundary for the queried capabilities |
| Server-role effective privileges | `service_role`: SELECT, INSERT, TRUNCATE and grading execution true; UPDATE/DELETE and history execution false | Required writer access exists. Additional TRUNCATE permission is not needed by the application writer; record for a separate least-privilege decision. No privilege changes made |
| `record_attempt(jsonb)` | PL/pgSQL; invoker security; empty search path; transaction-scoped advisory lock per learner/exercise; duplicate lookup; insertion and first unaided/correct evidence eligibility in one transaction | Definition matches the baseline; live concurrent-write and retry behavior still require H3 evidence |
| `read_attempt_history()` | SQL STABLE; invoker security; empty search path; owner filter using `auth.uid()`; one JSON aggregate ordered by created time and ID descending, with empty-array fallback | Definition matches the baseline; live Data API authorization still requires H3 evidence |
| Indexes | Unique primary-key index on `id`; unique learner/submission index; `(user_id, created_at DESC)` and `(user_id, exercise_id)` indexes | All four reported definitions match |

The schema effects above are consistent with the four baseline migrations, subject to the additional server-role privilege. They do not prove which migration files were executed, their execution dates, absence of every other database object/privilege, or runtime application acceptance. Do not apply or repair migrations merely to populate history. No deployed schema was changed by this verification.

Next H1 checkpoint: confirm the queried Supabase project matches the recorded deployment's Vercel Production configuration, the explicit Production environment label and exact deployment creation timestamp, plus preview/production data separation. If the production alias now targets a later deployment, record that new deployment as a separate baseline before running H2/H3. H1/H2/H3 remain open; release approval is unchanged.

## Remaining acceptance work

Every row is **pending recorded evidence or decision**. GadDev is accountable and may name an actual reviewer/operator when the work occurs. Do not invent people, dates, outcomes or provider settings.

| ID | Work and owner | Evidence needed to close |
| --- | --- | --- |
| H1 | Deployment identity and configuration — GadDev | Partial evidence recorded in [H1 checkpoint](#h1-checkpoint--reported-production-deployment); still open. Record exact app commit, hosted deployment identifier, date, intended origin and preview/production separation. Confirm configured migrations against every ordered repository migration without exposing credentials |
| H2 | Hosted sign-in and session lifecycle — GadDev | On the recorded deployment, exercise FR/EN sign-in, refresh/expiry, logout, account switching in two tabs and back/forward restoration; confirm cookie flags and no-store responses. Same-account focus preserves drafts; confirmed identity changes remove private state; progress reflects another tab's saved attempt |
| H3 | Hosted persistence and authorization — GadDev | With two synthetic accounts, verify answer → reload → later sign-in persistence; owner-only Data API/RPC reads; denied unauthenticated access and browser writes; duplicate UUID replay; rejected stale learner context. Capture outcomes without learner data |
| H4 | Accessible bilingual journey — GadDev, reviewer to be named | Complete reading/practice/feedback/progress by keyboard in both languages at 320, 375, 768 and 1280 px; inspect focus, feedback announcements, mathematical readings and overflow. Add screen-reader/browser details when tested |
| O1 | Privacy and account-data operations — GadDev | Decide retention, deletion/export, notice/contact details and data-location requirements. Document a manual procedure first if sufficient; verify it with synthetic data before inviting classmates |
| O2 | Cost, recovery and rollout — GadDev | Record actual plan/eligibility checks and accepted pause/quota limits with dated official sources; demonstrate recovery, disposable export/restore and application rollback. State that application rollback does not reverse migrations. Confirm pilot size and access scope |
| R1 | Mathematical and bilingual review — GadDev, reviewer to be named | Start with the planned L01/L02/L03/L05 pilot. Check answers, domains, explanations, prerequisites and French/English fidelity; record actual evidence against exact versions/fingerprints. L05 author self-check is not independent review. Preserve existing exceptions until an explicit decision changes them |
| R2 | Publication rights — GadDev | Resolve the source-rights/publication boundary recorded in [CONTENT_LICENSE.md](../CONTENT_LICENSE.md); attribution alone is not permission |

Passing H2 does not close H3 or the operational rows. Record maintainer-reported results with their deployment revision and named checks; distinguish them from independently reproduced evidence.

## Recording a completed check

For each closed row, add its ID, date, operator, exact application commit and deployment identifier, method/environment, expected and observed outcome, and a sanitized evidence link. For database checks, record the migration revision separately. Record failures and scope exclusions, including any checks not attempted. Keep secrets, cookies, account emails and attempt payloads out of public evidence.

Update only the rows actually verified. Keep content review metadata in the release registry and link its evidence rather than duplicating status here. M2/M3 readiness is determined by the [roadmap acceptance criteria](ROADMAP.md), not the number of merged PRs.
