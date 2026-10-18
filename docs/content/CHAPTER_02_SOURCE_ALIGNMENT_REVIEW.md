# Chapter 2 — PDF structure and beginner reading revision

Review scope: L21–L36 reading version 2, French and English, the PDF topic path and original teaching SVGs. AI-assisted mathematical and bilingual author self-check; not independent peer review. No classroom calibration or hosted Supabase acceptance is claimed.

## Requested behaviour

The first reading implementation compressed the source too heavily and omitted its instructional drawings. The owner requested the PDF's structure, retained source examples with expanded explanations, additional worked examples and more diagrams. This revision makes the five source parts and 48 topic passages the primary ordered reading path. Repeated slide builds remain consolidated.

Source: Bruno Teheux, *Mathématiques Générales — Droites: du papier à l'écran, puis au machine learning*, supplied 87-page PDF, title counted as page 1. Uploaded copies `(3)` and `(4)` have SHA-256 `45b6e93507c9ad20a844b6ba010c94c36e2ec4f2a1d332374628c86c428c912e`. Source files and slide artwork are excluded from Git. Explanations, captions, diagrams and supplemental examples are original project work; standard equations and historical numeric observations retain attribution.

## Structure and teaching coverage

The [topic catalogue](../../src/lib/droites-source.ts) is ordered by PDF page. Every topic has the same `pdf-N` anchor in both languages and a next-topic link that follows the source, including crossings between existing lessons. The path is independent of exercise identity: fractions precede identities; rasterisation precedes triangle filling; the introductory dataset precedes regression; the ML vocabulary precedes correlation.

| Lesson | PDF pages / revised teaching |
| --- | --- |
| L21 | 4–6: priority example, grouping convention, opposite/reciprocal and sign examples. |
| L22 | 7–12, 15–18: source expansion/factorisation calculations, double distributivity, three named identities, area model, source mental-arithmetic and binomial examples plus additional examples. |
| L23 | 13–14: source fraction sum, fraction strips, explicit product-power law, numeric rule table and roots versus square-equation solutions. |
| L24 | 19–22: source equation, lost-zero trap, strict inequality and graduated solution ray, plus an included-boundary example. |
| L25 | 23–24: coffee/croissant modelling, elimination and verification, retaining other substitution and price examples. |
| L26 | 25–26: sigma components and subscript reading, all three sum rules, expanded examples, mean/deviation proof, weighted groups and correction of the necessity claim about group sizes. |
| L27 | 28–30: the four source coordinates, labelled axes, source 3–4–5 distance example and original additional examples. |
| L28 | 31–35: source on/off-curve tests, all four curve plots, equivalent source line equations, retained domain/counterexample support. |
| L29 | 37–39: source point table, slope triangle, mobile-data tariff, changing m/p plots and retained additional examples. |
| L30 | 40–49: Celsius/Fahrenheit forward/inverse conversion, −40 intersection, three source intersection situations and retained further examples. |
| L31 | 50–51, 60: source half-plane test points, shaded/hatched region, original fully calculated triangle example linked after rasterisation. |
| L32 | 53–55: indexed screen grid, source 800×600 centring and 50-pixels/unit transformation, additional inverse examples. |
| L33 | 56–59: source gentle/steep slopes, pixel comparisons, named octant and midpoint explanation, retained integer recurrence with a new step table. |
| L34 | 63–67: source dataset model comparison, annotated vertical residuals, signed/absolute/squared criteria, definition and expanded centred-sum table. |
| L35 | 68–79: formula, source completing-square calculation and parabola, both source proof stages, four-year source calculation table, fitted plot, source-data Python call plus retained three-point example. |
| L36 | 62, 80–87: complete historical table and scatterplot, ML vocabulary, correlation, four named limitations with Anscombe/outlier/extrapolation figures, and source-linked later-model previews. |

