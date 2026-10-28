# L43–L49 — guided information-theory lessons

Date: 2026-10-28. Starting main: `961fc88`. Paired reading versions advance from 1 to 2. This record describes an AI-assisted implementing-author mathematical and translation self-check; it does not claim independent review or hosted acceptance.

## Scope and evidence boundaries

Reviewed all fourteen original French/English lesson sources, the Astro lesson route, content/release gates, existing MDX/React activities, project instructions and Chapter 4 release evidence. The seven published URLs could not be fetched by the web tool. Local production rendering is used for page verification; no live-page equivalence is claimed. The original PDF was unavailable for a fresh page-by-page comparison. Existing source-page markers and attributed examples are retained; new methods, guided exercises and diagrams are original project work. The existing [Stanford Huffman reference](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/24-huffman/huffman_background.html) was opened and checked; UTF-8 character/byte distinctions were checked against [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629).

The immutable authenticated practice banks are unchanged: L43–L48 remain selected at v2 and L49 at v1. Their existing mathematical/translation `unreviewed-exception` states and warning notices remain in force under [the prior owner release decision](chapter-04/INTERACTIVE_RELEASE_DECISION.md). This change does not review every graded question or promote those banks to self-checked. The fresh reading fingerprints and French translation-source hashes deliberately record the revised pair while retaining that exception. New public self-study exercises are explanatory lesson material, separate from authenticated assessment answers.

## Assessment and priority

| Priority / specific original passage | Beginner difficulty | Implemented response |
| --- | --- | --- |
| P1, L43 §02 “De manière générale… 2^n” | The multiplication rule is asserted, and fixed versus bounded length is not derived. | Explain the doubling argument, derive minimum fixed-length capacity, cover n=0/M=1 and contrast the geometric sum for bounded length. |
| P1, L44 §01–02 “S*” / “La même lettre c…” | Alphabet size, word length and coded length can be conflated; the extension on the empty message is implicit. | Explain the star and message index, define the empty extension, derive length additivity and trace concatenation. |
| P1, L45 §03 “Donc le décodage…” | One successful decode may look like a general proof; non-prefix unique decoding has a message-end condition. | Prove the prefix guarantee, distinguish partial/invalid streams from ambiguity, show complete alternative parsings and explain finite c2 boundaries. |
| P1, L46 §02 “Les fréquences empiriques sont donc…” | The common denominator, zero counts and empty samples need explicit treatment. | Derive normalisation, separate alphabet size from sample size, expose changing denominators, and distinguish data from model assumptions. |
| P1, L47 §01 “L(c)=…” | The expectation appears before a concrete total-cost derivation. | Add a receipt analogy before the definition, derive exact B/N from counts and explain expectation, units, marginal distributions and decoding constraints. |
| P1, L48 §02–03 “Shannon propose…” / H definition | Negative log, individual surprise and its weighted contribution are easily confused; zero endpoints risk log(0). | Motivate log-additivity for independent events, give calculator steps and per-symbol contributions; explicitly extend entropy at zero by a limit. |
| P1, L49 §01 “minimum…” | The greedy merge is stated without its cost invariant or reason for optimality. | Explain merge-cost increments and a guided exchange/contraction proof within the correct code class. |
| P2, L49 §02 text tree | ASCII branches are difficult to inspect on phones and give no experiment. | Replace with an original labelled SVG tree and a stepwise manipulable forest plus sorted merge trace. |
| P2, all lessons, T01–T06 cross-references and inline answers | Topic IDs are not route IDs; there is little independent retrieval or paper guidance. | Link actual lesson IDs, add a hint/solution exercise, prediction and explained guided experiment in every lesson, then a final revision checklist. |
| P1, L47 §02 comparison table | Literal absolute-value pipes in the Markdown header prevent table parsing under MDX. | Preserve every codeword, probability and length in a four-column table with lengths in parentheses; browser tests require an actual table in both languages. |
| P2, L43 Hello World bit line | One long expression risks paper/mobile overflow. | Preserve all bytes and order, wrapping the mathematical display across three rows. |

