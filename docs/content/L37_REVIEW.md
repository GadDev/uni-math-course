# L37 — first encounter with functions, domains and graphs

Review date: 2026-10-28. Scope: the published French L37 page and the repository at the starting main revision; French source rewritten as reading version 2, with its English counterpart aligned. This is an AI-assisted mathematical and translation author self-check, not independent mathematical, accessibility or classroom acceptance. The professor’s source PDF was not available for a new comparison; page references remain the existing provenance, and all new diagrams and activities are original project work.

## Assessment and priorities

The existing calculations and rational-function domain are correct. The lesson is concise but compresses the bridge from ordinary language to notation, and from calculations to coordinates. Its seven-section progression is serviceable; its claimed detailed example and graph explanation need more actual scaffolding.

1. **P1 — Explain the notation before asking the learner to use it.** Define domain, image, codomain, function name and variable; distinguish `f(x)` from multiplication.
2. **P1 — Make reasoning visible.** Derive the forbidden inputs with the zero-product rule, and show substitution, powers, products and sums separately.
3. **P1 — Supply the missing visual bridge.** Replace the reference to an unavailable PDF curve with an original graph, reference table and coordinate guides alongside the explanation.
4. **P2 — Make the two main misconceptions testable.** Show many inputs sharing an image versus one input having two images, and explicit undefined states at both forbidden inputs.
5. **P2 — Make retrieval practice possible.** Ask for predictions before manipulation; hide the quick-check corrections in native `details`.
6. **P2 — Preserve lightweight, accessible reading.** Keep Astro content collections, server-rendered mathematics and static figures; hydrate animated React panels only where used on L37.

## Passage-specific findings and resulting edits

| Existing location / passage | Why a first-time reader can stumble | Concrete change |
| --- | --- | --- |
| “Objectifs et prérequis” immediately displays `f:A→ℝ, x↦f(x)`. | A, ℝ, the two arrows, the word image and the difference between the function and its value have not been introduced. The formula looks like a prerequisite. | Begin with an input/output sentence and three prerequisite checks. Move the notation after the calculation-box intuition and explain every part. Link L23 and L27 directly. |
| “Qu’est-ce qu’une fonction ?” asserts uniqueness in one paragraph, then gives the cubic. | The cubic does not illustrate two different inputs sharing an output. Readers can confuse single-valuedness with injectivity. | Add the square function on the explicit finite domain {−1,0,1}, an arrow diagram and a selectable counterexample. Say that ℝ as codomain does not guarantee every real is obtained. |
| “Le domaine n’est pas facultatif” gives the quotient and final domain at once. | The zero-product rule, `D_r`, set difference and the distinction between a specified domain and a natural domain are unstated. | Identify the denominator; solve its two zero factors; exclude 0 and 2; explain the symbols. State that there are no further restrictions for this quotient. Mention the different constraint for a real square root without adding a new exercise objective. |
| “même si une simplification semble possible” | There is no cancellable factor in the displayed example. The warning has no concrete referent. | Keep r as the domain example and add h(x)=x(x−2)/(x−2) in the pitfalls section; cancellation applies only for x≠2. |
| “Exemple détaillé : calculer des images” shows three nearly immediate equalities. | Replacement of every occurrence, the role of parentheses and the operation order are compressed. | Work f(2) through 8+4+3; work the negative input through −1−2+3; explicitly label input and image. Preserve all existing worked inputs. |
| “Du calcul au graphique” introduces set-builder notation and refers to the PDF curve. | The student must decode a set expression and imagine the curve without seeing it. A few isolated points can be mistaken for the whole graph. | Show coordinates and graph first; then decode membership, set-builder bar, inclusion and ℝ². Provide a fixed-scale plotted curve and a table. Explain the finite viewport and unequal axis scales. |
| “Le graphe ne peut attribuer deux ordonnées à une même abscisse.” | No drawing or procedure supports this statement. Zero intersections outside the domain and multiple inputs with a shared image can be confused. | Explain the vertical-line test with a circle intersected twice at x=0, and explicitly allow zero intersections outside the domain. |
| “Vérification rapide” displays answers immediately. | There is no opportunity for unaided retrieval. | Ask three questions first and place the worked corrections in a keyboard-operable disclosure. |

## Representative rewritten French passages

The complete French rewrite is in `content/lessons/L37/fr.mdx`.

> Imaginez une boîte de calcul : vous choisissez une entrée autorisée, la boîte applique une règle et fournit **exactement une sortie**. La même entrée redonne toujours la même sortie.

> Avant de calculer une image, demandez-vous : « Ai-je le droit d’utiliser cette entrée ? » Un domaine peut être imposé par l’énoncé. Si seule une formule est donnée et qu’on demande son **domaine naturel réel**, on cherche toutes les entrées réelles pour lesquelles cette formule a un sens.

> Dans f(2)=15, **2 est l’entrée et 15 est son image**. Dire « l’image de 2 » revient à demander la valeur de f(2).

