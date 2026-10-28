# L41 — logarithms, derivatives and tangents

Review date: 2026-10-28. Scope: published French L41, prerequisites L38–L40, and repository source at starting main 13bcb2a. Reading version 2 replaces the paired Markdown lessons with MDX. The exercise bank remains the immutable v1 bank. This is an AI-assisted mathematical and translation author self-check, not independent peer review, screen-reader acceptance or hosted class acceptance. The original PDF was unavailable for a new source comparison; existing pages 16–17 remain provenance. All added explanations and SVGs are original project work.

## Assessment and priorities

L41 is **the natural logarithm**, following the derivative introduction in L38, calculation rules in L39 and exponential in L40. Keep this place in the course: the derivative refresher supports logarithms rather than replacing the lesson with a general differentiation chapter.

| Priority / passage | Obstacle for a first-time reader | Implemented response |
| --- | --- | --- |
| P1: “Le PDF donne une règle remarquablement simple.” | Refers away from the lesson instead of explaining the derivative; neither D nor the local slope is unpacked. | Introduce height versus slope, explain x/a/h/f(a)/f′(a)/f′/Df, and connect secants to the finite two-sided limit. Recover 1/x using the inverse differentiation theorem, explicitly admitted, then the chain rule. |
| P1: “la chaîne ajoute la dérivée de l’intérieur” | “Adds” can suggest addition rather than multiplication. The example jumps directly to 2/(2x+1). | State multiplication by the inner derivative. Work through domain, inner function, inner derivative, substitution and check separately. |
| P1: “Le graphe du PDF, page 17…” | No graph is embedded in L41; students cannot connect points, slope and asymptote. | Two original server-rendered Cartesian SVGs beside the explanations, with fixed axes, ticks, labeled A/B and horizontal/vertical guides. Explain window clipping and unequal axis scales. |
| P1: No tangent example. | No bridge from the numerical derivative to the equation of a line. | Highlight the formula, derive its point/slope interpretation, work ln at a=1, and verify point and coefficient. |
| P2: “La formule pour une somme… est différente” | Suggests a missing alternative sum rule. | Give the explicit counterexample ln(1+1)>0 versus ln(1)+ln(1)=0. State positivity conditions on product/quotient/power rules. |
| P2: Only the exponential is listed as prerequisite. | L38's derivative concept and L39's chain rule are required for the existing derivative example. | Add L38 to frontmatter and linked prerequisite checks. Preserve stable objective IDs and source pages. |
| P2: Only ln(x)=2 is worked. | Readers can recognise a solution without reproducing a method. | Keep the example and add four progressive paper exercises, a separate hint disclosure and worked solutions. |
| P2: No revision sheet or print support. | Interactive-only material or hidden answers would be lost on paper. | A compact highlighted revision sheet starts on a new printed page; print uses fixed diagrams and exposes disclosure content. |

## Concrete French rewrites

The complete implementation is [fr.mdx](../../content/lessons/L41/fr.mdx).

- “Le logarithme répond à une question d’exposant. Sa dérivée répond à une question de pente.”
- “La hauteur ln(a) peut être négative, mais la pente 1/a est toujours positive.”
- “x reste variable sur la droite ; a, f(a) et f′(a) sont fixés.”
- “On ne remplace jamais h par zéro dans le quotient.”

Definitions, formulas, methods, pitfalls and essential points use existing card surfaces and chapter-blue accents. French remains the source; English is aligned section by section, including identical mathematics and locale-aware component copy.

## Interactions and visual specifications

| Activity / objective | Manipulation | Synchronized response | Prediction / takeaway | Initial and reset state |
| --- | --- | --- | --- | --- |
| Secant to tangent: distinguish average from local slope for ln. | Native a and signed h sliders, numeric inputs and ±0.1/±0.001 buttons. a ranges 0.25–4; 0.001 ≤ abs(h) ≤ 2; a+h must be positive. | A/B coordinates, secant, tangent, horizontal/vertical change guides, quotient and 1/a. Invalid input preserves the last valid graph and gives an associated alert. Moving a adjusts h to −a/2 if necessary to preserve the domain. | “Quand h se rapproche de zéro, vers quelle pente va la sécante ?” Try both signs. The experiment illustrates, but does not prove, a limit. | a=1, h=1, ln. Reset restores both values. |
| Construct a tangent: connect derivative sign, point and line. | Select ln(x), −ln(x) or (ln(x))²; move a; choose rise/fall/horizontal; verify. | Curve and A update immediately. Verification reveals the tangent, analytic derivative, rounded equation, direction and point check. A change to function, a or prediction hides the answer again. | Predict the direction before revealing. ln always rises, −ln always falls, and (ln(x))² has negative/zero/positive slopes across a=1. | ln at a=1; no prediction. Reset restores that state. |

