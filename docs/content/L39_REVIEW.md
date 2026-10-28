# L39 — Derivatives and tangents: reading and interaction review

Date: 2026-10-28. Status: AI-assisted mathematical and French/English **author self-check**, not independent mathematical, translation or accessibility review. The deployed URL could not be retrieved by the page reader. This work inspects the repository source and local rendered output; the professor's PDF was not accessed. Its existing page-13 attribution is retained, with the new teaching material identified as original project additions.

## Assessment and priorities

L39 already contains correct, useful examples of the constant, power, sum, product, quotient and chain rules. The main first-reading obstacle is the jump from an unexplained differentiation operator to compressed calculations, with no in-lesson link between derivative, slope and tangent. L38 remains the prerequisite; the added recap makes that connection available at the point of use.

1. **P1:** introduce average slope, the two-sided limit and the distinction between f(a), f′(a) and f′ before the rules.
2. **P1:** highlight the derivative definition, tangent equation, domain restrictions and final essentials.
3. **P1:** unpack each existing worked example, explaining why each factor and sign appears.
4. **P2:** place two coordinated graph activities alongside the slope and tangent explanations, with prediction prompts and explanatory feedback.
5. **P2:** preserve bilingual content, prerendered reading, accessible alternatives and the release freshness contract.

## Passage-specific findings and changes

| Original passage | Potential difficulty | Resulting change |
| --- | --- | --- |
| “Les limites sont fondamentales…” immediately followed by D(c)=0 and D(xⁿ)=nxⁿ⁻¹. | D, c and n are unexplained; the student must recall the meaning of a derivative before seeing why these rules matter. | Start with three prerequisite checks, links to L23/L37/L38, a secant calculation and the limit. Explain the operator and restrict the stated power rule to positive integral exponents, with constants separate. |
| “Révisez les puissances et l’idée de tangente…” | The prerequisite is named but not made actionable. | State the needed skills and provide a point/slope/tangent recap with a complete example. |
| “Dérivez chaque terme séparément…” and one result 6x+2. | Why the coefficient survives, why x differentiates to 1 and why the constant disappears are implicit. | Show 3×2x + 2×1 + 0, with each term explained. |
| “Il faut deux termes.” and D(x²(x+1))=… | The roles of the two factors and the two terms are compressed. | Identify each factor and its derivative, apply the rule, then independently expand x³+x². |
| Quotient rule and “x ne vaut jamais moins un.” | The domain restriction appears after the calculation; numerator order and the squared denominator are easy to lose. | State the domain first; identify both derivatives; substitute them visibly; retain x≠−1 and add an Attention block. |
| “Dérivez l’extérieur puis multipliez…” | Composition notation and evaluation of the outer derivative at the inner output are unstated. | Explain f∘g and f(g(x)), state differentiability hypotheses, identify inner/outer operations, then account for the factor 2. |
| “On peut tester le résultat en substituant un x simple…” | A single numerical match could be mistaken for proof. | Retain the sanity check but explicitly distinguish error detection from an algebraic proof. |
| Final expanded-product identity. | A useful independent method is asserted without showing agreement with the product rule. | Preserve the original identity and add the other derivation. |

## Rewritten French anchors

- “La dérivée répond à une question : à quelle vitesse la valeur d’une fonction change-t-elle près d’une entrée donnée ?”
- “On garde A fixe et on rapproche B de A. Si les pentes des sécantes tendent vers un même nombre fini des deux côtés, ce nombre est la pente instantanée…”
- “À h = 0, le quotient donnerait 0/0 : il est indéfini.”
- “La valeur f(a) est une hauteur ; f′(a) est une pente ; f′ est la fonction des pentes.”

The full passages, worked calculations and native correction disclosure are in `content/lessons/L39/fr.mdx`; `en.mdx` preserves the same section structure, notation and teaching claims.

## Interaction and visual specifications

