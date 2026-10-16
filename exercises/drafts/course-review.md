# Requested lesson review — 2026-10-16

Status: Codex author mathematical/bilingual self-check, not independent peer review or publication approval. Review-only PR: no lesson, published bank, release record, skill, test suite or application changes.

## Scope and evidence

Reviewed sequentially, starting L01, saving each note before proceeding: **L01, L02, L03, L05, L06, L07, L08, L09, L10, L11, L12, L13, L14, L15, L16, L17, L18, L19, L20**. L04 was not requested and is not reviewed/certified here; its Boolean-law exposition was consulted as prerequisite context only.

Pinned input revision: `c2238703e34986b623a151473d2f4f6568e3956a`. Exact SHA-256 hashes of all 38 lesson files and 19 registry-selected banks, review states, selected versions, item coverage and source-page inventory: exercises/drafts/review-evidence.json. L07 selects **v2**; every other requested bank selects v1. No fallback to archived v1 for L07. All 19 are served for practice; none is withdrawn at this revision. L05/L07 retain their recorded author/translation self-checks; the other 17 requested banks retain explicit unreviewed exceptions. This report does not update those records.

Both languages and every prompt, hint, option, feedback, explanation and key were read: **19 lessons, 38 files, 114 items; 9 truth-table keys and 105 choice keys**. Source PDF: supplied 96-page “Mathématiques Générales — Logique et ensembles,” Bruno Teheux. All requested lesson source pages were read as extracted text; selected pages **31, 48, 60, 64, 65, 71, 89, 94** were rendered and visually inspected. Extra text pages 2/19/25/36/66 establish section breaks/proof context. Exact PDF hash is in the manifest. Source text/images are not redistributed. This is not a visual audit of every PDF page, a copyright clearance, a human translation review or a hosted acceptance check.

Publication-base comparison: main advanced to `d270b67eb974bacd3d5f9f52315458f6a6c27964` through acceptance-documentation-only PRs #36/#39. All 57 reviewed content inputs, release registry and skill are unchanged there; the review remains pinned to the stated revision. Existing user-reported hosted evidence is not independently validated by this content review.

## Most important findings

Locations below are pinned project paths plus item IDs/section names; per-lesson notes give counterexamples, competing readings, keyed outcomes and separate repair proposals. Severity follows the skill rubric: blocking for false core mathematical exposition/ambiguous or wrong graded keys; major for missing assumptions, misleading feedback and assessment gaps.

