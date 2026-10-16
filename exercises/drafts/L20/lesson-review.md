# L20 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [95, 96] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L20-1 — “necessary, not sufficient” overstates what “only” entails (lesson and E02, both languages).** `V⇒M` does not imply `¬(M⇒V)`. In a model where exactly all managers can approve all requests, both directions hold and the only-managers sentence is still true. Say “necessary; sufficiency is not asserted/does not follow.” E02 `a` is defensible as an intended statement about what the sentence guarantees, but read literally it asserts nonsufficiency. Its own feedback to `c` correctly says sufficiency is unasserted rather than false. Source p96 uses the same shortcut; agreement does not establish the stronger claim.
- **Major L20-2 — independent-practice reproduction.** E03 repeats the exact guided model and disclosed counterexample; E04/E05/E06 repeat the visible translations/negation. These are rehearsal, not independent transfer evidence. Later bank variants should change the model/rule and assess an unseen negation.
- **Minor L20-3 — standalone domains and modalities.** E01/E04–E06 omit the U/R bounds and predicate definitions stated only in the lesson; make domains explicit. The model calls its tuples “approvals” although V denotes permission (“can approve”), so identify them as allowed approvals to distinguish permission from observed action. FR E06 `a` feedback “tous ne peuvent pas” is ambiguous; prefer “aucun utilisateur ne peut.” Five keys are `a`.
- **Minor L20-4 — stale availability** in both languages.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a` with u∈U/r∈R: every allowed approver must be M. A manager lacking one permission shows the converse is extra; mere successful manager existence does not exclude nonmanagers; conjunction asserts everyone is M and allowed. |
| E02 | Intended `a` in the entailment sense; necessity follows from the rule, sufficiency does not follow. Literal nonsufficiency remains unresolved wording, not a proved logical consequence. `b`/`d` deny required necessity; `c` adds an unasserted converse. |
| E03 | `b`: ben-r1 is allowed while ben is not M, giving true⇒false. Cleo's absence is harmless (false antecedent); ana's status or permissions do not repair ben's violation. All six user/request pairs considered. |
| E04 | `a`: each manager must have every request permission. `b` reverses implication; a single privileged manager does not guarantee all managers (`c`); `d` improperly requires every user M and only some request. |
| E05 | `a`: negate outer ∀, then implication to M∧¬B, then inner ∀ to ∃¬V. This derivation also handles empty U/R. `b` leaves ∀ unchanged; `c` admits a nonmanager witness; `d` changes the antecedent rather than negating. |
| E06 | `a`: one request must lack permission for every user. `b`/`c` permit only one missing user per request, `d` permits a different missing request per user. A two-user/two-request diagonal permission relation makes all three alternatives true while each request still has an approver, refuting their equivalence. |

Both languages preserve implication direction and nested scopes, with French ambiguity and shared inference overstatement above. Source pp95–96 poses administrator/file tasks; project manager/request solutions are original adaptations, not source-supplied answers. The two negation formulas were derived symbolically; the finite access model merely evaluates the particular statements. No wrong symbolic formula key found; E02 needs an unambiguous entailment reading in a separate version.


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
