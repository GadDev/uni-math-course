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

This renders the same editable **Slope Laboratory** artwork as [the standalone Chapter 03 SVG](chapter-03-deep-blue-art.svg), using the design-system colour token `--blue-accent`. The token has **light and dark** values (`#1455C0` and `#8BBAFF`). The shared component still defaults to the existing Chapter 1 artwork, and no public page references the new variant yet. The [preview](chapter-03-deep-blue-art.svg) is the fixed light-mode export.

## Artwork — a new composition, not a blue Décalage recolour

**Changed following design review:** the earlier blue grid resembled Chapter 02's offset-tile Décalage too closely. It was replaced by **The Slope Laboratory**, a singular mathematical composition, while preserving the Signal rules for paper, ink, precise linework and one strong accent.

- [Editable, original SVG hero](chapter-03-deep-blue-art.svg) (560 × 560) — a **dominant parabolic ribbon** rather than rectangular tiles/quarter-circle blocks.
- The illustration specifically uses the lesson's graph `f(x)=x²/2`: a quadratic Bézier representing the curve, P and Q, a thick black secant, a fine dashed tangent and discreet projection lines. These are decorative visual references and **not substitutes for the labelled teaching graph**.
- A single black square, small geometric corner wedge and edge marks maintain the Signal editorial family without borrowing Décalage's grid system.
- **Deep Blue** `#1455C0` on the shared paper `#F4F4EF` and ink `#111111`. The component uses theme tokens for the dark-mode alternative `#8BBAFF`. No gradients, photorealism or 3D.
- Preserve black actions, section numbers, restrained typography and compact mobile artwork treatment as in Chapter 02; mobile hides the decorative hero but keeps chapter identity.
- The six-lesson plan corresponds to proposed L37–L42, which are **not released lessons**.

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

The HTML studies are responsive down to 320px. Desktop preview SVGs embed the revised **Slope Laboratory** artwork; mobile mockups omit the decorative hero, just like Chapter 2.
