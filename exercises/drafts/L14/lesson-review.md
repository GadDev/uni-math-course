# L14 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [58] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L14-1 — E03 `d` feedback (both languages) gives a false general reason.** “P(A) contains sets, not the elements of A” need not hold: with `A={∅}`, the empty set is an element of both A and P(A). The universal equality option is still wrong (already A=∅ is a counterexample); explain it using a valid counterexample, not categorical disjointness. The distinction between element and subset does not imply an object cannot be both.
- **Minor L14-2 — visible-answer repetition.** E01/E05/E06 reproduce displayed examples, E06 hint supplies the answer, and five keys are `a`. E01 `c` feedback presumes which part the learner omitted from a numeric answer; phrase as possibilities rather than a diagnosis.
- **Minor L14-3 — stale availability** in both lessons. Counting is correctly identified as enrichment rather than a source result.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: explicitly enumerate ∅,{1},{2},{1,2}, four distinct subsets. Numeric distractors disagree with that complete list. |
| E02 | `a`: {1,3} passes membership in {1,2,3}; {1,4} fails at 4; bare numbers are not subsets under the elementary object convention. |
| E03 | `a`: no element of ∅ can violate inclusion. `b` is its negation; `c` fails because every element of A belongs to A; `d` fails at A=∅ since P(∅)={∅}≠∅. See invalid feedback argument above. |
| E04 | `b`: a bijection sends each subset to its four inclusion bits, yielding 2⁴=16. This proves completeness of the count, not merely a pattern from small examples. |
| E05 | `a`: {1} is included; 1 is a bare number in the course convention; the full set and empty set both are subsets, rejecting `c`/`d`. |
| E06 | `a`: any subset of ∅ must be ∅, so its power set has exactly the one member ∅. The empty set/zero singleton/two-member family alternatives differ. |

Both languages agree on keyed meanings, formulas and explanations; the false general feedback is shared. Source p58 provides the definition and two-element example, with counting explicitly separate original support. No wrong stored option found. Elementary number/set typing is acknowledged; no claims about all foundational encodings are made.


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
