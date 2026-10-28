# L28–L34: understanding, exploration and paper study

Date: 2026-10-28. Author self-check performed by the implementing assistant; no independent mathematical review or hosted classroom acceptance is asserted.

## Observed starting point and priorities

The seven published French routes were retrieved over HTTP and their lesson articles compared with the corresponding main-branch sources at 7ffe5758eb8a78fbd142ccd030182a0ba59346fb. Each had worked examples and original local SVG figures; none had an interactive island in its article. The web search reader could not retrieve these routes; direct HTTP retrieval succeeded. Source PDFs were not available and were not re-reviewed; existing source-page attribution is retained. New derivations, activities and paper exercises are original project additions.

| Lesson / passage | Beginner obstacle | Implemented response |
| --- | --- | --- |
| L28, “Une équation est un filtre”, “Exemple guidé : équivalence” | Repeated introductory substitutions; the method for comparing solution sets is implicit. | Replace the duplicate paragraph, derive the circle from Pythagoras, explain reversible transformations, test points against six equations including added branches. |
| L29, “Pente et ordonnée à l’origine : lire m et p” | Delta notation and the constant ratio are stated quickly. | Define signed differences and indices, subtract two line equations, connect a two-unit step to adjustable slope and intercept. |
| L30, “Deux points distincts”, “Une, aucune ou une infinité” | Formulas arrive without derivation; zero denominators can look like a technical exception. | Derive slope and intercept; put repeated and vertical points first; derive elimination and manipulate all intersection cases, including a vertical and an off-window intersection. |
| L31, “Un test de même côté” | The product rule compresses three sign cases. | Explain why affine signs describe sides, distinguish boundary inclusion, test the triangle’s three constraints together. |
| L32, “Exemple guidé : transformer une droite” | A substitution is left to the reader; inverse versus rounded pixels needs reinforcement. | Derive forward/inverse transforms and screen slope; expand every substitution; display continuous screen coordinates and visibility. |
| L33, “Bresenham : mettre à jour plutôt que recalculer” | Increments are stated without deriving their difference; the two rounding conventions are easy to mix up. | Derive both increments, compare traversal axes, trace the current pixel/decision/next move, keep E for a tie and reject unsupported octants. |
| L34, “Les moindres carrés et les trois sommes centrées” | Means and sigma notation need an introduction; a zero signed sum can be mistaken for a perfect fit. | Define notation, build an exact centred table, manipulate a line with residual segments and a numerical table, demonstrate zero sum with positive loss. |

## Implementation and interaction specifications

Both lesson languages use the existing MDX content loader and React integration; each activity is an SSR React island with `client:visible`. This gives shared state for graph, controls, calculations and feedback without hydrating the written lesson. No new dependency, service or paid infrastructure is added. Original figures/examples, stable source-page markers and PDF-path links remain. The selected immutable exercise banks, grading contracts and practice route access are unchanged. Public explorations follow the existing public lesson-island pattern: they do not save responses or produce mastery evidence.

| Activity | Manipulation | Response | Prediction / challenge |
| --- | --- | --- | --- |
| L28 membership | Equation, integer x/y | Curve, additional branches, both evaluated sides, membership | Does squaring preserve every solution? Find (1; −1) on the added branch. |
| L29 slope | m and p | Line, intercept, two-unit step, signed changes | Does p change slope? Build m = −1/2, p = 2. |
| L30 points | Both coordinates of A/B | Line equation, substitutions, repeated/vertical classification | What happens when horizontal coordinates match? Build the vertical x = 1. |
| L30 intersection | Second line type, slope/intercept or fixed horizontal coordinate | Two strokes, eliminated equation, unique/none/infinite result, off-window notice | Can an intersection disappear from view without becoming parallel? Obtain distinct parallels. |
| L31 region | Open/closed half-plane or closed triangle, point coordinates | Filled region, dashed/solid boundary, every constraint value, membership | Does the boundary count? Test the triangle vertex (4; 0). |
| L32 screen | Point, independent positive scales | Screen point, transformed coordinates, continuous inverse, bounds notice | Does increasing y increase v? Obtain screen (300; 100). |
| L33 sampling | Endpoint and traversal axis | Ideal segment, selected pixels, complete coordinate list | Compare four column samples with nine row samples for (3; 8). |
| L33 Bresenham | Integer endpoint, step, E/NE prediction | Trace prefix, current d, next move and update; unsupported-octant notice | At d = 0, choose E for (2; 1). |
| L34 residuals | m/p, exact fractional preset | Model, observed disks, prediction squares, vertical residuals, table, sum/S/MSE | Can Σe be zero with S positive? Use m = 1/2, p = 7/6. |

