# Original sample content and review record

Status: design-sample self-check, not independently peer-reviewed or approved for learner publication. Date: 2026-10-14.

## Provenance and source boundary

All displayed lesson prose, exercise wording, feedback and worked derivation were authored for this proposal. Topic locators come from [the roadmap](../../ROADMAP.md): implication L05, PDF pp. 20–23; connectives pp. 6–12; number sets and membership/inclusion pp. 41–43 and 57. These are indirect locators, not a claim that the PDF was inspected. The selected raster screens do not all display these locators; implementation must add original-authorship and source/coverage metadata. The PDF must be inspected before approving course-aligned content. No source PDF or substantial course text is reproduced.

The page-48 warning repeats the known issue recorded in [the constitution](../../CONSTITUTION.md), not a new verification of that source. No quiz is based on that disputed example. Proof prompts on pages 19/25/31, ambient complements on 60–65, duplicate-free database teaching on 71–89 and the maximum task on page 94 are outside this sample's assessed scope; they remain publication review requirements.

## One exercise, one answer contract

| Field | Value |
| --- | --- |
| ID/version | `logic.implication.false-case.01`, version `1` |
| Objective | Recognise the unique falsifying assignment of material implication |
| Type/difficulty | Single-choice recognition; introductory |
| Domain | Independent assertions P and Q; each in {V,F}; classical material implication |
| Prerequisites | Assertion, truth value, reading a two-input truth table |
| FR prompt | Dans quel cas P ⇒ Q est-elle fausse ? |
| EN prompt | In which case is P ⇒ Q false? |
| Answer | Stable option ID `true-false` (option B) |
| Grading contract | Exactly one allowed option ID. Correct iff it equals `true-false`. Unknown/missing/multiple option values are invalid input, not mathematical answers. No free-text parsing. |
| Misconception tags | `false-antecedent`, `implication-as-conjunction`, `implication-as-biconditional`, `antecedent-only-evaluation` |
| Optional FR hint | Cherchez le cas où P est vraie mais Q ne l’est pas. |
| Optional EN hint | Look for the case where P is true but Q is not. |
| Coverage | Source-taught topic; original application-authored wording |
| Provenance | This design proposal; topic locator L05/pp. 20–23 from the roadmap; direct source review pending |

Hints/reveals/retries must affect independent-evidence eligibility. The public design source necessarily exposes the answer; this is learning content, not examination security. The raster concepts perform no grading or storage; this table specifies intended production behaviour only.

### All options and bilingual feedback

| Option and ID | Assignment | Result | FR feedback | EN feedback |
| --- | --- | --- | --- | --- |
| A / `both-true` | P=V, Q=V | Incorrect | P et Q sont vraies : l’implication est vraie. Ce cas ne la réfute pas. | P and Q are true: the implication is true. This case does not refute it. |
| B / `true-false` | P=V, Q=F | Correct | Oui : P est vraie et Q est fausse. C’est le seul cas où l’implication est fausse. | Yes: P is true and Q is false. This is the only case where the implication is false. |
| C / `false-true` | P=F, Q=V | Incorrect; shown in screens | P est fausse et Q est vraie : l’implication est vraie. La valeur de P seule ne suffit pas à juger l’implication. Vérifiez les deux assertions, puis la ligne correspondante. | P is false and Q is true: the implication is true. P's value alone does not determine the implication. Check both assertions, then the corresponding row. |
| D / `both-false` | P=F, Q=F | Incorrect | Les deux assertions sont fausses, mais l’implication est vraie. Ne la confondez pas avec une conjonction qui exige deux assertions vraies. | Both assertions are false, but the implication is true. Do not confuse it with a conjunction requiring two true assertions. |

Distractors model alternative misunderstandings: A may come from negating the whole expression or misreading the objective; C from treating a false antecedent as a false implication; D from conjunction-style reasoning. These are hypotheses for learner testing, not diagnoses. The screen deliberately says “peut-être / may have”. Multiple options can reflect the same misconception; do not infer a learner's reasoning from the option alone.

## Two mathematical checks

### Check 1: direct truth-table enumeration

Material implication P ⇒ Q has outputs V, F, V, V for inputs (V,V), (V,F), (F,V), (F,F), respectively. Thus exactly option B is correct. The submitted raster concept uses C and is incorrect. The French lesson, practice and feedback concepts share this table and answer. Matched English page concepts are not included in the selected set.

### Check 2: a different derivation

Using the definition “P implies Q” has the same truth conditions as “not P or Q”, its negation has the same truth conditions as “P and not Q”. That conjunction is true only when P is true and Q false. This independently derived route confirms the same assignment, but was performed within the same authoring session; it is not independent peer review.

Worked example `logic.implication.worked.01`: n belongs to ℕ={0,1,2,…}; fix n=7; P(n) means n≥5 and Q(n) means n is even. First check: 7≥5 is true, 7 even is false, hence P(7)⇒Q(7) false. Second check: write 7=2×3+1, which witnesses oddness; the same n witnesses failure of the universal statement “for every n∈ℕ, if n≥5 then n is even”. This example is original and is not assigned a fabricated exercise page.

## Translation and notation check

The earlier bilingual authored wording was self-checked for truth conditions, antecedent/consequent roles, necessity/sufficiency and retry eligibility. The current Signal raster set presents these pages in French only; that earlier wording review is not evidence of English Signal page layouts. FR “P est suffisante pour Q ; Q est nécessaire pour P” matches EN “P is sufficient for Q; Q is necessary for P”. Neither language asserts the converse. V/F notation is explicitly defined even in English; mathematical identity does not change with the presentation language.

Natural numbers include zero. The glossary interval `]0; 1]` remains in both languages and means real x with 0<x≤1. FR reading “de zéro exclu à un inclus” and EN “from zero excluded to one included” preserve endpoints. The reduced Signal glossary does not show ↔. The implementation must distinguish the biconditional connective from semantic equivalence between formulas' truth tables. Membership ∈ relates an element to a set; inclusion ⊆ relates a set to a set.

Proposed glossary identities: `logic.implication`, `logic.biconditional`, `sets.membership`, `sets.inclusion`, `numbers.naturals`, `intervals.half-open`. Membership and inclusion have separate entries and identities. The selected raster glossary does not label coverage per row: ℕ/interval prerequisite support and source-taught membership/inclusion must receive explicit coverage labels in implementation. No enrichment chapter is invented.

## Signal raster review

The selected lesson/feedback tables show exactly (V,V,V), (V,F,F), (F,V,V), (F,F,V). Practice remains unanswered; feedback selects C and correctly identifies its implication as true. The n=7 worked example and the interval readings preserve the checked sample meaning. The homepage caption was corrected to the sole falsifying case without changing the selected visual direction. Generated lettering remains a design reference: implementation must use real mathematical markup, review glyph fidelity and attach proper provenance.

The glossary shows five entries (⇒, ∈, ⊆, ℕ, ]0;1]); full bilingual lessons, all-option interaction feedback and source-discrepancy UI are not demonstrated in this raster set.

## Publication gates remaining

- Direct source inspection and notation/page mapping confirmation.
- Documented mathematical and bilingual approval; this authoring self-check is available to the maintainer but not a claim that the maintainer already approved it.
- Review every production option's explanatory feedback and six independent items for the first lesson; this proposal supplies only one assessed-item design and one worked example.
- Missing/stale required translations block publication. Meaning changes trigger translation review and a new exercise version after any attempts exist.
- Implement server grading, input validation, immutable exercise versions and idempotent owned attempt writes before any real practice.