## Activities and diagrams

Each lesson embeds one `client:visible` island next to its method. Controls use native labels, number/select/range inputs, 44px minimum targets and visible focus. Invalid inputs keep an explicit explanation instead of misleading computations. State changes update a concise polite output, diagram and/or calculation table. No animation, drag-only interaction, service, chart dependency or paid infrastructure is added.

| Lesson / objective | Manipulation | Linked output and visual | Guided prediction |
| --- | --- | --- | --- |
| L43, capacity | n integer 0–8; M integer 1–256; presets and reset | Capacity, shortfall/unused words, fixed-length minimum and first 16 binary labels; epsilon explicit | Do three bits cover nine states? |
| L44, substitution | x/y/z word up to 12 symbols; three code tables; empty/zz presets | Encoded stream, source/bit lengths and full cumulative block table | Do four symbols imply four bits? |
| L45, decoding | Binary input up to 12 bits; c1/c2/d presets; empty input | Exhaustive parsings for that word, all source alternatives, whole-table prefix test and precise limits | Does c1 decode 001 in two ways? |
| L46, frequencies | Three integer counts 0–20; uniform/absent/empty presets | Shared total, exact n_i/N, approximate fractions and common-scale probability bars | Does adding x change the frequency of y? |
| L47, expected length | Three positive counts 1–20; c1/c2/d; uniform/d presets | Every weighted contribution, exact total fraction and side-by-side same-distribution comparison with admissibility | Does c2→d save bits for 2/1/1? |
| L48, entropy | Binary p in [0,1], step .01; uniform/certain presets | Both surprises and weighted contributions; linear 0–1 entropy graph and selected point | Can rare-symbol surprise rise while entropy falls? |
| L49, Huffman | Four positive counts 1–20; previous/next merge; equal/skewed presets | Current forest, next minimum pair, sorted trace, final code table, total cost and mean | Are merged subtrees candidates in later merges? |

Each activity has an external French/English mode d’emploi, initial prediction, a full paper reference and explained reflection. Prefix and collision claims are supported by general arguments or explicit witnesses; finite computations are labelled accordingly. Probability plots use a common numeric scale; Huffman positions express tree topology rather than numeric scale. SVG accessible names, captions and equivalent numeric/path tables describe every plot. Line/point position and labels carry meaning without color dependence.

## Architecture

`astro.config.ts` already enables React and MDX, and the route renders both through the same content collection. Fourteen reading files move to MDX, retaining course IDs, paired mathematical strings, source markers and aligned section depths. Prose and KaTeX stay server-rendered. React keeps each activity's controls, calculations and visual in sync, reusing the established island approach. Native HTML/SVG suffice inside the islands. No integration, dependency, lockfile, auth, schema or application-route change is required. The repository link checker now resolves only the exact existing `/fr|en/lessons/Lxx/` route shape to one actual Markdown/MDX source; tests retain rejection of missing languages, unknown IDs, duplicate sources, absent anchors, traversal and unrelated missing routes. Shared public mathematical helpers import no graded banks.

## Mathematical and bilingual author self-check