Each activity has a reset, labelled slider and number inputs, live results, validation messages, a reflection question and explained challenge feedback. All visuals have SVG titles/descriptions and textual calculations; distinct stroke/point shapes carry meaning without relying on colour. Domain restrictions are separate from UI window bounds. Numerical output states its rounding precision. The browser input retains the last valid graph state while reporting an invalid entry.

## Mathematical and bilingual self-check

French/English lesson frontmatter versions are advanced together, while exercise-bank versions remain unchanged. Both versions have aligned heading levels/order, matching mathematical notation, matched activities and corresponding explanations. Release fingerprints and the translation source fingerprint are renewed for the full paired MDX sources with this evidence document.

Checks include direct substitution for equations and two-point lines; all intersection cases; boundary tests; screen transform inversion before rounding; independent integer nearest-pixel comparison with ties down for every first-octant endpoint through 12; separate ties-up sampling; and exact rational residual/centred-sum examples. For the fixed dataset (0,1),(1,2),(2,2), means are 1 and 5/3, Sxx = 2, Sxy = 1, Syy = 2/3. The fractional preset produces residuals −1/6, 1/3, −1/6, S = 1/6 and MSE = 1/18. A small loss does not establish causation.

## Paper and JavaScript-free reading

Each lesson has an original paper task, an explained native disclosure solution and a revision sheet with definitions, conditions, method and traps. Without JavaScript, SSR provides the fixed graph/calculations and a clear static-example notice. Print CSS replaces live activities with fixed worked figures/results, reveals disclosure content, hides navigation/controls and uses monochrome-friendly strokes. These are printable pages, not a separate generated PDF product.

## Initial implementation validation (before the expansion)

- `pnpm check`: passed with Node 24.19.0 and pnpm 11.25.0 after rebasing onto main 83e5c61 (including L38 and Playwright 1.64.1). Documentation/release/content gates, Astro type checking, formatting, all 344 tests and the Vercel production build passed.
- Final complete `pnpm test:e2e` on 83e5c61: **362 passed, 3 failed out of 365**. All 26 new geometry checks passed, including both languages, domain/boundary cases, challenge/reset, input validation, keyboard focus/arrow operation, 320 px mobile layout, touch, dark theme, paired section anchors, printing and JavaScript-free reading. Existing Chapter 2 tests now verify the deliberate activity count and `client:visible`, while retaining zero islands on the other Chapter 2 lessons.
- The three remaining failures are the shared French header at a 1051 px viewport: chapter-navigation, reading and theme. Each reports a 1052 px document width. All three were reproduced on unchanged main 7ffe575 in a separate checkout with the same Chromium executable. The later 8c93851 and 83e5c61 base changes update Playwright and L38 without changing header CSS; no header assertion was weakened or unrelated header change included. The full browser gate is therefore not claimed green.
- Browser verification used temporary Chromium 153.0.8010.0 through the existing executable override because the standard Chromium 156 download produced a truncated archive. No application dependency or lockfile change is introduced by this PR.
- `scripts/content/verify-droites-reading.py`: 52 named exact arithmetic/symbolic checks passed, including execution of the published Python and 860 raster segments per language. The new calculation tests additionally compare all educational first-octant endpoints through 12 with an independent integer rounding oracle.
- `node scripts/check-immutable-exercises.ts origin/main` and `git diff --check`: passed.
- Visual inspection covered desktop, mobile, dark mode and all seven rendered A4 lessons. Print inspection prompted smaller static figures, kept-together activities/solutions and monochrome code. The final French print captures have 6, 6, 7, 5, 6, 9 and 6 pages respectively for L28–L34, with solutions and revision sheets present. Temporary PDFs are QA intermediates, not an added publication product. [Screen captures](../design/implementation/l28-l34/README.md) accompany the PR.
- Normalized published article text matched the unchanged baseline render for all seven French lessons before editing. Mathematical/translation checks remain an implementing-author self-check. Independent peer review, physical-device/screen-reader testing and hosted acceptance remain unverified.

