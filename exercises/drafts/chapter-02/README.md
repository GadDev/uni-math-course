# Chapter 2 — source map and authoring checkpoint

Status: unreviewed publication drafts with AI-assisted mathematical and bilingual author self-check; not independent peer review. This checkpoint does not activate lessons or practice. The user separately requested verification and integration, which is handled in the promotion change.

Source: Bruno Teheux, *Mathématiques Générales — Droites: du papier à l’écran, puis au machine learning*, BINFO-FCE 2026–2027, supplied file `Droites_01(3).pdf`, 87 PDF pages. Page 1 is the title. The source PDF and its artwork are excluded from Git. Prose, worked examples, questions and solutions are original project work. Standard mathematical definitions and formulas follow the source concepts.

## Lesson map

Repeated slide builds are consolidated. Each lesson contains six objectives, explanatory sections, at least two guided examples and 15 single-choice exercises with bilingual hints, worked answers and feedback for all options. Times are reading/activity estimates, not measured learner timings.

| Lesson | French / English | PDF pages | Minutes | Easy / medium / hard |
| --- | --- | --- | --- | --- |
| L21 | Calculer dans les réels / Calculating with real numbers | 4, 5, 6 | 14 | 5 / 5 / 5 |
| L22 | Développer et factoriser / Expanding and factorising | 7, 8, 9, 10, 11, 12, 15, 16, 17, 18 | 18 | 5 / 5 / 5 |
| L23 | Fractions, puissances et racines / Fractions, powers and roots | 13, 14 | 20 | 5 / 5 / 5 |
| L24 | Équations et inéquations / Equations and inequalities | 19, 20, 21, 22 | 18 | 5 / 5 / 5 |
| L25 | Systèmes de deux équations / Systems of two equations | 23, 24 | 16 | 5 / 5 / 5 |
| L26 | Sommes, moyennes et centrage / Sums, means and centring | 25, 26 | 15 | 5 / 5 / 5 |
| L27 | Repères et distances / Coordinates and distances | 28, 29, 30 | 15 | 5 / 5 / 5 |
| L28 | Équations cartésiennes et courbes / Cartesian equations and curves | 31, 32, 33, 34, 35 | 16 | 5 / 5 / 5 |
| L29 | Pente et ordonnée à l’origine / Slope and intercept | 37, 38, 39 | 15 | 5 / 5 / 5 |
| L30 | Deux points et intersections / Two points and intersections | 40, 41, 42, 43, 44, 45, 46, 47, 48, 49 | 18 | 5 / 5 / 5 |
| L31 | Demi-plans et triangles / Half-planes and triangles | 50, 51, 60 | 17 | 5 / 5 / 5 |
| L32 | Du repère aux pixels / From coordinates to pixels | 53, 54, 55 | 17 | 5 / 5 / 5 |
| L33 | Rastérisation et idée de Bresenham / Rasterisation and Bresenham’s idea | 56, 57, 58, 59 | 22 | 5 / 5 / 5 |
| L34 | Modèles affines et résidus / Affine models and residuals | 63, 64, 65, 66, 67 | 18 | 5 / 5 / 5 |
| L35 | Calculer et justifier les moindres carrés / Calculating and justifying least squares | 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79 | 25 | 5 / 5 / 5 |
| L36 | Corrélation et limites des modèles / Correlation and model limits | 62, 80, 81, 82, 83, 84, 85, 86, 87 | 22 | 5 / 5 / 5 |

Total: 16 lessons, 32 language files, 240 exercises (80 at each level). Pages 1–3, 27, 36, 52 and 61 are title, plan or section-divider pages. The mapping covers every substantive page. L31 brings the triangle application on page 60 alongside half-planes; L36 brings the correlation warning on page 62 alongside statistical interpretation. Page 87 is a preview, not a requirement to calculate derivatives or neural-network updates.

## Scope and design decisions

All listed page concepts are source-taught. Midpoint review in L27, domain checks, exact small datasets, explicit rounding ties and implementation safeguards are prerequisite support or explanatory additions. They do not claim to reproduce every source example. L21 starts from the real-number vocabulary of L10; subsequent prerequisites are explicit in each lesson-spec. Source examples and slide art are not copied.

Choose direct recognition/computation for easy tasks, combined applications for medium tasks, and counterexamples, conditional cases, model critique or general-argument recognition for hard tasks. Difficulty is editorial and relative to beginners; familiar edge cases can be easier for experienced learners. Single-choice recognition does not assess free proof production. Longer arithmetic alone is not an intended reason for a hard label.

