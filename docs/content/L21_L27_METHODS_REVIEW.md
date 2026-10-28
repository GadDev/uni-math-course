# L21–L27 — additional methods and React islands

Follow-up to [the initial learning review](L21_L27_LEARNING_REVIEW.md), requested on 2026-10-28: give L23 a reminder of fraction addition, subtraction, multiplication and division, with a playable panel; inspect the seven improved lessons for additional explanations and React islands.

Basis: the current PR #125 at `51a9bd2`, repository sources and local rendering. The published URLs remain unavailable through the web reader; no new original-PDF comparison is claimed. This is an AI-assisted mathematical and translation author self-check, not independent peer review, a human translation approval or hosted acceptance.

## Findings and resulting additions

The original seven islands demonstrate concepts and results. The additional islands teach how to perform a calculation, choose a method or track a restriction. Each new activity has a learning objective, prediction, native controls, exact or explicitly rounded results, explanation and deterministic printable reference. The French and English content remains paired.

| Lesson | Remaining learning gap | Additional explanation and island |
| --- | --- | --- |
| L21 | Parentheses around a negative base and a leading minus are easy to conflate. | Explain which number receives the exponent; vary a and n, expand repeated factors, compare even/odd and zero cases. |
| L22 | The area model explains a square, but does not teach how to start factorisation. | Identify a common factor or an identity; choose three patterns, follow the algebra, then distinguish a numerical check from a general expansion proof. |
| L23 | Four fraction rules appear close together without a compact operation-specific reminder. | Four-row rule/example table and explanations of common units, reciprocal and reduction. A new fraction island supports all four operations, editable signed integer terms, exact steps, reduction and conditional unit bars. |
| L24 | “Move to the other side” can conceal the reversible operation. | Show subtraction on both sides, division by a nonzero coefficient and direct comparison when the coefficient is zero; an equation island complements the existing inequality island. |
| L25 | Geometric solution counts do not show how elimination/substitution proceeds. | Choose either method for the same adjustable sum/difference system, keep an original condition and verify both equations. |
| L26 | The mean activity starts at index 1; shifted bounds and repeated constants need separate practice. | Define start/end indices and renaming; vary bounds and the indexed expression, count included endpoints and expand every term. Reversed bounds produce an explicit workshop-domain message. |
| L27 | A distance graph with equal coordinate units cannot demonstrate the physical-unit caveat. | Convert both signed coordinate changes to metres, then use Pythagoras. Adjust metres per coordinate unit; the graph shows the resulting physical displacements on an equal metre scale. |

## Fraction panel contract

Input terms are integers from −12 to 12. This is a workshop bound, not a restriction on the general rules. Denominators must be nonzero. A zero numerator is valid, except in the fraction used as divisor. Empty, noninteger, out-of-range and zero-denominator input suppresses the calculation and gives an explanation; invalid input is not coerced to zero.

Denominator signs are moved to numerators before calculation without first reducing away the learner’s chosen denominators. For addition/subtraction, choose the least positive common denominator and show the factors multiplying both numerator and denominator. Multiplication needs no common denominator. Division retains the first fraction and inverts the nonzero second fraction. Reduction uses a positive greatest common divisor and gives a positive denominator; zero normalizes to 0/1.

The bar diagram appears only for addition/subtraction with a common denominator at most 24 and each represented signed fraction in [−1,1]. Every full bar represents one unit and cells show absolute magnitude; the sign is explicit. A and B represent the input fractions, not automatically the signed contributions to subtraction. Other inputs retain the exact symbolic explanation instead of drawing misleading clipped or microscopic parts.

All four rules and worked examples are present in the static lesson. The island’s default print/no-JavaScript reference is 1/2 + 1/3 = 5/6, independent of later live controls or invalid input. Presets reproduce 3/4 − 1/6 = 7/12, (2/3)(3/5) = 2/5, and (3/4)/(9/8) = 2/3.

## Other method contracts

- Signed powers: a=0…4, integer n=2…5. Distinguish −aⁿ and (−a)ⁿ; parity statements explicitly include the zero case.
- Factorisation: 6x²−9x, x²−9 or x²+6x+9; test x=−4…4. General identities come from expansion, not bounded numerical testing. No division by x is introduced.
- Equation: ax+b=c with integer a=−4…4, b=−5…5 and c=−5…12. Divide only if a≠0; a=0 gives all reals or no solution. Unique results are exact reduced fractions and are substituted in the original equation.
- System: x+y=s, x−y=d, with integer s=0…10 and d=−5…5. Both methods lead to x=(s+d)/2 and y=(s−d)/2; unrestricted real unknowns may be negative or fractional. Fractional values retain French decimal formatting in prose and exact fractions in formulas.
- Sigma: r=0…5, s=0…6 with r≤s; term 2i−1 or constant c=−3…5. Both bounds count. The workshop does not silently apply the r≤s formula to reversed bounds.
- Physical distance: signed coordinate differences −4…4 and positive metre-per-unit scales 1…3. Convert X=sxΔx, Y=syΔy and compute √(X²+Y²), rounded to four decimal places for the displayed length. The physical plot uses metres on both perpendicular axes; changing units is a changed physical interpretation, not merely a screen zoom. Zero and axis-aligned displacements need no division.