Original extra worked examples are retained. Additional support is identified as extra rather than attributed to the PDF. The outlier illustration uses explicitly original supplemental data because the source does not tabulate its fictitious points. Anscombe plots use the classical numeric dataset checked against [R's dataset source](https://svn.r-project.org/R/trunk/src/library/datasets/data/anscombe.R), with its [official documentation](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/anscombe.html) linked in the reading. Summaries are described as approximate for the published decimal values.

## Mathematical and bilingual self-check

The important source qualifications remain: orthonormal distance; nonzero line coefficients; explicit screen-axis direction; restricted raster octant and tie rule; nonnegative loss; nonconstant inputs for an identifiable slope; positive variation in both variables for Pearson correlation; no reliability guarantee from interpolation alone.

The grouped-mean wording now states the general weighted formula rather than claiming equal group sizes are necessary in every particular case. The positive-integer product-power example explicitly allows zero bases; inverse/negative-power rules retain their nonzero restrictions. The square-area drawing requires positive side lengths while the associated algebraic identity applies to all real a,b.

[Supplemental exact checks](../../scripts/content/verify-droites-reading.py) cover 46 named arithmetic/symbolic results, including source calculations, fraction arithmetic, lost-zero example, conversions/intersections, half-plane signs, screen transformations, raster samples, completing-square identities, the four-year regression table/parameters, outlier coefficients, extrapolation and both published Python examples. The ten-point slope rounds to 0.2014 at four decimals; the PDF's prefix 0.2013… is not used as a four-decimal rounded output. The three-symbol loss identity is a supplemental finite-size symbolic check; the arbitrary-n argument is reviewed as an algebraic derivation in prose, not an automated general proof.

Paired authoring and review preserve domains, signs, inclusive/exclusive boundaries, units and the distinction between observed/predicted values. Formula-sequence, heading structure, topic destinations and diagram parity are checked mechanically as additional evidence, not a natural-language translation certificate. The authoring comparison caught and repaired notation-sequence differences without changing mathematical meaning.

## Visual and accessibility checks

There are 38 instructional figure compositions, with 76 French/English SVG assets. [The generator](../../scripts/content/illustrate-droites.py) plots exact mathematical curves or the explicitly specified numeric data; no generated raster approximation or copied slide art is used. Captions and image descriptions accompany every figure. Signs, marker shapes, hatching and line styles supplement colour. Distances/circles use equal mathematical units; statistical plots use labelled independent axes. Figures are static and remain usable without JavaScript; compact figures stack rather than placing multiple small plots in one image.

The PDF path is visible on the chapter overview and available in lesson navigation. Same-topic language switching retains the stable source anchor. Wide calculation tables can scroll within their own region on small screens. Reading-time changes are author estimates reflecting the expanded prose and activities, not measured student timings.

Rendered review found an existing renderer/style mismatch: Markdown emitted KaTeX 0.16 classes while the application imported 0.19 CSS. The workspace override and lockfile now resolve the existing direct, Markdown and remark-math dependencies to the same pinned 0.19.0. This adds no application dependency. A browser regression checks that a mathematical base is actually styled as an unbreakable inline block, in addition to checking MathML, successful rendering and page overflow. Rendered 320/375 px examples were inspected after the fix. When checking a pre-existing local checkout after this dependency change, regenerate Astro's rendered-content cache rather than judging stale cached HTML; clean CI builds render from the locked dependency graph.

## Release and history boundary

Only reading files advance to version 2. The registry still selects exercise bank version 1. All 240 archived exercise items and their original draft banks are unchanged; original reading draft files remain the historical authoring checkpoint and are no longer asserted to equal later published prose. Their bank self-check evidence is retained in [the original release review](CHAPTER_02_REVIEW.md).

This evidence renews the mathematical/bilingual author self-check for the changed readings and their French source fingerprints. It does not regrade learner attempts, provide fresh exercise mastery evidence, claim a second review of every unchanged answer key or certify independent review. Existing lesson URLs, exercise IDs, account history and database contracts remain intact.

## Validation

Completed on the final implementation: `pnpm check` passed, including 269 tests, type checking, formatting, content/release/documentation validation and the production build. The full local browser suite passed 179 tests after the renderer correction, including public source-order navigation, FR/EN source-anchor switching, all paired readings at 320/1280 px, figure loading, no-JavaScript reading and existing practice/history/account isolation scenarios. Local browser execution used Chromium 153 via the existing executable override; no browser package was added to the app. The 46 named exact reading checks and both published Python examples passed. The unchanged original draft checker also passed all 16 banks; its original verifier rerun passed 129 exact candidate calculations and retained 111 recorded arguments outside automatic proof verification.

All 38 compositions were inspected on rendered overview sheets, and selected public reading views were visually inspected at 320/375/1280 px. The visual review corrected a mistakenly duplicated parallel-lines plot, improved label placement and caught the KaTeX mismatch that the previous overflow-only checks had missed. Reproduction commands:

```sh
python scripts/content/illustrate-droites.py
python scripts/content/verify-droites-reading.py
pnpm check
pnpm test:e2e
```

The two Python scripts require authoring-only matplotlib/numpy and SymPy respectively; they do not add application dependencies or run as part of the normal production build. The immutable-bank gate must be checked against the actual PR base. Mathematical and bilingual author self-check is distinct from independent review and beginner usability testing.

Author self-check with a different derivation; not independent peer review.
