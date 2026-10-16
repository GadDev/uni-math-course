# L12 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [49, 50, 51] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L12-1 — missing nonempty-domain qualification in E01 feedback (`b`, both languages).** It calls `∀x ¬P(x)` stronger than `¬∀x P(x)` for arbitrary domain X. At `X=∅`, the former is true and the latter false, so that implication fails. On a nonempty domain it is indeed stronger. Keep the laws (which hold also on empty domains), but qualify the comparative feedback or give a mixed nonempty countermodel. The correct keyed equivalence is unaffected.
- **Minor L12-2 — ambiguous French natural-language scope.** “Tous les oiseaux ne volent pas” and E02 feedback “tout élément ne satisfait pas P” are susceptible to the very not-all/none scope confusion being taught. English explicitly says “Not every”/“every ... fails.” Prefer unambiguous French “certains oiseaux ne volent pas” and “aucun élément ne satisfait P.” Formulas themselves are unambiguous.
- **Minor L12-3 — assessment independence.** E03/E05/E06 reproduce visible lesson examples; five choice keys are `a`. E05 feedback to the empty-club option should explain that emptiness is sufficient but not necessary for absence of under-18 members, rather than merely saying it changes the subject.
- **Minor L12-4 — stale availability** in both languages.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: universal failure means a counterexample exists, including the empty-domain boundary where both sides are false. `b` differs on a mixed two-element domain; `c` differs when all satisfy P; `d` is the unnegated universal. See feedback qualification above. |
| E02 | `a`: absence of any witness means every element fails, true on the empty domain as well. `b` can coexist with a successful witness; `c` is not the complement; `d` equals existence of P. |
| E03 | `a`: one unavailable book suffices. In a mixed library, none/all-unavailable alternatives are false while the correct negation is true; some available can coexist with all available. |
| E04 | `d`: 4<4 is false, whereas 1/2/3 are each <4. All four domain elements checked. |
| E05 | `a`: over ages, not <18 means ≥18. An adult alongside a minor rejects `b`; an all-minor nonempty club rejects `c`; an all-adult nonempty club shows `d` is not necessary. Empty clubs also satisfy the correct universal. |
| E06 | `a`: swap universal to existential and replace > by ≤. Zero witnesses truth; 5 refutes `b`; `c` is true but not the syntactic negation; 2 refutes `d` and shows strict < is wrong. |

FR/EN keys and formulas agree, with the French scope issue above. Source pp49–51 supports the two quantifier-negation laws; project book/club examples are original replacements. Proof of each law is by meaning of universal/existential quantification, not enumeration of a few domains. No wrong keyed option found; explanatory feedback needs correction in a new bank version.


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