## Hosted preview status

The PR’s Vercel status reports failure with a `build-rate-limit` URL. The local production build passed; screen captures are included for review. Hosting limits are separate from mathematical verification and the local browser results.

## User-requested expansion: thirteen activities

The follow-up adds four distinct islands using the same `client:visible`, SSR and print conventions, with original bilingual instructions:

| Lesson | Added island | Controls, response and learning check |
| --- | --- | --- |
| L28 | Circle builder | Centre, nonnegative radius and query point update the equation, radius segment and squared-distance test. Includes radius zero and interior-of-disk versus on-circle cases. |
| L31 | Triangle builder | Select and edit any vertex, swap B/C and test P. Three edge equations compare the test point with the opposite vertex. Aligned/repeated vertices stop filling and interior classification. |
| L32 | Pixel rounding | Fractional point coordinates and independent positive scales produce continuous coordinates, nearest integer indices and the inverse representative. Ties go toward the greater integer; error bounds are per mathematical coordinate. A nearby second point demonstrates many-to-one mapping; bounds are checked after rounding. |
| L34 | Centering | Edit any of three observations; switch raw/centred views and inspect means, deviations, squares and products. Presets demonstrate negative Sxy and zero horizontal spread without importing the next lesson’s fitting formula. |

The existing slope activity now accepts positive, negative and zero horizontal increments. Zero has an undefined quotient, while the line’s slope parameter still exists. The intersection activity reveals equating/substitution, elimination and conclusion in three steps, resetting when inputs change. Bresenham has a labelled local E/NE/M zoom, hidden future coordinates/decision until prediction, explanatory feedback for each current step and a gated next-pixel action. Fixed/print views reveal the complete worked state.

Shared accessible inputs and SVG axes were extracted into `GeometryLabPrimitives.tsx`. The four additions live in a separate component; no dependency was added. The paired reading versions and translation fingerprints are advanced; immutable graded banks remain unchanged.

Additional mathematical self-checks compare triangle membership with independent barycentric coordinates in both vertex orientations, verify circle/disk/zero-radius cases, check nearest-integer ties and inverse error bounds, and compare centred cross sums with a pairwise covariance identity.
### Expansion validation

- `pnpm check` passed on the branch based on main 576165e, with pinned Node 24.19.0 and pnpm 11.25.0: documentation/release/content gates, Astro types, formatting, **355 tests**, and Vercel production build.
- Targeted geometry/Chapter 2 browser run: **54/54 passed**. Final full browser run: **401 passed, 3 failed out of 404**. All **40 geometry activity checks** passed, including the four new islands, improved slope/intersection/Bresenham tools, invalid input, keyboard focus and table scrolling, dark/touch contexts, 320/375/1440 px layouts, print and JavaScript-free reading.
- The three failures are the same reproduced shared French header overflow at 1051 px (chapter navigation, public reading and theme). No failure was hidden or assertion weakened. The full browser gate remains red with temporary Chromium 153.
- All 15 focused mathematical/source checks passed, including the four new independent comparisons described above. The existing symbolic verifier also passed 52 named checks and 860 published raster segments in each language. The immutable-bank check and `git diff --check` passed.
- New/updated screenshots were inspected for all seven affected activities. All seven latest A4 captures were rendered and inspected; their page counts are **7, 6, 7, 6, 7, 9, 7** for L28–L34. Tables preserve complete headings with keyboard-accessible horizontal scrolling on screen and full-width layout in print. The new activities, printed results, native solutions and revision sheets remain visible; live controls and navigation are hidden in print.
- This is an implementing-author mathematical and bilingual self-check. No independent review, physical screen-reader/device evaluation or hosted classroom acceptance is asserted.
