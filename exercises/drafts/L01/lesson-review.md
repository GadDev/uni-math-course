# L01 content review — 2026-10-16

Status: Codex mathematical/bilingual author self-check; not independent human peer review or publication approval.

## Scope

Pinned source: `c2238703e34986b623a151473d2f4f6568e3956a`; both L01 lesson files and registry-selected bank v1, every prompt/hint/option/feedback/explanation and six keys. PDF pages 3–5 were read from the supplied course source: they define assertions and distinguish vague and liar sentences. The examples here are original project work; no substantial source text is reproduced. See the range review's evidence manifest for complete file hashes and command results. L04 is outside the requested review range.

## Findings

| ID | Severity | Location | Finding and impact | Proposed separate correction |
| --- | --- | --- | --- | --- |
| L01-1 | Blocking | FR/EN lesson, Context and notation / Contexte et notation | Fixing speaker, place and time is said to give **a sentence** one truth value. Questions, the liar, and vague predicates without a threshold remain counterexamples; the guided example itself separately fixes a threshold. This overgeneralizes the source definition. | Restrict the claim to precise, non-paradoxical declarative statements with all relevant context/meaning fixed. |
| L01-2 | Minor | E04/E06; Guided example / Independent practice | E04 repeats the exact temperature worked example; E06 reuses the lesson's false-prime example. Their application labels overstate the observed demand; these are recognition/retrieval, not demonstrated transfer. | Calibrate notes/labels or introduce meaningful variation in a new bank version. |
| L01-3 | Minor | Correct option positions | Five keys are b, one c; position becomes a cue. | Diversify positions in a new version while preserving identity/history. |
| L01-4 | Minor | FR/EN Independent practice | Says interactive practice will be added after authentication/grading, although implemented locally. | Renew both lesson texts and review fingerprints in a separate editorial correction. |

## Mathematics and verification coverage

| Item | Key | Concise semantic check, alternatives and different check | Scope/result |
| --- | --- | --- | --- |
| E01 | b | 7 = 2·3 + 1 is odd and determinate. a is vague under the course's stated convention; c is a question, d a command. Contrast the source examples and sentence types. | Author semantic check; no automatic natural-language key checker. |
| E02 | c | Assuming the liar true forces false and vice versa. Independently the Boolean fixed-point condition v = ¬v has no solution. a/b contradict their assumption; d confuses ignorance with inconsistency. | Exhaustive two-value check plus semantic argument. |
| E03 | b | A specified rainfall proposition has one unknown truth value under the lesson's intended classical idealization; changing weather does not change the fixed instant. Neither truth nor falsehood is asserted here. a/d confuse context or knowledge; c wrongly asserts necessary truth. | Author semantic check; no actual historical weather lookup needed or claimed. |
| E04 | b | Only b fixes temperature threshold, location and instant. a stays vague, c asks a question, d expresses an uncalibrated opinion under this course convention. Compare with the guided example; the answer is copied, not a transfer task. | Author semantic check. |
| E05 | b | 2 = 2·1, so the assertion is true, encoded 1. a is false's code, c is a name, d the sentence rather than a truth value. Divisibility independently confirms evenness. | General elementary argument and existing numeric test. |
| E06 | b | 10 = 2·5, so its primality claim is false. a is true; c/d are interrogative in the course convention (tag questions carry an assertion pragmatically, but are not the requested declarative assertion). | Elementary counterexample plus trial-divisor test. |

No truth-table items: linked automatic truth-table key coverage is not applicable. All six choice keys remain outside the helper's automatic verification. Existing tests partly use textual heuristics (a numeral in E04 or a matching phrase in E03); their success cannot certify these semantic classifications. No wrong stored key found under the explicitly stated course conventions. The general prose claim in L01-1 still needs repair.

## Bilingual, teaching, accessibility and rights

FR/EN definitions, options, explanations and errors preserve meaning; the context overstatement and stale availability occur in both languages. The English summary's “fresh falsifiable statement” is looser than FR “affirmation nouvelle à vérifier”; neither is a requirement for empirical falsifiability of every mathematical assertion. Use the glossary's assertion/statement terminology consistently. Threshold, time and location are translated correctly. Headings and prose are readable, no colour-only meaning observed; browser/screen-reader behaviour was not tested. The liar derivation is original explanatory support to the source examples; no copied artwork or source PDF is included.

## Verdict and open work

Mathematical exposition needs the scoped blocking prose repair; no incorrect stored choice key found. Publication readiness, calibrated difficulty and independent human FR/EN/mathematical review are not established. Record source coverage, structural tests, semantic arguments and human review as different evidence. Existing release exception remains unchanged. Correct prose separately; any bank wording/position/difficulty change uses a new immutable version. No content or registry changes are made here.


## Explicit rubric and scope inventory

- **A — Mathematics:** per-item checks above cover the keyed response and rejected alternatives; unresolved assumptions/ambiguities are findings, not passed keys.
- **B — Source:** the listed PDF pages were read as extracted text; visual inspection was limited to the exact central page inventory. Source agreement is not an independent proof.
- **C — Teaching:** worked examples precede practice and explanations follow answers; visible-answer repetition and hint leakage are reported above where observed. No learner study was run.
- **D — Languages:** FR/EN prose fields were read manually against one shared key and glossary terminology; structural formula equality is separately checked by the repository validator. This is not human translation approval.
- **E — Assessment:** all six item/objective identities, distractors, feedback and stored difficulty labels were inspected. `foundation` primarily measures scaffolded recognition; `application` includes medium combinations, with disclosed/repeated answers often reducing observed demand to easy. No demonstrated hard transfer or empirical calibration is claimed. Exact counts are in review-evidence.json.
- **F — Accessibility:** source text has headings, short explanations and verbal readings; no colour-only content signal observed. Several compact formulas require the lesson's adjacent explanation. Browser layout, keyboard, MathML and screen-reader delivery remain untested.
- **G — Rights/honesty:** notes contain short project-language findings and original arguments, no source PDF/artwork or substantial source transcription. No rights clearance, independent review, changed release status or hosted readiness is certified.

Scope labels: **Exhaustive finite checking** applies only to all rows/elements explicitly enumerated above; **Counterexample search** establishes only a found witness's refutation; **Bounded sanity check** describes finite samples of unbounded claims; **General mathematical argument** describes the symbolic/definition arguments under their stated assumptions. Existing tests sometimes assert literal keys or use text heuristics; these are not different semantic derivations. Unexecuted behavioural/browser checks and any unresolved semantic second check remain unverified. See the central test-scope inventory. Author self-check with a different derivation where recorded; not independent peer review.
