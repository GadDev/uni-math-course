# L04 exercise expansion — author draft (2026-10-16)

Status: **unreviewed author self-check**, not independent peer review or release evidence.

## Scope and progression

L04's registry-selected bank is v2. The proposed v3 draft contains 15 new E07–E21 items (five easy, five medium, five hard), with all six objectives represented. The six published items, bilingual lessons, source citations and release decisions remain unchanged. Source pages 15–19 were inherited from the existing bank/frontmatter; the underlying PDF was not inspected.

| Objective | New questions and editorial rationale |
| --- | --- |
| O01 semantic equivalence | E07 (easy definition), E16 (medium one-row fallacy) |
| O02 compare entire tables | E08 (easy 3-bit AND/OR), E13 (medium nested NOT/OR), E18 (hard two conditional paths) |
| O03 Boolean laws | E09 (easy De Morgan), E14 (medium absorption), E19 (hard double De Morgan) |
| O04 tautology/contradiction | E10 (easy excluded middle), E15 (medium contradiction), E20 (hard safety-filter tautology) |
| O05 refute a claimed equivalence | E11 (easy boundary witness), E17 (hard missing distributive factor) |
| O06 identify false equivalences | E12 (medium law comparison), E21 (hard reject a two-row-only argument) |

The levels describe the authoring intention for adults returning to mathematics, not measured learner difficulty. A reviewer should decide whether E10/E15 and E11/E17 are distinct enough and whether E18's longer table really merits hard.

## Candidate and misconception decisions

- Preferred complete-column tasks for table objectives over guessing one output; otherwise tried a direct identity, a counterexample or a misconception audit.
- Alternatives intentionally conflate agreement on a subset of rows, De Morgan's operator swap, an incorrect distributive factor, and satisfiable versus tautological. Each incorrect option has a row or algebraic repair in both languages.
- Avoided a cross-lesson duplicate when drafting E17: the retained false identity differs from the L02 parentheses counterexample.

## Answer keys and different checks

| Item | Key or true rows | Direct check | Other derivation / boundary |
| --- | --- | --- | --- |
| E07 | b | Equivalent iff all truth-table columns agree | One agreeing assignment cannot prove the all-rows claim |
| E08 | 101,110,111 | A=1 and (B or C)=1 | Exhaustive linked table comparison |
| E09 | c | ¬(A∨B)=¬A∧¬B | Both expressions true only at 00 |
| E10 | a | B∨¬B covers 0 and 1 | False row impossible |
| E11 | b | At 001, left=0 and right=1 | At 000 and 111 both expressions agree |
| E12 | c | ¬(A∨B) not equivalent to ¬A∨¬B | Assignment 10 refutes; distribution choices are valid identities |
| E13 | 000,001,011,101,111 | C=1, or A=B=0 | Exhaustive linked table comparison |
| E14 | a | A∨(A∧B)=A by absorption | If A=0 both false; if A=1 both true; supplemental equivalent check passed |
| E15 | b | A∧¬A false for both A values | Others have a true row |
| E16 | c | Two variables give four rows | One-row agreement is compatible with both equivalence and non-equivalence |
| E17 | b | At 101, A∧(B∨C)=1 but (A∧B)∨(B∧C)=0 | At 000 and 111 both sides agree |
| E18 | 010,011,101,111 | If A=0 require B; if A=1 require C | Exhaustive linked table comparison |
| E19 | c | Double De Morgan yields ¬A∨(¬B∧¬C) | Exhaustive supplemental equivalence check passed |
| E20 | a | Set X=A∧B; selected formula =X∨¬X | All four Boolean assignments checked by supplemental classification |
| E21 | c | At 01, OR=1 but AND=0 | At 00 and 11 the two coincide, showing why the incomplete test misleads |

## Language, validation and open review

FR/EN mathematical expressions were kept identical; the stem, distractor explanations and hints were read together for matching meaning. Hints point toward a procedure, not the option. This is original project text, not copied slides.

- Assembler generated L04 v3 with fifteen items.
- Draft validator: **0 warnings**.
- Truth-table checker: **3/3 stored table keys matched** the provided formulas, zero failed/unchecked; three independent supplemental formula checks passed. These checks do not certify wording or any of the twelve single-choice answers.

Next: an independent mathematical and bilingual second check, comparison with source PDF pages, novelty/pedagogical trial, then a *separately authorized* immutable bank promotion if approved. This draft alone changes no served exercise.