> Quelques points donnent des repères, mais ne constituent pas tout le graphe. Pour le domaine A=ℝ, celui-ci contient un point pour **chaque** entrée réelle, y compris entre les valeurs du tableau et au-delà de la fenêtre dessinée.

## Interactions implemented beside the examples

All three are React islands embedded inline in the MDX lesson, hydrated with `client:visible`. They are public reading demonstrations, without sign-in, network requests for learner data, grading, persistence or exercise-bank imports. Sliders use native keyboard behaviour; preset buttons also work with touch and keyboard. Controls are enabled only after hydration. Outputs are polite, atomic live regions during manual use; live announcements pause during playback to avoid flooding assistive technology. Static teaching remains when JavaScript is disabled.

| Concept / learning objective | Placement and student manipulation | What updates | Prediction / reflection prompt (French) |
| --- | --- | --- | --- |
| Function uniqueness; distinguish a shared image from two images for one input. | After the square-function example; choose the square mapping or the relation adding −1↦2. | Arrow diagram, image alternative text and explicit function/not-a-function explanation. | « Deux entrées peuvent-elles partager la même sortie ? Et une entrée avoir deux sorties ? » |
| Natural domain of a rational expression; check before evaluating. | After the denominator derivation; move x from −1 to 3 in steps of 0.25 or choose presets, including both forbidden inputs. | Selected marker, factors, denominator and rational value; at 0 and 2 show “not defined” and an open marker. Repeating decimal values use ≈, with at most six decimal places. | « Prédisez le résultat pour x = 0, puis pour x = 1 : quelle vérification décide si le calcul est permis ? » |
| Connect substitution, image, table entry and ordered pair. | Immediately after the coordinate explanation, following the original worked calculations; move x from −2 to 2 in steps of 0.25 or select −1, 0, 2. | Substitution and arithmetic, exact terminating value, table selection/current row, plotted point and projections to both axes. Axis scales stay fixed. Play/pause steps through the inputs, stopping at the endpoint. | « Avant de sélectionner x = −1, prédisez f(−1). Sur quel axe le point sera-t-il situé ? » |

The graph panel also contains an optional theory experiment: **F_c(x)=x³+2x+c**, with c between 1 and 5 and default c=3, which recovers the lesson’s f. Changing c updates the whole curve, selected point, arithmetic and table. Ask: « Si c passe de 3 à 4, où ira le point d’abscisse 0 ? » This illustrates a change to the rule and all its outputs while its domain stays ℝ. A reset restores c=3 and x=0. The controls distinguish changing an input from changing the function itself.

Point/curve transitions are brief. Playback starts only on an explicit action, offers Pause, stops on manual input, on a hidden tab or when the panel leaves view, and stops at x=2. Reduced-motion preferences remove transitions and disable playback while preserving direct manipulation.

The bounded sliders are sampling tools, not claims that the real domain is discrete or restricted to their ranges. The surrounding text explicitly explains this distinction.

## Visual specifications

- **Arrow map, beside uniqueness:** all three members of A={−1,0,1} are shown; −1 and 1 both point to 1. The invalid relation adds a dashed arrow from −1 to 2. Output 2 remains displayed but unattained in the valid diagram; the caption states the displayed outputs are only part of ℝ.
- **Real line, beside the domain derivation:** open circles at 0 and 2, labelled exclusions, arrows at both ends. A selected marker follows the domain slider; textual feedback duplicates the valid/invalid distinction, so colour is not the only signal.
- **Cubic curve, beside coordinates:** original SVG sampled at 201 polynomial points across [−2,2], with five reference points. Horizontal range is [−2.2,2.2], vertical range [−12,18]; unequal scales are stated. The dynamic point and dashed horizontal/vertical guides use the same geometry. The table and plain-language caption provide alternatives to visual inspection.
- **Vertical-line counterexample, beside the test:** original circle with intersections (0,1) and (0,−1) highlighted on the line x=0. Explain why this fails single-valuedness, while a square function may have a shared image.

SVG assets have French/English labels and alternative text. No generated bitmap or third-party diagram is used for exact mathematics.

## Astro / React decision

Inspected files: `astro.config.ts`, `package.json`, `src/content.config.ts`, `src/pages/[locale]/lessons/[lessonId].astro`, `src/pages/[locale]/lessons/[lessonId]/practice.astro`, `src/components/SecantExplorer.astro`, content/release checks and existing browser tests.

