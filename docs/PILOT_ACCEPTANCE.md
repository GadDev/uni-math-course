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

## Remaining acceptance work

Every row is **pending recorded evidence or decision**. GadDev is accountable and may name an actual reviewer/operator when the work occurs. Do not invent people, dates, outcomes or provider settings.

| ID | Work and owner | Evidence needed to close |
| --- | --- | --- |
| H1 | Deployment identity and configuration — GadDev | Record exact app commit, hosted deployment identifier, date, intended origin and preview/production separation. Confirm configured migrations against every ordered repository migration without exposing credentials |
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