The transforms use previously taught constant and chain rules, with derivatives explicitly explained beside the lab. Both have the original domain x>0; a zero derivative is not claimed to guarantee an extremum in general. A tangent may meet the curve elsewhere; its definition is local.

On desktop, the graph and calculated results stay beside the controls in a sticky column; mobile stacks them with larger axis labels. SVG line patterns and disk/square markers convey meaning without color. Text values and explanations provide a nonvisual alternative. Native controls provide keyboard behavior, focus outlines and touch targets of at least 44px. No motion or autoplay is used, and the graph does not capture touch scrolling. Controls are hidden until hydration; without JavaScript, the initial SVGs, numeric results, methods, disclosures and revision material remain readable.

## Implementation decision

Astro already configures React and MDX; L37 provides a precedent for MDX content with client:visible React islands. React keeps each lab's coordinates, graphs, validation, predictions and calculated text in one state. Reuse that stack and SVG with **no added dependencies**. Only L41 imports these islands. Prose and KaTeX remain server rendered in the content collection. The unrelated chapter overview's existing Astro secant component remains unchanged.

Pure calculations live in [logarithm-explorer.ts](../../src/lib/logarithm-explorer.ts). Secants use log1p(h/a)/h to reduce cancellation near zero. There is no arbitrary expression parser, learner persistence, authentication dependency or exercise-bank import. The page route and bilingual heading mapping are unchanged.

## Mathematical and translation self-check

- ln is the inverse of exp on positive inputs; inverse identities and reference values 0, 1 and −2 are correct. Product/quotient rules require both positive factors; the real-power rule requires a positive base.
- The derivative definition requires an open interval about a and a common finite limit for nonzero positive and negative increments. For ln, both a and a+h are positive.
- Inverse differentiability is stated as an admitted theorem before differentiating exp(ln x)=x; the calculation declares that prerequisite.
- D ln x=1/x; D ln(2x+1)=2/(2x+1) for x>−1/2; D ln(3x−2)=3/(3x−2) for x>2/3.
- Tangents: ln at 1 gives y=x−1; ln at e gives y=x/e; ln(2x+1) at 0 gives y=2x. Each line passes through the chosen point with the required slope.
- Transform derivatives are −1/x and 2 ln(x)/x; the latter vanishes at 1 and changes sign there. A zero derivative is not generalized to all extrema.
- ln(x²) is defined on x≠0 and has derivative 2/x there; replacing it by 2 ln x would incorrectly remove negative inputs.
- French and English contain the same mathematical expressions in the same order and 13 aligned level-two sections. Course decimal-comma mathematical notation is preserved in both languages.
- No published exercise is edited. The existing full-bank self-check remains in [CHAPTER_03_REVIEW.md](CHAPTER_03_REVIEW.md). This document renews reading/translation evidence and fingerprints for L41.

## Validation

- Runtime: Node 24.19.0 and pnpm 11.25.0, with the committed lockfile. The branch was rebased onto main 416c57c (application release 0.15.0).
- pnpm check: passed, including documentation/release/content checks, type checking (zero errors/warnings, existing hints), formatting, 310 tests, and the Vercel production build.
- L41 focused browser suite: 9/9 passed in French/English. Covers two-sided secant convergence, exact coordinates, keyboard range controls and focus, numeric validation, all three slope signs, prediction feedback, mobile widths 320/375/768/1440, touch in dark mode, no-JavaScript reading/disclosures, print fallbacks and exact section language-switch anchors. The final responsive layout is checked again after the full run.
- Full browser suite: 289 passed, 3 failed out of 292. All remaining failures are the existing French header's one-pixel overflow at 1051px: chapter-navigation/header, reading/header geometry and theme/header geometry. Running precisely those three tests on unchanged main 13bcb2a reproduces all three failures. The subsequent main release changes only the app version, manifest and changelog. This lesson PR does not claim a green full suite.
- Browser environment: the standard Chromium 156 download returned a truncated archive. Browser checks use the existing PLAYWRIGHT_CHROMIUM_EXECUTABLE option with temporary Chromium 153.0.8010.0; no dependency or browser configuration was added to the repository.
- Visual checks: desktop and 320px French labs inspected in light/dark themes; both islands hydrate without page errors. Fixed axes, patterns, markers, values and controls remain legible. The final desktop arrangement keeps the graph beside the inputs.
- Print check: generated A4 browser output, checked exposed corrections and two fixed diagrams, and inspected the revision page. The full lesson is 10 pages; the essential revision sheet occupies one page, with readable grayscale notation and no clipping.
- Mathematical unit checks independently compare analytic slopes against central differences, check secant convergence from both sides (including tiny increments), reject invalid domains, and verify tangent point/slope properties.

No physical-device, manual screen-reader, independent mathematical or hosted-preview acceptance is claimed. The source PDF was not newly inspected. These limits remain separate from local automated checks.