- Capacity is 2^n for exactly n positions. For M≥1 states, minimum n is ceil(log2 M); M=1 allows the empty label only with framing/count known. The bounded-length count includes epsilon and is 2^(n+1)−1.
- UTF-8 `Hé` with precomposed U+00E9 is bytes 72/195/169: 24 bits, not 16. Original eleven-byte Hello World order is preserved.
- c2(xyzx)=0010110 and c2(zyx)=011010. Empty messages encode to empty; unknown symbols are rejected. c1 has the collision x/zy at 001. d decodes 01011 as xyz. The c2 proof uses all zero-start boundaries plus the known finite end; a finite parsing test is not a universal UD test.
- Frequencies 6/10, 3/10, 1/10 sum to one; adding x changes the denominator to 11. Zero empirical counts and N=0 are distinct. The alternating-source example now uses a uniformly random initial bit before deterministic alternation, so every position has the claimed half/half marginals while transitions remain dependent. The positive course model and dependence assumptions remain explicit.
- For counts 2/1/1, c1/c2/d totals are 9/7/6 bits and means 9/4, 7/4, 3/2. c1's algebraic mean does not repair its ambiguity. N times the expected length follows from linearity under equal marginals, without requiring independence.
- Self-information is undefined at p=0; its limit is +∞, whereas the entropy contribution tends to zero. Binary entropy at p=1/4 is approximately .811278124459; it is 1 at .5 and 0 at either certain endpoint. Four-symbol exercise entropy is 7/4. Individual-symbol entropy is not asserted to be a dependent source's entropy rate.
- Huffman example gives 0/10/110/111, merge weights 4/8/16, total 28 and mean 7/4. Four equal weights give 00/01/10/11 and mean 2. The exchange inequality (a−b)(s−r)≤0 and contraction recurrence justify the greedy step for finite positive-weight binary prefix coding. Tie rules fix one optimum, not the only valid code.
- Both languages carry the same mathematics, examples, proof conditions, guided experiments, input limits and solutions. The structural mathematical-expression gate checks notation equality in addition to the implementing-author prose comparison. No new human reviewer or independent endorsement is recorded.

[French desktop/mobile/dark previews](../design/implementation/l43-l49/README.md) are committed alongside this record.

## Printing

Every island has a separate fixed reference rendering, unaffected by manipulated screen state. Print rules hide navigation and controls, retain labels/tables/graphs and force a monochrome light page. Native solutions/hints are exposed in print through `::details-content`, including without JavaScript. The paper reference uses the complete final Huffman tree. Exercises, corrections and revision cards remain available in the lesson; no separate PDF download or workbook regeneration is claimed.

## Validation

- `pnpm check`: passed on Node 24.19.0 and pnpm 11.25.0, including documentation/release/content gates, TypeScript (zero errors/warnings; eight existing hints), formatting, **349 unit/contract tests**, and the Vercel production build.
- New mathematical checks cover binary words including epsilon, UTF-8 byte counts, exhaustive finite parsing and non-prefix c2 round trips, frequency domains, exact weighted costs, entropy limits/symmetry and an independent optimum comparison over **259 four-weight Huffman cases**. The independent verifier enumerates every binary tree partition rather than reusing the greedy merge rule.
- Final full browser suite: **381 passed / 3 failed out of 384**. All **20 new activity checks pass**, covering French/English interactions, invalid input and recovery, reset, keyboard/focus, touch/dark phone use, non-overlapping Huffman leaves, rendered comparison tables, 320px layouts, paired section anchors, fixed print references and visible solutions without JavaScript.
- Baseline reproduction: a detached, unchanged checkout of starting main `961fc88` reproduces all three French 1051px header failures in chapter navigation, public reading and theme; the three corresponding English cases pass. The document is 1052px wide at a 1051px viewport. The header and its assertions are unchanged in this focused PR.
- Visual/layout checks cover every lesson pair at **320/375/768/1440px**, light/dark examples and zero KaTeX errors. The entropy table retains unbroken decimal probabilities on phones; Huffman leaf placement allocates space by leaf count to avoid overlap.
- Fourteen browser-generated A4 outputs (**63 pages total**, 4–6 pages per lesson) were rendered and visually inspected. All French/English hints, corrections, reflection answers and revision cards are present; the activity references remain intact on one page, graph/table labels remain visible, and text bounds pass. Print output stays light from a dark screen theme. These are temporary QA documents, not new course downloads; existing workbooks are unchanged.
- Existing immutable-exercise gate and `git diff --check`: passed. Reading objective identities and source markers remain; no authenticated answer key, grade history or bank archive changes.
- Browser verification uses **Chromium 153.0.8010.0** through the existing executable override. This container logs a restricted network-interface enumeration error when starting the Node test server; the servers nevertheless respond and the browser tests execute.

This self-check does not establish independent mathematical/translation review, physical-device or manual screen-reader acceptance, hosted authentication, deployment or classroom readiness. No merge is performed.
