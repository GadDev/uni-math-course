# Droites — revised 92-page source alignment

AI-assisted mathematical and bilingual author self-check, 23 October 2026. This is not independent peer review, learner testing or hosted acceptance. Implements issue #86. The earlier 87-page alignment remains a historical review, not evidence for this revision.

## Authoritative source

Bruno Teheux, *Mathématiques Générales — Droites: du papier à l’écran, puis au machine learning*, BINFO-FCE 2026–2027, University of Luxembourg. Supplied file: `Droites_01(6).pdf`, 92 pages, PDF creation/modification metadata 20 October 2026, SHA-256 `7a51f4b02822073ec9575aa709b63d6441724a989271aa2c3bf88b88302cceb9`. Page numbers count the title as page 1. The PDF and its artwork are excluded from Git.

All 92 pages were extracted and visually reviewed, including repeated presentation builds and the image-only page 58. Existing FR/EN lessons, the 87-page topic catalogue, glossary and exercise contracts were compared against the source. Original teaching illustrations are retained or redrawn; no source screenshot is distributed.

## Source-to-lesson mapping and decisions

Repeated slide builds are consolidated into one topic. The five source parts now contain 46 linked topics; stable L21–L36 lesson identities are preserved.

| Revised PDF pages | Lesson | Existing coverage and implemented decision |
| --- | --- | --- |
| 1–3 | Chapter overview | Title, five-part plan and first part divider; retain five parts, identify revised source date/page count. |
| 4–6 | L21 | Priorities, signs, algebraic rules; retained. Explicit grouping convention and nonzero restrictions already correct. |
| 7–12, 15–18 | L22 | Expansion, factorisation, three identities, mental arithmetic and area diagram retained. Fractions still precede identities in the source path. |
| 13–14 | L23 | Fraction operations, integer powers, nonnegative roots and absolute value retained; domains already stated. |
| 19–22 | L24 | Equivalent equations, lost zero solution and negative inequality multiplier retained. |
| 23–24 | L25 | Coffee/croissant modelling, elimination and verification retained. |
| 25–26 | L26 | Sigma properties, mean and zero sum of deviations retained, with original weighted-mean support. |
| 27 | Part divider | Represented by the second part heading; no duplicate lesson. |
| 28–30 | L27 | Coordinates, orthonormal distance and 3–4–5 example retained. |
| 31–35 | L28 | Cartesian solution sets, four curves and equivalent equations retained. |
| 36 | Part divider | Represented by the third part heading. |
| 37–39 | L29 | Point table, slope/intercept and parameter effects retained. |
| 40–49 | L30 | Two-point formula, Celsius/Fahrenheit, inverse conversion, −40 intersection and three solution cases retained. |
| 50 | L31 | Half-plane tests retained; remove old source attribution for triangle filling and label it a project supplement. |
| 51 | Part divider | Represented by the fourth part heading. |
| 52–55 | L32 | Correct grid source reference to p.52; p.53 context and p.54 centring consolidate at the p.54 topic; preserve scaling and inverse examples. |
| 56–57 | L33 | Gentle/steep raster sampling retained and clarified. |
| 58 | L33 context | Image-only video-game illustration acknowledged in prose; excluded from reproduction and no mathematical topic invented. |
| 59 | L33 | Correct steep-slope traversal reference; state vertical/reverse-direction limitations. |
| 60–63 | L33 | Expanded midpoint derivation, integer decision, incremental updates and executable pseudocode. Correct tie convention: E for d ≤ 0, NE for d > 0. Add exact tie example. |
| 64 | Part divider | Represented by the fifth part heading. |
| 65 | L36 introduction | Historical ten-row dataset and scatterplot retained, then source path leads to L34. |
| 66–70 | L34 | Model comparison, residuals, squared loss and centred sums; correct references and distinguish supplemental absolute-error comparison and Syy from source material. |
| 71 | L35 | Formula admitted without proof, as stated by the new source. Move retained algebraic proof to an optional disclosure. |
| 72–77 | L35 | Four-year calculation and prediction retained with corrected references; code retained as an optional project supplement. |
| 78 | L36 | Add explicit ML vocabulary table and a training/inference comprehension check. |
| 79–81 | L36 | Causality, Anscombe and outlier explanations/figures retained with corrected references; Pearson formula moved to optional support. |
| 82–83 | L36 | Replace obsolete source-attributed margarine extrapolation with supplied height data, fitted coefficients and a new original diagram. Explain intercept and observed range. |
| 84–91 | L35 | Add study-hours/score exercise, centred table, native solution disclosure, interpolation/extrapolation and a new original diagram. Path reaches it after the limitations, then returns to L36. |
| 92 | L36 | Future models/classification/gradient-descent preview retained, with corrected reference. |

