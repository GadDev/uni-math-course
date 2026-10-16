# L01 exercise expansion — author draft (2026-10-16)

Status: **unreviewed**. Author mathematical/bilingual self-check only, **not independent peer review**. No release registry, selected practice bank, or published lesson was changed.

## Versions, coverage and scope

- Selected bank: `L01/v1.json` (six archived questions); proposed draft: `L01/v2.draft.json` (15 **new** questions, E07–E21, no reused item IDs).
- Release record: mathematical and translation `unreviewed-exception`; no new exception or evidence is claimed.
- Course objectives: O01–O06 all represented, some more than once. Lesson source pages: 3–5, inherited from the repository course map. The underlying third-party PDF was not inspected in this session. Questions are original project work; page fidelity is not newly certified.
- Audience: adults returning to mathematics. Required knowledge: simple sentence reading, whole-number comparisons, elementary arithmetic and the L01 distinctions (assertion, truth value, fixed meaning, self-reference).
- Requested distribution: **5 easy, 5 medium, 5 hard**. This is an editorial classification, not a calibrated empirical difficulty scale.

## Objective and difficulty coverage

| Item | Objective | Level | Demand and misconception |
| --- | --- | --- | --- |
| E07 | O06 | Easy | Convert a false arithmetic assertion to 0; avoid confusing false with undefined |
| E08 | O01 | Easy | Select a false assertion rather than a question or command |
| E09 | O02 | Easy | Identify a closed true assertion among other sentence types |
| E10 | O03 | Easy | Make a vague description measurable by fixing item, threshold and time |
| E11 | O05 | Easy | Distinguish the historical truth value from unavailable evidence |
| E12 | O06 | Medium | Evaluate two arithmetic assertions and preserve their ordered labels |
| E13 | O03 | Medium | Resolve multiple sources of contextual vagueness in ticket pricing |
| E14 | O02 | Medium | Contrast a free integer variable with a closed numerical proposition |
| E15 | O04 | Medium | Derive the contradiction when the liar sentence is assumed true |
| E16 | O01 | Medium | Test a universal arithmetic claim with a counterexample, then classify it |
| E17 | O03 | Hard | Diagnose remaining vague terminology even with person/date/place fixed |
| E18 | O05 | Hard | Transfer unknown-versus-undefined to a permanently sealed integer |
| E19 | O04 | Hard | Discriminate paradoxical self-reference from checkable self-reference |
| E20 | O02 | Hard | Contrast a free predicate variable with a specific but hidden witness |
| E21 | O01 | Hard | Reject proof by one example while retaining assertion status |

## Candidate comparisons and safeguards

The selected questions vary contexts (integers, archives, bags, admission prices, cards, self-reference), rather than swapping numbers in the existing six items. In each case, the distractor set was chosen to expose a specific erroneous inference rather than a random alternative:

- **Truth-value items (E07, E08, E11, E12, E18):** chose the false/unknown distinction over arithmetic speed. Rejected options explicitly confuse falsity, impossibility of verification, and absence of value.
- **Context items (E09, E10, E13, E14, E17, E20):** chose missing semantics and fixed objects over purely changing location or date. A dated sentence can still contain a subjective adjective (E17); an unknown fixed integer is not a free variable (E20).
- **Counterexample and self-reference items (E15, E16, E19, E21):** chose recognition of the *reason* over mere classification. Correct options vary between `a`, `b`, and `c` to avoid a positional pattern.
- The hard set remains within L01's core conceptual material; it does not claim that adult learners will find these items equally hard. E15 resembles archived E02's liar sentence, but evaluates one branch of the contradiction. Reviewers should decide whether that variation is sufficiently novel.

## Answer checks (two different author routes)

Every row was checked against the exact French and English stem; the second route is a separate derivation or explicit refutation of competing options, not independent peer review.

| Item | Key | Direct argument | Different check / boundary |
| --- | --- | --- | --- |
| E07 | b | 9 is odd, so the statement is false = 0 | Divide by 2: remainder 1, not 0; false still has a value |
| E08 | c | 5 is smaller than 8, so `5 > 8` is false | Question and command have no truth value; the false comparison does |
| E09 | b | 12 = 3 × 4 is divisible by 3 | Sentence is declarative and has a determinate value; other options request an action or answer |
| E10 | c | Numbered bag, numeric threshold and absolute date/time define a measurable claim | Both competing descriptions leave a subjective threshold unresolved |
| E11 | a | Fixed date/location/event yields a true-or-false historical proposition | Removing the records affects evidence, not the event's actual truth value |
| E12 | c | 4² = 16, hence (1,0) | (0,1) reverses the values, and (1,1) incorrectly treats 16 = 8 as true |
| E13 | a | Adult ticket, exhibition, date and price threshold are fixed | “Reasonable” and “too expensive” have unspecified judgments |
| E14 | b | 4 > 2 is a closed true comparison | Changing the value of free `n` changes `n > 2`; question form is not true/false |
| E15 | c | Assuming S true makes its statement “S is false” true, a contradiction | Assuming S false also makes the denial fail; this is more than missing information |
| E16 | a | 3² = 9 is odd, refuting a universal assertion | One positive case (2² = 4) cannot establish “every”; a false claim remains an assertion |
| E17 | b | “Tall” has no specified measurement rule, even with date/place | Two observers using different height thresholds can disagree with the same fixed context |
| E18 | c | The already-written integer has a fixed remainder modulo 3 | Either remainder 0 or 1/2 gives a definite truth value; the sealed card prevents observation only |
| E19 | b | The liar sentence contradicts each proposed truth value | Both “Cette phrase contient cinq mots” and “This sentence contains five words” contain five space-separated words, so that self-reference is evaluable |
| E20 | c | Free `n` leaves P open; the already-filled card makes Q closed | Changing `n` can flip P; Q's written integer does not change when the reader lacks access |
| E21 | a | 3 is divisible by 3 but not by 6 | 6 provides only one satisfying example; a universal statement is still an assertion when false |

All tasks are single-choice; the propositional truth-table key checker is **not applicable**. The draft validator checks structure and notation, not these mathematical arguments or true bilingual equivalence.

## French/English considerations

Use the same `$...$` expressions in both languages. “Assertion”, “truth value / valeur de vérité”, “counterexample / contre-exemple”, and “false / faux” follow the course vocabulary. E19 deliberately uses a *five-word* sentence in both languages; recount after any copy edit. E10 uses an absolute date so its correct option does not depend on when it is read. The bilingual checks here are author self-checks only.

## Validation and next review

- `node scripts/assemble-exercise-draft.mjs exercises/drafts/L01/spec.json` — assembled 15 new questions.
- `node .claude/skills/math-course-studio/scripts/validate-draft.mjs exercises/drafts/L01/v2.draft.json` — passed with 0 warnings.
- Key derivations: author self-check as recorded above; no automatic single-choice mathematics checker.

Before publication: a person must review all 15 mathematical keys, every French/English line and distractor, the difficulty classifications, and the claim of objective alignment. A separate evidence-backed promotion change is required to add an immutable bank and select it in `content/releases.json`. No hosted acceptance is implied.