| ID | Severity | Lessons / location | Concrete evidence and impact | Separate repair |
| --- | --- | --- | --- | --- |
| R01 | Blocking ambiguity | exercises/L03/v1.json, E05 FR | “Une seule ligne est fausse” selects row 01 if it asks where the formula is false, but row 11 (key d) if it asks which written entry is wrong. English specifies wrong. | New L03 version explicitly asks for the incorrect written entry; renew bilingual review. |
| R02 | Blocking key boundary | exercises/L19/v1.json, E03; both lessons' count sentence | n=0 is admitted, but keyed n−1 adjacent pairs gives −1 instead of zero. No offered count/range pair handles that case correctly. | New L19 version uses max(n−1,0), or states n≥1 for this question; repair prose separately with renewed evidence. |
| R03 | Blocking exposition | content/lessons/L06/fr.md and en.md, everyday-language paragraph | Converse B⇒A is called stronger than A⇒B. Assignments 01/10 show neither entails the other. | Say different direction, or explicitly require both directions for strengthening. |
| R04 | Blocking exposition | content/lessons/L01/fr.md and en.md, context paragraph | Fixing speaker/place/time is claimed to give a sentence one truth value; a fixed-context question, liar or unspecified vague threshold still fails. | Scope to precise non-paradoxical declarative statements with meaning/context fixed. |
| R05 | Major explanatory generalization | exercises/L03/v1.json, E02 explanation | Bare-letter-only atomic test excludes the already introduced constant top; the offered C key is correct, but the general rule overreaches. | Scope to offered/designated atoms, handle constants explicitly in a new version. |
| R06 | Major missing boundary | L08 lessons, E05; source p35 | OR/NOT completeness lacks n≥1. At n=0, no variable exists for the displayed contradiction fallback unless constants are admitted. | State positive arity or supply a constant/closed-formula convention. |
| R07 | Major missing assumption | L05 lesson card example and E05 | No-converse card answer presumes blue excludes red. Multicolour cards leave it underdetermined. | Specify mutually exclusive uniform colours; preserve the intended key with new-version wording. |
| R08 | Major feedback error | L12 E01 b; L16 E05 b; L19 E02 b | On an empty quantified domain, ∀¬P is true while ¬∀P is false; the former is not generally stronger. L19 lengths 0/1 reproduce this failure. | Qualify nonempty comparison domains; keep the valid negation laws and vacuous-truth teaching. |
| R09 | Major feedback error | L14 E03 d | P(A) need not contain objects disjoint from A: with A={∅}, ∅ belongs to both. The equality distractor remains false as a universal claim. | Explain by a valid counterexample (e.g. A=∅), not categorical separation. |
| R10 | Major entailment ambiguity | L20 lessons and E02; source p96 | “Only” entails necessity but does not entail failure of sufficiency. A model where exactly all managers can approve everything satisfies both directions. | Say sufficiency is not asserted/does not follow, rather than literally false. |
| R11 | Major standalone prompt | L15 E02; also L17/L20 symbol-only prompts | E02 refers to “same sets” without including E01's data. A directly addressed item lacks those bindings. Other notation-only prompts assume lesson-bound domains. | Restate local sets/predicates/domains in each new-version prompt. |
| R12 | Major assessment validity | L13/L15/L19 banks | All six keys in each bank are a: first-option selection gives full marks. L07/L08 similarly put every choice answer at a, though tables remain. | Rebalance positions in new immutable banks and evaluate response-pattern shortcuts. |
| R13 | Major independent-evidence gap | Especially L17 E05/E06, L18 E05, L20 E03–E06 | Independent practice repeats the exact visible data, queries, evaluations or translated answers. Earlier lessons have similar repeats noted individually. | Use fresh data/structures or describe rehearsal accurately; don't count visible solutions as transfer evidence. |
| R14 | Major domain/objective gap | L19 lessons/E01/E02/E04/E05 | Arbitrary Python numbers include complex/NaN, invalidating comparison/negation assumptions; formulas omit index bounds; promised duplicate/maximum Python translations are absent. E05's alternative formulas are also always true on the stated finite nonempty total-order domain, so truth-value checks cannot distinguish their intended structure. | Require total-order comparable values, explicit index domains, actual code examples, and a structural maximality task. |
| R15 | Major prerequisite/meaning gap | L09/L10/L12/L16 and descendants | Formal NOT, ⇒ and ≡ appear without their teaching lessons in the prerequisite ancestry; ≡ widens from propositional truth tables to quantified statements without explicit meaning. See prerequisite audit. | Add appropriate earlier edges or local readings/definitions; do not create a L10↔L11 cycle. |

## Lesson index and automatic key coverage

Each path is under exercises/drafts/; all choice IDs are listed individually in review-evidence.json. “Matched” means stored truth-table cells match supplied, manually transcribed formulas, not that prose or a whole bank is automatically approved.

| Lesson | Note | Table keys matched | Choice keys outside helper |
| --- | --- | --- | --- |
| L01 v1 | L01/lesson-review.md | Not applicable | 6 |
| L02 v1 | L02/lesson-review.md | E04 | 5 |
| L03 v1 | L03/lesson-review.md | E03, E06 | 4 |
| L05 v1 | L05/lesson-review.md | E02 | 5 |
| L06 v1 | L06/lesson-review.md | E04 | 5 |
| L07 v2 | L07/lesson-review.md | E02, E05 | 4 |
| L08 v1 | L08/lesson-review.md | E02, E06 | 4 |
| L09 v1 | L09/lesson-review.md | Not applicable | 6 |
| L10 v1 | L10/lesson-review.md | Not applicable | 6 |
| L11 v1 | L11/lesson-review.md | Not applicable | 6 |
| L12 v1 | L12/lesson-review.md | Not applicable | 6 |
| L13 v1 | L13/lesson-review.md | Not applicable | 6 |
| L14 v1 | L14/lesson-review.md | Not applicable | 6 |
| L15 v1 | L15/lesson-review.md | Not applicable | 6 |
| L16 v1 | L16/lesson-review.md | Not applicable | 6 |
| L17 v1 | L17/lesson-review.md | Not applicable | 6 |
| L18 v1 | L18/lesson-review.md | Not applicable | 6 |
| L19 v1 | L19/lesson-review.md | Not applicable | 6 |
| L20 v1 | L20/lesson-review.md | Not applicable | 6 |

