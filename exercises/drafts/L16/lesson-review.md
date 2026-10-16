# L16 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [67, 68, 69, 70] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Major L16-1 — E05 `b` feedback contradicts the taught empty-set boundary.** Both languages call `∀x∈X ¬P(x)` stronger than `¬∀x∈X P(x)` without assuming X nonempty. At X=∅ the former is true, the latter false. Qualify the comparison or replace it with a mixed-domain countermodel. This is the same issue as L12-1 and especially misleading next to E06, which correctly teaches vacuous truth.
- **Minor L16-2 — implicit predicate universe.** Expansion evaluates P on the quantified universe, including objects outside X, so explicitly require P defined on that universe (or an extension from X). “Larger universe” should permit equality with X; the existence of an outside object is a separate stated condition for the trap.
- **Minor L16-3 — assessment independence/cueing.** E04 repeats the entire guided U/X/P example, E05 repeats a displayed law, E06 repeats the empty-set paragraph, and five of six keys are `a`. The pairing mnemonic E03 is valid specifically for bounded-quantifier expansion, not a restriction on all quantified formulas.
- **Minor L16-4 — stale availability** in both languages.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a`: objects outside X satisfy the implication automatically; inside X must satisfy P. Conjunction would require every universe object in X; existential alternatives do not express universal restriction. |
| E02 | `a`: a witness must satisfy both membership and P. Implication admits any outside witness; universal alternatives cannot express existence correctly (take mixed P or empty X). |
| E03 | `a` matches both definitions. The reversed/mixed pairings contain the errors just distinguished, witnessed with an outside element and an all-false predicate. |
| E04 | `b`: x=4 witnesses the true implication. No x in X exceeds 10, rejecting `a`; x=1 refutes `c`; x=4 refutes `d`. All five universe elements satisfy the stated domain assumptions. |
| E05 | `a`: a counterexample inside X negates the bounded universal, also correctly false when X empty. Mixed P refutes `b` as an equivalence; all-true P refutes `c`; `d` is the original universal. See false strength comparison above. |
| E06 | `a`: the membership antecedent is false for every quantified x. No witness is required, value is defined, and P's truth anywhere is irrelevant. |

FR/EN keys, bounds and scoping agree. Source pp67–70 was compared and supports the expansions, outside-witness trap and negation laws. The generic laws follow by definitions and quantifier negation, including the empty case; finite witnesses diagnose distractors only. No wrong stored key found, but generic feedback needs a separate versioned correction.


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
