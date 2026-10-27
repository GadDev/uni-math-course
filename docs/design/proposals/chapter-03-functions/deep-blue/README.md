# Chapter 03 — Deep Blue / Signal design study

**Status:** Proposed · **not selected, implemented, or published as a course chapter.**

Design references: [Chapter 02 implementation](../../../implementation/chapter-02/README.md) and [selected Décalage green](../../chapter-02-droites/selected/README.md).

## Review the two responsive, bilingual mockups

| Language | Desktop (1440 px) | Mobile (375 px, also inspect 320 px) |
| --- | --- | --- |
| Français | [Open French study](chapter-03-fr.html) | [Open French study](chapter-03-fr.html) |
| English | [Open English study](chapter-03-en.html) | [Open English study](chapter-03-en.html) |

These are **real editable HTML/CSS studies**, responsive at desktop and mobile widths, not images of an implemented production route. To view the fully interactive explorer **with the repository's actual Anton font**, start a local HTTP server **from the repository root**, for example `python3 -m http.server 8000`, then navigate to `http://localhost:8000/docs/design/proposals/chapter-03-functions/deep-blue/chapter-03-fr.html` or `chapter-03-en.html`. The CSS uses the same font asset as the application, with system-font fallback if the study is served from its folder. Open the browser responsive inspector at 1440, 375, or 320 px. JavaScript modules typically will not run through GitHub's blob viewer or when opened directly via `file://`.

## Production artwork variant (additive, not yet used by a live chapter)

The shared [`src/components/SignalGeometry.astro`](../../../../../src/components/SignalGeometry.astro) now accepts `variant="functions"` alongside the existing, unchanged `logic` and `decalage` variants:

```astro
<SignalGeometry variant="functions" />
```

This renders the same editable geometry as [the standalone Chapter 03 SVG](chapter-03-deep-blue-art.svg), using the design-system colour token `--blue-accent`. The token has **light and dark** values (`#1455C0` and `#8BBAFF`). The shared component still defaults to the existing Chapter 1 artwork, and no public page references the new variant yet. The [preview](chapter-03-deep-blue-art.svg) is the fixed light-mode export.

## Artwork — same Signal family, new chapter identity

- [Editable, original SVG hero](chapter-03-deep-blue-art.svg) (560 × 560): quarter-circles, triangles, offset rectangles, hard black slabs, fine black rules and sparse dashed geometry.
- **Deep Blue** `#1455C0`, shared Signal paper `#F4F4EF`, ink `#111111`; no gradients, photorealism, 3D, invented UI or bitmap sources.
- Anton-inspired oversized condensed editorial headings with system-font fallback, thin black dividers, numbered lesson tiles and black actions. The studies intentionally keep distinct palette semantics for a future production integration. Chapter 1 red and Chapter 2 green are not changed.
- On mobile, the decorative hero artwork is omitted in the same spirit as Chapter 2; the information hierarchy and chapter identity remain visible.
- The sample six-lesson plan corresponds to L37–L42; these entries are **not released lessons**, practice links or fabricated progress.

## Real interactive prototype — From secant to tangent

The graph uses the exact pedagogical example from the supplied **Fonctions d’une variable réelle** PDF (pp. 7–12): `f(x) = x²/2`, fixed `P=(1, 1/2)`, movable `Q=(1+h, f(1+h))`.

- Mouse/touch/pen: drag Q horizontally along the curve; its y-coordinate follows f exactly.
- Accessible `h` range input, 0.01 increments, keyboard arrow controls, and labelled/focusable Q drag handle.
- Presets at h=1, 0.5, 0.1 and 0; reset to h=2; positive and negative h supported.
- Readouts update Q coordinates, h, secant slope and the difference quotient; a solid black secant and dashed blue tangent stay visually distinguishable.
- Correct endpoint: for **h≠0**, secant slope is `1+h/2`; at **h=0** the quotient is undefined and the displayed tangent slope is the **limit 1**, not a fake evaluation of 0/0.
- Status/help text updates and a live region announces keyboard/drag changes without a backend; no grades or learner information are stored.

The source `secant-math.mjs` is separated from DOM logic, with `secant-math.test.mjs` verifying source-slide slopes, left/right limits and the undefined h=0 quotient.

## Scope and acceptance

This PR is a **design exploration and working tool prototype**, not live Chapter 3 registration. No modifications to existing Astro layout, released exercises, lesson registry, analytics, authentication, publication metadata or course PDFs. After design approval, integrate this into the real Astro/React application in a *separate* implementation PR, using existing lesson accessibility and design tokens.

Test mathematically using `node --test secant-math.test.mjs`. Review both locales at **1440 / 375 / 320 px**, keyboard navigation, drag on touch/mouse, slider and preset behavior, h=0 handling, and dark-mode integration as a separate implementation gate. HTML studies assume the standalone light Signal palette; dark mode is not claimed validated. These previews are not an official University of Luxembourg resource.

## Immediate vector previews

These **editable SVG layout compositions** are intentionally labelled design previews, *not browser screenshots*. Open the HTML files above to test the real layout and interactive graph.

| Locale | Desktop composition (1440px) | Mobile composition (375px) |
| --- | --- | --- |
| French | [FR desktop SVG](mockup-fr-desktop.svg) | [FR mobile SVG](mockup-fr-mobile.svg) |
| English | [EN desktop SVG](mockup-en-desktop.svg) | [EN mobile SVG](mockup-en-mobile.svg) |

The 375px studies are fluid down to 320px. The illustration is a direct inline reuse of the editable Deep Blue Signal shapes; the mobile mockup omits the decorative hero, just like Chapter 2.
