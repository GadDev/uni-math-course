# Updated Chapter 4 — source and lesson review

Source: Bruno Teheux, *Mathématiques Générales — Théorie de l’information*, supplied `coding(3).pdf`, 60 PDF pages including the cover. Cover identifies BINFO-LLL 2022–2023; no newer course year is inferred from upload metadata. SHA-256: `283514eaae1098669434d3393adf65befe3c244b0de47ed6b22e2b92c0e3e1d9`. The prior attachment `coding(2).pdf` is byte-identical. The earlier 20-page source described by existing lessons was unavailable; comparison is with the implemented lessons and their historical review. No source PDF is redistributed.

Read all 60 pages, treating repeated slides and progressive reveals as one argument. Visually inspected the Huffman section, binary entropy graph, decision tree, logarithm diagram and block-code table in addition to extracted text. Original explanations, exercises, accessible diagrams and proofs expand the supplied material; they are not transcriptions.

## Coverage and decisions

| PDF pages | Topic | Previous implementation | Delivered change |
| --- | --- | --- | --- |
| 2–6 | Communication, bits, messages | L43 | Preserve examples and interactive representation |
| 7–9 | Alphabets, words, substitution extended by concatenation | L44 | Preserve definitions and message encoding |
| 9–10, 14–15 | Symbol injectivity versus message decodability, prefixes | L45 | Preserve collision proof; link to L51 |
| 11–13 | Positive source model, empirical frequencies, weighted cost definition | L46–L47 | Preserve model; L46 links to explicit iid extension |
| 14–16 | Average length, ambiguity, shorter frequent words | L47 | Replace obsolete “proof absent” claim with L49/L53 continuation |
| 17–20 | Huffman, five-symbol example, ABRACADABRA, optimality and ties | L49 | Correct obsolete “outside PDF” label; add both source calculations and full scope |
| 22–32 | Surprise, symbol information, source and binary entropy, examples | L48 | Correct page mapping; binary formula, derivative, endpoints and forward links |
| 33–44 | Yes/no trees, expected questions, die and entropy bound statement | Missing | New L50: paths, prefix correspondence, expectation versus maximum |
| 45 | Kraft–McMillan | Missing | New L51: prefix counting proof, admitted general McMillan, constructive converse on lengths |
| 46–48 | Natural-log inequality, Gibbs and equality | Missing | New L52: derivative proof, positive ratios, weighted sum, base conversion |
| 49–54 | Normalised weights and lower-bound proof | Missing | New L53: full chain, signs, both equality conditions, strict-gap examples |
| 55–58 | Extensions, iid products, pair Huffman cost | Missing | New L54: product model, worked table and separate cost units |
| 59–60 | Shannon limit, codebook trade-off, dictionary conclusion | Missing | L54: quantitative finite-block bound and proof as teaching addition; brief historical correction |

L43–L49 URLs are unchanged. The source presents Huffman before entropy; the existing L48/L49 order is retained to preserve links and prerequisites. The overview explicitly maps their nonmonotonic page ranges. Five new lessons each expose six objectives, three worked open exercises and 15 signed-in single-choice questions. Open work is compared to justified model solutions; it is not misrepresented as automatically graded written reasoning.

## Mathematical verification and source qualifications

