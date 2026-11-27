# C04 theory diagrams and guided explanations

26 November 2026. Based on `aacd35581f9d8f899c42dda69a0910a6a1fb3657` (PR #199). This is an AI-assisted mathematical and bilingual author self-check, not independent review or hosted classroom acceptance.

## Scope and source mapping

The supplied `coding.pdf` has 93 physical pages, including incremental reveals (SHA-256 `02e2b2a866ffb9d004f63e11cdfa10fcc3262ea61ffb025583f78cb014c6153c`). Relevant text, formulas and diagrams were revisited: entropy 24–27, McMillan 45, logarithm/Gibbs 46–48, normalization/lower bound 49–54, source extensions 55–60. All five full French/English lesson pairs were read and compared. No private PDFs or copied slide artwork are committed.

| Lesson | Change | Source versus teaching addition |
| --- | --- | --- |
| L48 | Original weighted-information diagram, explicit sigma expansion and table of logarithms, prediction contrasting individual surprise with source entropy | Source definitions retained; diagram and numerical scaffold are original explanations. Derivative justification uses a native mastery disclosure with prerequisite links; the source's entropy curve remains in the essential reading. |
| L51 | Eight-position capacity diagram, concrete prefix reservations and overlap, negative-exponent explanation, guided unused-capacity calculation | McMillan remains admitted in general, as in the source. Prefix proof and constructive converse remain labelled teaching additions; feasibility is not presented as validity of a particular assignment. |
| L52 | Numerically plotted ln(x) and tangent, derivative sign table, two-term Gibbs expansion and inequality-direction prompt | The source's lemma and proof remain required visible reading; the new graph is computed independently rather than copied from its schematic. |
| L53 | Symbol ledger, proof dependency diagram, three-stage normalization example and sign-error diagnosis | Source proof retained; explicit numerical scaffold precedes its general indexed form. |
| L54 | Original iid probability grid and grouping illustration, product expansion, two-position entropy derivation and unit check | Source theorem and hypotheses remain visible. The existing quantitative upper-bound derivation is explicitly supplementary and placed in a native disclosure. |

The reading versions advance together within each pair: L48 v4, L51/L52/L54 v2, L53 v3. Objectives, source-page anchors and selected practice-bank versions are preserved. No graded question, answer, bank archive or attempt contract changes. Release fingerprints and translation-source hashes are deliberately renewed for the revised bilingual readings. The unchanged banks retain their mathematical evidence in [CHAPTER_04_UPDATE_REVIEW.md](CHAPTER_04_UPDATE_REVIEW.md); L53’s preceding reading clarification is documented in [C04_AUDIT_FOLLOWUP_REVIEW.md](C04_AUDIT_FOLLOWUP_REVIEW.md). This record reviews the new readings.

## Mathematical self-check

- L48: for probabilities (1/2,1/4,1/4), logarithms are −1,−2,−2; surprises 1,2,2; contributions 1/2,1/2,1/2; H=3/2. Equal segment widths encode equal weighted contributions. For binary p changing 1/2→1/4, I(x) rises 1→2 while H falls 1→approximately 0.811278. These are different sources from the three-symbol illustration, explicitly called binary in the prediction.
- L51: at M=3, prefix 0 reserves 000–011 (4 positions), 10 reserves 100/101, and 11 reserves 110/111; shares total 1. Prefixes 0 and 01 overlap on 010/011. For 00,01,10, six distinct depth-3 positions are occupied and one quarter remains free. Four lab lengths (2,3,3,3) give K=5/8; the three-word worked example instead gives K=3/4. Both are feasible and explicitly distinguished.
- L52: curve samples use y=ln(x), x in [0.25,3], on the same affine numeric axes as y=x−1; contact is (1,0), common slope 1. The mathematical lemma holds on all x>0, not merely the plotted interval. g′=(x−1)/x is negative/zero/positive around 1. For p=(1/2,1/2), q=(1/4,3/4), ratios are 1/2 and 3/2; the upper bounds −1/4 and 1/4 sum to zero, while the weighted log sum is (1/2)ln(3/4)<0. Multiplying by −1 reverses direction; dividing by ln2>0 preserves it. Proportional raw count lists normalize to identical probabilities.
- L53: words 00,010,011 are prefix-free, lengths (2,3,3), weights (1/4,1/8,1/8), K=1/2, normalized q=(1/2,1/4,1/4). With p=q, H=3/2, L=5/2, log2K=−1 and H=L+log2K<L. The plus sign follows from negating log2q=−length−log2K. The first inequality can be an equality while the second is strict. Both equalities are needed for H=L.
- L54: iid probabilities (2/3,1/3) give P(aba)=4/27 and pair probabilities (4/9,2/9,2/9,1/9). aaba groups as aa|ba and codes as 0|110 under the displayed table, totaling 4 bits for this message, distinct from the source's mean. L2=17/9 bits/block and L2/2=17/18 bits/original symbol. For entropy additivity, regrouping the four pair terms gives H(S) for each position because the other position's probabilities sum to 1. Independence remains an explicit prerequisite.
- All new diagrams have paired translated labels, meaningful alternative text and explanatory captions. Geometry and numerical values agree across languages. Solid/dashed lines, positions, numbers and borders provide meaning without color. SVGs are original editable vector assets with white backgrounds for dark-screen contrast and monochrome print.

## Learning and accessibility design

The guides use ordinary native disclosures, readable without JavaScript; every question precedes its explanation. The existing InformationExplorer and InformationTheoryLab models are reused without changing their behavior or introducing another workshop. Each guide gives specific values to test and an interpretation to check, rather than only displaying a calculation. Existing objectives and source material stay accessible; supplementary proofs are labelled honestly, not represented as excluded from an official exam.

Figures retain readable labels in a bounded horizontal scroll region on narrow screens; captions convey the conclusion without relying on the image. Figure/table scroll regions can receive keyboard focus with a visible outline. Print removes scrolling, fits the figures and uses the existing solution-disclosure print convention. No animation or paid dependency is added. Guided/visible solutions do not establish independent mastery.

## Verification

Command outcomes are appended after execution. Local checks are separate from CI, deployed acceptance, screen-reader and physical-paper review.

- Validated with pinned Node 24.19.0 and pnpm 11.25.0. `pnpm check` passed: all 458 tests; 57 bilingual content/release contracts; formatting; typecheck with zero errors/warnings and nine existing hints; Vercel production build.
- The new mathematical figure test inverts all 111 SVG sample coordinates in each language and compares them to ln(x), verifies they lie below x−1, checks the contact point and tangent endpoints, and checks paired curve geometry. The existing entropy, Kraft, Gibbs, lower-bound and iid-block mathematical suites also pass.
- All ten SVGs were rendered for visual inspection; labels, tables, reservations and the curve were checked. The final graph uses a true x=0 vertical axis and samples the curve only for x≥0.25. This image inspection is not a full browser screenshot, screen-reader or physical print review.
- All ten built reading pages were parsed: each has its concept figure, meaningful image alternative, existing asset and at least one guided prompt; no KaTeX error elements. Existing lab fallbacks remain in the output.
- `CONTENT_BASE_REF=aacd35581f9d8f899c42dda69a0910a6a1fb3657 node scripts/check-immutable-exercises.ts` passed; no practice bank changed. `git diff --check` passed.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium pnpm test:e2e --max-failures=1` was attempted. Chromium exits before page launch because `/usr/lib/chromium/chromium` is missing (exit 127). The bounded suite stopped after the first launch failure; the new FR/EN guide tests did not execute locally. They cover all five routes at 320px with JavaScript disabled, loaded figures, keyboard focus/scroll, native solution reveals, document width, math rendering and print disclosure content. CI uses its installed Chrome and must run these checks before merge.
- Hosted deployment, manual screen-reader use, physical-device gestures and physical-paper output remain unverified. No measured learning gains or post-redesign score are claimed.