| Activity / objective | Student manipulation | Live response | Prediction or reflection |
| --- | --- | --- | --- |
| Secant → tangent: distinguish finite average slope from its limit. Located immediately after the numerical secant example. | Move A horizontally, use the native a slider (−2 to 2, steps 0.05), choose the sign of h, and adjust its magnitude (0.001 to 1) or select shrinking presets. Reset restores a=1, h=1. | On f(x)=x², update A, B, secant, tangent, slope triangle, coordinates, signed changes, quotient, derivative and tangent equation. A table compares both sides at four magnitudes for the selected a. | Predict the limiting slope before shrinking h. Observe that every offered h remains nonzero and finite secants differ from the limit. |
| Derivative ↔ tangent: distinguish function height, tangent slope and derivative graph. Located immediately after the tangent equation and approximation example. | Move A by pointer, keyboard, native slider or presets; select x² or x³−3x. Reset restores the square at a=1. | Update the original curve, tangent, coordinates, height, derivative, substituted equation and slope sign. A separate graph plots f′ with a diamond at (a,f′(a)). | Predict what happens at a=0. Choose the condition for a horizontal tangent; wrong and correct choices receive explanations. Move A to satisfy f′(a)=0, including the cubic's horizontal tangent at height −2. |

Both activities use original exact-function SVG geometry, with axes x/y, numeric ticks, a bounded window, and an explicit unequal-scale notice. The secant triangle links horizontal/vertical changes to the displayed Δx and Δy. A solid blue curve, dashed orange tangent, solid black secant, disk A, square B and dotted purple derivative with diamond distinguish roles by line/marker shape as well as color. Successive secants are controlled directly and compared numerically; there is no automatic motion. The text beside the tangent gives the local approximation example 1.2 versus 1.21. A zoom is not needed for these two bounded activities.

The curve and all initial explanations are server-rendered, including without JavaScript. Controls are hidden until hydration; a static-example note explains that state. Native controls and preset buttons provide alternatives to dragging. The SVG A handle has a labelled slider role after hydration, arrows and Home/End, bounded values, and visible focus. Pointer capture is released by the platform on up/cancel; local dragging state also clears on lost capture. Touch dragging is horizontal on the point only (`pan-y`); the surrounding SVG retains normal scrolling. Outputs use polite, atomic live announcements. Correction disclosures work without JavaScript. There is no sign-in, grading, persistence or exercise-bank import in the panels.

## Astro and React decision

The existing content collection already accepts Markdown and MDX. The lesson route uses `render(lesson)` and `<Content />`; paired headings support bilingual section navigation. React and MDX are already installed and configured. L37 already embeds inline `client:visible` React panels; the chapter's native `SecantExplorer.astro` offers a simpler alternative for independent controls.

For L39, React provides a practical benefit: one selected a synchronizes multiple plots, equations, values and challenge state. Two directly imported `DerivativePanel` islands use `client:visible`. Only the L39 pair becomes MDX; prose remains in the content collection, server-rendered KaTeX/MathML remains in use, and unrelated lessons do not hydrate these panels. No dependency, plotting library, app shell or global stylesheet is added. SVG is appropriate for the exact mathematical curves. The component-local stylesheet also styles L39 callouts.

## Mathematical and bilingual self-check

