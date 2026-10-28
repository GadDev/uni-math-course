# Chapter 03 — Fonctions d’une variable réelle: author self-check

**Status:** AI-assisted mathematical/translation **author self-check**, not independent human review. Source: *Mathématiques Générales — Fonctions d’une variable réelle*, BINFO-FCE 2025–2026, 19-page PDF. This PR does not redistribute the source PDF.

## Source map

| Lesson | PDF pages | Grounded mathematical content | Additional original instruction |
| --- | --- | --- | --- |
| L37 | 2–4 | Function, domain, polynomial and rational functions, graph points | Worked substitutions; removable-domain trap |
| L38 | 5–12 | Average speed, derivative limit, secants and tangent | Negative-h approach, tangent equation, interactive plot |
| L39 | 13 | Constant, powers, sum, product, quotient and chain rules | Rule identification and second-method examples |
| L40 | 14–15 | Exponential, derivative, initial value and addition law | Composed derivatives and tangents |
| L41 | 16–17 | Natural logarithm, inverse, derivative and graphical reading | Chain-rule examples and domain traps |
| L42 | 18–19 | Base-a exponential/log, derivative and comparative complexity plot | Halving example and finite input comparisons |

## Reviewed mathematical anchors

- **L37:** For f=x³+2x+3, direct evaluation gives f(0)=3, f(1)=6, f(2)=15, f(−1)=0 and f(−2)=−9. For r=(x²−2x+2)/(x(x−2)), the forbidden inputs are 0 and 2; r(1)=−1 and r(−1)=5/3. A simplification never permits evaluation at a previously excluded input.
- **L38:** With f=x²/2 and x₀=1, the secant quotient simplifies to 1+h/2 for h≠0. Values h=2, 1, .5, .25 and .1 yield 2, 1.5, 1.25, 1.125 and 1.05, matching PDF pages 7–11. Values −1 and −.2 yield .5 and .9, independently confirming the approach from the left. The limit is 1, and the tangent is y=x−.5. **At h=0 the quotient is undefined**; only the limit is 1.
- **L39:** Expanding a product checks the product rule: (x+1)(x²−x+1)=x³+1, giving derivative 3x². For x²/(x²+1), the numerator terms simplify from 2x(x²+1)−2x³ to 2x. Composite powers apply the chain factor (2x+1)³ → 6(2x+1)².
- **L40:** e⁰=1, D(eˣ)=eˣ, e²e³=e⁵; the chain gives D(e^(3x−2))=3e^(3x−2). The tangent at x=0 has slope and intercept one.
- **L41:** ln(1)=0, ln(e)=1, ln(e^a)=a, and e^(ln x)=x for x>0. Product and quotient laws agree when x,y>0; D ln(2x+1)=2/(2x+1), x>−.5; D ln(x²)=2/x on x≠0.
- **L42:** D(aˣ)=ln(a)aˣ for a>0. The inverse log base requires a≠1 and x>0; log₂8=3, log₂16=4, log₂64=6. At n=8, nlog₂n=24 and 2ⁿ=256. The source's finite complexity plot motivates comparisons but does not prove asymptotic bounds.

## Exercise publication and bilingual gates

- 6 initial banks × 15 = **90** unique versioned IDs, partitioned 5 easy / 5 medium / 5 hard.
- Each bank spans O01–O06 and stores provenance, misconceptions, hints, per-option feedback, strict grading and post-answer explanations.
- Mathematical display strings and heading counts across both languages were checked for exact correspondence during authoring. Release fingerprints bind complete UTF-8 lesson/bank bytes and record that the English lesson is based on the current French source.
- Distinct options/keys, sign conventions, domain restrictions and the example anchors above were author checked. Automated structural/content checks cannot certify all pedagogical interpretations, and **difficulty is not psychometrically calibrated**.
- Human mathematical, bilingual and accessibility reviews remain desirable. Hosted Supabase acceptance is not asserted. This branch is a **draft** until the maintainer approves merging.
