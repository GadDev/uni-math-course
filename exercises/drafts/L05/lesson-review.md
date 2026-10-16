# L05 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `self-checked` / `self-checked`. PDF pages [20, 21, 22, 23] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

| ID | Severity | Location | Finding | Separate repair |
| --- | --- | --- | --- | --- |
| L05-1 | Major assumption | E05 and card example | The key assumes a blue card cannot also be red. The lesson implicitly uses an exclusive colour model but does not state a single uniform colour per card; without that model the observation alone does not decide the antecedent. | State the two exclusive colour categories. No key error under the intended model; obtain a human wording decision before class use. |
| L05-2 | Minor | E03 hint; E05; E02 difficulty | E03's hint reproduces the answer; E05 repeats the guided blue-card example; E02 is direct canonical-table recall despite application label. These are weaker evidence of transfer than the labels suggest. | Improve hints and variation in a new version; do not present repeated examples as new mastery evidence. |

## Per-item mathematics and alternatives

| Item | Key | Definition, different check and rejected alternatives |
| --- | --- | --- |
| E01 | 10 | Failure is true antecedent/false consequent. NOT A OR B is true at 00,01,11 and false at 10; no alternative works. |
| E02 | 1,1,0,1 | Linked exhaustive four-row comparison agrees. Independently the disjunction fails only when both NOT A and B are false. |
| E03 | A sufficient, B necessary | Allowed implication models exclude 10; 01 demonstrates neither reverse implication nor mutual guarantee is forced. This proves the chosen relationship without assuming the converse. |
| E04 | A AND NOT B | De Morgan negates NOT A OR B; four Boolean assignments confirm it. NOT A AND B differs at 10; NOT A implies NOT B differs at 11. |
| E05 | no under exclusive colours | Blue implies NOT red only under the intended model, giving implication true regardless of stamp. A single case cannot prove the universal rule. If red/blue can overlap, the item is underdetermined rather than a simple no. |
| E06 | 8 | Solve failure n>5 AND n≤10 over naturals: exactly 6–10. Among 0,4,8,12 only 8 belongs. Bounded enumeration through 12 corroborates this; the symbolic inequalities justify the unbounded-domain result. |

## Rubric and bilingual findings

A correctness: no wrong stored Boolean key found; the colour-domain issue is separate. B source: pages 20–23 support implication, necessary/sufficient and negation; original project examples use strict thresholds instead of copying the source's non-strict example, without changing the taught law. C pedagogy: causation and one-observation-versus-general-proof warnings are strong; reduce worked-example repetition. D FR/EN: domains, thresholds, failure and necessary/sufficient meanings align. E quality: exactly one offered numerical witness; E05 has only two options, acceptable under the current schema but not the skill's preferred three-plus style. F accessibility: plain prose readings; actual browser/assistive technology untested. G rights/honesty: read original L05 review and scoped availability renewal; they are historical author evidence, not new human review. Current availability prose accurately reflects local implementation.

Verdict: retain existing self-check metadata unchanged; seek a scoped colour-model wording review and stronger practice design. Do not silently infer independent review from this note or bounded enumeration.


## Executed linked-key verification

`node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/L05/v1.json exercises/drafts/L05/answer-checks.json` exited 0. Exact output: [verification-output.txt](verification-output.txt). Every declared table formula was read against its bilingual prompt; supplemental checks are not stored-key coverage.


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
