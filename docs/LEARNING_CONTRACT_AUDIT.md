# Learning contract audit

Repository implementation audit, 2026-10-16. Base: PR #23 at `033259e91321ca06406c8f0f0969073809600c19`. This is a code/contract audit, not a new mathematical, bilingual or hosted-provider acceptance review.

| Area | Finding | Resolution and evidence |
| --- | --- | --- |
| Version-aware history | Historical records were filtered out when their lesson was withdrawn. The archive itself was also filtered to active releases; older history had no explanation view. | Retain every authored immutable archive and every saved record. Mark archived versions, identify lesson/item/version in recent history, and render only the exact version's explanation. Missing archives show an unavailable notice; the saved verdict is never replaced. A late old-version answer cannot close a current-version mistake. Unit and browser regressions cover withdrawn/unknown versions and original feedback. |
| Lifetime progress | Loading offset pages with an application-clock cutoff was not a true database snapshot; late commits could shift page boundaries and clock skew could omit rows. Withdrawn rows also vanished from totals. | `read_attempt_history()` returns one JSON value from an RLS-protected statement snapshot. No owner argument, offset, app-clock cutoff or set-returning row cap. Tests cover 1,002 records, owner isolation, denied anonymous RPC and foreign-result rejection. Lifetime totals include all records; current-course evidence only uses selected versions. |
| Active exercise | PR #23 already restored by stable ID, learner and entry version. | Retained the implementation. Browser regressions cover English/French round trips, reload, stale versions, foreign drafts, missing IDs and reordered delivery. No duplicate state system was introduced. |
| Translation freshness | Deleting a release record bypassed checks while its reading remained public. French/English lesson metadata versions were not compared. | Require a freshness record for every authored/public lesson. `practice: false` withdraws practice without removing bilingual checks. Compare paired lesson metadata versions; retain fingerprint checks and immutable-bank enforcement. Tests reject missing records, missing translations and edited French/English content after practice withdrawal. |
| Current documentation | The roadmap and reading guide still described saved progress/banks as absent; the stack table still named unimplemented Vitest/API-Zod choices. | Align current status, actual validation tools and remaining hosted acceptance. Preserve the original L05 self-check as historical evidence with a clearly separated current-status note. PR #24's native disclosure remains a separate change. |

## Contract boundaries

- Current-course counts and mastery evidence are version-specific. Historical independent-evidence flags describe the original saved record, not certification of a corrected version. An already-seen exercise ID remains practice-only for later attempts.
- Archived mistakes can be read but do not drive current-practice recommendations or link to withdrawn practice. Recent history shows 20 records; lifetime totals are not capped to that display window.
- The JSON history snapshot loads the learner's complete history for this small class pilot. Before much larger usage, measure payload size and introduce database aggregates plus cursor-paged history without weakening snapshot/ownership semantics.
- A fingerprint detects changed bytes; it does not prove that a person reviewed a translation. Renew evidence explicitly after the actual mathematical/bilingual review or an owner-authorized exception. This audit adds no new review claims or release exceptions.
- Apply all ordered Supabase migrations before deploying the updated writer/progress reader. In particular, the reader requires `20261016050000_attempt_history_snapshot.sql`. No hosted migration is performed by this audit.

## Verification

Run `pnpm check`, `pnpm test:e2e`, and `bash tests/database/run.sh` with `TEST_DATABASE_URL` pointing to an empty disposable database. The PR records the actual local and GitHub results. Hosted Supabase/Data API behavior, deployed two-account isolation, privacy/retention/deletion/export and human content review remain explicit rollout checks in [ROADMAP.md](ROADMAP.md).