The six linked-helper runs exited 0: **9 matched / 0 failed / 0 unchecked truth-table items**. Exact commands, supplemental checks and outputs are in each relevant note, answer-checks.json and verification-output.txt. No empty manifests were used for choice-only banks. Equivalence checks enumerate only supplied finite formulas; the L03 value check tests one assignment. None of the **105 single-choice keys** is covered by this helper. Those received author semantic review with the ambiguities and assumptions retained above; “reviewed” does not mean “passed without findings.”

## Executed checks and their actual scope

Command outcomes are recorded in exercises/drafts/validation-results.txt. Reproduce finding witnesses with `python exercises/drafts/review-checks.py`; its actual output is exercises/drafts/review-checks-output.txt. The script confirms specific countermodels, empty/short-list Python behaviour and the two exact L18 SQL queries. It asserts the counterexamples successfully: that does **not** mean the reported lesson claims passed.

- `node --test tests/content/*.test.mjs`: 108 passed, 0 failed. These cover all 20 lessons structurally/with selected mathematical models, including out-of-scope L04; this does not extend our semantic review scope.
- Pilot tests partly inspect text/keys (e.g. L01 rainfall/context and L03 atomic/row wording); no automated natural-language uniqueness check exists. An asserted literal answer letter is not a semantic second derivation.
- L05 tests sample naturals 0–12. That is a **Bounded sanity check** for unbounded ℕ; solving 5<n≤10 gives the actual counterexample range 6…10. Implication table enumeration is **Exhaustive finite checking** for its two Boolean inputs.
- Extended logic tests enumerate truth tables, all 16×16 pairs of two-variable Boolean functions for L07 E04, and all 16/256 functions for L08 at two/three variables. This supports those finite domains; L08's positive-arity minterm construction is a **General mathematical argument**, not a finite-test extrapolation.
- Sets tests enumerate particular sets/subsets and use witness models for number inclusions. Empty-set/inclusion identities still require their general definition arguments. Tests do not inspect all explanatory feedback, including the L14 categorical error.
- Application tests enumerate restricted predicate/relation models and short integer lists; SQL is mostly modelled in JavaScript. We additionally executed the actual two L18 queries in SQLite. The suite uses max(n−1,0) internally, yet only checks E03's keyed letter/count at n=3: it misses L19's unqualified n=0 claim. It also confirms both L19 maximum formulations true on finite nonempty sample lists, not unique semantic expressiveness.
- **Counterexample search** here means a found valid witness (e.g. empty domain, NaN, converse assignments) refutes a claim. Failing to find a witness in samples would not prove it. General laws are justified separately in the lesson notes; these are author arguments, not machine-checked proofs.

No product/browser/assistive-technology, live PostgreSQL ownership, hosted deployment or learner calibration tests were run for this documentation-only change. Full application pnpm check is a repository gate, not mathematical peer review. No new model behavioural evaluations were run; skill fixture tests, if included in pnpm check, are not model-evaluation results.

## Prerequisite, progression and convention audit

