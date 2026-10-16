# Chapter 2 — mathematical and bilingual release self-check

Scope: L21–L36, both lesson languages and each new v1 bank, 240 original single-choice items. The owner requested mapping the PDF, writing FR/EN lessons and worked examples, 5 easy / 5 medium / 5 hard items per lesson, verification and integration with saved practice. This change performs that separately authorized promotion from the inactive draft checkpoint. It selects new archives and never changes a previously published bank.

Review type: AI-assisted author self-check with different mathematical routes; **not independent peer review**. No human reviewer, review timestamp, empirical difficulty calibration or hosted acceptance is asserted.

## Evidence and source alignment

The [source map and clarification table](../../exercises/drafts/chapter-02/README.md) explain all 87 PDF pages, repeated builds, prerequisite support and the source's omitted conditions. Each lesson has six objectives and matching sourcePages/coveragePages. The source PDF is not redistributed. Explanations, datasets and solutions are original project work.

Every lesson folder under `exercises/drafts/L21` through `L36` contains the proposed bilingual reading, bank, per-item objective/difficulty ledger and `answer-checks.json`. The machine-readable [verification results](../../exercises/drafts/chapter-02/verification-results.json) distinguish 129 exact symbolic/numeric candidate checks from 111 recorded mathematical arguments. For each argument, the authored key, domain and rejected alternatives were read against the stem; these arguments are author judgments, not computer-verified proofs. The first route is the bank's worked explanation; the second route is the calculation or argument in its manifest.

The separate Python verifier executes the lesson's Python code, reproduces the regression example with exact rationals and rejects empty and constant-input data. It compares Bresenham updates with exact rounding for 350 segments in the stated octant. This is bounded testing, supported by the general recurrence identity, not an all-octant claim.

## Review findings resolved before selection

- Kept the nonzero restrictions after cancellation and division, and both roots when solving a square equation. L24's inequality counterexample choices were corrected so there is exactly one valid witness; zero would also refute the implication and was removed.
- Required equal physical units for the coordinate distance formula and a nonzero coefficient vector for a line.
- Kept upward mathematical y separate from downward screen v, stated the restricted Bresenham octant, handled reverse traversal and chose NE on ties.
- Used nonnegative squared loss, not strictly positive loss; explained constant-input nonidentifiability.
- Required positive Sxx and Syy for Pearson correlation, qualified the perfect-fit equivalence and did not claim interpolation guarantees reliability.
- Replaced a question about the source's later syllabus with a model-evaluation task about using validation data for fitting.
- Preserved red incorrect-answer feedback within the green Chapter 2 theme; both 320 px regression checks pass. Desktop/mobile overview, reading and practice views were visually inspected.
- Corrected an FR/EN formula-sequence mismatch in the change-of-units question. Translated the coordinate-curve option prose while retaining identical mathematical strings.

## Bilingual and pedagogical check

FR and EN share identities, keys, domains, formulas and section order. Read each pair for meaning, particularly negation, inequality direction, units, signed residuals, intercept terminology, boundary inclusion and constant-variable cases. Formula-sequence and heading checks are additional mechanical evidence. No fluent independent human translation review is claimed.

All banks contain exactly 15 items, 5 per level, cover all six objectives and supply answers, method hints and worked feedback for every choice. Levels are editorial judgments for beginning learners, not calibrated scores. Hard tasks target conditions, counterexamples, transfer or argument recognition; familiar tasks may be easier for experienced learners. The supported format tests recognition, not free proof production. No Boolean truth-table key checks apply to this chapter.

## Integration and historical semantics

The registry selects the exact immutable v1 copies and fingerprints both full lesson files and the bank. French source fingerprints are renewed for these new lessons only, following the bilingual review above. The original L01–L20 registry records and bank bytes remain unchanged.

The Chapter 2 catalogue links 16 public bilingual readings and 240 signed-in questions. Chapter-aware outlines and breadcrumbs retain the chosen green Décalage art. The existing server grader, attempt records, hint/retry eligibility, account isolation and archived-version explanations serve the new IDs. The safe login-return policy now consults the release registry instead of hardcoding L01–L20 and still rejects unknown destinations. Private progress groups the actual records by chapter, with no public fabricated learner metrics and no history reset. The existing SQL lesson-ID contract already accepts L21–L36; no migration is needed.

## Reproducible validation

- `node scripts/check-chapter-two-drafts.mjs`: 16 pairs and 240 items; 5/5/5, objective coverage, unique choices, paired notation and KaTeX passed.
- `python3 exercises/drafts/chapter-02/authoring/verify.py` with SymPy: 129 exact checks, 111 argument records, lesson Python execution and 350 raster segments passed.
- Standard draft validation passed on all 16 banks after the matching lesson paths were staged for promotion.
- `pnpm check`: 267 tests passed, zero Astro errors/warnings/hints, formatting and production build passed.
- Browser suite: 172 passed, including all 16 new readings in both languages at 320/1280 px and saved Chapter 2 practice, reload/language switching, later sign-in and account isolation.
- Immutable-bank gate passed against current main; L01–L20 archives are unchanged.

Remaining limitations: independent human mathematics/translation review and difficulty calibration remain useful; hosted acceptance and cloud persistence must still be assessed in the existing class-pilot process. Local protocol fixtures verify application behavior without claiming to certify a deployed database.

Author self-check with a different derivation; not independent peer review.
