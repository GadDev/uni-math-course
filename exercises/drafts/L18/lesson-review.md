# L18 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [82, 83, 84, 85, 86, 87, 88, 89] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L18-1 — independent-practice reproduction.** E05 is the identical SQL, data and returned set as the guided example; E01 repeats the first displayed query and answer. These do not establish independent query interpretation. Use unseen data/query variants in a new immutable bank.
- **Minor L18-2 — scope of the SQL model.** “SQL has no universal quantifier” is a useful shorthand for no general `FOR ALL` predicate operator in this toy fragment; SQL does have `ALL` quantified comparisons. Clarify the intended fragment. The text already excludes nulls/duplicates; maintain that qualification in the takeaway instead of treating every SELECT as literal set comprehension. Projection can create duplicates even from duplicate-free source rows on other data.
- **Minor L18-3 — distractor/cueing quality.** Five keys are `a`; E02's semicolon distractor is implausible and E03's hint supplies all three names. FR E04 `d` feedback “tous ne...” is scope-ambiguous beside explicit English “not all”; use “au moins un ... ne ... pas.”
- **Minor L18-4 — stale availability** in both languages.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: filtering enrolments to bio retains max/noa, then projects student. Lia is art; all-student ignores WHERE; art/bio are the wrong column. |
| E02 | `a`: equality after WHERE is the Boolean row predicate. SELECT projects, FROM names the input relation, and semicolon is syntax termination. |
| E03 | `a`: conjunction/disjunction/negation respectively under two-valued, null-free conditions. Other lists swap AND/OR or confuse connectives with implication/quantifiers. |
| E04 | `a`: NOT EXISTS means the subquery has zero rows. It negates existence of a satisfying row, not existence of a failing row or universality without internal negation. |
| E05 | `b`: lia's correlated subquery has one art row and fails NOT EXISTS; max/noa each have zero and pass. Other result sets include lia or omit successful students. |
| E06 | `a`: no counterexample iff every element satisfies P, including an empty domain. `b` is its negation, `c` negates existence of successes, `d` requires only one success. |

Both languages preserve correlation (`e.student=s.id`), selected column, string constants and logical scope; no key mismatch found. Source pp82–89 was compared; project data and art-specific query differ from the source's no-course query, so its result must not be imported. Both actual SQL queries were executed in Python sqlite3 against exactly the stated rows and returned max/noa; central evidence records the transcript. This is finite-dataset query verification, not validation of arbitrary SQL/null behaviour. Official PostgreSQL subquery documentation was consulted for the ALL/model qualification; URL recorded centrally.


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
