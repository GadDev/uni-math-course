# L37 six-stage review

AI-assisted implementing-author self-check; independent mathematical review and hosted acceptance are not claimed. Base: 9eff7a2ebf42c140b1fa5c99042fcf87973b9cbf. Reading v3; published practice bank v1 remains unchanged.

## Source and mathematical checks

Reopened the supplied Fonctions_01.pdf physical pages 2–4, including their rendered pages. Preserved f:A→R with A a subset of R, the polynomial x³+2x+3, rational (x²−2x+2)/(x(x−2)) excluding 0 and 2, Cartesian equation y=f(x), and graph-set definition. Restored the source's exponential 3^x as a preview of L42. Domain intersections, range/preimages/zeros, the vertical-line test, cancellation example, new figures and written challenges are explicitly project teaching extensions.

Independently recalculated polynomial values at −2, −1, 0, 1, 2: −9, 0, 3, 6, 15. The rational function gives −1 at 1. The combined domain of sqrt(x+1)/(x−2) is [−1;2[ union ]2;+∞[; sqrt(4−x)/(x+1) has domain ]−∞;−1[ union ]−1;4]. The zeros of x²−4 are −2 and 2. Cancelling the original factor in (x²−2x)/(x−2) retains the exclusion of 2. A zero is an input, with a corresponding point on the horizontal axis. Distinguish the codomain R from the attained range {0,1} for squaring on {−1,0,1}.

French and English share 110 exact mathematical strings, six main stages and seven preserved subsection headings. Original heading anchors and paired language navigation remain intact. Both reading fingerprints and the translation source fingerprint are renewed. Bank v1 and its prior review docs/content/L37_REVIEW.md remain unchanged.

## Learning and presentation

The six stages connect a concrete ticket-price example, prerequisite diagnostics, definitions, worked examples, three existing interactive workshops, written practice and revision. Essentials, Mastery and Go further identify reading depths. Prerequisite corrections link to L21/L23/L27; equations and graph membership link to L24/L28. The combined square-root/domain extension is optional and initially collapsed.

Preserved all three React workshops, their existing calculations and original quick check. Added prediction/check/reset with localized corrective feedback. Three bilingual static diagram pairs use the chapter's blue accent; the hole graph labels the origin. Two additional written challenges remain outside the graded bank. No grading, authentication, database or application dependency changes.

The revision section starts a new printed page. Printing reveals closed corrections and the optional worked example, retains static diagrams, hides interactive controls and navigation, and forces a white page even when the screen uses dark mode. Browser tests address each named correction separately because the lesson now contains several answer disclosures.

## Validation

- Node 24.19.0 and pnpm 11.25.0, with locked dependencies.
- `pnpm check`: repository, release, content, formatting, Astro type checks, all 455 tests and production build passed.
- Local browser review: both languages on desktop and mobile; interactive feedback and dark theme; no page errors or KaTeX errors.
- Final browser and print verification is recorded in the pull request after completion.

No deployment or independent human approval is implied by these local checks.
