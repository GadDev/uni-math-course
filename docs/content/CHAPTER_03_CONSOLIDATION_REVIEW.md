# Chapter 3 consolidation review

26 November 2026. Implementing-author review, using the same ten equally weighted criteria as the initial pedagogical audit. These are instructional-design estimates, not independent certification, learner mastery or predicted examination marks.

## Exact scope

The reviewable candidate is main **75b656965c4156c061a1ec5d0f97d89a3a7bda6f** plus this L40–L42 change. The corrected English challenge PDF is already in that base. L37–L39 in this candidate remain their existing v2 readings. The following earlier work was inspected separately and is not silently included or merged:

| Lesson | Separately inspected revision | Status at review |
| --- | --- | --- |
| L37 | [PR 198](https://github.com/GadDev/uni-math-course/pull/198), 303084fa64bb0ea0ce016729b70b44f2de5e21dc | Draft; six stages, diagnostics, range and printable recap |
| L38 | [PR 200](https://github.com/GadDev/uni-math-course/pull/200), ed989c55ecc0f826d3183aa75402e0df6c4412f6 | Draft; original parabola retained, signed slope/error and prediction additions |
| L39 | branch feat/l39-six-stage-learning, 2020136eee4f508ffb730cb6901bb0c2f5193018 | Branch inspected; no PR returned by the repository's recent-PR listing |
| L40–L42 | This PR, reading v3 | Six stages, public equation practice and compact revision sections |

An assembled six-redesign branch has not been merged or tested here. After the earlier lesson branches are reviewed and integrated, repeat the cross-lesson browser checks on that exact combined commit. Individual branch checks do not establish integration acceptance.

## Before and after scorecard

Baseline: initial audit pinned at 9eff7a2ebf42c140b1fa5c99042fcf87973b9cbf. Same anchors: 5–6 functional with gaps; 7–8 good with material improvements; 9 strong evidence; 10 not justified. All columns below assess the current candidate described above. L37–L39 retain their earlier design scores except printable resources, where the corrected shared PDF removes the confirmed assessment-role defect.

| Criterion | L37 | L38 | L39 | L40 | L41 | L42 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| C1 Conceptual clarity | 8 | 9 | 8 | 9 | 9 | 9 |
| C2 Visualization | 8 | 9 | 7 | 8 | 9 | 8 |
| C3 Calculation/reasoning steps | 8 | 8 | 8 | 9 | 9 | 9 |
| C4 Motivation and relevance | 5 | 8 | 5 | 8 | 7 | 9 |
| C5 Interactive learning design | 8 | 8 | 6 | 8 | 8 | 8 |
| C6 Progression and coherence | 7 | 7 | 6 | 8 | 8 | 8 |
| C7 Prerequisite support | 8 | 7 | 7 | 8 | 8 | 8 |
| C8 Exam preparation/independence | 6 | 7 | 6 | 8 | 8 | 8 |
| C9 Printable revision | 7 | 7 | 7 | 8 | 8 | 8 |
| C10 Cognitive load | 7 | 6 | 5 | 7 | 7 | 7 |
| **Current estimate /10** | **7.2** | **7.6** | **6.5** | **8.1** | **8.1** | **8.2** |
| **Initial audit /10** | **7.1** | **7.5** | **6.4** | **6.8** | **7.0** | **7.2** |

The equal-weight chapter estimate rises from **7.0 to 7.6/10** for this candidate. It does not yet reach the earlier 8.9 planning target. The unresolved assessment patterns and pending integration of L37–L39 are material reasons to avoid claiming the whole redesign is complete.

## Chapter consistency checks

| Area | Finding and resulting behavior |
| --- | --- |
| Sources | Fonctions_01.pdf pp.2–19 covers the six topics; fresh source reread for this increment: pp.14–19 and Revision.pdf pp.29–30. Derivatives remain required course material. Revision equations now have a visible simplification → worked → faded → independent route. |
| Examples | The cubic/rational examples, x²/2 secants, product/quotient/chain rules, exp/ln and exact halving conventions remain intact. A mixed six-question review at the end of L42 transfers between these topics without naming each method in the prompt. |
| Domains | Original denominator restrictions survive cancellation. Log arguments are strictly positive, including each argument before combining logs. ln(x²) has x≠0 and equals 2ln|x|. General-base powers allow a=1; logarithms require a≠1. |
| Exact values | Change-of-base fractions remain exact; rounded decimals use ≈ and come last. Rounded substitution is explicitly approximate. Floor and ceiling counts remain distinct from measured time and asymptotic growth. |
| Notation | Df and f′ are both decoded. L42 explicitly reserves a for the base and x₀ for tangency. Existing L37–L41 workshops retain a as their point parameter; this compatibility choice is stated rather than renaming controls or source anchors. |
| Reading depth | L40–L42 use Essentials/Mastery/Go further. Equations and derivative formulas stay visible. Repeated derivative explanations, proof details and quantified Θ are optional. L37/L38 drafts and the L39 branch need integration before this structure is uniform across the served chapter. |
| Graphs | L41 and the common reference share one equal-scale inverse reflection component. Existing secant/tangent and no-JavaScript diagrams remain. L42 starts with log/n/n²/2ⁿ, with all additional curves and the complete numeric table retained. |
| Navigation | IDs/routes/prerequisites/objectives are preserved. Every old L40–L42 section heading survives as a subsection, preserving paired deep links. Shared formula links target the existing exact sections. Mixed-review corrections link back to L37–L41. |
| Print | Each changed lesson has a new-page recap. Equation corrections print without controls; optional repeated derivative refreshers are omitted from paper. Dark-mode pages force a white print background. Local browser/render evidence is recorded in the PR; physical printing remains unverified. |
| Release/data | Only paired reading versions advance. All six v1 banks, C03 mock, graded answers/history and authentication remain unchanged. Public self-study tasks use distinct examples and do not save scores or infer mastery. |

## Remaining priorities

1. **Integrate and verify the earlier lesson work.** Review L37/L38 drafts and the L39 branch, resolve against current main, then run the complete chapter journey on the combined commit. L39's method-selection lab and L38's consolidation remain dependencies for the intended full chapter redesign.
2. **Renew assessment in a separate versioned increment.** Fresh inspection confirms all six 15-question v1 banks retain the repeating key sequence `bacbacbacbacbac`; the two wrong-option feedback texts are identical within each of the 90 items. New public practice provides targeted recovery, but does not repair that graded-bank limitation. Preserve historical v1 and introduce independently reviewed fresh items if a new bank release is authorized.
3. **Finish the reference/assessment bridge.** Keep the corrected 72-question English booklet and separate solutions. The PDF correction was visually reviewed in PR 201; this review does not recertify all 600 workbook solutions. A smaller fresh mixed graded assessment and precise per-lesson PDF page mappings remain useful future work.
4. **Observe actual independent work.** Use the mixed review with a learner, recording hints and first errors separately from repeated practice. No tutoring session or progress update occurred here. Manual screen-reader, physical-device and hosted-commit acceptance remain separate verification tasks.

## Verification boundaries

The PR records actual repository, mathematical, browser and rendered-print results for the L40–L42 candidate. Passing software checks cannot establish independent mathematical review or learning gains. The served production site and other open branches must be identified by their actual deployed/combined commit before claiming chapter-wide deployment acceptance.
