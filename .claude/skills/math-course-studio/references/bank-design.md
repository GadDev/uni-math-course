# Designing a flexible exercise bank

The checker requires all six lesson objectives to be covered, but not a fixed number of exercises. Multiple questions may target an objective. The supported types are single-choice and truth-table; new difficulty values are easy, medium and hard, while old bank archives retain foundation/application.

## 1. Item roles across lesson objectives

Aim for a visible progression rather than six variations of one question:

| Position | Role | Typical difficulty |
| --- | --- | --- |
| First role | Recognise / read the notation or definition | easy |
| Second role | Apply the definition mechanically (a computation, a table) | easy |
| Third role | Apply it to a slightly less direct case | medium |
| Fourth role | Distinguish it from a confusable concept | medium |
| Fifth role | Handle an edge case (empty set, vacuous truth, zero, equality) | hard |
| Sixth role | Combine ideas, or use it in a concrete context | hard |

These are examples of roles, not fixed positions or IDs. Distribute the requested exercises across the lesson's six objectives. When targeting an objective repeatedly, vary the misconception or reasoning demand instead of making number-swapped clones.

## 1b. Easy, medium and hard are editorial levels

Difficulty is relative to the target objective and prerequisites actually taught before this item. Record the target learner, taught concepts, scaffolding and reason for the level; do not infer difficulty from item position or type.

| Editorial level | Observable demand | New stored difficulty |
| --- | --- | --- |
| Easy | Recognise a concept or apply one familiar rule, with explicit scaffolding. | `easy` |
| Medium | Select and combine taught ideas in several meaningful steps with less scaffolding. | `medium` |
| Hard | Transfer taught ideas to an unfamiliar situation, select a counterexample or analyse a justification. | `hard` |

A nested formula or a longer truth table is usually medium when the learner still follows the familiar evaluation procedure; added connectives alone do not demonstrate hard transfer. Recognition objectives may not support an honest hard variant within the same type. If a request demands all-hard items, preserve objective alignment and explain any lower-level items or propose a separate contract decision; never upgrade labels simply to satisfy the requested quota.

These are authoring judgements, not empirically calibrated levels. Historical `foundation`/`application` remain valid without migration. The user may request any number at each level; five per level is the default expansion goal, not a permanent ceiling. Record the rationale for each level in generation notes.

Every bank still covers all six objectives. Use several items per objective when useful. Do not force a hard item that depends on untaught material merely to meet a quota; document genuinely difficult transfer within the lesson or report the pedagogical limit. Keep additional work as a draft until reviewed and explicitly promoted.

### Comparable L05 examples (review specimens, not publishable bank JSON)

- **Easy, O01:** FR: « Avec A vraie et B fausse, que vaut A ⇒ B ? » EN: “With A true and B false, what is A ⇒ B?” Answer: false. The true antecedent/false consequent is the one failure case; values and method are familiar. Stored label: `easy`.
- **Medium, O04:** FR: « Quelle formule décrit exactement l’échec de (A ∧ B) ⇒ C ? » EN: “Which formula describes exactly the failure of (A ∧ B) ⇒ C?” Answer: A ∧ B ∧ ¬C. Treat the whole conjunction as the antecedent, then negate the consequent. Prerequisites: conjunction and implication; combine two taught ideas. Stored label: `medium`.
- **Hard, O05:** FR: « Chaque carte a un côté rouge ou bleu et un côté avec ou sans tampon. Quatre cartes montrent rouge, bleu, avec tampon et sans tampon. Quel ensemble minimal retourner pour tester “si rouge, alors avec tampon” ? » EN: “Each card has a red or blue side and a stamped or unstamped side. Four cards show red, blue, stamped and unstamped. Which minimal set must you turn over to test ‘if red, then stamped’?” Answer: red and unstamped. Either can hide the failure case; the other two cannot. This transfers implication to an inspection strategy using only the taught failure rule. A single-choice version assesses recognition of the strategy, not production of a proof. Stored label: `hard`.

The examples have author mathematical/bilingual self-check only. Before use they need complete bilingual options, feedback, hints, provenance and the normal draft validation/review. A familiar card task may be easier for an experienced learner: record that uncertainty.

### Quality gates for every level