Map output: exercises/drafts/course-map-output.txt. Whole map: 20 lessons/246 minutes; requested subset: 19/232 minutes. No declared-ID forward edge, FR/EN ID mismatch or item/frontmatter prerequisite mismatch was found (L01's free-text prerequisite is translated). The M3 pilot L01/L02/L03/L05 is closed under declared lesson dependencies; outside arithmetic/language support still needs to be explicit. Six objectives in an 8-minute L14 lesson leave little time for power-set enrichment; the 14-minute SQL/Python lessons also need novice syntax support. Minutes are author estimates, not measured learner timings.

| Lesson(s) | Used notation/result and first teaching | Judgment / repair |
| --- | --- | --- |
| L01 | Simple reading, evenness/primality of 2/7/10; elementary arithmetic is outside course | Realistic entry support but make arithmetic expectation explicit; number reference is optional support, not a prerequisite proof. |
| L02/L03/L05/L06 | NOT/AND/OR/constants in L02; table counting L03; ⇒/negation L05; converse L06 | Declared ancestry provides the formal operations. L03's constant generalization remains a separate finding. |
| L07/L08/L15 | Boolean laws and ≡ first taught L04 | L04 is correctly declared (directly or via ancestry), despite omitted review scope. Those lessons cannot be certified independent of unreviewed prerequisite quality. |
| L09 | Formal Boolean negation in v=¬v first taught L02 | Only L01 declared. Add L02 or define the two-value operation locally; membership/nonmembership is read in the text itself. |
| L10 | Inclusion uses ⇒ (L05) and ∀ (L11, later) | Current ancestry L09/L01 does not supply implication. Plain-language inclusion helps; add L05 support and read ∀ locally, avoiding a cyclic prerequisite on L11. |
| L11 | Predicates/quantifiers first taught here; real inequality/interval notation used | Domains/witnesses and the interval are read in words; algebra/order fluency remains external prerequisite support. |
| L12 | ¬ from L02 and ≡ from L04; quantified equivalence extends propositional definition | Neither formal lesson is an ancestor. Add support and define equivalent quantified statements as agreeing for all interpretations over the stated domains. |
| L13/L14 | Comprehension/power set taught locally; primality, intervals, powers | Domains and evenness/zero explicit; prime definition is in E02 hint but should be available before graded work. Counting is labelled enrichment, correctly outside source scope. |
| L16 | ⇒ truth/vacuity from L05; ∧ from L02; equivalence of quantified claims | Declared L11/L12 ancestry does not supply L05. Add that edge or self-contained implication support, and make ambient universe/predicate domain explicit. |
| L17/L18 | Product/relation and SELECT/WHERE/EXISTS taught locally | Main dependency chain is adequate after L16 repair. Explain projection/set-model qualification; state E/C/I in standalone translation items. |
| L19 | all/any, generators, range, zero indexing; arithmetic and total order | Indexing is introduced, but Python familiarity/total-order values are undeclared external needs. Add concrete duplicate/maximum code if objectives retain that promise. |
| L20 | ⇒ from L05; bounded/nested quantifiers from L16 | Declared ancestry supplies formal ingredients; unbound prompt variables and permission/action terminology need local clarification. |

Glossary terms were compared: assertion/statement, implication, converse/contrapositive, necessary/sufficient, counterexample, membership/inclusion, quantifier and bounded quantifier. Course ℕ includes zero and both languages preserve French intervals. L07 correctly separates ⇔ and ≡; its v2 E04 repair is present and is **not** re-reported as a current wrong key. L12/L16/L18 extend ≡ beyond truth tables without explicitly giving the wider interpretation-level meaning; the glossary's French “tous ne...” wording also echoes scope ambiguity, but glossary edits are outside this PR. Domain (quantification), ambient set (relative complement) and universe (expanded bounded quantifier) should be related explicitly without implying they must be equal or strictly different.

## Source coverage and known discrepancies

The whole map covers 3–35, 37–65 and 67–96, without overlaps. Extra text inspection shows uncovered p2/p36/p66 are section dividers, not omitted mathematical topics; p1 is the title. Requested lessons omit L04 pp15–19 deliberately. Repeated builds elsewhere are consolidated, not missing objectives. Competing interpretation “missing content” was rejected for those dividers because their actual text contains section headings only.

- p48: strict-age existential/universal claim is false at self-comparison. L11 explicitly flags and avoids it. Visual confirmation obtained. Excluding self still would not prove a strictly oldest person exists.
- pp19/25/31: proof prompts, not source-supplied completed proofs. Text checked p19/p25, text and visual p31. Project worked arguments are original support; L04's correctness was not reviewed here.
- pp60–65: ambient complement superscripts were visually confirmed on pp60/64/65, avoiding extraction ambiguity. L15 keeps named ambient sets; broader set difference versus the course's subset convention is a minor wording distinction, not a fabricated source error.
- pp71–89: text plus visual p71/p89 confirms duplicate-free toy relations and the source SQL results. L17/L18 use different original data, with matching recalculated outcomes, and already distinguish duplicates/nulls from their model.
- p94: visually confirmed an open exercise only, not a solution. L19 calls its duplicate/maximum translations original and handles empty maximum false, but needs the count/order/expressiveness qualifications above. Finite nonempty numeric is insufficient for arbitrary Python numeric types without a total-order assumption.

External premises consulted 2026-10-16: official Arlon municipal page https://www.arlon.be/loisirs/arlon-en-images (Belgian address), Wiltz municipal https://www.wiltz.lu/fr/contact and https://www.wiltz.lu/fr/economie-locale/commerces-services/commerces-et-entreprises-locales (local Luxembourg postal services), Esch https://administration.esch.lu/histoire-de-ville-desch/ (Luxembourg town); PostgreSQL https://www.postgresql.org/docs/17/functions-subquery.html (EXISTS and ALL comparisons); Python https://docs.python.org/3/library/functions.html and https://docs.python.org/3.11/reference/expressions.html (empty all/any and numeric comparison). Geography is an external premise for L11 E06, not a mathematical theorem. No external prose copied into the PR.

## Appendix: minor findings and spread

- Both lesson endings usually describe practice as future work; L05 already has current availability wording. Proposed later bilingual replacement: FR “La pratique interactive nécessite une connexion ; son ouverture dépend de la version et du statut de publication de cette leçon.” EN “Interactive practice requires sign-in; availability depends on this lesson's selected version and release status.” This does not claim hosted readiness.
- E03/E04 natural-language hints sometimes directly identify the correct option; individual notes give exact cases. Retain deliberate optional hints but don't count hinted answers as fresh mastery evidence.
- French “tous ne...” constructions in L12/L18/L20 need unambiguous none/not-all wording; English is clearer. Formula equality alone cannot detect that problem.
- L06 “never ... in general” risks implying no particular converse can agree; use “not equivalent in general.” L10's blanket approximate-computer-real claim should distinguish floating point from exact symbolic representations.
- L08's necessity-of-both-connectives heading omits the NOT-alone argument; L07's E05 conclusion is requested but only table cells are automatically graded. Clarify what is assessed.
- Stored foundation/application counts, option-position counts and 152 distinct existing misconception tags are in the manifest. Sparse reuse of many tags is not itself a defect, but lessons are dominated by choices (105/114) and some “application” work is visibly rehearsed. Easy/medium/hard here are editorial demand judgments relative to taught support, not new product labels; no empirically calibrated hard transfer is established.
- Text-level headings/readings appear usable and no colour-only meaning was observed. Rendered UI, keyboard focus, screen-reader announcements, mobile overflow and actual MathML remain unverified.

## Maintainer decisions and separate correction sequence

1. Confirm the blocking L03 wording and L19 empty-list boundary, then author **new unused immutable bank versions** for those lessons in separate correction PRs. Do not rewrite v1, refresh hashes as a bypass, reinterpret old grades or count already-seen IDs as fresh mastery evidence.
2. Repair blocking L01/L06 exposition in separate reviewed bilingual content PRs, with renewed fingerprints/evidence as required. Bank repairs for feedback/domains/assessment each get their own appropriate new version and review evidence.
3. Resolve whether L08 permits arity zero/constants, how colour exclusivity is declared, and whether L20 asks about entailment or actual sufficiency. Retain competing readings until wording settles them.
4. Repair prerequisite/local-reading gaps and provide fresh transfer tasks; do not promote all reviewed banks wholesale. Choose a coherent correction group per PR, preserve history, and rerun applicable mathematical/bilingual and immutable-bank checks against its actual base.
5. Obtain a human mathematical second check and human FR/EN review of changed meanings. Hosted acceptance, independent review, learner difficulty and release readiness remain separate outstanding evidence.

This PR records findings and reproducible scope only. No corrections or release promotion are bundled.
