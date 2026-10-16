# L03 exercise expansion — author draft (2026-10-16)

Status: **unreviewed draft**. Author mathematical/bilingual self-check, not independent peer review. No lesson, immutable bank or release registry was changed.

## Versions and coverage

- Selected bank: L03 v2, six archived items. Draft: L03 v3 with fifteen **new** E07–E21 IDs, five easy, five medium and five hard; all six objectives covered.
- Existing release and translation records retain their current status and do not certify this new draft. Coverage pages 13–14 come from the lesson's frontmatter and existing bank; the PDF was not accessible in this turn.
- Adult learners need L01 statements/truth values and L02 AND/OR/NOT. All questions use those operators and truth tables only; no implication or untaught connective is required.

## Objective map and difficulty

| Objective | Items | Reason for level |
| --- | --- | --- |
| O01 atomic/compound | E07 easy, E16 medium | Recognition versus parsing the outer connective of a nested formula |
| O02 enumerate assignments | E08 easy, E15 medium | Standard $2^n$ count versus correcting a linear-count misconception |
| O03 build columns | E12 medium, E17 hard | Three-variable table with an AND gate versus combining two distinct access paths on all eight rows |
| O04 evaluate a row | E09 easy, E13 medium, E18 hard | Nested evaluation, regrouping, then finding a counterexample to a claimed identity |
| O05 audit a table | E10 easy, E14 medium, E19 hard, E21 hard | Missing row, wrong cell, refuting an all-ones program output, and diagnosing a universal inference from one row |
| O06 complete all rows | E11 easy, E20 hard | A conjunction with negation versus a complete equality-detector truth table |

Editorial difficulty is relative to the taught L03 methods, not empirically calibrated. E18 uses a De Morgan counterexample from the same connective vocabulary; E21 intentionally revisits the lesson's guided formula but demands refuting a new false generalisation, so a reviewer should judge whether that is sufficiently fresh.

## Design decisions

- Stem candidates: row counting, formula evaluation or counterexample selection. Kept all three rather than duplicating the selected bank's exact example; for O03/O06 kept the genuine **truth-table** response type.
- Distractor candidates: skipped assignments, an omitted outer negation, swapping AND/OR and assuming one successful row implies a general rule. Retained misconceptions with a concrete wrong row or formula; rejected filler and "all of the above."
- Correct options for eleven single-choice items span a/b/c. Tables enumerate standard binary IDs and use the shared grading contract.

## Author answer checks

| Item | Key or true rows | Derivation | Different check and edge cases |
| --- | --- | --- | --- |
| E07 | a | D contains no connective | ¬D and D∧E each contain one |
| E08 | b | Four independent bits give $2^4=16$ | Pair the sixteen binary strings from 0000 through 1111 |
| E09 | c | At 110, ¬B=0 and C=0 | Both disjuncts vanish separately |
| E10 | a | 00,01,10,11 is the complete two-bit list | Set difference leaves only 10 |
| E11 | 10 | A=1 and ¬B=1 only there | Exhaustively verified by logic helper |
| E12 | 011,101,111 | C=1 and A∨B=1 | Eight rows verified by helper |
| E13 | b | ¬(1∨0)∨(1∧1)=0∨1=1 | Outer OR needs just one true disjunct |
| E14 | c | 01 gives 0∧¬1=0, not 1 | Direct check on 00,10,11 matches the student's entries |
| E15 | a | Five bits give $2^5=32$ | Doubling from 1,2,4,8,16,32 |
| E16 | b | Outer expression is ¬(A∧B) OR C | Parenthesis grouping isolates AND under NOT |
| E17 | 001,011,100,101 | First branch requires A¬B, second ¬AC | Eight stored keys matched formula by helper |
| E18 | c | At 10, ¬(1∨0)=0 but ¬1∨¬0=1 | At 00 and 11 the two formulas agree |
| E19 | a | At 110, ¬(1∧1)∨0=0 | For every other row either C=1 or A∧B=0 |
| E20 | 00,11 | Both false or both true satisfy two branches | Four stored keys matched formula; alternative equality form equivalent exhaustively |
| E21 | b | At 11, (1∨1)∧¬1=0 | At 01 it is 1, so B=1 alone is insufficient |

Domains: all formula variables are Boolean, and table rows enumerate the complete finite domain. For single-choice keys, the author explicitly checked the wrong options; the helper does **not** verify these.

## Bilingual and validation

French and English are authored side by side; mathematical notation is shared exactly. "Affectation/assignment", "formule composée/compound formula", and "table de vérité/truth table" use the course's terminology. Feedback explains a specific missing row, truth value or connective. The tables' hints describe procedure without supplying the row answer.

- Assembler — assembled fifteen items.
- Draft validator — structurally valid, **0 warnings**.
- Logic helper — **4/4 linked table keys matched**, zero failed/unchecked; one supplemental equivalence passed. Eleven single-choice keys are outside automatic verification.

An independent second mathematical/FR-EN review, novelty check, source-page inspection and pedagogical difficulty assessment are needed before a separate promotion PR. No new review evidence or publication decision is asserted.
