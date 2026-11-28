# L11–L15 guided reading review

27 November 2026. Implementing-author mathematical and bilingual self-check; not independent review or hosted acceptance. Base: 4ba2f5b9d276b46685778bbf16bb92750f6955e6 (the current main inspected before implementation).

## Review findings and implemented changes

| Lesson | Existing strength / gap | Updated reading |
| --- | --- | --- |
| L11 | Correct predicate/domain definitions and source-error warning; little unaided justification or quantifier-order support. | Witness/counterexample proof table, finite-model prediction, empty-domain case, faded example and optional quantifier-order preview. |
| L12 | Correct two negation laws, including vacuous truth; only one simple numerical example. | Bracket-and-push method, implication and inequality negation, boundary check, compound example, nested-quantifier extension and fresh written questions. |
| L13 | Correct finite comprehension and interval examples; no complete candidate trace or explicit real/integer comparison. | Domain/filter diagnostic, row-by-row square test, endpoint checks, variable renaming, filter diagram and changing-domain workshop. |
| L14 | Correct definition and empty-set warning; unstructured enumeration can hide omissions and brace errors. | Include/exclude decision diagram, enumeration by subset size, cardinality/duplicate checks, nested empty sets and power-set workshop. |
| L15 | Correct laws and original Venn diagrams; worked results precede a dense list of laws. | Both De Morgan regions, arbitrary-element equivalence proof, faded second proof, ambient-set experiment and mixed calculations. |

All five readings follow six stages and include a prerequisite diagnostic, complete example, faded work, two new public paper questions and a compact new-page revision section. Preserve every original heading text as a subsection, original examples, existing figures, stable lesson/objective IDs, routes and source-page metadata. Reading v3→v4; MD→MDX to embed one bounded public React workshop per lesson. No dependency, grading, database or saved-progress change.

## Sources inspected

Freshly read supplied Logique_01.pdf physical pp.44–65 and Revision.pdf pp.13–18. Source coverage: predicates pp.44–46; quantifiers pp.47–48; negation pp.49–51; set-builder notation pp.52–56; membership/subset reminder p.57 and power set p.58; set operations and Boolean correspondence pp.59–65. Revision exercises ask for justification, quantifier order, negated implication, explicit sets, De Morgan verification and a three-element power set.

Preserve the existing source discrepancy notice: p.48's strict “older than” predicate makes ∃x∀y P(x,y) false because y may equal x. The new equality and strict-inequality examples avoid that error. Nested/bounded syntax is identified as a preview of L16. Counting 2^n subsets, empty-domain semantics, new finite models, diagrams and proof scaffolding are original project teaching extensions, not newly attributed source theorems.

## Mathematical self-check

- A finite universal is a conjunction of its instances; an existential is a disjunction. Empty conjunction is true and empty disjunction false. Negation swaps quantifiers and negates the full predicate, preserving domain and order. The parity lab includes zero, all-even and empty domains.
- On {−2,0,3}, x²>1 has truth values true/false/true. On R, ∀x∃y(y>x) is true with y=x+1; ∃y∀x(y>x) is false by x=y. Equality on {0,1,2} separates the two quantifier orders too.
- The negation of ∀x∈X((x>0)⇒(x<4)) is ∃x∈X((x>0)∧(x≥4)); witness 5 lies in the specified domain. Negating ∃x∈R((x<0)∧(x²>9)) gives ∀x∈R((x≥0)∨(x²≤9)); the original is true at −4, its negation false.
- A comprehension filters candidates; it does not add an otherwise-suitable object outside the domain. Squares at −2,−1,0,1,2,3 are 4,1,0,1,4,9. The real interval ]−1,3] differs from the integer set {0,1,2,3}. N includes zero; the bounded odd-number exercise gives {1,3,5,7}.
- Power sets contain subsets as elements. For three distinct objects, sizes 0/1/2/3 contribute 1/3/3/1 subsets. P(∅)={∅} has one element; P({∅})={∅,{∅}} has two. The lab has only distinct base elements, so its include/exclude construction has no duplicate branches.
- Relative complements and both De Morgan laws use a fixed common ambient set. The arbitrary-element proof explicitly fixes x∈C. For C={0,1,2,3,4,5}, A={0,2,4}, B={2,3}, the intersection is {2}, union {0,2,3,4}, complement of union {1,5}. Adding 6 to the ambient set adds 6 to each relevant complement. The finite workshop never returns elements outside its ambient set.

## Release and scope

Preserve published banks L11 v2, L12–L14 v4 and L15 v5, including all historical archives. The earlier bank/release evidence remains in [the clarity review](LESSON_CLARITY_REVIEW_2026-10-23.md) and existing bank tests. This increment renews only the actual changed reading fingerprints and French-source translation fingerprints.

L11's pre-existing `unreviewed-exception` mathematical and translation release states remain unchanged: this reading self-check does not certify the whole bank or silently upgrade its status. L12–L15 retain their existing `self-checked` states; no independent human review is claimed. Generated release-status counts therefore do not change.

## Verification

- Pinned Node 24.19.0 / pnpm 11.25.0, frozen lockfile.
- `pnpm check`: all 471 tests, repository/release/content/format checks, zero Astro errors/warnings (nine existing hints) and production build passed. Published archive immutability check passes.
- New mathematical tests exhaust every subset of a five-element parity domain, construct power sets independently with bit masks, and verify both De Morgan laws across all ambient/subset combinations of a four-element universe.
- The initial repository run encountered unstaged MD→MDX paths in the Git-tracked fixture copier; staging the actual renames resolved it without changing fixture logic. Visual review found one malformed formula escape; it was corrected, and strict KaTeX rendering of every changed reading formula was added to the regression test.
- Paired mathematical strings: L11 80, L12 51, L13 70, L14 84, L15 94. All original headings retained as H3.
- Desktop/mobile/dark browser review of all ten pages: zero page or KaTeX errors. All ten rendered A4 revision sections, including their headings, fit on a single final page. New diagrams and representative paper references were visually inspected.
- This execution host denies interface enumeration used by Astro's startup logger. Local browser QA used a temporary loopback-only logging fallback outside the repository; actual HTTP listeners/requests and application logic were unchanged. The normal runner/browser configuration remains unchanged.
- Full and final focused browser results are recorded in the pull request. Manual screen-reader/physical-device acceptance, physical printing and hosted-deployment identity are not claimed. No tutoring session or learner progress update occurred.
