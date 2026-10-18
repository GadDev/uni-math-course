# Chapter 1: PDF alignment and beginner support - 2026-10-18

Status: Codex mathematical and French/English author self-check, not independent peer review, human translation approval or hosted acceptance. The maintainer requested an implementation PR. Merge is the maintainer's decision.

## Scope and source

Base revision: c09bcbeb7aa3f1b4837b185f6f297c6c4d74c80b. Reviewed all twenty Chapter 1 lesson pairs and their registry-selected prompts, choices and hints sequentially. The baseline notes are in exercises/drafts/chapter-01-2026-10-18/lesson-notes.md. Existing reviews were consulted but not overwritten. This is a pedagogical review of the whole chapter and a full mathematical/bilingual self-check of the seven newly selected banks, not renewed certification of all other banks.

Source: the user-supplied 96-page Logique PDF, Bruno Teheux, BINFO-FCE 2026-2027. The newly attached copy has SHA-256 c31043cc12c7667ff0da50a246ce11013cc27acbeac323faaafa1dfea65cf329, matching the earlier source. All pages were read as extracted text; selected Boolean pages were also rendered for inspection. No source PDF, slide screenshots or copied artwork is included. Mathematical examples and finite data are developed with original explanatory prose, completed tables and original diagrams. Source proof prompts are not presented as supplied solutions.

## Source structure retained

| PDF part | Pages | Lessons | Added support |
| --- | --- | --- | --- |
| Classical propositional logic | 3-35 | L01-L08 | Plain readings, assignment tree, original completed p14 example, full Boolean law explanations, formula tree, p19 case proof, decoding the completeness theorem and p32-35 example |
| Naive set theory | 37-65 | L09-L15 | Concrete membership examples, number-family nesting, finite predicate table, quantified negation edge cases, interval endpoints, keep/omit subset table, Venn diagrams and Boolean/set correspondence |
| IT applications | 67-96 | L16-L20 | Bounded-domain explanation, enrollment matrix, source p71-81 dataset alongside the original second model, SQL trace, Python index row, necessary/sufficient countermodels |

Pages 1, 2, 36 and 66 are the title/section dividers, not missing teaching units. Repeated slide builds are consolidated. The programme now visibly groups lessons into these three parts. Stable L01-L20 identities, routes and source-page contracts remain intact. L10's earlier preview of membership/inclusion is explicitly labelled support; the p57 recall returns in L14. This avoids a prerequisite cycle or a disruptive renumbering. Additional explanations are placed before abstractions where possible; no new advanced prerequisite is imposed.

## Main findings and disposition

| ID | Priority | Location at base | Finding | Implemented response / remaining boundary |
| --- | --- | --- | --- | --- |
| C01 | Major | L04 Boolean-law catalogue, PDF 17-19 | Names and formulas do not teach use; only one distribution table | Explain all seven law families, both distributivities and reverse factoring; distinguish examples from proof; add annotated case argument and eight fresh exercises |
| C02 | Major | L15 operations/algebra | Second catalogue without a visual bridge | Three original Venn diagrams, logic/set correspondence and element-wise De Morgan argument |
| C03 | Major | L08, L09, L10, L16-L19 | Notation and assumptions arrive before enough concrete support | Local readings, finite models, input/output interpretation, alias/index explanations and visible grids; retain source order |
| C04 | Major | L20 text and E02 | Necessity is confused with guaranteed failure of sufficiency | Say sufficiency does not follow; show compatible systems with and without sufficiency; new E02 wording and feedback |
| C05 | Major | L12 E01 and L16 E05 feedback | 'Stronger' is unqualified on empty domains | Explain empty/nonempty distinction and retain the valid negation laws; correct further ambiguous French and numerical feedback |
| C06 | Major | L14 E03 feedback | Power-set elements described as categorically separate from original elements | Give A=empty-set counterexample to equality and explain shared-element possibility with A={empty set} |
| C07 | Major | L15 E02, L20 symbolic prompts | Dependence on an earlier question or unbound symbols | Restate the sets and domain/predicate conventions locally in new immutable banks |
| C08 | Major | L13/L15 selected banks | All correct displayed choices first | Rebalance seven corrected banks without relabelling stable option IDs |
| C09 | Major | L09-L18 and L20 availability prose | Practice described as a future implementation | Correct both languages to current sign-in-dependent availability; no hosted acceptance claim |
| C10 | Major | Several banks across chapter | Solved examples recur as independent practice | Eight fresh Boolean items are added. Rehearsal repetition in other banks remains a separate follow-up; it is not recertified as transfer evidence |
| C11 | Minor | L03 counting, L07 reading | Assignments/binary enumeration and 'iff' need plain readings | Define assignment, distinct free inputs, doubling rows and 'si et seulement si / if and only if' |
| C12 | Minor | L01 recap, L06 table paragraph, L10 numeric representation | Short recap overgeneralizations survive earlier corrections | Restore precise/classical context, 'not equivalent in general' and qualified floating-point explanation |
| C13 | Minor | L11 geography question and L09 later notation | Some practice still assumes outside facts or later symbols | Lesson support improved; a full fresh exercise-bank redesign for L09/L10/L11/L17/L18 remains explicit follow-up |
| C14 | Minor | Lesson durations | Short metadata estimates no longer match expanded reading | Increase estimates for expanded lessons; these are editorial estimates, not measured learner times |

