# L13 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [52, 53, 54, 55, 56] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L13-1 — response-position shortcut.** All six keyed choices are `a`; selecting the first option earns full marks without evaluating any comprehension. This is an assessment-validity defect, not a wrong mathematical key. Rebalance and re-evaluate in a new immutable version.
- **Minor L13-2 — assessment independence/coverage.** E03/E04/E05 reproduce exact displayed answers; E02 extends the prime domain but yields the same set. The practice summary promises “two intervals,” while only E03 primarily assesses interval notation; E06 instead compares natural/real comprehensions. Explain that distinction or align the summary.
- **Minor L13-3 — stale availability** in both languages. The interval-bracket explanation correctly identifies French notation in English, but an English `(2,∞)` gloss would improve transfer; this is not a wrong notation finding.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: filter 1..6 by divisibility by 2 to obtain 2,4,6. Other options invert the filter, omit filtering, or drop 6. |
| E02 | `a`: 0/1 are not prime; 4,6,8,10 have divisor 2; 9 has divisor 3; 2,3,5,7 have no nontrivial positive divisor. Other options add 1/9 or omit 2. |
| E03 | `a`: strict > excludes 2, includes 3, and is unbounded above. These witnesses exclude the closed endpoint, lower half-line and start-at-10 alternatives. |
| E04 | `a`: witness k=0 proves membership of 0. Odd 7/3 cannot be twice a natural; −2 fails the domain before filtering. |
| E05 | `a`: each of 1/2/3 is ≤5, so none passes. 5 is not in the domain (and also fails >5); keeping all ignores the predicate; empty still is a set. |
| E06 | `a`: 5/2 witnesses inequality of sets and failure of reverse inclusion; 3 witnesses nonemptiness. Every natural >2 is real >2, proving forward inclusion for all members. |

Both languages preserve domain, strictness, predicates and option meanings; no mistranslated key found. Source pp52–56 was compared: comprehension, interval and even-number examples agree; the original prime filter replaces the source's city filter. No wrong mathematical key found. Infinite-set conclusions above use witnesses/inclusion arguments rather than a finite sample claim.


## Automatic key coverage

No truth-table items in this bank: linked automatic table-key verification is not applicable. All six single-choice keys remain outside automatic key verification. No empty manifest was used.


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
