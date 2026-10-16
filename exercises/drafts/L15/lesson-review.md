# L15 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [59, 60, 61, 62, 63, 64, 65] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L15-1 — E02 depends on E01's unstated local data.** “With the same sets A and B” does not restate them. A standalone bank item cannot determine its union from that prompt; bind `{1,3,5,7}` and `{3,4,5,6}` in E02 itself. The key is correct when E01's data is carried over. This is a self-contained-prompt requirement; browser presentation was not tested.
- **Major L15-2 — response-position shortcut.** All six choice keys are `a`, allowing full marks by first-option selection. Rebalance in a new immutable bank.
- **Minor L15-3 — repeated examples and convention wording.** E04 directly names the displayed law and its hint names the transformation; E05 repeats the exact ambient-set example. The source/course defines complement only when A⊆C: under that convention its requirements are valid. General set difference C\A also works for arbitrary A, so the prose should identify this as the course's complement convention rather than an impossibility in broader mathematics. The relative De Morgan identities remain true under that broader definition too.
- **Minor L15-4 — stale availability** in both lessons. E06 `c` feedback omits the ambient restriction when describing nonmembership as a complement; add it for consistency.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: common elements are 3/5; 1/7 are only in A, 4/6 only in B. Other options are union, A-only and all B. |
| E02 | `a` conditional on E01's data: sorted unique union is 1,3,4,5,6,7. Other choices lose A-only/B-only/common elements. Without those data the item is underdetermined. |
| E03 | `a`: remove 1..4 from C=1..8 to leave 5..8. The other options retain removed members, leave C, or omit remaining members. |
| E04 | `a`: for any x∈C, not(A or B) iff not A and not B. With C={1,2,3}, A={1}, B={2}, the target is {3}, alternatives b/c give C and d gives {2,3}. |
| E05 | `a`: direct differences give {3} and {3,4} for the two named ambient sets. Empty occurs only for C=A under A⊆C; “all numbers” presupposes a missing choice of domain. |
| E06 | `a` is inclusive OR by definition; an A-only member refutes AND, a common member refutes nonmembership, and arbitrary C is unrelated. |

FR/EN formulas and condition directions agree. Source pp59–65 agrees with definitions/laws; project finite examples are different original data. General identities follow by arbitrary-element membership and Boolean laws; no finite-test inference is used as a universal proof. L04 was consulted only as prerequisite Boolean-law support, outside requested review scope. No incorrect stored key under the intended E01 context; E02 wording needs repair.


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