## Mathematical and bilingual checks

All new lesson passages were authored in French and English together. The paired heading depths/order and mathematical strings were checked. Readings retain inclusive OR, classical two-valued logic, zero in natural numbers, French interval brackets and a named universe for complements. The new SVG labels are mathematical; each embedding has a complete localized alt description and adjacent explanation. Hatching/open-versus-filled endpoints avoids relying on colour alone. Visual checks and keyboard/no-JavaScript checks are recorded below; they do not certify screen-reader behavior.

The PDF's p48 strict-age example remains explicitly flagged in L11: taking the universally quantified person equal to the existential witness refutes strict self-age comparison. The p19/p25/p31 proof prompts remain distinct from application-authored explanations. L17/L18 retain the duplicate-free, no-missing-value SQL teaching model; L19 retains its finite comparable-real/no-NaN scope and empty-list handling from the preceding correction.

For unchanged selected banks, existing mathematical/translation statuses and their explicit exceptions are retained. This document renews only the changed reading/prose evidence for them; their selected bank bytes are unchanged. Seven new selected banks receive the full author self-check described below: L04 v4 and L12/L13/L14/L15/L16/L20 v3. Six older bank exceptions consequently become documented author self-checks. No independent reviewer or approval is invented.

### Complete selected-bank key review

Each row lists E01-E06 in order. Options and bilingual feedback were read against each stem; counterexamples below explain rejected alternatives. Existing stable item IDs remain practice-only for learners who have seen them. New L04 E22-E29 have never-used IDs; E07-E21 are already reserved by an earlier unpublished draft and are not duplicated here.

| Bank | Keys | Definition/derivation and separate check |
| --- | --- | --- |
| L04 v4, original six | b, b, table, a, c, c | Equivalence requires every row; De Morgan NOT-AND gives OR of negations; nested table true only at 000/001/010; X OR NOT X is tautological; AND of opposites cannot equal true; 101 distinguishes the E06 sides. Exhaustive tables corroborate law/case reasoning. The linked helper compares every E03 stored cell. |
| L12 v3 | a, a, a, d, a, a | Negate all by a failing witness and exists by no witnesses; library needs at least one unavailable book; four alone fails x<4 on {1,2,3,4}; no minor means every member at least eighteen; numeric negation is an existing natural at most two. Finite mixed predicates and empty domains distinguish wrong quantifier patterns. Symbolic negation covers arbitrary domains; finite enumeration is only a cross-check. |
| L13 v3 | a, a, a, a, a, a | Finite filters yield {2,4,6}, primes {2,3,5,7}, open interval above two, zero with k=0, empty finite filter, and distinct natural/real sets witnessed by 5/2. Direct enumeration and membership/inequality definitions agree; zero/one are not prime and -2 is outside naturals. |
| L14 v3 | a, a, a, b, a, a | Enumerate four subsets of {1,2}; {1,3} is a subset of {1,2,3}; empty set belongs to every power set; binary keep/omit yields sixteen for four elements; {1} is a power-set element; empty set has one subset. General subset argument, explicit enumeration and empty-set checks agree. |
| L15 v3 | a, a, a, a, a, a | Intersection {3,5}, union {1,3,4,5,6,7}, ambient complement {5,6,7,8}, complement of union is intersection of complements, complements depend on ambient set, membership in union is inclusive OR. Element enumeration and arbitrary-element Boolean arguments agree. Competing De Morgan expressions differ for disjoint singleton sets in a three-element universe. |
| L16 v3 | a, a, a, b, a, a | Universal restriction uses implication, existential restriction uses AND; the mnemonic is scoped to these expansions; outside-X witness four makes the wrong existential implication true; negation swaps quantifier and keeps X; empty bounded universal is true. Direct restricted traversal and unrestricted expansion agree for every subset/predicate of a finite universe, including empty X. Symbolic definitions give the general argument. |
| L20 v3 | a, a, b, a, a, a | Only-permitted implies manager; that requirement leaves sufficiency undecided; ben/r1 violates the model rule; every manager can all is universal conditional; its negation is one manager missing at least one permission; one inaccessible request is exists-request/all-users-NOT. Implication/quantifier rules and permission matrices with both sufficient and insufficient managers agree. Empty sets do not break the translations. |

