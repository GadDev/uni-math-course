# L17 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L17-1 — independent-practice data exactly duplicate the guided solution.** E05/E06 use the same students, courses and all three enrolments as the visible worked example and ask for its disclosed truth values. E03/E04 also repeat the two displayed translations. These are recognition/rehearsal, not independent transfer evidence; change the data or scope the mastery claim in a separately versioned bank.
- **Minor L17-2 — self-contained notation.** E03/E04 omit the definitions of E, C and I included in other prompts. Their linguistic intent is recoverable from variable names/lesson context, but explicitly state the domains/predicate to support standalone delivery.
- **Minor L17-3 — stale availability** in both lesson endings. The takeaway “a table is a set of pairs” should retain the binary-toy-model qualification; real tables can have any arity, while the preceding SQL caveat correctly excludes duplicates/nulls from this model.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: enumerate lia-art/lia-bio/max-art/max-bio/noa-art/noa-bio, six. Three enrolments are a proper subset of the product; 5/3/2 are not its size. |
| E02 | `b`: max-bio is listed; lia-bio, noa-art, max-art are absent. “Exactly” establishes closed-world predicate data. |
| E03 | `a`: each student may choose a dependent course witness. `b` demands a common course, `c` one student in every course, `d` no empty course. They are distinct translations, even where some happen to agree on this data. |
| E04 | `a`: choose one course before requiring every student. The other alternatives allow dependent courses, require each course populated, or merely one enrolment. |
| E05 | `b`: art fails at max, bio fails at lia; these exhaust C, so no common course exists. Two bio students are insufficient; all students having a course establishes a different formula. |
| E06 | `a`: witnesses art/bio/bio prove the universal-existential; the preceding two counterexamples refute the existential-universal. This gives true/false, excluding all other pairs. |

FR/EN domains, pair order, scopes, prompts/feedback agree. Source pp71–81 uses different names and enrolment pattern, so its false/false outcomes must not be copied to this original true/false dataset. All six product pairs and both course candidates were manually checked. The example proves non-equivalence by one countermodel; it does not claim the values differ in every model. No incorrect stored key found.


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
