# L07 version 2 content review — 2026-10-16

Status: AI-assisted author self-check by Codex, not independent human or mathematical peer review. No hosted/class-pilot acceptance is claimed.

## Scope

Read both L07 lessons and all six items in bank v2, including each option, hint, explanation and grading contract. The only content changes from v1 are E04's FR/EN stem and hint; bank and item versions advance together to 2. Lesson files are unchanged. The source PDF was unavailable; pages 30–31 are repository provenance, not newly verified source coverage. The explanation of the equivalence criterion is original project work.

## Correction

The v1 question “When does equivalence hold?” admits “both are tautologies” as a sufficient condition, although option d is rejected. In v2 the stem explicitly asks for a **necessary and sufficient** condition in both languages. The hint asks learners to check both directions without identifying an option. Key a and its justification remain valid.

## Mathematical self-check

| Item | Definition or semantic argument | Different check and result |
| --- | --- | --- |
| E01 | Biconditional means implication in both directions. | Four assignments give 1, 0, 0, 1. Disjunction is always true; a single implication differs at 01; conjunction differs at 00. Only a matches. |
| E02 | Equal truth values give true, unequal values false. | Evaluate both implications and their conjunction on all four rows: 1, 0, 0, 1; agrees with every stored cell. |
| E03 | A connective builds a formula; semantic equivalence compares its entire truth function with another's. | A biconditional has row values, including false at 10; swapping conjunction operands leaves the whole truth function unchanged. Only a describes both levels correctly. |
| E04 | Identical truth functions are equivalent exactly when their biconditional is always true. | Enumerate all 16 Boolean functions of two variables against all 16 others. Only condition a agrees with equivalence on every pair. b is insufficient; c contradicts equivalence; d is sufficient but unnecessary. |
| E05 | De Morgan makes both sides identical. | All four biconditional cells are true by direct evaluation; agrees with the stored key. The free conclusion is explanatory: only the labelled cells are graded. |
| E06 | Semantic equivalence has no truth value attached to one assignment. | At 10 the biconditional is false, which can refute whole-table equivalence but does not give the relation a row value. Only a confuses the two levels. |

For E04, conjunction and disjunction agree at 00 and 11 but differ elsewhere (b); a formula and its negation disagree everywhere (c); two identical contingent formulas are equivalent but not tautologies (d). Two contradictions also demonstrate why d is unnecessary. The 256-pair enumeration is exhaustive for two-variable Boolean functions; the general criterion follows from the definition of equivalence, not from extrapolating finite examples.

## Bilingual self-check

Read FR/EN lesson prose, item stems, options, hints, feedback and explanations side by side. Both use necessary/nécessaire and sufficient/suffisante, tautology/tautologie, connective/connecteur and semantic equivalence/équivalence sémantique consistently. Both E04 stems require both directions; both d feedback entries explicitly acknowledge sufficiency without necessity. Formula parity is checked automatically; prose fidelity is an author self-check, not certified translation review.

## Remaining quality findings

Correctness and bilingual parity pass this self-check. Existing teaching limitations remain: every single-choice key is a; several hints closely reproduce the lesson; no empirical difficulty calibration exists. Both lessons still describe interactive practice as future work despite local implementation. These are separate follow-ups, not evidence of hosted readiness. The source proof prompt was not inspected or copied.

## Release and history

Select v2 in the registry with this new mathematical and translation evidence. This replaces L07's old unreviewed exception with the author self-check documented here, without extending that exception. Lesson bytes and the French translation-source fingerprint remain unchanged. Retain v1 byte for byte; saved v1 attempts keep their original grade and v1 feedback. The correction does not retroactively award credit or make an already-seen ID fresh mastery evidence.

## Validation

Executed with Node 24.19.0 and pnpm 11.25.0:

- `node --test tests/content/extended-lessons.test.mjs`: 18 passed, 0 failed, including all E04 conditions over the finite Boolean domain.
- `pnpm check`: passed, including 237 tests, type checking, formatting, content/docs checks and production build. Tests now read registry-selected banks, so L07 exercises are checked against v2.
- `node scripts/check-immutable-exercises.mjs`: passed against the PR base; v1 is unchanged.
- `pnpm test:e2e`: 1 passed, 121 failed to launch because the Chromium executable was absent. `pnpm exec playwright install chromium` also failed (downloaded archive was truncated/invalid). Browser verification remains blocked by this environment and must run in CI or a provisioned workstation.

These checks cannot certify prose semantics, source fidelity or independent review.

Human mathematical/translation second review and source-PDF comparison remain open. No reviewer identity or human approval is inferred from this note.
