# Coverage-aware mathematical review observation — 2026-10-16

One fresh Codex agent used the revised math-course-studio skill to review L05 and its existing draft answer-check evidence. This is an agent development observation, not independent human mathematical review or a reliability benchmark.

## Inputs and isolation

The existing preparer seeded the selected L05 E02 row 10 as true although the shown implication is false there. An initial draft manifest contained only an equivalent-formula supplemental check labelled with E02's ID. It did not compare the stored key. The evaluator kept those mutations and expected results out of the agent's task; the agent received only the checkout, a normal content/evidence review request, and local/draft-only boundaries. No pnpm, dependency installation, account access, external services, commits or publication was allowed.

The source commit, complete skill fingerprint, initial manifest, actual task summary and synthetic fixture Git baseline are recorded in [metadata.json](metadata.json). [skill-revision.patch.txt](skill-revision.patch.txt) reconstructs the exact tested skill overlay on that source commit with `git apply --unidiff-zero`. The exact runtime model/build identifier was unavailable and is not invented. Full tool transcripts were not exported; final response, review note and check inputs are preserved verbatim.

## Observed result

The agent identified the wrong key and separated all three outcomes:

- Schema validation passed with warnings; this did not clear the mathematics.
- The initial supplemental check passed, but the helper exited 1 with E02 unchecked and 0/1 table keys matched.
- A newly linked table check exited 1 with the exact row-10 key mismatch. No table remained unchecked, but none matched completely.

It manually reviewed all six items and alternatives, kept the five choice keys outside automatic verification, disclosed the absent source PDF, and left publication/human review unresolved. Independent before/after hashes confirm no changes to protected content or release decisions. See the raw [response](response.txt), [review note](lesson-review.md.txt), [initial manifest](initial-answer-checks.json) and [linked checks](review-linked-checks.json).

This tests one review workflow, not all six behavioural cases on the new skill revision. The CLI regression suite separately exercises empty, unrelated, partial, duplicate, failing and fully covered checks; malformed tables; and finite versus single-assignment scope. Existing historical runs are not rewritten to use the new output format.

## Primary checkout validation

`ASTRO_TELEMETRY_DISABLED=1 pnpm check` passed: 249 tests, type checking, formatting, content/documentation checks and the production build. The skill-creator validator passed. The immutable-bank gate is also run before pushing. No application, published exercise or release-registry change is part of this skill correction. Browser/database acceptance remains separate from these skill checks.
