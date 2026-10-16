# L07 exercise expansion — author draft (2026-10-16)

Status: **unreviewed draft**, mathematical and bilingual **author self-check only**, not independent peer review or release evidence.

## Versions, scope and difficulty

Selected bank L07 v3 retains the existing documented author self-check. This proposed v4 draft contains fifteen entirely new IDs E07–E21 (5 easy, 5 medium, 5 hard). The prior L07 v1/v2/v3 archives, bilingual lessons and release metadata were not changed. The source pages 30–31 came from the registry-selected bank and lesson frontmatter; the original PDF was not inspected.

| Objective | Items | Intended demand |
| --- | --- | --- |
| O01 biconditional | E07 easy, E13 medium, E19 hard | Read equal values, combine both directions, evaluate an access condition |
| O02 truth table | E08 easy, E14 medium | Two-variable negated side, three-variable conjunction |
| O03 connective vs relation | E09 easy, E15 medium | Distinguish symbols, apply semantic commutativity |
| O04 semantic equivalence | E10 easy, E16 medium, E20 hard | All-row comparison, find differing rows, negate both sides |
| O05 testing laws | E11 easy, E17 hard, E21 hard | Contrapositive, distributivity and limits of replacing a chain by its shortcut |
| O06 avoid symbol confusion | E12 medium, E18 hard | Reject one-row inference and incomplete software tests |

The hard classification is an editorial hypothesis, not measured learner difficulty. The table tasks directly assess all rows instead of merely asking the student to recognise the number of rows.

## Candidate and distractor decisions

The candidate families were formula evaluation, all-row table completion and diagnosis of a false generalisation. Kept genuine table tasks for O02/O05. Distractors represent biconditional-as-AND, a single implication replacing both directions, and agreement on one row mistaken for semantic equivalence. Rejected a repeated De Morgan truth table already present in the selected L07 bank. All single-choice options have bilingual specific repair feedback.

## Key verification (author)

| Item | Key or true rows | Primary check | Different check / boundary |
| --- | --- | --- | --- |
| E07 | b | Equal values make ⇔ true | 00 and 11 satisfy; 01 and 10 fail |
| E08 | 01,10 | A equals ¬B only on mixed rows | Exhaustive linked table check |
| E09 | c | ⇔ connective creates a formula; ≡ relates truth functions | Compare A versus B on 11 and 01 |
| E10 | a | P≡Q requires agreement on every assignment | One differing row refutes |
| E11 | all four | An implication equals its contrapositive | Exhaustive linked table check |
| E12 | b | Agreement on 11 does not imply column equality | 01 and 10 refute A≡B |
| E13 | a | Two implications hold exactly when values agree | Exhaustive supplemental equivalence |
| E14 | 001,111 | A=B and C=1 | Exhaustive linked table check |
| E15 | c | OR is commutative for every row | Four rows inspected directly |
| E16 | b | AND/OR differ on 01 and 10 | They agree on 00 and 11 |
| E17 | all eight | Distributivity makes the two sides identical | Exhaustive linked table check |
| E18 | c | Ignored 01 and 10 refute A≡B | The observed 00 and 11 only show local agreement |
| E19 | b | At 110, A=1 and B∧C=0 | Wrong alternatives yield matching sides |
| E20 | a | Negating both values preserves equality | Exhaustive supplemental equivalence and four-row check |
| E21 | 000,001,011,100,110,111 | False rows 010 and 101 show shortcut does not imply chain | Exhaustive linked table check |

All formula variables range over Boolean values. There are five truth-table items with stored keys; ten single-choice keys are outside the automated key comparison.

## Language, validation, open review

Mathematical strings were kept identical in French and English. The wording explicitly distinguishes a row-level truth value of a biconditional from semantic equivalence of *whole formulas*. Hints do not name option IDs and correct positions vary.

- Assembler: fifteen unreviewed v4 items.
- Draft validator: structurally valid, **0 warnings**.
- Logic helper: **5/5 linked table keys matched**; zero failed or unchecked; three supplemental equivalence/inequivalence checks passed.

Human mathematical and French/English second review, source-page fidelity, novelty check and difficulty calibration remain necessary before any separately authorized immutable-bank promotion. Existing self-check evidence for L07 v3 must not be transferred to v4.
