# L03 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [13, 14] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

| ID | Severity | Location | Finding and impact | Separate repair |
| --- | --- | --- | --- | --- |
| L03-1 | Blocking ambiguity | E05 French stem and feedback | “Une seule ligne est fausse” can mean the formula is false (row 01) or a student's entry is incorrect (row 11, the stored key). Both readings have exactly one row; English explicitly says “wrong.” A mathematically coherent French reading can therefore select rejected b. Feedback starts “Correct” on rejected rows without distinguishing a correct table entry from a correct response. | Ask explicitly for the unique **incorrect written entry**, and tie feedback to the student's table rather than selection correctness, in a new bilingual bank version. |
| L03-2 | Major | E02 explanation | Defines an atomic assertion as a bare letter and calls every other form composite, although prerequisite L02 introduced the zero-argument constant top; the stated source/course definition excludes constructions using connectives, not every non-letter expression. | Scope the bare-letter test to the offered formulas/designated atoms; explain constants separately. The current offered key C is still valid. |
| L03-3 | Minor | Both lessons Independent practice | Future-tense practice availability is stale. | Separate bilingual prose renewal. |

## Mathematical and alternative checks

| Item | Key | Author argument and different check |
| --- | --- | --- |
| E01 | b | Three independent binary choices give 2³=8, corroborated by the listed eight distinct binary strings. 6/9/3 count different objects. |
| E02 | d | C has no connective; AND, NOT C and OR NOT B each have an operation in their syntax tree. Compare against the source definition; the explanatory overgeneralization above does not change the offered key. |
| E03 | 010,100,110 true | C must be false and at least one of A/B true. Distribution gives (A AND NOT C) OR (B AND NOT C); eight-row enumeration checks the stored cells. |
| E04 | a | NOT 0 AND (0 OR 1)=1. Independently both required factors equal 1. b is arithmetically wrong and c/d ignore fully supplied values; their feedback should not imply a unique cause for every error. |
| E05 | d under intended “incorrect entry” reading | Correct column for A OR NOT B is 1,0,1,1; only written row 11 differs. Under literal formula-false reading, row 01 is uniquely false, giving b. Preserve both readings; do not force consensus. |
| E06 | 0001 | Distribution reduces (NOT A OR B) AND A to A AND B. Four-row evaluation agrees. |

## Rubric and bilingual findings

A correctness: linked tables and arithmetic match; E05 is a grading-affecting wording problem. B source: extracted pages 13–14 support atomic/composite distinction and table construction; the project supplies original completed examples and three-variable practice. C pedagogy: progression is clear; three-variable work needs scaffolded subcolumns as supplied. D bilingual: E05 false/wrong distinction is consequential; other fields retain meaning. E quality: six distinct objectives and keys, but ambiguity must be fixed before treating this bank as pilot-ready. F accessibility: row labels are explicit; actual HTML/MathML/screen-reader rendering untested. G rights/honesty: no source exercise solution claimed as supplied, no independent review claimed.

Verdict: hold mathematical/bilingual approval of E05 pending wording review; do not infer a wrong Boolean table key from that ambiguity. Single-choice semantics remain outside the helper's automatic verification; E04's supplemental value check is one assignment only.


## Executed linked-key verification

`node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/L03/v1.json exercises/drafts/L03/answer-checks.json` exited 0. Exact output: [verification-output.txt](verification-output.txt). Every declared table formula was read against its bilingual prompt; supplemental checks are not stored-key coverage.


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
