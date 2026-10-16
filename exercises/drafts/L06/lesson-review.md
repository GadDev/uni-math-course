# L06 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [24, 25, 26, 27, 28, 29] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

| ID | Severity | Location | Finding and witness | Separate repair |
| --- | --- | --- | --- | --- |
| L06-1 | Blocking | Everyday-language paragraph, both languages | Calls B⇒A something “stronger” than A⇒B. Neither schema entails the other: 01 satisfies the original but not the converse, while 10 satisfies the converse but not the original. Requiring both directions would be stronger. | Say a different direction/intention, or explicitly distinguish replacement from a biconditional strengthening. |
| L06-2 | Major wording | Takeaway, both languages | “Jamais” / “never ... in general” risks teaching that a converse can never agree with an implication, instead of not being equivalent in general. Taking A and B identical gives a simple special case where they do agree. | State “not equivalent in general; they may coincide for particular assertions.” |
| L06-3 | Minor | Both practice paragraphs | Interactive practice is still described as future work. | Separate bilingual editorial renewal. |

## Per-item mathematical checks

| Item | Key | Definition and different check / alternatives |
| --- | --- | --- |
| E01 | a | Swap antecedent/consequent without negation; b is inverse, c contrapositive, d changes consequent only. Compare exact formula structures. |
| E02 | b | Swap and negate both; a is inverse, c converse, d negation of the whole implication. Truth-table rewrite of the selected form equals NOT A OR B. |
| E03 | b | Contrapositive equals NOT A OR B by commutativity. a/c fail at 01, d at 11; exhaust four assignments to corroborate. |
| E04 | 1,0,1,1 | B⇒A fails only at 01. Compare NOT B OR A against all four stored cells. |
| E05 | a | If A⇒B is a true premise and B is false, A cannot be true. Allowed Boolean models with NOT B leave only 00; b contradicts the premise, c misses modus tollens, d is not forced. |
| E06 | b | “Only finishers get leave” requires leave⇒finished. a promises leave for finishers, c grants it to non-finishers, d asserts facts rather than the general eligibility rule. Translate the rule and inspect the direction. |

## Rubric, bilingual and source findings

A correctness: stored keys/table match under classical premises; repair logical-strengthening language. B source: pages 24–29 support definitions, contraposition and natural-language direction; p25 contains a proof prompt, so the completed table/argument here is project-authored support, not a supplied proof. C pedagogy: n=2 is a valid converse counterexample, including zero causes no problem for divisibility. D FR/EN: both share the strengthening and never-language issues; other translations preserve meaning. E quality: E05 repeats the lesson's report example, so do not claim transfer from that item. F accessibility: text explains formulas and row IDs; runtime accessibility untested. G rights/honesty: no substantial source quotation, no independent peer review claimed.

Verdict: no blocking key defect found; major conceptual wording should be corrected before treating this lesson as reviewed for the class pilot. Five choice keys remain outside automatic key checking.


## Executed linked-key verification

`node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/L06/v1.json exercises/drafts/L06/answer-checks.json` exited 0. Exact output: [verification-output.txt](verification-output.txt). Every declared table formula was read against its bilingual prompt; supplemental checks are not stored-key coverage.


## Verification limits and release decision

Structural/fingerprint checks and existing content tests are recorded in the range report; they do not establish prose semantics or independent review. Per-item arguments above are author mathematical checks of the key and rejected alternatives, with separate witnesses/definitions or finite computations. Any unproved general claim remains explicitly unresolved. Tables are compared only against supplied formulas; single-choice keys, wording and translation are outside automatic key verification. Browser/assistive-technology behaviour, empirical difficulty and hosted readiness were not tested. Existing review documents and release records are unchanged. Corrections need separately reviewed lesson edits or new immutable bank versions with renewed evidence; preserve original grades and version-specific feedback.


## Explicit rubric and scope inventory

- **A — Mathematics:** per-item checks above cover the keyed response and rejected alternatives; unresolved assumptions/ambiguities are findings, not passed keys.
- **B — Source:** the listed PDF pages were read as extracted text; visual inspection was limited to the exact central page inventory. Source agreement is not an independent proof.
- **C — Teaching:** worked examples precede practice and explanations follow answers; visible-answer repetition and hint leakage are reported above where observed. No learner study was run.
- **D — Languages:** FR/EN prose fields were read manually against one shared key and glossary terminology; structural formula equality is separately checked by the repository validator. This is not human translation approval.
- **E — Assessment:** all six item/objective identities, distractors, feedback and stored difficulty labels were inspected. `foundation` primarily measures scaffolded recognition; `application` includes medium combinations, with disclosed/repeated answers often reducing observed demand to easy. No demonstrated hard transfer or empirical calibration is claimed. Exact counts are in review-evidence.json.
- **F — Accessibility:** source text has headings, short explanations and verbal readings; no colour-only content signal observed. Several compact formulas require the lesson's adjacent explanation. Browser layout, keyboard, MathML and screen-reader delivery remain untested.
- **G — Rights/honesty:** notes contain short project-language findings and original arguments, no source PDF/artwork or substantial source transcription. No rights clearance, independent review, changed release status or hosted readiness is certified.

Scope labels: **Exhaustive finite checking** applies only to all rows/elements explicitly enumerated above; **Counterexample search** establishes only a found witness's refutation; **Bounded sanity check** describes finite samples of unbounded claims; **General mathematical argument** describes the symbolic/definition arguments under their stated assumptions. Existing tests sometimes assert literal keys or use text heuristics; these are not different semantic derivations. Unexecuted behavioural/browser checks and any unresolved semantic second check remain unverified. See the central test-scope inventory. Author self-check with a different derivation where recorded; not independent peer review.