- State domains, assumptions and boundary cases; test each rejected option against the exact stem, including sufficient versus necessary-and-sufficient readings.
- Use misconception-based distractors; give concise worked solutions and equivalent FR/EN feedback. Check meaning and required effort in both languages, not just formula parity.
- Hints should move from a method cue toward a useful next step without naming the answer; keep hints optional. Never label a leaked answer as scaffolding that demonstrates independent mastery.
- Compare against the lesson's worked examples and selected bank. Changing numbers or paraphrasing is surface variation, not transfer. Record close matches and justify any retained repetition.
- Longer arithmetic, obscure notation, trick wording and untaught content are not conceptual difficulty. Keep plain-language mathematical readings and the supported deterministic grading contract.
- A hard item may ask learners to recognise a valid argument or counterexample from choices. Free proof production belongs in proposed-types notes; no automatic proof grading exists.

## 2. Choosing the item type

- **truth-table** — for propositional lessons where completing every row *is* the objective (evaluating a formula, spotting equivalence). Not suitable when the objective is to *choose* or *explain*. Needs a formula whose rows you computed twice; use `scripts/logic-check.ts`.
- **single-choice** — everything else. Make each option a plausible error; four options by default (three minimum).
- **Neither fits** (e.g. "prove that…", "find a counterexample of your own", "which step is wrong?"): do not force it into a poor multiple choice. Write the nearest single-choice that tests recognition, and put the real item in `proposed-types.md`.
- A **sets / relations / quantifier lesson** has no truth-table material unless an objective is genuinely propositional. Do not invent a table to fill the slot.

## 3. Distractor engineering

1. Name the misconception first (tag it), then write the option a student with that error would choose.
2. Every distractor must be wrong for a reason you can state in the feedback; every distractor must be tempting for a reason you can name.
3. Avoid distractors that are eliminable by form: length, absolutes ("always"/"never"), grammar, or being the only option with a negation.
4. No "all/none of the above"; no overlapping options where two are defensibly right.
5. Vary the position of the correct option across the bank.
6. Feedback on a distractor says what the student probably did, why it fails, and the repair, in a neutral tone. The correct option's feedback confirms *why* it is right, not just that it is.

## 3b. Hints

A hint nudges the method, never the answer or the option. It must not make the item trivially solvable, and it must not be required to understand the stem. Hints and revealed solutions are not fresh mastery evidence (the evidence block already encodes this).

## 4. Prompts and domains

- State the domain in the prompt: "for every natural number $n$ (0 included)", "in the universe $E = \{1, 2, 3\}$".
- Name the ambient set whenever a complement appears.
- Use French interval notation `]a, b[` in both languages.
- Prefer small, checkable instances; avoid arithmetic that is harder than the logic being tested.
- Contexts (cards, students, databases) must not carry a hidden second ambiguity (see the Constitution's page 48 discrepancy). When the source's example is itself flawed, do not build an item on it.

## 5. French and English together

- Write both from one shared answer; never translate a finished English item mechanically.
- Look terms up in `src/data/glossary.json` (names, readings, confusions) and reuse the glossary's wording.
- French mathematical register: "assertion", "proposition", "contre-exemple", "condition nécessaire / suffisante", "pour tout", "il existe"; avoid anglicisms and keep sentences short.
- `$...$` strings are identical in both languages; translate the *reading* of the formula, not the notation.

## 6. Self-review checklist (run before validating)

- [ ] Requested item count, distinct IDs (new IDs when expanding), every objective covered and meaningful misconception diversity.
- [ ] Each item has a difficulty, prerequisites and rationale in notes; the requested easy/medium/hard counts are met honestly.
- [ ] Meaningful variation and non-leaking hints checked against the lesson and selected bank.
- [ ] Every key derived twice; two routes agree; edge cases tested.
- [ ] Domain stated in every prompt that needs one.
- [ ] Every option has FR and EN feedback that explains the error.
- [ ] Correct option position varies; no filler options.
- [ ] Hint helps method without leaking the answer.
- [ ] `coveragePages` equals the lesson's `sourcePages`; provenance says original-project-work.
- [ ] No slide text copied; no claim that anything is auto-graded beyond the stated grading contract.
