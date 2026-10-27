# Chapter 4 — Information Theory / Théorie de l'information

**Status:** original bilingual editorial manuscript and **600 original draft worked exercises** awaiting mathematical and translation review. Nothing here is a public lesson or immutable graded bank.

**Primary source:** the user-provided 20-page PDF `coding.pdf`, *Mathématiques Générales — Théorie de l'information*, BINFO-LLL 2022–2023. Page numbers count its cover as page 1. **Do not commit or redistribute that PDF**, its slides, or its drawings. All explanations, solutions and exercise wording here were authored for this project.

**Visual integration:** [Chapter 4 Ember Signal design implementation, draft PR #105](https://github.com/GadDev/uni-math-course/pull/105); original design [PR #104](https://github.com/GadDev/uni-math-course/pull/104). Neither PR is a content-release decision.

## Reading route (French and English)

| Draft | Pages | Subject | Manuscript | Worked practice |
| --- | --- | --- | --- | --- |
| T01 | 2–6 | Messages, bits, sender/channel/receiver, Hello World | [FR](drafts/T01/fr.md) · [EN](drafts/T01/en.md) | [100 items](../../../exercises/drafts/chapter-04/T01.json) |
| T02 | 5, 7–9 | Source/target alphabets, words, substitution functions | [FR](drafts/T02/fr.md) · [EN](drafts/T02/en.md) | [100 items](../../../exercises/drafts/chapter-04/T02.json) |
| T03 | 9–10, 14–15 | Unique decodability and collisions | [FR](drafts/T03/fr.md) · [EN](drafts/T03/en.md) | [100 items](../../../exercises/drafts/chapter-04/T03.json) |
| T04 | 11, 13 | Distributions and empirical frequencies | [FR](drafts/T04/fr.md) · [EN](drafts/T04/en.md) | [100 items](../../../exercises/drafts/chapter-04/T04.json) |
| T05 | 11–16 | Weighted average codeword length, compare codes | [FR](drafts/T05/fr.md) · [EN](drafts/T05/en.md) | [100 items](../../../exercises/drafts/chapter-04/T05.json) |
| T06 | 17–20 | Self-information, Shannon entropy | [FR](drafts/T06/fr.md) · [EN](drafts/T06/en.md) | [100 items](../../../exercises/drafts/chapter-04/T06.json) |

Each lesson has a six-part objective list, prerequisite note, source-vs-added-example labels, derivations, common mistakes, and short checks with worked answers. The additional exercise packs each contain **10 parameterized families × 10 instances**: 600 items, split across easy/medium/hard, each with bilingual questions and solutions. These are useful **calculation and concept drills**, not 600 distinct underlying concepts; the limited family diversity must be considered in editorial review. They are **not compatible with the production grading contract**, which supports different types and requires detailed feedback, six objective IDs, metadata and review.

## How the PDF is used

- **Slides 2–6:** Perseverance motivates transmission. Page 6 asks about binary encoding of Hello World but does **not** define a character encoding; the UTF-8/ASCII-byte worked answer in T01 is labelled additional material.
- **Slides 7–10:** keep the source definitions `S*`, `T*`, `c: S -> T*`, concatenation and unique decoding. The source's example on p. 9 has `c(z)=10=c(yx)` and is ambiguous. Prefixed codes are a **teaching extension** not explicitly defined in the slides.
- **Slides 11–16:** respect the document's **strictly positive** `p_i` and probabilities summing to 1. Calculate the source's `L(c_1)=9/4` and `L(c_2)=7/4` faithfully, but **do not call c1 uniquely decodable**: its `c1(x)=001=c1(zy)`. The p. 10 claim that subsequent examples are uniquely decodable is therefore not applicable to c1. Code c2 **is** uniquely decodable but **not prefix-free**. A separately labelled prefix-code counterexample of average length `3/2` proves c2 need not be optimal.
- **Slides 17–20:** retain the questions about different sources and the formulas for self-information and entropy. The slide calls `-log2 p` “entropy of a character”; standard terminology `I(s)` (self-information/surprisal) is introduced **explicitly as a clarification**, while `H(S)` names the average. Its final `Exemples. [...]` contains no worked numerical examples, so ours are labelled additional teaching examples.

## Quality gates and release sequence

1. [ ] Independent or documented author mathematical review of all 600 answers and 12 reading manuscripts (an automated arithmetic check is *not* this review).
2. [ ] Human bilingual review of meaning, notation, learner pacing, and 6 objectives per eventual public lesson.
3. [ ] Replace low-diversity drill families with more diverse word problems and proof/explanation tasks where educationally warranted.
4. [ ] Assign final stable `Lxx` IDs after Chapter 3's numbering has been resolved. **Do not reserve L37–L42** without coordinating Chapter 3.
5. [ ] Convert approved readings to `content/lessons/Lxx/{fr,en}.md`, create independent production-schema exercise banks, record verified release metadata, bilingual and mathematical review evidence and SHA-256 fingerprints in `content/releases.json`. Keep answer-bearing files server-only.
6. [ ] Produce print-checked A4 exercise/solution PDFs and timed mock exams *after* reviewing the corresponding answers. No print-ready or released PDF is claimed here.
7. [ ] Integrate the lessons with C04's chapter navigator, run `pnpm check`, `pnpm test:e2e`, and complete accessibility checks before publication.

The Chapter 4 overview in PR #105 should continue to say **In preparation** until those release gates have been met. Public practice/history/authentication and Chapters 1–3 remain unchanged.