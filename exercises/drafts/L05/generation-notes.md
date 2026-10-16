# L05 exercise expansion — author draft (2026-10-16)

Status: **unreviewed author self-check**; not independent mathematical or translation review and not release evidence.

## Versions and objectives

Selected archive L05 v2 remains unchanged. Draft v3 has fifteen new questions E07–E21, distributed five easy, five medium, five hard, with all six objectives covered. Provenance pages 20–23 were copied from the registry-selected bank and lesson frontmatter, not independently verified against the source PDF. The selected L05 bank has author self-check evidence; that evidence does **not** transfer to these new items.

| Objective | Items | Intended progression |
| --- | --- | --- |
| O01 implication failure | E07 easy, E13 medium | Direct 10 row, then compound antecedent |
| O02 table of implication | E08 easy, E14 medium, E19 hard | A⇒¬B, composite antecedent, then two rules as a conjunction |
| O03 necessary/sufficient | E09 easy, E15 medium, E20 hard | Numeric sufficient condition, necessary record state, two requirements with a missing converse |
| O04 negate implication | E10 easy, E16 medium, E21 hard | Bare implication, compound premise, then distinguish two differently scoped formulas |
| O05 natural-language violation | E11 easy, E17 hard | Non-VIP case and four two-sided badge cards |
| O06 counterexample | E12 medium, E18 hard | Divisibility by 4 and a statement about an integer's square |

The hard labels are editorial: the two-sided cards and the square counterexample require transfer, but learners with these examples already memorised may find them easier. The cards intentionally follow the same failure principle as the lesson and the skill's own guidance; reviewers must decide whether that is sufficient variation.

## Misconceptions and decisions

Retained distractors instantiate false antecedent, reversed necessary/sufficient reading, bad implication negation, insufficient example and failure to test the relevant cards. Rejected number-only variations where a counterexample needs conceptual analysis. All wrong-option feedback supplies a particular violating or nonviolating case.

## Answer-key author verification

| Item | Key / true rows | First argument | Different check / edge |
| --- | --- | --- | --- |
| E07 | b | A=1,B=0 is failure row | ¬A∨B=0 |
| E08 | 00,01,10 | Only A=1 and ¬B=0 fails | Exhaustive linked truth-table check |
| E09 | a | 6k=2(3k) is even | Odd and >6 cases do not guarantee evenness |
| E10 | c | Negation of implication is A∧¬B | Four-row Boolean equivalence checked as supplemental |
| E11 | b | Ordinary ticket makes the antecedent false | Without VIP, either star state is consistent |
| E12 | c | 6 even and not divisible by 4 | 8 supports the rule and 3 has false antecedent |
| E13 | b | At 100, A∨B=1 and C=0 | Alternatives 000 and 011 make the implication true |
| E14 | all but 110 | Antecedent A∧B true only at 110/111 | Exhaustive linked truth-table check |
| E15 | c | V⇒R makes R necessary for V | R without V is allowed, so V is not necessary for R |
| E16 | a | ¬((A∧B)⇒C)=A∧B∧¬C | Exhaustive supplemental equivalence check |
| E17 | a | To detect A∧¬B, turn visible A and visible ¬B cards | Other two faces cannot hide a violation |
| E18 | b | n=2 gives square 4 and non-multiple 2 | 4 fulfils both, 1 has false hypothesis |
| E19 | 000,001,011,111 | First implication fails at 100/101; second at 010/110 | Exhaustive linked truth-table check |
| E20 | c | Access⇒valid card is necessary; converse fails | Code missing provides explicit V=true,A=false witness |
| E21 | b | At 00 the negated first implication is 0, second is 1 | At 10 both are 1 and at 11 both are 0; supplemental inequivalence test passed |

All propositional domains are Boolean. The numeric claims state natural/integer domains and use counterexamples sufficient to refute universals; no bounded search is being presented as a general proof.

## Bilingual quality and verification

French/English notation was made identical for every mathematical expression. Badge-card sides are explicit and exclusive; “can open” is the other card face, not a physical guarantee. The single-choice answers and prose were checked by author reasoning, **not** by the logic helper.

- Assembler produced fifteen draft items.
- Draft validator passed with **0 warnings** after the math-string parity correction.
- Truth-table helper: **3/3 linked keys matched**, none failed or unchecked; three supplemental equivalence/inequivalence checks passed. Twelve single-choice stored keys remain outside automatic checking.

Before publication: a second person should verify the keys, translations, severity of difficulty and source-page fidelity. Archives L05 v1/v2, review evidence, and the release registry were not changed.
