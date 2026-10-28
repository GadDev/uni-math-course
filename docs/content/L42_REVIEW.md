# L42 — logarithms, halving, tangents and complexity

Date: 2026-10-28. Starting revision: `416c57c` on main. Reading version 2 in French and English; exercise bank v1 remains unchanged. This is an AI-assisted mathematical and translation author self-check, not independent human review. The live French page was fetched and matched the initial source. The source PDF was not available for a new page-by-page comparison: pages 18–19 retain their existing provenance, and new teaching material is identified as original project work.

## Assessment and priorities

The original formulas and n=8 anchors are correct, but the lesson compresses several learning steps and supplies no manipulable diagrams.

| Priority / original passage | Potential beginner difficulty | Implemented change |
| --- | --- | --- |
| P1: “La valeur logarithmique compte le nombre de divisions par deux.” (`fr.md`, “Comprendre une boucle…”) | A non-power-of-two input has no stated rounding or stopping rule. A noninteger logarithm is not an integer iteration count. | Explicit floor-division pseudocode, count of loop-body executions, full trace, graph, power-of-two bounds and exact floor-log count; contrast with real division and ceiling. |
| P1: “Utilisez la règle de la chaîne…” (“Dérivation…”) | The inner function, constant factor, derivative notation and relation to tangent slope are unstated. | Define D and prime notation, derive the square-function difference quotient, construct the tangent, and derive both general-base derivative rules with intermediate steps. |
| P1: “La réciproque nécessite…” followed by the change-of-base formula (“Le logarithme…”) | The inverse relation and numerator/denominator choice arrive without a derivation. | Start with the exponent question, derive the formula by taking natural logarithms, show a calculator method, and contrast exact values with rounded decimals. |
| P2: Reference to “La figure de la page 19” (“Comparer…”) | The figure is absent from the lesson; finite graph comparisons can be mistaken for proofs or running-time predictions. | Original SVG plots, numeric comparison table, selectable families and scales, explicit cost units, integer samples and viewport notes, explained O versus Θ and a constant-factor bound. |
| P2: “Toutes les bases positives” | Exponential and logarithmic base restrictions can be conflated. | Explain the constant base-one power, lack of inverse, decreasing bases and invalid zero/negative inputs. |
| P2: Final exercise immediately shows values | Little opportunity for retrieval or paper study. | Short predictions and exercises throughout, native revealable solutions, synthesis problems and method/formula revision sheet. |

The new French explanations and diagrams are implemented in `content/lessons/L42/fr.mdx`. The English counterpart follows the same section order, examples, domains and 142 initial mathematical expressions. All French-page student copy is French. Both reading versions become 2; the six objective IDs and immutable graded bank remain intact.

## Interactive specifications and visual choices

Each panel appears immediately beside the explanation it supports. All four use server-rendered React SVG, explanatory output and a table; JavaScript only enables controls. Native controls have explicit labels and touch targets of at least 44px. Line patterns and legends supplement color. Graphs use labeled axes, readable scales and text describing the viewport. Animations start on request, pause explicitly, stop at the endpoint and pause when hidden or outside the viewport; reduced-motion settings preserve direct controls and disable playback.

| Panel / objective | Manipulation and bounds | Linked updates and visual | Prediction |
| --- | --- | --- | --- |
| Halving: derive and count an exact loop | Integer n, 1–1,048,576; presets 1/63/64/65; step, play/pause, reset to n=64 | Current m and k, floor-log count, complete calculation trace, active row, full dashed trace and executed solid trace; graph k versus m | Do 63, 64 and 65 take the same number of divisions? |
| Logarithm: connect exponent, formula and graph | Base 0.1–10 excluding 1; input 0.1–16; decreasing-base preset; reset to (2,8) | Natural-log quotient, inverse-power check, selected coordinate, graph and reference table; invalid inputs explain the domain and hide the graph | Is log base 0.5 of 8 positive or negative? |
| Complexity: compare values and growth | Integer n, 1–64; eight selectable families including the original square-root/factorial models and added n²; linear or base-10 log y-axis; playback/reset | Selected values, all-family table, curves, axis bounds and legend; zero log-scale points omitted explicitly, retained in table | Which is larger, n² or 2ⁿ, at n=8 and n=4? |
| Tangent: connect average and instantaneous rates | x², 2ˣ or log₂(x); x₀ from −1 to 2 (0.5 to 2 for log); h from −1 to 1 in steps of .001; positive/negative presets; play/pause/reset | P/Q coordinates, quotient, analytical derivative, point-slope equation, fixed-window function/secant/tangent and two-sided sample table | For x² at 1, what happens when h changes from 1 to .1 to −.1? |

The tangent refresher reinforces L38–L39 instead of replacing their full treatment; its exponential and logarithmic examples directly support L42 differentiation. At h=0 there is no secant or Q marker, and the derivative/tangent remain distinct. Invalid logarithmic endpoints hide only the undefined secant. Playback halves |h| on the control’s .001 lattice and stops at .001, without claiming to reach a limit numerically. Stable `expm1`/`log1p` expressions avoid cancellation in small secants.

SVGs are precise code-native diagrams, not generated artwork. Integer-cost connecting segments guide reading and do not assert fractional input sizes. Log plots explicitly describe auto-scaled axes; tangent plots keep a fixed window for each function. Factorials stop at 64 to keep all costs finite. Number displays use ≈ for potentially rounded values.

## Astro and React decision

Inspected `astro.config.ts`, `package.json`, the lesson content loader/route, `FunctionPanel.tsx`, `SecantExplorer.astro`, release checks and L37’s existing MDX examples. React and MDX are already configured. The lesson route already renders MDX via the content collection; no route rewrite or new integration is necessary.

