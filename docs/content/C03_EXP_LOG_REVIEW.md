# L40–L42 reading and equation-practice review

Implementing-author mathematical and bilingual self-check. Independent review and hosted acceptance are not claimed. Base: 75b656965c4156c061a1ec5d0f97d89a3a7bda6f.

Reading versions advance from 2 to 3 in both languages. Published bank v1 bytes and their original reviews remain unchanged: [L40](L40_REVIEW.md), [L41](L41_REVIEW.md), [L42](L42_REVIEW.md). The new examples are public, ungraded self-study tasks with no attempt saving.

## Source and scope

Reopened supplied Fonctions_01.pdf physical pp.14–19 and Revision.pdf physical pp.29–30. The former defines exp through Df=f and f(0)=1, its inverse ln, logarithm laws and change of base. Existence/uniqueness and the inverse differentiation theorem remain explicitly admitted. Revision emphasizes simplification and exponential/logarithmic equations; derivative teaching is retained alongside that practice.

The source p.19 already includes n². Both readings now say so. Model context, worked/faded equations, domain traps, the nine public choice tasks and mixed chapter retrieval are original project explanations/extensions. Formal O/Θ and the trace proof are optional; general-base derivative rules remain visible.

## Mathematical checks

- Ideal model N(t)=100 exp(0.2t): N′=0.2N; units distinguished. At t=1,2 values round to 122.14/149.18 and changes to 24.43/29.84. For rates −0.2,0,0.2 at zero, the changes are −20,0,20 while quantities stay 100.
- Equal-base exponential equations use injectivity; an exponential cannot equal a nonpositive real. Examples and choice candidates are checked by substitution.
- Logarithmic equations first restrict every original argument. Combining ln(x−1)+ln(x+1) yields candidate roots ±2, but the original domain x>1 excludes −2. For ln(x²), the domain is x≠0 and both signs can be valid. The identity is ln(x²)=2ln|x|, not 2ln(x) on negative inputs.
- Powers are isolated before applying logarithms. Exact values ln(10)/ln(2), ln(7)/ln(3), ln(7)/ln(2) precede rounded decimals. A base between 0 and 1 is allowed and injective; base 1 has no inverse logarithm.
- Shared reflection diagram retains equal scales of 45 SVG units per mathematical unit on both axes. Coordinate pairs (0,1)/(1,0) and (1,e)/(e,1) are swapped. The diagram is reused by the reference sheet and L41.
- Floor/real halving counts remain 5/6, 6/6, 6/7 for 63/64/65. Four cost curves are initially selected; all other curves and complete value table remain available.
- Mixed retrieval: excluded input 3 survives cancellation; secant slope 0.9 approaches tangent slope 1; product/chain derivative at zero is 2; exp equation gives 2; power equation gives ln6/ln2; log equation admits only 3; 17 takes four floor divisions or five real divisions.

## Verification

- Pinned Node 24.19.0 / pnpm 11.25.0, frozen-lockfile dependencies.
- Final `pnpm check` passed: all 459 tests, repository/release/content/format checks, zero Astro errors/warnings and production build. Nine existing hints remain.
- All published exercise archives are unchanged; immutability and diff-whitespace checks pass.
- Exact paired mathematical strings: L40 153, L41 235, L42 194. All original headings survive as subsections.
- Browser review of the final build: both languages, desktop and 375px dark-theme equation cards, shared inverse reflection; zero page errors and zero KaTeX errors across all six pages.
- Re-rendered all six lessons to A4 after correcting the revision-heading page break. Each revision section, including its heading, fits on the final single page. All rendered page corners are white; all six recap pages were visually inspected.
- Full Playwright results and the final focused browser rerun are recorded in the pull request. A temporary alternate-output build outside the checkout failed dependency resolution; the unchanged build configuration succeeded when the temporary output remained inside the checkout. No learner progress records or claims of improved exam scores are produced by this implementation.
