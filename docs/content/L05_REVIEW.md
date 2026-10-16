# L05 content pilot review

## Current status note (2026-10-16)

The original M1 self-check below is historical evidence, not a new review. L01–L20 reading/practice, grading and private progress are now implemented locally. Only L05 has this documented self-check; hosted acceptance and the other banks’ review remain open. See [practice contracts](../PRACTICE.md).

## Availability wording renewal (2026-10-16)

This is a scoped AI-assisted editorial consistency check by Codex, not a new human or independent mathematical review. The original mathematical and bilingual self-check below remains historical evidence for the teaching material.

The French and English availability passages were compared side by side against the implementation:

- L01 and L02 are public lesson routes, reachable through the programme and lesson outline. Both versions now direct learners there for prerequisites.
- L10 and the public number-families guide already exist. Both refresher paragraphs identify them rather than promising a future lesson.
- L05's practice button links to its authenticated activity. Both versions now describe the six exercises, feedback and private saved attempts, conditional on sign-in being configured. This states implemented behavior and does not claim hosted acceptance.

The correction changes availability guidance only: lesson IDs/versions, prerequisites, mathematical expressions, worked examples, exercises and grading contracts are unchanged. The existing L05 self-check states and all other lessons' explicit release exceptions are retained. Only L05's French/English file fingerprints and the translation's French source fingerprint are renewed in `content/releases.json`, with this note as the scoped evidence. The bank fingerprint remains unchanged.

Validation: run `pnpm check` and `pnpm test:e2e`; inspect the generated FR/EN L05 pages and referenced L01/L02/L10/number-guide routes. These checks do not substitute for human translation review or hosted/class acceptance.

## Original M1 scope and authorship

This is M1's original French/English implication lesson and six authored exercise contracts, not the full course bank. The source coverage range follows the repository's course map: PDF pages 20–23. No source exercise, screenshot or source PDF was copied. At the time of this original M1 review, L01/L02 were planned prerequisites.

## Contract

Each item has a stable exercise ID, lesson/objective IDs, immutable version, difficulty, prerequisites, misconception tags, provenance, bilingual prompt/hint/explanation, a shared answer and deterministic grading rule. Selection feedback is keyed by every option ID. Truth-table answers are keyed by row IDs rather than row positions.

A first independent response can provide evidence. Hints, revealed solutions and retries cannot count as fresh evidence. These were contracts for later M2 features at the time of this review; see the current-status note above.

## Mathematical self-check

A second derivation was used: enumerate the four Boolean assignments for implication and separately check its negation against A AND NOT B. For the numerical question, test the proposed numbers against n > 5 and n > 10 and enumerate all natural counterexamples up to 12. The eligible numbers are 6–10, with 8 the only offered witness.

- E01: 10 is the sole false assignment.
- E02: rows 00, 01, 10, 11 produce true, true, false, true.
- E03: A is sufficient for B; B is necessary for A. The reverse is not guaranteed.
- E04: negation describes A true and B false; negating operands is refuted at 11.
- E05: a blue unstamped card is not a counterexample and does not establish a universal rule.
- E06: 8 makes the condition true and conclusion false; 0, 4 and 12 do not.

This is a documented author self-check with different derivations, not independent mathematical peer review. The PR is the content-review checkpoint.

## Bilingual self-check

Both lessons follow the same teaching order and mathematical expressions. Check terminology: antécédent/antecedent, conséquent/consequent, nécessaire/necessary, suffisante/sufficient, contre-exemple/counterexample. Natural numbers explicitly include zero in both languages. The lesson distinguishes implication from semantic equivalence and from causation.

The automated check compares formula strings and required fields; it cannot certify translation quality. Both prose versions and each option's feedback were reviewed manually for the same meaning.

## Validation commands

Run from the repository root with the pinned Node/pnpm toolchain:

```sh
node scripts/check-repository.mjs
node scripts/check-content.mjs
node --test tests/content/*.test.mjs
```

## Remaining project decisions

The application stack and zero-recurring-cost budget are approved. The implication teaching slice follows the roadmap. Classmate auth-provider suitability, pilot size, free-plan interruption/restore acceptance, retention/deletion/export and rewards remain open. Original project work can proceed under CONTENT_LICENSE.md; third-party republication rights remain unverified.

This review does not claim M1's remaining product decisions or M2 are complete.
