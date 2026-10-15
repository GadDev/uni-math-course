# Content release contracts

`content/releases.json` selects each served practice bank version and records its review state. `src/lib/released-lessons.ts` derives routes and review notices from it. Authored reading can exist without a practice release.

## Existing release decisions

L05 has the documented author self-check in [L05_REVIEW.md](content/L05_REVIEW.md), using different derivations and bilingual checks. It is not independent peer review. The initial fingerprints bind the existing files to that record; capturing hashes does not constitute a new human review.

L01–L04 and L06–L20 remain served under the maintainer's explicit pre-review release decision, already recorded in `src/lib/released-lessons.ts` and [PRACTICE.md](PRACTICE.md) before this change. Their state is `unreviewed-exception`; the practice notice remains visible. This preserves an existing exception, not permission to release additional unreviewed material. These banks do not establish class-pilot readiness.

## Changes and publication

- Keep published exercise versions immutable. Correct an answer, domain, grading contract or wording in a new `vN.json`, retaining earlier files for historical feedback.
- Review mathematical correctness and French/English fidelity before selecting the next version. Record the actual review or explicit owner exception in an evidence document; never invent a reviewer or date.
- The release record contains SHA-256 fingerprints of the selected bank and both lesson files. Any edit to either language or the bank makes `pnpm check:content` fail until the release decision is renewed. The diagnostic prints the current hash; updating it is an explicit review decision, not an automatic translation step.
- Old evidence does not automatically certify a corrected version. History preserves the original recorded grade and resolves explanations from the exact archived version. Missing archives must not borrow current feedback. An already-seen exercise ID stays practice-only even after a version correction; introduce distinct items when fresh independent evidence is needed.
- Removing a lesson from the release record withdraws its practice route and API delivery without deleting its authored reading or stored attempts.

The fingerprint gate detects changed bytes, missing translations and stale recorded releases. It cannot prove translation fidelity or mathematical review. Keep the content checks and documented human/self-check alongside it.

## Class-pilot acceptance

Local builds, protocol fixtures and database tests are separate evidence. Before classmates use the hosted service, verify sign-in, refresh/logout, secure/no-store responses, migrations, two-account isolation, answer/reload/later-sign-in persistence, and the privacy/retention/deletion/export decisions in [ROADMAP.md](ROADMAP.md). A green CI run does not certify cloud configuration.
