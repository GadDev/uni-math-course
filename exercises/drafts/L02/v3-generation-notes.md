# L02 exercise expansion — author draft (2026-10-16)

Status: **unreviewed**. Mathematical and bilingual **author self-check**, not independent peer review. The lesson, published v1/v2 archives and release registry remain unchanged.

## Version and coverage

- Registry-selected bank: L02 v2. Proposed bank: v3, 15 new items E07–E21; no reused historical IDs.
- Source-page provenance: 6–12 from both lesson frontmatters and the existing bank. The source PDF was not inspected; the content is original, based on the repository's lesson and not a new PDF-fidelity certification.
- All six objectives are represented. The target is five items each at **easy**, **medium** and **hard**, calibrated editorially for adults who have studied L01 and L02.

## Design and objective distribution

| Level | Items | Primary demand | Prerequisite/support |
| --- | --- | --- | --- |
| Easy | E07–E11 | Read NOT; evaluate AND, inclusive OR and a scoped NOT; recognise an always-true formula | L01 truth values and L02 definitions |
| Medium | E12–E16 | Evaluate parentheses, translate “at least one”, test a two-condition gate, distinguish inclusive/exclusive OR, evaluate a negated group | L02 operators and precedence |
| Hard | E17–E21 | Find a counterexample to a missing-parentheses reading; design a two-sensor always-false signal; apply a maintenance override; refute a universal claim about a nested formula; identify the shared mandatory condition of two access paths | Transfer of L02 ideas into checks and systems |

Objectives: O01 in E07/E13; O02 in E08/E14/E21; O03 in E09/E15/E19; O04 in E10/E16/E20; O05 in E11/E18; O06 in E12/E17. Every objective has a concrete, directly relevant task.

Selected misconception families: inclusive versus exclusive OR, treating AND as OR, ignoring parentheses or the outer negation, tautology versus contradiction, counterexamples to “always”, and neglecting a gate's shared blocking condition. Chosen contexts span mathematical assignments, room access, a warning signal and maintenance mode. After the draft-only self-review, E18/E20/E21 were rewritten to demand transfer, counterexample reasoning and shared-condition analysis instead of routine value evaluation. Correct positions vary across a/b/c. The hard labels remain editorial hypotheses, not empirically calibrated.

## Answer-key author checks

The first route follows the stated evaluation order. The second checks against an alternative property, a complementary assignment or a rejected option. These are two **author checks**, not independent review.

| Item | Key | Route 1 | Route 2 / edge case |
| --- | --- | --- | --- |
| E07 | b | NOT is the unary operator ¬ | AND and OR each combine two terms, so neither expresses NOT |
| E08 | c | 0 ∧ 1 = 0 | AND's only true row is 11; 01 is not that row |
| E09 | a | 0 ∨ 1 = 1 | OR fails only on 00 |
| E10 | b | ¬1 ∨ 0 = 0 ∨ 0 = 0 | Both disjuncts false implies false |
| E11 | c | A ∨ ¬A gives 1 for A=0 and A=1 | The alternatives fail on A=0 or all assignments |
| E12 | a | 1 ∧ (0 ∨ 1) = 1 | Inner OR is true; AND with true A stays true |
| E13 | b | “At least one” includes either and both, hence A ∨ B | A ∧ B misses single-open cases; ¬A ∧ ¬B means neither |
| E14 | a | Valid card 1 and invalid code 0 give 1 ∧ 0 = 0 | Necessary paired conditions fail when one fails |
| E15 | c | With 11, inclusive OR is 1, exactly-one is false | There are two successes, violating “exactly one” |
| E16 | b | ¬(0 ∨ 0) = ¬0 = 1 | OR is false only on 00; its negation holds there |
| E17 | c | At 100: (1 ∨ 0) ∧ 0 = 0, but 1 ∨ (0 ∧ 0) = 1 | At alternatives 000 both are 0; 101 both are 1 |
| E18 | a | With X=A ∨ B, X ∧ ¬X=0 for every pair of sensor states | Enumerate 00, 01, 10 and 11; wrong options trigger respectively on 10 and 00 |
| E19 | b | (1 ∨ 1) ∧ ¬1 = 1 ∧ 0 = 0 | Regardless of sensors, maintenance C=1 blocks the outer AND |
| E20 | c | At 100, ¬((1 ∧ 0) ∨ 0) = ¬0 = 1, refuting “always 0 if A=1” | At 110 and 101 the expression is 0, so those options fail to refute the claim |
| E21 | b | Set B=0: both A ∧ B and B ∧ C are 0, regardless of A,C | Factor as (A ∧ B) ∨ (B ∧ C) = B ∧ (A ∨ C); A=0 alone fails when BC=11; C=0 alone fails when AB=11 |

The finite truth-value calculations above cover the stated assignments and both truth values for unary tautology/contradiction questions. For contextual questions, the conclusion depends on the stated condition being accurately translated. No automatic truth-table **answer-key** coverage is claimed, because these are single-choice items. A second human mathematical and FR/EN review remains necessary.

## Bilingual and validation

Both languages use identical mathematical expressions. Vocabulary follows the course's AND/OR/NOT definitions; "ou" and "or" are expressly inclusive when confusion is possible. Feedback addresses every distractor. Hints point to an evaluation order or comparison case without naming the key.

- Assembler command: node scripts/assemble-exercise-draft.mjs exercises/drafts/L02/spec.json — assembled 15 items.
- Draft validator: node .claude/skills/math-course-studio/scripts/validate-draft.mjs exercises/drafts/L02/v3.draft.json — **OK, 0 warnings**.

Before publication: verify all keys and translations independently, review the hard-level claims, check source-page coverage, then promote under the separate immutable-bank release process with actual evidence. Nothing here certifies hosted/class readiness.