Method step buttons select and highlight an explanation; every step remains readable without requiring repeated clicks or JavaScript. Changing an input resets the highlighted step. Previous/next bounds and reset are explicit. All new controls use labels, keyboard focus and native input behavior, with no animation. Long calculations and the fraction reminder table have keyboard-focusable horizontal scrolling.

## React, content and release decision

React and MDX are already configured. Add seven focused `client:visible` islands: FractionExplorer in L23 and AlgebraMethodLab in each other lesson. There are now two islands per lesson, fourteen across L21–L27. The existing seven concept explorers are preserved. Reuse the existing Tex/KaTeX rendering and algebra styling; no dependency or infrastructure addition is needed.

Written explanations remain in the Astro content collection. Added headings have paired depth/order; existing section anchors and PDF markers remain intact. Print styles hide live controls, show initial reference states and preserve the four-operation reminder. The language switch remains aligned.

Reading versions advance L21/L24/L25/L27 3→4 and L22/L23/L26 4→5. Reading/translation fingerprints are renewed after checking the pairs. Existing graded bank versions, archives and answers are unchanged. Bank review evidence remains the existing [source alignment](CHAPTER_02_SOURCE_ALIGNMENT_REVIEW.md) / [lesson clarity](LESSON_CLARITY_REVIEW_2026-10-23.md) records; this follow-up renews the changed reading and translation only.

## Mathematical and bilingual self-check

- All four fraction examples were checked by reconstruction and exact integer identities. A signed-input sweep checks cross-multiplied results, reduced form, positive denominators and zero restrictions. Sign normalization preserves value before common-denominator calculation.
- Signed powers agree with repeated multiplication. Factorised forms expand to the stated polynomials, including at x=0.
- Linear equation solutions satisfy a·numerator + b·denominator = c·denominator; coefficient-zero cases are separate. Both system solutions satisfy sum and difference conditions.
- The sigma count is s−r+1 and the odd-term total telescopes to s²−(r−1)², including r=0. Constants repeat once per index.
- Equal physical scale factors multiply distance by the scale; unequal factors give √52 m for (3,4) with scales (2,1). Signs and zero displacements preserve the expected distance properties.
- Paired source formulas and heading structure are checked mechanically. French/English instructions, domain messages, operation names, inverse conditions, signs and physical-unit explanations were read for meaning. Bounded tests supplement the authored algebraic reasoning; they are not a proof of universal identities or independent review.

## Validation

- `pnpm check` passed with the pinned Node 24.19.0 / pnpm 11.25.0 runtime: zero Astro diagnostics, all 341 tests, formatting, content/release/documentation checks and the Vercel production build. No dependencies were added.
- The final focused browser run passed 38/38 tests, covering both languages, all fourteen island placements, all four fraction operations, signs, input boundaries and invalid states, method navigation/reset, keyboard controls, mobile/touch behavior, dark mode and no-JavaScript/print references. Chromium 153 was supplied with `PLAYWRIGHT_CHROMIUM_EXECUTABLE` because the default Playwright browser was unavailable.
- The full browser suite completed with 348 passes and three failures: the existing French header exceeds a 1051 px viewport by 1 px in the chapter-navigation, reading and theme tests. The same failures were reproduced on unchanged `7ffe575` during the initial review; that baseline was not rerun for this follow-up. The full gate remains failing. Subsequent calculation-preview, fraction-legibility and print-grouping polish was checked by the final focused run and/or final production render, rather than another full-suite run.
- All fourteen French/English production routes were rendered to A4 PDFs. Text extraction found all three explained exercise solutions in each lesson and no text outside the horizontal page margins. Page contact sheets were inspected; the added workshops keep their title, worked steps and static figure together, with live controls hidden. These are local Chromium print checks, not cross-browser or physical-printer acceptance.
- Production layouts were inspected at 320, 375, 768 and 1440 px, including light/dark examples, fraction operation presets and the physical-unit graph. Calculations and the reminder table can scroll within their own region without widening the lesson. [Fraction workshop, desktop](../design/implementation/l21-l27/fractions-fr-desktop.png) and [signed powers, mobile](../design/implementation/l21-l27/powers-fr-mobile.png) record representative states.
- `git diff --check` and the immutable-exercise guard passed. Graded exercise banks, archived answer contracts and existing dependency versions are unchanged. No hosted acceptance, deployment, independent mathematics review, human translation approval or physical screen-reader testing is claimed.
