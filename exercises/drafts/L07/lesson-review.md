# L07 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v2 prompt, hint, option, feedback, key and explanation. Registry states remain `self-checked` / `self-checked`. PDF pages [30, 31] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

| ID | Severity | Location | Finding | Separate repair |
| --- | --- | --- | --- | --- |
| L07-1 | Minor | All single-choice items | Every choice key is a, giving a strong answer-position cue. | Diversify positions in a new version. |
| L07-2 | Minor | E05 prompt | Asks for an equivalence conclusion, but the grading contract accepts only labelled Boolean cells. The explanatory conclusion is not independently assessed. | Distinguish the graded table from the optional self-review conclusion. |
| L07-3 | Minor | Both practice paragraphs | Future-tense availability is stale. | Separate bilingual lesson renewal. |

## Per-item mathematical checks

| Item | Key | Definition, independent computation/witness and alternatives |
| --- | --- | --- |
| E01 | a | Both implications must hold. Four assignments yield 1,0,0,1; b is a tautology, c differs at 01, d differs at 00. |
| E02 | 1,0,0,1 | Equality of truth values; separately evaluate the two directional implications and their conjunction. Linked check covers every cell. |
| E03 | a | Biconditional constructs a formula; semantic equivalence compares whole truth functions. b swaps the levels; c/d wrongly identify both symbols as one category. |
| E04 | a | v2 explicitly requires a necessary-and-sufficient condition, resolving the archived v1 ambiguity. Agreement on every valuation is exactly a tautological biconditional. b fails for conjunction versus disjunction; c disagrees everywhere; d is sufficient but unnecessary (identical contingent formulas or two contradictions). Existing test exhausts 16×16 pairs of two-variable truth functions; the general argument follows the definition, not extrapolation. |
| E05 | all true | De Morgan gives identical sides; all four row comparisons agree. No automatic grading of a written conclusion is claimed. |
| E06 | a | Only a treats whole-table equivalence as row-valued. b correctly computes false at 10; c correctly gives the bridge theorem; d correctly describes the relation. |

## Rubric and bilingual findings

A correctness: no wrong key found in selected v2. B source: pages 30–31 support definitions and distinction; the source leaves a proof prompt, so the project's full explanation is original support. C pedagogy: accessible row/whole-table contrast; improve answer-position balance. D FR/EN: v2 necessary-and-sufficient stem/hint, all options and feedback align; no remaining grading-affecting mismatch found. E quality: E04 now rejects sufficient-only conditions for a precisely stated reason; immutable v1 must remain historical evidence. F accessibility: plain-language distinction and row labels observed; runtime untested. G rights/honesty: read the existing L07 review without modifying it; this is another author self-check, not independent confirmation by a human.

Verdict: prior E04 ambiguity is fixed in selected v2. Preserve historical grades and existing release evidence; do not recertify class readiness from this review.


## Executed linked-key verification

`node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/L07/v2.json exercises/drafts/L07/answer-checks.json` exited 0. Exact output: [verification-output.txt](verification-output.txt). Every declared table formula was read against its bilingual prompt; supplemental checks are not stored-key coverage.


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
