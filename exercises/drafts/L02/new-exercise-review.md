# L02 new exercise draft review — 2026-10-16

Status: **author mathematical and bilingual self-check, not independent peer review**. Review scope: fifteen new E07–E21 items in v3 draft/spec, read alongside the selected v2 bank and the bilingual L02 lesson. The source PDF was not read, so this does not establish independent source fidelity.

## Findings and repairs

| Severity | Location | Finding | Action |
| --- | --- | --- | --- |
| Major, resolved in draft | E18 | Original hard problem directly recognised A ∧ ¬A; little transfer beyond the lesson's familiar contradiction. | Replaced with a two-sensor “never activate” design using (A ∨ B) ∧ ¬(A ∨ B). |
| Major, resolved in draft | E20 | Original hard problem just evaluated a supplied nested formula for one assignment. | Replaced with refutation of an auditor's universal claim, requiring a valid counterexample with A=1. |
| Major, resolved in draft | E21 | Original hard problem used routine three-way AND with one failed input. | Replaced with two alternative access paths, identifying the shared required B through reasoning or Boolean factoring. |
| Editorial review pending | E17–E21 | “Hard” reflects transfer intent and remains uncalibrated against student performance. | Conduct a pedagogical trial before promotion. |

## Mathematical verdict and verification coverage

The formula checks were performed against every item's actual bilingual stem and all distractors. Each result was cross-checked by a truth-table property, witness/counterexample, or a second algebraic reading. Complete per-item justifications for E07–E21 are recorded in [v3-generation-notes.md](v3-generation-notes.md#answer-key-author-checks); the revised hard checks appear there.

| Items | Keys (ID order) | Different check / edge case |
| --- | --- | --- |
| E07–E11 | b, c, a, b, c | Unary NOT; AND only true on 11; inclusive OR true on 01; ¬1∨0=0; A∨¬A true for both A values |
| E12–E16 | a, b, a, c, b | Parentheses and full assignment; “at least one” permits two; a failed conjunct blocks entry; XOR differs from OR at 11; ¬(0∨0)=1 |
| E17 | c | At 100 the grouped expressions differ; at 000 and 101 the supplied distractors do not |
| E18 | a | All four assignments of A,B satisfy X∧¬X=0 with X=A∨B; the other expressions admit a true row |
| E19 | b | (1∨1)∧¬1=0; changing the active-sensor count does not bypass maintenance |
| E20 | c | At 100 the block condition is 1, contradicting “always 0”; at 110 and 101 it is 0 |
| E21 | b | (A∧B)∨(B∧C)=B∧(A∨C); counterexamples show A=0 and C=0 do not alone block both paths |

All fifteen are **single-choice**, so the truth-table helper provides no automatic stored-answer coverage. Finite Boolean cases were evaluated in the author check; these results do not certify the bilingual phrasing or teaching effect.

## Bilingual, pedagogy, accessibility and rights

- FR/EN formula strings and target claims were compared; “ou/or” is inclusive, with “exactly one” explicitly distinguished at E15.
- Hints invite evaluation, factoring, or counterexample testing without naming the correct option. Wrong-option feedback explains a concrete failed row or rule, not merely “incorrect.”
- No colour-only cue, shaming language, copied source prompt or implicit real-world safety guarantee was found. The alarm and door cases are simplified Boolean learning models.
- E07–E21 are new IDs, five per editorial difficulty level, with all six objectives covered. The questions are original project work, not copied source-slide text.

## Publication readiness

**Do not publish yet.** A person must second-check mathematical answers and FR/EN wording, confirm the editorial level progression, and examine the source-page alignment. This note is an author self-review only; it does not justify changing releases, lessons or immutable banks.
