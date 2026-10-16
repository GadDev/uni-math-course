# Content release contracts

`content/releases.json` selects each served practice bank version and records mathematical and translation review states. `src/lib/released-lessons.ts` derives routes and review notices from it. Every public reading lesson must have a freshness record; `practice: false` withdraws practice without withdrawing or bypassing checks on its reading.

## Existing release decisions

L05 has the documented author self-check in [L05_REVIEW.md](content/L05_REVIEW.md), using different derivations and bilingual checks. It is not independent peer review. The initial fingerprints bind the existing files to that record; capturing hashes does not constitute a new human review.

L07 v2 has the scoped correction and full-bank/lesson author self-check in [L07_REVIEW.md](content/L07_REVIEW.md). Its v1 archive remains available for historical feedback. This is AI-assisted self-check evidence, not independent human review.

L01–L04, L06 and L08–L20 remain served under the maintainer's explicit pre-review release decision, already recorded in `src/lib/released-lessons.ts` and [PRACTICE.md](PRACTICE.md) before this change. Their state is `unreviewed-exception`; the practice notice remains visible. This preserves an existing exception, not permission to release additional unreviewed material. These banks do not establish class-pilot readiness.

## Authoritative metadata and documentation

Each record's `version` selects an immutable exercise bank; paired lesson frontmatter versions remain equal and are checked separately. `review` and `evidence` record mathematical review or the existing release exception. `translation` explicitly records `source: fr`, `target: en`, its review/exception state and evidence, and `sourceFingerprint`: the SHA-256 of the full French lesson used for that translation decision. A practice page is self-checked only when both review states are self-checked.

The initial translation metadata captures the existing L05 bilingual self-check and the other lessons' existing exceptions; it does not assert a new review. No reviewer or review date is fabricated. Hashes cover full file bytes, including prose and frontmatter, not just mathematics.

README, AGENTS and the roadmap contain generated status blocks. After a deliberate registry change, run `pnpm sync:release-status`; `pnpm check:docs` rejects missing or stale blocks. Edit release/review status in the registry rather than these summaries. The roadmap's teaching sequence is a plan, not a second release allowlist.

## Changes and publication

- Keep published exercise versions immutable. Correct an answer, domain, grading contract or wording in a new `vN.json`, retaining earlier files for historical feedback.
- Review mathematical correctness and French/English fidelity before selecting the next version. Record the actual review or explicit owner exception in an evidence document; never invent a reviewer or date.
- The release record contains SHA-256 fingerprints of the selected bank and both lesson files. Any edit to either language or the bank makes `pnpm check:content` fail until the release decision is renewed. A French source edit also requires deliberate renewal of `translation.sourceFingerprint` after checking its English counterpart or explicitly retaining an authorized exception. Refreshing only `fingerprints` fails. The diagnostic prints the current hash; updating it is an explicit review decision, not an automatic translation step.
- Old evidence does not automatically certify a corrected version. History preserves the original recorded grade and resolves explanations from the exact archived version. Missing archives must not borrow current feedback. An already-seen exercise ID stays practice-only even after a version correction; introduce distinct items when fresh independent evidence is needed.
- Set `practice: false` to withdraw a practice route and API delivery. Keep the reading fingerprints and immutable archives. Removing the record while its lesson is public fails the content gate. Lifetime attempts and historical explanations remain visible after withdrawal.

The fingerprint gate detects changed bytes, missing translations and stale recorded releases. It cannot prove translation fidelity or mathematical review. Keep the content checks and documented human/self-check alongside it.

## Class-pilot acceptance

Local builds, protocol fixtures and database tests are separate evidence. Before classmates use the hosted service, verify sign-in, refresh/logout, secure/no-store responses, migrations, two-account isolation, answer/reload/later-sign-in persistence, and the privacy/retention/deletion/export decisions in [ROADMAP.md](ROADMAP.md). A green CI run does not certify cloud configuration.
