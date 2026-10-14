# Review rubric and note template

Contents: 1 Dimensions · 2 Known source items · 3 Severity · 4 Note template

## 1. Dimensions

Work through each; record at least one line per dimension, even if "no finding".

**A. Mathematical correctness**
- Every statement has a stated domain; no free variable without a universe.
- ℕ includes 0 in both languages.
- Biconditional connective (⇔) is not conflated with semantic equivalence (≡); likewise implication (⇒) vs logical consequence.
- Membership (∈) vs inclusion (⊆); empty set vs set containing the empty set.
- Converse vs contrapositive vs inverse; necessary vs sufficient (both directions of the reading).
- Quantifier order and negation (¬∀x ≡ ∃x¬; ¬∃x ≡ ∀x¬); bounded quantifiers (∀x∈A with ⇒, ∃x∈A with ∧).
- Complements always name their ambient set.
- Intervals use French notation (`]a, b[`) consistently.
- Databases as duplicate-free sets: flag the teaching-model vs SQL (duplicates, NULL) distinction when relevant.

**B. Source fidelity** — compare with the lesson's `sourcePages` (PDF page 1 = title page; repeated slide builds are consolidated into topics). Mark coverage as *source-taught*, *prerequisite support*, or *optional enrichment*. See section 2 for known defects.

**C. Pedagogy** — sequence understand → worked example → practise → feedback → revisit; each objective has a worked example and an item; hints are optional and non-leaking; feedback explains the mistake and the repair; tone never shames.

**D. Bilingual fidelity** — same structure and meaning; identical `$...$` strings; consistent glossary terms (antécédent/antecedent, conséquent/consequent, nécessaire/necessary, suffisante/sufficient, contre-exemple/counterexample, assertion/statement); natural phrasing, not word-for-word. Meaning changes need translation review. The automated check compares formulas only.

**E. Exercise quality** — one defensible key; distractors tied to named misconceptions; feedback on every option; correct option position varies; difficulty honest (`foundation` / `application`); prerequisites accurate; misconception tags reuse existing ones; provenance is original work with correct pages; no answer leaked by stem or hint.

**F. Accessibility** — plain-language reading of every formula; no colour-only signals; headings sensible; short paragraphs.

**G. Rights and honesty** — no copied slide text or artwork; no claims of implemented quizzes/grading/progress; verification described as self-check, not peer review.

## 2. Known source items (from `docs/CONSTITUTION.md` — re-read it; it may have grown)

- **p. 48** — existential/universal strict-age example is labelled true over humans. Self-comparison makes the formula false as written; excluding self removes that defect but does not prove a unique strictly oldest person exists. Flag before authoring any quiz on it.
- **pp. 19, 25, 31** — proof prompts, not completed proofs. Any authored solution is original work and must be labelled as such.
- **pp. 60–65** — complement relative to an ambient set; always name the set.
- **pp. 71–89** — database tables treated as duplicate-free sets; distinguish from SQL duplicates and NULL.
- **p. 94** — maximum exercise needs a finite, nonempty numeric domain; define edge cases, do not guess the intended answer.

When a source statement is ambiguous, apply tree-of-thoughts: list the plausible readings, give each reading's truth value, and report the ambiguity with the page number rather than choosing.

## 2b. Reading the sources

- The source PDF is `docs/Logique_01 (1).pdf` (untracked; quote the path because of the space and "(1)"). PDF page N is the Nth page of the file; page 1 is the title page. Use the `Read` tool with `pages` (max 20 per call) and read only the pages you need.
- Terminology authority: `src/data/glossary.json` (FR/EN names, readings, common confusions, source pages).
- Never copy substantial slide text into notes; quote a few words at most and cite the page.
- Course-wide questions (prerequisite graph, coverage gaps, stale claims) are in `course-review.md`, not here.

## 3. Severity

- **Blocking** — a mathematically false statement, wrong key, ambiguous key, or FR/EN divergence that changes meaning. Do not publish.
- **Major** — missing domain, misleading distractor feedback, objective without an item, rights concern, or a source discrepancy not flagged.
- **Minor** — wording, terminology consistency, tone, accessibility polish.
- **Note** — observation or enrichment idea, no action required.

## 4. Note template (modelled on `docs/content/L05_REVIEW.md`)

```markdown
# <Lxx> content review — <date>

Status: author self-check, not independent peer review.

## Scope and authorship
What was reviewed (files, versions, source pages). What was not.

## Findings
At most 15 rows (Blocking and Major first); one-line minor findings go in an appendix.

| # | Severity | Dimension | Location (file:line or item ID, PDF page) | Finding | Suggested repair |
| --- | --- | --- | --- | --- | --- |

## Mathematical self-check
For each item: key, Route A, Route B, agreement. Edge cases tested.

## Reasoning trace
Compact tree-of-thoughts blocks for ambiguous readings and design decisions (see `reasoning-protocols.md` §5).

## Bilingual self-check
Terminology table and any meaning divergences. State that formula equality is automated and prose was read manually.

## Validation commands
Exact commands run and their outcomes (do not paraphrase failures).

## Open decisions for maintainers
Items that need a human: second mathematical check, translation review, source-discrepancy handling, version bump.
```