Candidate comparison: numerical calculation versus proof-recognition versus unsupported free proof. Keep numerical calculation where the objective is operational; retain argument recognition for boundaries; reject free proof because the app cannot grade it. Within numerical choices, sign/scope and omitted-condition errors are retained; unrelated distractor noise is pruned. The per-lesson ledger maps every retained item to its objective and second check. Correct option positions rotate a/c/b, five of each per bank.

## Mathematical and bilingual author review

Every item's first route is its bilingual worked explanation. `answer-checks.json` records a different exact computation or mathematical argument for the key. `authoring/verify.py` uses SymPy for 129 exact symbolic/numeric calculations and rejects both incorrect original candidate values. It aligns the stored item IDs and rotated keys. The remaining 111 items have recorded mathematical arguments, reviewed as author self-checks; a script checks their presence, not their truth. The computation manifest is authored separately from prose and does not parse natural-language option semantics.

Additional reproducible checks execute the Python block actually published in L35, including empty/constant-input rejection; recompute its worked dataset with exact rationals; and compare the integer Bresenham recurrence with exact nearest-pixel rounding for all 350 integer segments with width 1–25 in the taught octant, including ties. This bounded enumeration is not a proof for every segment; the recurrence identity in L33 provides the general algebraic argument.

Read FR/EN together for preserved domains, strict versus non-strict inequalities, negative signs, negation, units, predicted versus observed values, and equivalent feedback meaning. Terminology: abscisse / horizontal coordinate, ordonnée / vertical coordinate, ordonnée à l’origine / vertical intercept, résidu / residual, entraînement / training, inférence / inference. French interval notation is kept in English. The draft checker verifies identical formula sequences, matching heading counts, valid KaTeX, six-objective coverage, unique choices and exactly five items per difficulty. These structural checks cannot certify natural-language fidelity. No propositional truth-table items exist, so the Boolean key checker is inapplicable.

## Source clarifications carried into the lessons

| PDF page | Issue or omitted condition | Treatment |
| --- | --- | --- |
| 29 | Perpendicular axes alone do not justify the raw-coordinate Euclidean distance formula. | L27 requires an orthonormal system with equal length units, and gives an unequal-scale counterexample. |
| 50 | A line equation needs a nonzero normal vector. | L28–L31 require `(a,b) ≠ (0,0)`; the all-zero case is handled separately. |
| 58 | An ascending row loop does not cover reverse endpoint order automatically. | L33 explicitly requires reordering or an adapted step and handles vertical segments separately. |
| 59 | Bresenham uses upward y and a restricted octant. The midpoint equality needs a rule. | L33 states integer Δx > 0 and 0 ≤ Δy ≤ Δx, upward axis, NE on ties, and no all-octant claim. |
| 66 | Squared-error sum may equal zero. | L34 says nonnegative, with zero exactly for a perfect observed fit. |
| 68 | Constant inputs make the slope formula undefined. | L35 explains nonidentifiability and rejects the quotient in code. |
| 81 | Pearson correlation requires variation in both variables; unrestricted collinearity includes vertical/horizontal cases where r is undefined. | L36 requires Sxx > 0 and Syy > 0, then states the perfect affine-fit equivalence. |
| 85–86 | Inside-range input alone does not establish prediction reliability. | L36 requires model/data validation for interpolation too. |
| 87 | Neural networks and gradient descent are previews. | Explain their place without testing untaught calculations. |

These are explicit qualifications of the source, not a claim that its standard algebraic concepts are wrong.

## Reproduction and release boundary

From the repository root, regenerate one lesson with `node exercises/drafts/chapter-02/authoring/L21.ts` (substitute the lesson ID). Run `node scripts/check-chapter-two-drafts.ts`. With SymPy installed, run `python3 exercises/drafts/chapter-02/authoring/verify.py`. The verification-results file records the actual scopes. SymPy is a content-review tool, not an application dependency.

The standard draft validator checks against active lesson paths; for these new IDs it runs after promotion has staged matching lesson files. This checkpoint uses the structural draft checker without inventing a registry exception. Promotion must copy the reviewed bank to a new immutable v1 archive, record actual bilingual/mathematical evidence and select it in the release registry. Existing archives and learner attempts remain unchanged.

Local tests and fixtures do not certify hosted sign-in, Supabase configuration or class readiness. Human mathematical/translation review and learner difficulty calibration remain useful follow-up review; none is fabricated here.

Author self-check with a different derivation; not independent peer review.