- Page 14 code c1 is ambiguous: x and zy both map to 001. This existing correction is retained. Distinct symbol words do not prove injectivity on messages. c2 remains uniquely decodable for finite messages despite being non-prefix.
- Page 18 weights 8,4,2,1,1: merge costs 2,4,8,16 total 30, mean 15/8. Page 19 ABRACADABRA weights 5,2,2,1,1: merge costs 2,4,6,11 total 23, mean 23/11. Different tied constructions and bit orientations are valid; no universal table identity is required.
- Pages 41–43: an individual question count is integral, but an expected count can be fractional. Fair-die optimal lengths 2,2,3,3,3,3 give 8/3, above log2(6), not because fractional means are forbidden.
- Page 45 necessity is not a certificate for a specific assignment. A→0, B→01, C→10 has Kraft sum 1 but AC and BA both map to 010. The constructive converse about the existence of a prefix code is an explicit teaching addition. The general McMillan necessity is admitted, as in the source; only its prefix case is proved here.
- Page 46 illustration: the supplied blue curve appears above the red line on part of the plotted range, contradicting the stated inequality there. This is a suspected schematic drawing error, not a defect in the true lemma. L52 uses the analytic derivative proof and does not reproduce that drawing.
- Pages 46–48: positivity is used for logarithms, ratios and preserved inequality direction. Natural logarithms convert to base 2 through division by positive ln(2). Equality requires all ratios equal to 1; normalisation alone is insufficient.
- Pages 49–54: q is 2^(-length)/K. Cross entropy is L + log2(K), with a plus sign. Gibbs and K ≤ 1 give H ≤ L + log2(K) ≤ L. Equality H=L requires K=1 and p=q together, equivalently each probability equals 2^(-length).
- Numerical displays state their five-decimal rounding. The Gibbs panel checks equality by exact integer cross-products of the entered counts, so a tiny positive gap rounded to zero is still labelled strictly positive before rounding. Browser coverage includes close and proportional models.
- Zero probabilities are excluded from Gibbs and block proofs. The binary entropy explorer alone extends to endpoints using the explicitly stated limiting convention 0 log2(0)=0. Symbol surprise at zero is never silently evaluated as finite.
- Pages 56–58: independent identically distributed symbols give pair probabilities 4/9,2/9,2/9,1/9. Mean is 17/9 bits per block, 17/18 per original symbol. The source reports the latter under its length notation; L54 separates units. Another checked example gives 27/16 per block and 27/32 per symbol for weights 3:1.
- Pages 59–60: the quantitative bound H ≤ L_n/n < H+1/n uses finite positive iid sources, at least two symbols, and a prefix/Huffman code on each full block alphabet. The Shannon-ceiling construction and upper-bound proof are teaching additions. Codebook cardinality is m^n. Headers, codebook transfer and incomplete final blocks are outside the ideal word-cost bound.
- Page 60 “LZW (1977) → ZIP” conflates families and dates. LZ77 is the 1977 method; Welch's LZW paper is from 1984. DEFLATE combines LZ77 and Huffman. Verified against [Welch's original paper](https://courses.cs.duke.edu/spring03/cps296.5/papers/welch_1984_technique_for.pdf) and [RFC 1951](https://www.rfc-editor.org/rfc/rfc1951.html). The conclusion stays brief.

## Practice and release review

75 original bilingual items added: L50 15, L51 15, L52 15, L53 15, L54 15. Existing L48 v2 and L49 v1 remain immutable. Active L48 v3 corrects source provenance, French feedback and two discovered incorrect keys (E06 and E14: the last, rarer symbol is more surprising). Active L49 v2 corrects source provenance; all 15 existing Huffman keys were checked against constructions and weighted costs. Total active Chapter 4 practice: 180 items across 12 lessons.

Author self-check of new L50–L54 and revised L48–L49 covered every prompt, alternative, key, explanation, domain and bilingual equivalent. Numerical items were recalculated; conceptual distractors were checked against the proof assumptions and counterexamples. This is an author self-check, not independent mathematical peer review. Existing L43–L47 bank and translation exceptions remain explicitly recorded; their wording/link changes do not silently certify their banks. All previous bank versions and the final exam v1 are preserved.

French/English section and exact TeX parity are checked by the repository. The English explanations retain course notation and decimal syntax within formulas. New glossary entries E65–E72 identify this source and page ranges; preceding entries and IDs are unchanged.

## Learning interactions

| Lesson | Objective | Editable inputs | Updates | Prediction |
| --- | --- | --- | --- | --- |
| L48 | Separate individual surprise from mean uncertainty | Binary probability slider, including explicit limiting endpoints | Surprises, contributions and moving entropy point | Does making one symbol rarer always increase entropy? |
| L49 | Choose two minimum weights and reinsert each merged node | Four positive counts, manual next-merge control | Forest, final code, mean | Which candidates remain after the first merge? |
| L50 | Connect question paths, prefix codes and expectation | Three-symbol/die preset, positive counts, strategy, traced symbol | Accessible tree, path table, H and expected question count | Is an equal split by symbol count optimal? |
| L51 | Distinguish length feasibility from assigned-code validity | Four integer lengths 1–8 | Exact Kraft fraction, canonical prefix construction or impossibility | What happens when all words are shortened? |
| L52 | Separate actual distribution and model | Two sets of positive counts, q=p action | Normalised p/q, entropy, cross entropy, gap | Which model makes the gap vanish? |
| L53 | Understand the two lower-bound inequalities | Three positive counts and three integer lengths | Constructed code, q, K, three-term chain | What changes when every word gains a bit? |
| L54 | Compare blocks using explicit units | Two positive counts, n=1..3, manual merge reveal | At most eight blocks, Huffman codes, merge sequence, entropies, both mean costs | Does blocking improve the uniform binary source? |

New panels use semantic tables, labelled native inputs, 44px controls, keyboard actions, inline invalid-input messages and bounded computations. Updates and manually revealed merge steps use a 260ms fade/translation; the existing entropy point uses a 280ms transition. Reduced-motion and print disable motion. Initial server-rendered results and worked examples remain readable without JavaScript. Printing hides controls, opens lesson solutions through existing print support, and retains the full block merge reference. The panels do not use autoplay.

## Assessment audit

Chapter mocks remain C01–C03. Final exam v1's information topic covers coding, expected lengths, entropy and Huffman, but has no objectives for L50–L54. Its published 180-question bank, selection blueprint and stored attempts are unchanged. Catalogue and preparation now explicitly disclose the gap and point to separate lesson practice. Expanding the final-exam blueprint and immutable content version is separate assessment work, not silently implied by “all chapters”.

## Validation

- `pnpm check`: passed locally — documentation/release fingerprints, 54 bilingual content contracts, Astro diagnostics (zero errors), formatting, 410 tests, and production build.
- Mathematical tests independently enumerate feasible small code-length lists to check Huffman optimality, test canonical prefix construction and ambiguity counterexamples, verify Gibbs and the normalised lower-bound chain, and check all 1,200 combinations of binary panel weights and block sizes against entropy additivity and Shannon bounds.
- `CONTENT_BASE_REF=5d1b74382b869de1b1e1e82e803bdfdf18027373 node scripts/check-immutable-exercises.ts`: passed; no published bank changed.
- Local targeted Playwright run built the complete test application, but Chromium failed before page execution because the workspace disallows its singleton socket (`Operation not permitted`). This is not a successful browser test run.
- New browser coverage exercises FR/EN navigation, 320px layouts, formulas, labelled controls, keyboard actions, no-JavaScript reading, print solutions, invalid inputs, Gibbs equality, lower-bound slack, block units, smooth animation and reduced motion. Existing signed-in practice coverage now includes all twelve Chapter 4 lessons.
- The required CI job remains `docs`; its budget increases from 15 to 20 minutes to accommodate the expanded browser and content journeys. Full browser validation runs on GitHub’s runner-provided Chrome.

Hosted classroom acceptance and independent mathematical review remain outside this change. The PR records the final CI outcome.
