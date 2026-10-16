# L08 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [32, 33, 34, 35] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L08-1 — theorem boundary (both languages; E05).** The universal statement uses arbitrary `n` without requiring `n ≥ 1`. At arity zero there is no variable from which the displayed always-false fallback `¬(x ∨ ¬x)` can be built. A language with only unary/binary connectives and no constants has no closed formula. State positive arity, or explicitly admit constants and handle arity zero. The source p35 has the same implicit boundary; source agreement does not resolve it. The keyed theorem is correct for the intended positive arity.
- **Minor L08-2 — demand and cueing.** E01/E02 repeat the lesson XOR construction, E03 repeats the displayed minterm, and all four choice answers are `a`. Several application labels therefore measure reproduction. The heading that both connectives are necessary would benefit from the omitted argument that NOT alone cannot combine two independent inputs.
- **Minor L08-3 — stale availability.** Both lesson endings describe exercise practice as forthcoming despite a selected released bank.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: XOR has exactly true rows 01 and 10. The complementary pair, incomplete singleton and all rows are rejected by the displayed function. |
| E02 | The two minterms select 01 and 10 respectively; their disjunction is false at 00/11. All four stored rows checked against the prompt formula. |
| E03 | `a`: `¬x ∧ y ∧ z` is true exactly at 011. Other minterms select 100/001; the proposed disjunction admits additional rows. |
| E04 | `a`: De Morgan transforms `C ∧ D` into `¬(¬C ∨ ¬D)`. The negation of AND fails at 11, neither-input fails at 11, and OR differs at 01/10. |
| E05 | `a` under positive arity: choose one minterm per true row, then eliminate every AND by De Morgan; use a contradiction for no true rows. Other choices deny this construction or incorrectly claim OR alone suffices. See boundary finding L08-1. |
| E06 | First minterm selects 011 and second selects 100; all other six rows fail both. All eight stored rows checked. |

FR/EN formulas, keyed meanings, hints and explanations agree. Source pp32–35 supplies the construction; project examples use different rows and are not a copied source solution. Existing exhaustive two-/three-variable function tests corroborate those finite arities only. The general positive-arity proof is the minterm construction above, not an extrapolation from that test. No incorrect stored row found.


## Executed linked-key verification

`node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/L08/v1.json exercises/drafts/L08/answer-checks.json` exited 0. Exact output: [verification-output.txt](verification-output.txt). Every declared table formula was read against its bilingual prompt; supplemental checks are not stored-key coverage.


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