## Mathematics and bilingual review

French and English retain the same formula sequence, domains, sections, source anchors and diagrams. English prose preserves the course’s French interval/decimal mathematical notation. For the height formula, English explicitly translates the French variable names retained inside the formula.

The new exact calculations are: height fit m=6.45, p=75.9, giving 269.4 cm at age 30 (about 270 cm in the source); study example means (3,12), Sxx=10, Sxy=23, m=2.3, p=5.1, predictions 13.15 and 28.1. All are checked using rational arithmetic independently of the rounded prose. Interpolation is not described as a reliability guarantee. Neither dataset establishes causality.

For Bresenham, the source’s p.60 wording does not separately state the equality case; p.61’s inclusive inequality and p.62–63’s explicit tests choose E. The revised reading follows those explicit tests. The old NE-on-tie variant is mathematically valid but does not reproduce this source. Execute the actual published function and compare against nearest-pixel rounding with ties downward for every endpoint in the stated octant with 1 ≤ u2 ≤ 40 (860 segments per language); include the (2,1) exact tie and invalid-domain rejection. This is bounded testing of the restricted octant, not a claim of an all-octant algorithm.

The preserved proof, Python, triangle and Pearson material is labelled supplemental. The L35/L36 practice notices explicitly explain that some questions use those supplements. Syy, completing-square and removed Python notation in the glossary are no longer falsely described as formulas present in the revised PDF. Their page references are labelled related concept pages. Stable glossary IDs are retained; d and the update arrow receive new bilingual entries.

No unreadable mathematical passages or unresolved arithmetic errors were found in the supplied revision. Source metadata is an identifier, not a verified publication date. Existing external historical dataset attributions are retained; this task does not independently re-verify those datasets.

## Exercise release and history

Readings L31–L36 advance to version 3. These lesson sourcePages are contractually tied to selected exercise provenance, so six new immutable v2 banks carry revised references. L31, L32, L34, L35 and L36 have unchanged questions, answers and feedback; a test compares their full item contents after excluding version/provenance. L33 changes only E11’s tie-rule stem/options/key/feedback to match the revised convention. The other 14 items retain their mathematical content, including E06’s explicitly stated upward rounding convention, which the reading distinguishes from Bresenham’s tie rule.

All v1 archives remain byte-identical. Exercise IDs, lesson URLs, existing attempts and recorded grades remain intact. Historical E11 still resolves to the old version and its NE answer; selecting v2 does not regrade history or create fresh independent mastery evidence for an already-seen ID. Earlier full-bank self-check evidence remains in [CHAPTER_02_REVIEW.md](CHAPTER_02_REVIEW.md); this review covers the actual item delta and revised reading/provenance, without claiming a new independent review of all 240 keys.

The registry renews both-language fingerprints and French translation source fingerprints for L31–L36 only after this paired author check. L21–L30 content, all earlier chapter content and their release records remain unchanged.

## Validation

`pnpm check` passed on the final content, including 280 tests, content/release/docs validation, type checking (zero errors/warnings), formatting and production build. The 52 named exact arithmetic/symbolic checks passed, including actual published Python execution and 860 restricted-octant raster segments per language. Targeted reading and Chapter 2 practice commands exited successfully using local Chromium 153. The full local browser run completed with 207 passed and four failures caused by obsolete glossary assertions (143 instead of 145 entries, and old sigma page references). After correcting those assertions, all 13 glossary browser tests passed on rerun. Together these runs verify all 211 scenarios; a second completely green full-suite run is not claimed. GitHub CI remains pending at handoff.

Original diagrams and public reading views were visually inspected at 320 and 1280 px with JavaScript disabled. This caught numeric table cells splitting across lines; narrow-screen cells now preserve numbers and let the table scroll. The new exercise reveals its centred working table inside the solution disclosure, after presenting the raw data. No page overflow or KaTeX errors were observed in the inspected views.

Reproduction:

```sh
python3 scripts/content/verify-droites-reading.py
python3 scripts/content/illustrate-droites.py --only height-extrapolation study-score
pnpm check
pnpm test:e2e
node scripts/check-immutable-exercises.ts
```

Python SymPy/matplotlib/numpy are authoring tools, not added application dependencies. Required GitHub CI remains the final hosted check; local browser fixtures do not certify production authentication or database deployment.