L12 E06's old feedback incorrectly discussed strict less-than although the offered alternative uses less-than-or-equal; its new feedback now addresses the actual option. L12 E02 and L20 E05/E06 feedback now use unambiguous French negation. Candidate designs retained precise statements and countermodels instead of simply shuffling labels around an ambiguous stem.

### Eight added Boolean items

| Item | Level | Objective | Separate algebraic/case argument |
| --- | --- | --- | --- |
| E22 | easy | O03 | Commute the two whole OR operands; preserve the negation on A |
| E23 | easy | O03 | AND of the same three literals regardless of grouping |
| E24 | easy | O03 | Two outer negations cancel; the inner negation stays on B |
| E25 | easy | O04 | X AND NOT X is false; compare with X OR NOT X and contingent X |
| E26 | medium | O03 | Split on A: NOT A true makes both sides true, otherwise both require B AND C |
| E27 | medium | O03 | Factor common A using OR-over-AND in reverse; verify A true/false cases |
| E28 | medium | O03 | Negate outer AND, then inner OR, then cancel NOT NOT C |
| E29 | medium | O05 | A false and C true exposes an unguarded C branch; only the offered 001 row differs |

The full bank still covers all six objectives and retains its truth-table task. The eight-item addition is deliberately scoped to the identified teaching gap; the user did not request a difficulty quota or a complete new bank. Hard labels are not forced onto direct law application. Compare candidates: a bigger law catalogue was rejected as repeating the problem; new lesson IDs were rejected as breaking source/navigation continuity; a developed existing L04 with fresh targeted practice was chosen. At item level, simple operand swaps, wrong connector substitutions, lost negations and dropped branches are the competing misconceptions; actual falsifying assignments appear in per-option feedback. These are editorial levels, not learner-calibrated difficulty.

Automatic verification: one of one stored truth-table keys matched, zero failed, zero unchecked; twenty-three supplemental equivalence/classification/value checks passed. Supplemental checks do not compare choice keys. The additional content tests parse each actual new formula option and check uniqueness of the keyed meaning against separately written Boolean functions on all eight assignments; E29 evaluates every offered row. Choice semantics and translation remain author checks. The earlier manifest's TeX syntax was rejected by the helper, then converted to its documented operator syntax; no mathematical check failure was suppressed.

## Release and history

No existing exercises/Lxx/vN.json was edited. New complete candidate copies live under exercises/drafts/chapter-01-2026-10-18/ and the same checked bytes become new immutable archives. The registry deliberately selects those versions and renews all changed French/English reading fingerprints and French-source translation fingerprints only after this scoped self-check. Earlier bank versions and previous draft banks remain untouched. This does not regrade old attempts or reset stable-item mastery eligibility. All existing practice withdrawals would be preserved; none is present for Chapter 1 at the base.

## Validation and remaining review

Command results and browser inspection are recorded in exercises/drafts/chapter-01-2026-10-18/validation.md after execution. Required checks are pnpm check, pnpm test:e2e, draft validation for all seven banks, the linked Boolean helper, and the immutable archive gate against the PR base after committing. No hosted service/database changes or acceptance checks are included.

The maintainer still reviews the expanded reading, source fidelity and bilingual phrasing before merging. Follow-up work: fresh non-Boolean practice contexts, non-leaking hints throughout the untouched banks, fuller independent review of L09/L10/L11/L17/L18, and learner testing of pacing. The PR does not claim that adding prose proves beginner readiness.
