# L02 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [6, 7, 8, 9, 10, 11, 12] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

| ID | Severity | Location | Finding | Separate repair |
| --- | --- | --- | --- | --- |
| L02-1 | Minor | E02 hint; E05 hint | E02 explicitly names the correct notation; E05 explicitly supplies the correct tautological option. These reveal the selection instead of progressively cueing a method. | Redesign hints in a new immutable version. Hinted attempts already remain ineligible for fresh evidence. |
| L02-2 | Minor | FR E05 explanation | The opening sentence lacks “est”; English is grammatical. | Correct French in a new bank version; this is not a changed answer. |
| L02-3 | Minor | Both lesson practice paragraphs | Practice is described as future work although implemented locally. | Separate bilingual prose/fingerprint renewal. |

## Per-item mathematics and alternatives

| Item | Key | Definition and different check / rejected options |
| --- | --- | --- |
| E01 | d | AND requires both true; enumerate 00/01/10/11 and only 11 works. a/b/c contain a false operand. |
| E02 | b | The source defines + as inclusive OR. AND differs at 01; both negation notations omit B and differ at 11. No alternate defensible key. |
| E03 | a | At 11, OR = true; XOR, NOT A and A AND NOT B = false. Separately apply “at least one” versus “exactly one.” |
| E04 | 0,1,0,0 | NOT A AND B is true only at 01; rewrite as NOT(A OR NOT B) or enumerate every Boolean row. Linked comparison checks all four stored cells. |
| E05 | b | OR with true is true for both A values. a reduces to A; c fails at A=1; d is always false. Exhaust all Boolean assignments to corroborate the definitions. |
| E06 | b | Under the course's explicit no-default AND/OR precedence, the two readings differ at A=0,B=0,C=1. a has unambiguous negation precedence; c/d have one connective. The helper's conventional parser precedence is not the course's unparenthesized mixed-notation policy. |

## Rubric and bilingual findings

A correctness: no wrong key or table cell found. B source: pages 6–12 support notation, constant, tables, XOR distinction and negation priority; explicit parenthesization is a reasonable project clarification rather than proof of a source rule not stated there. C pedagogy: clear progression; fix selection-revealing hints. D FR/EN: mathematical meaning matches; French grammar issue above; singular/plural “constant(s)” in summaries is cosmetic. E item quality: E03's supplied assignment is scaffolded foundation demand despite application label; E06 tests a course convention, not a universal parser standard. F accessibility: prose readings accompany formulas; actual assistive-technology rendering unverified. G rights/honesty: source is used for comparison only, original examples retained, no independent review claimed.

Verdict: no blocking mathematical defect found; editorial/hint improvements remain. All five choice keys still require semantic/human review outside automatic checking.


## Executed linked-key verification

`node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/L02/v1.json exercises/drafts/L02/answer-checks.json` exited 0. Exact output: [verification-output.txt](verification-output.txt). Every declared table formula was read against its bilingual prompt; supplemental checks are not stored-key coverage.


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
