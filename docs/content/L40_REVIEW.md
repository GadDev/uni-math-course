# L40 — exponential values, derivatives and tangents

Review date: 2026-10-28. Scope: the published French L40 page (downloaded successfully as HTML) and the repository's French/English lesson sources. This is an AI-assisted mathematical and translation author self-check, not independent peer review or classroom acceptance. The professor's original PDF was not available for a fresh comparison; its existing page references are retained as provenance, and the new figures and activities are original project work.

## Assessment and priorities

L40 is **the exponential function**, not the first differentiation lesson. L38 introduces secants and derivative limits; L39 covers differentiation rules. The original L40 identities and tangent example are mathematically correct, but the short text assumes fluency in derivatives, notation and composition. Keep the exponential scope and existing examples; supply a compact conceptual bridge rather than replace L38/L39.

1. **P1: define the quantities.** Introduce average change, derivative at a point, derivative function and the course's D notation before the differential equation.
2. **P1: connect algebra to a visible graph.** Put a labelled secant and tangent beside the difference quotient, with both signs of h and an explicit undefined state at zero.
3. **P1: work the calculations.** Identify the inner function, show its derivative, and derive the tangent equation through height and slope.
4. **P2: distinguish height from slope.** Compare eˣ with e⁻ˣ and x², then link f to f′ at the same input.
5. **P2: support recall and accessible practice.** Use selective definition/method/essential callouts, prediction questions, native solution disclosures, keyboard controls and static figures.

## Passage-specific changes

| Original passage | Likely difficulty | Implemented change |
| --- | --- | --- |
| “Elle a une propriété remarquable : sa dérivée est elle-même” immediately followed by D(eˣ)=eˣ. | The reader must already know what D, derivative and “itself” mean. | Begin with growth intuition; add the difference quotient, finite two-sided limit, domain conditions and f/f′/f′(a) distinctions before the exponential definition. |
| “Df=f, f(0)=1” | Function equality and a value at one point are different kinds of statement; “equation différentielle” is not explained. | Explain the differential equation in words and why Ceˣ also satisfies the derivative equation while the value at zero selects C=1. State existence/uniqueness is used without proof. |
| “Sur le graphique du PDF, page 15…” / “Sa pente est aussi sa hauteur.” | No actual graph is supplied; positive values can be confused with positive derivative. | Replace reliance on the unseen figure with original graphs. Specify “at the same a”, and use e⁻ˣ as a positive but decreasing counterexample. |
| “D(e^{g(x)})=g′(x)e^{g(x)}” then the answer 2e^{2x+1}. | The composition and source of the factor 2 are compressed. | Work g(x)=2x+1, g′(x)=2 and substitution as three steps; add the negative-exponent comparison. |
| “Un exemple de tangente”: height 1, slope 1, y=1+x. | No general tangent formula or substitution connects these lines. | Derive point–slope form, explain fixed a versus variable x, substitute step by step and verify the point. Compare e^0.1 with 1.1 to show local approximation. |
| “Ne remplacez pas une somme…” | The warning is abstract. | Keep the product identities; add e⁰+e⁰=2 versus e^(0+0)=1. Connect the product identity with the secant quotient without presenting circular reasoning as an existence proof. |
| “Bilan et erreurs à éviter” | The essential rules and next calculation steps are mixed together. | Add a four-step method, four ungraded reading questions with native details solutions, and a short essentials block. |

## Interactive specifications and diagrams

All activities are adjacent to the relevant passage, begin with a prediction, have an explicit goal, and initially use f(x)=eˣ, a=0. Each island is independent; the linked activity synchronises its own two graphs. Native ranges deliberately replace dragging: they are discoverable, work with arrows/Home/End and touch, and do not intercept page scrolling. Reset restores the function, a and h; it also hides the tangent answer in the prediction activity.

| Activity / location | Objective and initial state | Manipulation | Immediate updates | Prediction / feedback |
| --- | --- | --- | --- | --- |
| Secant, after the derivative reminder | Average rate approaches instantaneous slope; h=1. | a from −1 to 1 in steps of 0.1; h from −1 to 1 in steps of 0.01; presets ±0.1, ±0.01 and 0. | A, B, their secant, tangent, horizontal/vertical change triangle, point coordinates, Δx, Δy, quotient and tangent equation. | Will ±0.1 give slopes on the same side of 1? Feedback explains opposite-side bounds and convergence toward eᵃ. At h=0 the secant disappears and the quotient is labelled undefined; the derivative remains defined. |
| Tangent, after the worked equation | Height, slope and point–slope equation; tangent answer initially hidden. | a; selection of eˣ, e⁻ˣ or x²; reveal/hide answer. | Curve, point A; after reveal, tangent, derivative, rounded equation and sign explanation update together. | Is the slope at zero 0 or 1 for eˣ? Compare positive, negative and zero slopes. Feedback separates zero slope at one point from constancy on an interval. |
| Linked graphs, after the f/f′ explanation | Derivative value is slope on f but ordinate on f′. | a; the same three function choices; native disclosure for the second graph. | Tangent and A on f; M=(a,f′(a)) on f′, using identical axis scales. | Do both graphs coincide? For eˣ yes; for the comparisons generally no. Sign feedback connects to monotonicity on intervals. |

Figures use labelled x/y axes and numbered ticks, a thick solid function curve, dashed tangent, thin secant, circular A and square B. The difference triangle labels Δx and Δy when there is enough room; numerical text stays available at small h. Coordinate guides connect each selected point to the axes. The linked graph uses M to avoid confusing its ordinate with A's height. Windows are fixed at x∈[−2.2,2.2], y∈[−5,9]; they show part of the full real domain. Captions explicitly note unequal axis scales (ticks of 1 on x, 2 on y). No inference depends on color alone.