The L42 pair moves from Markdown to MDX to embed four directly imported, `client:visible` React islands. Shared state keeps each panel’s input, trace, graph, table and animation synchronized. This is a practical benefit for these linked interactions; native SVG/TypeScript remains sufficient for simpler one-control examples such as the existing chapter secant. Native SVG and existing React are sufficient here: no chart package, animation library, UI framework, paid dependency or lockfile change is added. The prose and KaTeX remain in the content workflow; unrelated pages do not import these islands.

## Mathematical and translation self-check

- The inverse relation gives log₂(8)=3, log₂(1/8)=−3 and log base 1/2 of 8=−3. The change-of-base denominator is nonzero precisely when the positive base differs from 1. D(aˣ)=ln(a)aˣ allows base 1; D logₐ(x)=1/[x ln(a)] requires x>0 and a>0, a≠1.
- With floor division, mₖ=floor(n/2ᵏ). Bounding n between 2^q and 2^(q+1) proves the first stop is q=floor(log₂n); n=1 takes zero divisions. Traces verify 63→31→15→7→3→1, 65→32→16→8→4→2→1, and 100→50→25→12→6→3→1. Real division with the same stopping threshold instead gives ceiling(log₂n).
- For x² at x₀=1, the quotient is 2+h for h≠0; the limit is 2 and tangent y=2x−1. At x₀=0 the tangent is horizontal. For log₂ at 1 the height is 0, slope 1/ln2 and tangent y=(x−1)/ln2. Tests compare stable secants with direct quotients and both-sided small increments.
- At n=8, log₂n=3, nlog₂n=24, n²=64, 2ⁿ=256 and n!=40320. At n=4, n²=2ⁿ=16. All eight models are finite over the tool’s integer range. Zero at n=1 is handled separately on logarithmic axes.
- Θ bounds are positive constant bounds for sufficiently large inputs, distinct from exact costs and the weaker O upper bound. For n≥1, 3n≤3n+7≤10n. Positive-base logarithmic cost equivalence uses a>1 so the multiplicative factor is positive. A finite plot is never presented as proof of eventual exponential dominance.
- French and English retain identical mathematics, headings/depths, objective IDs, domains, interaction semantics and solution reasoning. New full-file fingerprints and French-source translation freshness renew only this reading decision; previous bank evidence remains in `CHAPTER_03_REVIEW.md`.

## Paper study

L42-scoped print styles remove navigation, account/completion UI, animation controls and irrelevant buttons; convert dark themes to black-on-white; retain graphs, reference tables, calculations and the revision sheet; and avoid breaking figures/tables/solutions across pages. A print button uses the browser print dialog. `beforeprint` opens solutions and `afterprint` restores prior disclosure state; CSS also exposes solution contents when printing without JavaScript. The mathematical explanations and initial reference graphs/tables are rendered in HTML without hydration.

## Validation

- `pnpm check`: **passed** with pinned Node 24.19.0 and pnpm 11.25.0. Documentation/release/content gates, TypeScript (zero errors/warnings, eight existing hints), formatting, **311 unit/contract tests** and the Vercel production build pass.
- Final full browser suite: **293 passed, 3 failed out of 296**. All **13 L42 checks pass**, covering both languages, halving boundaries/playback/pause/reset, invalid/decreasing logarithms, numeric/graph/table alignment, scale/curve selection, factorial bounds, both-sided/zero/domain-excluded secants, native keyboard focus, touch, viewport-exit pause, reduced motion, 320/375/768/1440px layouts, no-JavaScript SSR teaching, printed corrections, disclosure-state restoration, paired language anchors and absence of L42 islands on the adjacent lesson.
- The three failures are the French header's existing **1052px content width at a 1051px viewport**, in `chapter-navigation.spec.ts`, `reading.spec.ts` and `theme.spec.ts`. All three reproduce in an unchanged detached checkout of starting main `416c57c`, using the same browser. They are documented rather than called passing or repaired in this focused lesson change. The required CI job may remain blocked by that separate header defect.
- The official Playwright Chromium 156 download failed with a truncated ZIP. Browser verification used the already available temporary **Chromium 153** via the repository's existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE` override. No project dependency or lockfile was changed. Local Node server logging also encounters this container's restricted network-interface enumeration; the servers answer and the checks above complete.
- Visual inspection: all four French panels reviewed at 1440px, the logarithm/tangent at 320px, and complexity in dark mode. Axes and legends remain legible; mobile label sizing and compact numeric ticks avoid clipped labels. The full rendered lesson has **eight section headings, four islands and zero KaTeX errors**.
- Print review: the browser-generated **12-page A4** reference output was rendered page by page and inspected. Print styling was checked from dark mode: white page backgrounds, light table headers, intact pseudocode/tables/figures/solutions, unsplit paragraphs, visible corrections and the final revision sheet. The print PDF is a temporary QA artifact, not a new published course download. Browser printing without JavaScript also exposes corrections.
- `node scripts/check-immutable-exercises.ts`: **passed**. The served L42 v1 bank is unchanged. The lesson pair keeps the six objectives, source-page references, paired heading depths and mathematical expressions; only reading/translation evidence and full-file fingerprints are renewed.

An earlier overlapping verification run interfered with generated test artifacts; the final full suite above was rerun sequentially on the completed code with a separate results directory. Automated tests and this author self-check do not establish independent mathematical review, manual screen-reader acceptance, physical-device acceptance or hosted class readiness.