- The route obtains the `lessons` content collection, calls `render(lesson)` and renders `<Content />`. Headings drive the outline and matched French/English anchor navigation. That workflow and both L37 public URLs remain in place.
- React **was already configured** with `react()` and dependencies `@astrojs/react`, `react` and `react-dom`. Authenticated practice already uses a React island with `client:load`. The chapter overview’s `SecantExplorer.astro` demonstrates native SVG/TypeScript interaction.
- The user specifically requested animated, manipulable React panels. React state now keeps rule parameters, selected input, graph, table, calculations and playback in sync. This is a concrete benefit for the richer interaction requested; native scripts would remain sufficient for simpler independent controls.
- **Chosen authoring integration:** add the official pinned `@astrojs/mdx` integration and convert only the French/English L37 pair to MDX. Its prose and KaTeX mathematics remain content files. Three direct `FunctionPanel` imports use `client:visible` so each interactive island hydrates when it enters view. Static examples render before hydration and when JavaScript is unavailable. Other lessons remain Markdown and do not load these React panels.
- The content loader accepts `.md` and `.mdx`. Filename-dependent content/release checks now resolve exactly one reviewed source per language, reject duplicate or unrecorded counterparts, and retain full-byte fingerprints, French-source freshness, heading and mathematical-expression parity. The documentation checker also scans MDX, and the repository’s course-map and draft-validation helpers can read either source type. Tests cover MDX freshness and duplicate-source rejection; this is not a relaxation of the review gate.
- `FunctionPanel.tsx` uses the existing React runtime, native controls and SVG. No animation library, plotting package, Radix stylesheet or additional UI framework is introduced. CSS transitions respect reduced motion. The prose is not moved into a React application.
- The lesson footer now displays its actual frontmatter version; the previous shell hard-coded Version 1 even for revised lessons.

Framework references: [Astro islands](https://docs.astro.build/en/concepts/islands/), [MDX integration and inline components](https://docs.astro.build/en/guides/integrations-guide/mdx/), [client directives](https://docs.astro.build/en/reference/directives-reference/).

## Mathematical and translation self-check

- The polynomial anchors are f(−2)=−9, f(−1)=0, f(0)=3, f(1)=6, f(2)=15. Fractional checks include f(1/4)=3.515625 and f(−1/2)=1.875. Quarter-step cubic values terminate within six decimal places; their equality displays are exact at the offered inputs.
- The denominator x(x−2) vanishes exactly at 0 and 2. The numerator is (x−1)²+1 and is always positive. For allowed x, r(x)=1+2/[x(x−2)], providing an alternative numerical check. r(1)=−1 and r(−1)=5/3.
- For the optional family, F_c(x)−f(x)=c−3 for every real input. The full slider range stays inside the graph’s fixed vertical window: the extreme outputs are −11 and 17.
- h(x)=x only for x≠2. h and the identity on all of ℝ have different domains. No infinity is assigned at an undefined input.
- The square example is single-valued on its explicit domain. The added arrow violates uniqueness. The circle has two distinct ordinates at x=0 and fails the vertical-line test.
- French and English preserve all mathematical expressions, seven heading pairs, domains, examples, activity states, questions and correction logic. French remains the source. Both reading versions become 2; the published exercise bank and its version remain unchanged.
- Existing bank review evidence remains [CHAPTER_03_REVIEW.md](CHAPTER_03_REVIEW.md). This change renews the L37 reading/translation evidence and hashes only; it does not claim a new independent review of that bank or access to the original PDF.

## Verification

- `pnpm check`: passed using Node 24.19.0 and pnpm 11.25.0. Documentation/release/content gates, TypeScript (zero errors/warnings; existing hints), formatting, **306 tests**, and the Vercel production build pass.
- L37 browser suite: **16/16 passed** in French/English. Checks include both excluded inputs, negative/fractional polynomial values, graph/table alignment, keyboard focus and native range limits, touch, 320/375/768/1440 px widths, no-JavaScript teaching/corrections, matching language anchors, React hydration without page errors, playback/pause, changing/restoring the rule, reduced motion and absence of L37 hydration on L38.
- Full browser suite: **269 passed, 3 failed** out of 272. All three are the existing French header’s one-pixel overflow at **1051 px**: chapter-navigation/header, reading/header geometry, and theme/header geometry. Running precisely these three tests in an unchanged detached checkout at `6029895fcab0eafcd788b578bc74f7a0d2eaa336` reproduces all three failures. They are not silently marked passed or fixed in this lesson change.
- Browser environment: the standard Playwright Chromium 156 download returned an invalid/truncated archive. Tests instead used a temporary Chromium **153.0.8010.0** executable via the repository’s existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE` option; this adds no project dependency. The baseline comparison used the same executable.
- Visual inspection: French panels were inspected at desktop and 320 px, in light and dark themes. The diagram axes, controls, values and selection markers remain legible; full-size displays and feedback do not overflow the mobile viewport.
- Production output: L37 has three directly imported React islands; its static examples are rendered in HTML. Other reading pages retain no L37 islands. The optional rule experiment reuses React and SVG without another animation/UI dependency.
- Authoring compatibility: the course-map helper reads both L37 MDX translations and their version metadata; release tests preserve MDX fingerprint/source-freshness checks and reject duplicate source formats. The standalone draft validator now reads MDX; its exploratory run against the unchanged published L37 v1 bank still flags five existing inline-TeX formatting differences in E06 (French `$x=1$`, English plain `x=1`), not different numerical claims. No immutable bank was changed.

Screen-reader and physical-device testing are distinct from browser automation; no such manual acceptance is claimed. Independent mathematical review and deployed-preview acceptance remain separate from these local checks.
