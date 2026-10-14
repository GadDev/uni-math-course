# Designing a six-item bank

The checker fixes the shape (six items, one per objective, two types, two difficulty labels). Within it, design is yours. A bank is a small test of one lesson; make the six items different from each other.

## 1. Item roles across the six objectives

Aim for a visible progression rather than six variations of one question:

| Position | Role | Typical difficulty |
| --- | --- | --- |
| E01 | Recognise / read the notation or definition | foundation |
| E02 | Apply the definition mechanically (a computation, a table) | foundation |
| E03 | Apply it to a slightly less direct case | foundation or application |
| E04 | Distinguish it from a confusable concept | application |
| E05 | Handle an edge case (empty set, vacuous truth, zero, equality) | application |
| E06 | Combine ideas, or use it in a concrete context | application |

Objectives rarely map one-to-one onto this table; keep the lesson's own objective order and use the table to check balance. If two items test the same misconception, rewrite one.

## 2. Choosing the item type

- **truth-table** — for propositional lessons where completing every row *is* the objective (evaluating a formula, spotting equivalence). Not suitable when the objective is to *choose* or *explain*. Needs a formula whose rows you computed twice; use `scripts/logic-check.mjs`.
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

- [ ] Six items, E01–E06, each with a distinct objective and, where possible, a distinct misconception tag.
- [ ] Every key derived twice; two routes agree; edge cases tested.
- [ ] Domain stated in every prompt that needs one.
- [ ] Every option has FR and EN feedback that explains the error.
- [ ] Correct option position varies; no filler options.
- [ ] Hint helps method without leaking the answer.
- [ ] `coveragePages` equals the lesson's `sourcePages`; provenance says original-project-work.
- [ ] No slide text copied; no claim that anything is auto-graded beyond the stated grading contract.
