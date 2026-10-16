# L06 exercise expansion — author draft (2026-10-16)

Status: **unreviewed author self-check**, not independent peer review.

## Version and coverage

Registry-selected L06 v1 is preserved; L06 v2 draft adds fifteen **new** E07–E21 IDs, five easy, five medium and five hard, with each of six objectives represented. The release and translation records remain unchanged. Source pages 24–29 match the existing lesson and bank; the underlying PDF was not read.

| Objective | Items | Scaffolding and intended demand |
| --- | --- | --- |
| O01 converse | E07 easy, E13 medium, E21 hard | Swap sides, refute numeric converse, refute a geometric converse |
| O02 contrapositive | E08 easy, E14 medium, E20 hard | Two negations, compound antecedent, De Morgan of compound consequent |
| O03 equivalence relationships | E09 easy, E15 medium, E19 hard | Direct rule, inverse counterexample, all four related implications |
| O04 tables of converses | E10 easy, E16 medium | Two- and three-variable converse columns |
| O05 everyday reasoning | E11 easy, E17 hard | No-badge contrapositive, then two linked implications |
| O06 only-if | E12 medium, E18 hard | Translate necessary condition, then distinguish necessity from unproven sufficiency |

Difficulty remains editorial rather than measured. E17 and E19 combine two rules; E21 transfers converse reasoning to geometry. The selected bank covers converse/contrapositive already, so novelty rests on the different demands, not merely the topic names.

## Candidate comparison

Two tempting but false rules guided distractor choice: an implication equals its converse, or it equals its inverse. The chosen tasks require constructing a witness against each, plus applying the true contrapositive rule. For only-if, the distractors deliberately add a converse not present in the natural-language statement. Rejected a mere longer chain of symbols without a change in reasoning demand.

## Mathematical author checks

| Item | Key / true rows | Primary argument | Different derivation or boundary |
| --- | --- | --- | --- |
| E07 | a | Converse exchanges A and B | Contrapositive also negates, so is distinct |
| E08 | b | Contrapositive is ¬B⇒¬A | Both false only when A=1,B=0 |
| E09 | c | Implication equals contrapositive | Exhaustive supplemental equivalence check; other pairs fail on 01 |
| E10 | 01,10,11 | ¬B⇒A fails only when B=0 and A=0 | Linked table check exhaustively matched |
| E11 | b | Enter⇒badge gives no badge⇒no entry | Entry without badge would falsify original rule |
| E12 | c | “Only if registered” means use⇒registered | Registered-without-use is permitted; converse adds a rule |
| E13 | a | 4 divisible by 4, not by 8 | Original direction holds because 8k=4(2k) |
| E14 | b | ¬C⇒¬(A∧B) | Set P=A∧B; apply ordinary contrapositive |
| E15 | c | 01 gives original 1, inverse 0 | At 00/11 both agree; single witness refutes universal equivalence |
| E16 | 000,001,011,101,111 | (A∨B)⇒C fails when OR=1,C=0 | Linked full-table comparison matched |
| E17 | b | ¬C⇒¬B⇒¬A | Assuming A=1 would force C=1, contradiction |
| E18 | c | Access⇒supervisor present; converse unstated | Countermodel: supervisor present, access refused for another reason |
| E19 | b | P⇔C, and R⇔I as contrapositive pairs | Exhaustive supplemental equivalence checks |
| E20 | a | ¬(B∨C)⇒¬A = (¬B∧¬C)⇒¬A | De Morgan plus exhaustive supplemental equivalence |
| E21 | c | 2-by-3 rectangle is not a square | Square⇒rectangle remains true; converse false |

The Boolean domain is explicit on formula tasks; arithmetic uses integers and the geometric task uses the standard quadrilateral definitions. A countermodel suffices to show an implication's converse is not entailed, but does not assert all such converses are false.

## FR/EN and verification

French and English were authored as paired stems and option feedback; all math-string spans matched in validation. Terms “réciproque/converse”, “contraposée/contrapositive” and “seulement si/only if” were checked for directional fidelity. Hints indicate direction or necessary-condition method without naming options.

- Assembler generated the v2 draft (15 items).
- Draft validator: **0 errors, 0 warnings**.
- Formula helper: **2/2 linked truth-table keys matched**, zero failed/unchecked; four supplemental equivalence/inequivalence checks passed. Thirteen single-choice keys remain outside automatic verification.

Needs a separate human mathematical/translation review, a source-page fidelity check and editorial difficulty assessment before any promotion. No served bank, immutable archive, lesson or release selection changed.