- At an interior point, existence of the same finite two-sided difference-quotient limit defines differentiability. The increment is nonzero and must keep inputs in the domain. For |x|, the one-sided slopes at zero differ, so its derivative there is not assigned a number.
- For the square: ((a+h)²−a²)/h = 2a+h for nonzero h. In particular, at a=1, h=1 gives 3, h=0.1 gives 2.1, and the limit is 2. The table approaches 2a from both sides.
- The numerical helper uses the algebraic identity rather than subtracting nearly equal floating-point squares. It returns null at h=0, preserving the distinction between a quotient and its continuous extension. The UI never offers zero; the static warning explains why.
- The square tangent at 1 is y=2x−1. At x=1.1 it gives 1.2 versus the function's 1.21. The approximation is local and explicitly not equality.
- For x³−3x: f′=3x²−3; at a=1, height −2 and slope 0 give the horizontal line y=−2. At a=0, tangent y=−3x crosses the curve since their difference is x³. The derivative graph is distinct from this line.
- All offered a values are multiples of 0.05; h magnitudes are multiples of 0.001. Values displayed in tangent equations terminate within six decimal places at these inputs. General numerical readouts use ≈ and state their rounding.
- Constants, powers and sums: D(3x²+2x+5)=6x+2. At 1, height 10 and slope 8 give y=8x+2.
- Product: x²(x+1)=x³+x² gives derivative 3x²+2x by expansion and by the two-term rule. The second original product expands to x³+1 and both methods yield 3x².
- Quotients: x/(x+1) has domain ℝ excluding −1 and derivative 1/(x+1)² there. For x²/(x²+1), the denominator is positive on ℝ and numerator cancellation yields 2x/(x²+1)².
- Chain: (2x+1)³ differentiates to 6(2x+1)²; expanding to 8x³+12x²+6x+1 independently gives 24x²+24x+6, the same derivative.
- French and English preserve all existing mathematical examples and now have matching headings, mathematical strings, domains, prompts, challenge/correction logic and version 2 metadata. French remains the translation source; English retains French course notation. Reading time is adjusted to 50 minutes for the added recap and labs.
- The immutable L39 v1 exercise bank is unchanged. Its prior self-check remains in `CHAPTER_03_REVIEW.md`; this evidence renews the reading and translation decisions and their full-byte fingerprints, not independent review of the bank.

## Verification

- `pnpm check`: passes with pinned Node **24.19.0** and pnpm **11.25.0**, including documentation, release policy, content/fingerprint/translation gates, TypeScript, formatting, **310 tests** and the Vercel production build. TypeScript reports zero errors/warnings and eight existing hints.
- Final focused browser run: `pnpm test:e2e tests/e2e/l39-explorers.spec.ts tests/e2e/lesson-clarity.spec.ts --workers=1`: **19/19 passed**, including all **12 L39 tests**, on the final lesson and graph implementation. This covers positive/negative h, smallest nonzero h, reset, positive/negative/zero slopes, changing functions, equation/value alignment, explanatory challenge feedback, keyboard focus and boundaries, direct pointer dragging, touch controls, paired language anchors, mobile widths (320/375/768/1440), dark/reduced-motion settings, static reading/corrections without JavaScript, and L38 isolation.
- Full browser run: **290 passed, 5 failed out of 295**. Three failures are the French header's one-pixel overflow at **1051 px**, in chapter navigation, public reading and theme/header geometry. Exactly those three failures reproduce in an unchanged detached checkout at **13bcb2a8092965be82220182052b360415b9180d**, with the same browser. The subsequent base commit **416c57c5d91bf3b341fb72dd4dc87b79811f3dcb** changes only release metadata, the changelog and the package version. No header styles are changed by this PR.
- The other two full-run failures timed out during scrolling in the English L39 pointer test and the French lesson-clarity test. Both pass in the final 19-test run above, without increasing timeouts or weakening assertions. The full suite is therefore not described as entirely green.
- Browser environment: the default Playwright Chromium 156 archive was invalid/truncated. These runs use temporary Chromium **153.0.8010.0** via the repository's existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE` option, with no dependency or browser configuration committed. Local Node adapter startup logs an environment `networkInterfaces` error; the public and fixture servers nevertheless serve the browser journeys.
- Visual inspection: checked the French secant panel at desktop size and the tangent panel at 320 px in light/dark themes, plus the definition callout. Enlarged graph text on narrow screens. The fixed vertical window is **[−5,10]**, keeping the full selected derivative marker visible at the square's minimum selectable derivative −4 and the cubic's minimum −3. A test checks all offered a values for marker containment.
- Mathematics: numerical central differences independently check both derivative functions; tests check two-sided secant convergence, the undefined h=0 quotient, tangent incidence, nonzero-height horizontal tangents and the cubic crossing example. The worked rule calculations and French/English fidelity are self-checked above; automated checks do not establish independent mathematical review.

Hosted deployment, physical-device and manual screen-reader acceptance remain outside these local checks. The deployed page was unavailable to the page reader; no hosted preview acceptance is claimed.
