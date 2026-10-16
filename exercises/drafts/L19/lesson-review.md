# L19 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human review, human translation approval or permission to publish.

## Scope and exact inputs

Pinned revision: `c2238703e34986b623a151473d2f4f6568e3956a` (full SHA in the range evidence manifest). Read both lesson languages and every selected bank v1 prompt, hint, option, feedback, key and explanation. Registry states remain `unreviewed-exception` / `unreviewed-exception`. PDF pages [90, 91, 92, 93, 94] were inspected as extracted text from the supplied 96-page source; selected high-risk source pages receive visual checks in the range report. No source PDF/text is included in the PR.

## Findings

- **Blocking L19-1 — E03 has no correct pair-count option for the admitted empty list.** The unqualified n-element question keys `n−1` pairs. At n=0 the actual count is zero, not −1. Correct count is `max(n−1,0)`; `range(n−1)` remains safe and empty. Either restrict this count question to n≥1 or amend the keyed option, feedback and lesson count sentence. Both languages share the defect; source pp90–93 uses the same implicit boundary. E06 expressly permits n=0, so this cannot silently be excluded.
- **Major L19-2 — E02 feedback `b` repeats the empty-domain strength error.** Universal strict descent is true for lengths 0/1, but “not sorted” is false. It is not stronger without n≥2. E01 `d` index-error feedback also needs qualification: `all` can short-circuit before the invalid last comparison, and an empty range raises no error.
- **Major L19-3 — numeric/order assumptions and index domains.** The lesson begins with an arbitrary Python list but treats `not(a≤b)` as `a>b` and assumes every nonempty numeric list has a maximum. Require values in a total order (e.g. real numbers excluding NaN, with defined comparisons); Python complex values are numbers without ≤, and float NaN makes both ≤ and > false. E04/E05 omit explicit index bounds; these should be `{0,…,n−1}` to avoid undefined accesses.
- **Major L19-4 — assessment validity.** All six keys are `a`. Moreover E05 rejects `∀i∃j t[j]≤t[i]` and `∃i∃j t[j]≤t[i]` as not expressing a maximum, yet on every finite nonempty totally ordered numeric list these and the keyed existence-of-maximum formula are all true. The intended dependency translation is defensible, but cannot be discriminated by truth-value tests on that domain. Ask for an index certifying maximality, or explicitly ask which formula has the required witness/dependency structure.
- **Minor L19-5 — coverage and independence.** Objectives promise Python translations for duplicates/maximum but their section gives only logical formulas. E01/E02/E06 repeat visible results. Both lesson endings have stale practice availability.

## Item-by-item mathematical and bilingual checks

| Item | Check and result |
|---|---|
| E01 | `a` under a total-order list and n=len(t). `[1,3,2]` rejects any-of-≤; `[1,1]` rejects strict <. `range(n)` accesses beyond the end for a nonempty nondecreasing list; it may short-circuit otherwise. |
| E02 | `a` under total-order comparisons follows by quantifier negation and complement of ≤. `[1,3,2]` refutes universal descent; `[1,2]` refutes a ≤ witness as nonsortedness; `[1,1]` refutes nonincrease as nonsortedness. Empty/singleton domains expose feedback `b` as above. |
| E03 | Intended `a` only for n≥1: start indices 0..n−2 number n−1. At n=0 all proposed counts are wrong or paired with the wrong range; zero actual pairs. This is an unresolved graded-answer boundary, not a passed general key. |
| E04 | `a` with bounded indices: duplicate positions can be ordered i<j. `[1,2]` refutes self-comparison `b`; a singleton refutes `c` as duplicate detection; choosing j=i refutes `d` for every candidate. |
| E05 | `a` has the intended maximal-value witness. For finite nonempty total orders a greatest value exists by repeated pairwise comparison. `b`/`c` hold by self-witness but do not exhibit that dependency; `d` requires all entries equal (fails [1,2]). Semantic non-discrimination is explicit above. |
| E06 | `a`: n=0 gives empty range(-1), hence all=True/any=False without evaluating indexing. For n=1 range(0) is also empty; the maximum existential is false only for the empty index set. |

Both languages share count, domain and feedback defects; no translation-only key divergence found. Source pp90–94 was compared, including that p94 merely asks the duplicate/maximum exercise and supplies no solution. The project correctly labels its solutions original; source agreement is not independent solution verification. Python built-in documentation was consulted, and exact short-list executions/counterexamples are preserved centrally. Those runs verify finite cases, not unrestricted mathematical maximum claims.


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