## Implementation decision

React and MDX are already installed and configured in `astro.config.ts`; L37 provides an existing inline-island precedent. The chapter overview also has a native Astro `SecantExplorer`, but that activity fixes a=1 on x²/2 and does not support the exponential, movable tangent point, prediction state or linked derivative view. Leave it intact for its existing chapter lesson path.

Use one new reusable `DerivativeExplorer` React component in three `client:visible` islands. Coordinating graph geometry, controls, equation, revealed answer and linked plot from one state makes React useful here. SVG is sufficient for these bounded analytic curves: no graphing, animation or expression-parser dependency is needed. L40 alone moves from paired Markdown to paired MDX; the existing content collection and lesson route already support it. The surrounding prose and mathematics are server-rendered. Controls are disabled until hydration; initial figures, readings, static explanations and native disclosures remain available without JavaScript. There is no automatic animation.

## Mathematical and bilingual self-check

- The derivative definition assumes an open interval around a, nonzero valid h, and a common finite two-sided limit. h=0 never receives a secant slope.
- eˣ is positive on ℝ, has derivative eˣ and value 1 at zero. Ceˣ has derivative Ceˣ and value C at zero. Existence and uniqueness are assumed, not proved by the numerical activity.
- The identity e^(a+h)=eᵃeʰ gives q_h=eᵃ(eʰ−1)/h. Given f′(0)=1, its limit is eᵃ. Stable evaluation uses `Math.expm1`, avoiding cancellation at small h. The square comparison uses its algebraically simplified quotient 2a+h.
- Tangents are T_a(x)=f(a)+f′(a)(x−a). For eˣ at zero this is 1+x; for e⁻ˣ at zero it is 1−x; for x² at zero it is horizontal. For general a on the square, T_a(x)=2ax−a².
- Composition gives 2e^(2x+1), −e^(−x), and the practice example 3e^(3x−2). Derivative sign, not positive height, determines the stated increasing/decreasing behavior. A single zero derivative does not establish constancy.
- e^0.1≈1.10517 while its zero-point tangent gives 1.1; at x=1 the larger difference is e−2. Product identities, positivity, the limit toward zero at −∞ and relative growth D(eˣ)/eˣ=1 remain in the lesson.
- Control ranges keep A and B within x∈[−2,2] and finite. The plots use analytic derivatives and tangent equations, not a noisy finite-difference derivative. The UI labels computed values/coefficients as rounded approximations and does not claim a numerical proof.
- French and English have aligned sections, identical mathematical strings, matching explanations, domains, controls, feedback and correction logic. French remains the source. Reading versions become 2; the immutable L40 v1 exercise bank and its selection remain unchanged. Existing bank self-check evidence remains [CHAPTER_03_REVIEW.md](CHAPTER_03_REVIEW.md); this document renews reading and translation evidence, not independent review of the bank.

## Verification

- `pnpm check`: documentation/release/content gates, TypeScript (zero errors/warnings, existing hints), formatting, **310 unit/content/repository tests**, and the Vercel production build pass with Node 24.19.0 / pnpm 11.25.0. The final gate was rerun successfully after synchronising the version-only 0.15.0 release from main.
- L40 browser suite: **12/12 pass** in French/English. It covers both signs of h, the undefined zero quotient, tangent passage/slope and graph coordinates, linked derivative ordinates, reset/reveal, keyboard arrows/Home/End and visible focus, native corrections, 320/375/768/1440 px layouts, static no-JavaScript figures/readings, disabled unavailable controls, touch targets and scrolling, reduced motion, language anchors and absence of L40 islands on L39.
- Full browser suite: **292 passed, 3 failed out of 295**. The three failures are the existing French header's one-pixel overflow at **1051 px** (document width 1052): chapter navigation, public-reading geometry and theme/header geometry. All three reproduce in a separate unchanged tracked checkout of main at `416c57c5d91bf3b341fb72dd4dc87b79811f3dcb`, using exactly the same browser. The lesson run preceded the fast-forward of that version-only release; its three changed files are package.json, the release manifest and CHANGELOG.md, with no application-source changes. No global header fix or assertion relaxation is included here.
- The normal Playwright Chromium 156 download returned a truncated archive. Tests used temporary Chromium **153.0.8010.0** through the existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE` setting; no project dependency or browser configuration was changed. The host also logs a restricted network-interface enumeration error when the test adapter announces its listening address; browser requests and the suites complete despite that environment diagnostic.
- Visual review: French secant diagrams inspected at desktop and 320 px, in light/dark themes. Mobile SVG text was enlarged after inspection. Thick/thin/dashed lines, round/square points, axis ticks, controls and textual readings remain distinguishable, and the page does not overflow at the tested widths. Initial diagrams and values remain rendered before hydration.
- Mathematics tests check fixed exponential/square anchors, two-sided secant convergence with an independent Taylor expansion near zero, undefined/invalid inputs, and tangent passage/slope against independently rearranged formulas over every offered a value. Browser tests independently check point-to-axis coordinates.
- No immutable exercise, answer, grading contract, dependency, lockfile or Astro integration was changed. Reading hashes and the French translation-source hash are deliberately renewed after the mathematical and bilingual self-check.

Source-PDF comparison, manual screen-reader testing, physical-device testing and hosted acceptance remain unverified. Passing local automated checks does not certify independent mathematical review or classroom acceptance.
