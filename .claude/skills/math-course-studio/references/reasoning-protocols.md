# Mathematical verification and design decisions

Contents: 1 Mathematical verification · 2 Candidate comparison · 3 Scoring grid · 4 Different-check recipes · 5 Decision record

## 1. Mathematical verification

Purpose: find wrong answer keys and hidden assumptions using checkable evidence. This process does not guarantee correctness.

For each claim you will publish or accept:

1. **Domain** — name the universe/ambient set and whether ℕ includes 0 (it does in this course).
2. **Definition** — quote the definition you apply (truth table of ⇒, definition of ⊆, quantifier semantics).
3. **Check** — give a concise derivation or reproducible calculation covering the relevant rows/elements; do not request a private reasoning transcript.
4. **Conclude** — one sentence, with the edge cases that were checked (empty set, vacuous truth, zero, equal elements).
5. **Cross-check** — a *different* route (section 4). If the routes disagree, the claim is wrong or the statement is ambiguous; stop and resolve before continuing.

A repeated computation is not a different check. A script can catch arithmetic slips, but its formula and assumptions still need review. Different routes by one model are author self-checks, not independent peer review.

### Bundled helper for propositional items

`scripts/logic-check.mjs <bank.json> <checks.json>` enumerates finite Boolean assignments with its own parser (no `eval`). First run the draft/schema validator separately. `checks.json` must be a non-empty array of checks:

```json
[
  { "id": "L03-E03", "kind": "table", "formula": "(A ∨ B) ∧ ¬C" },
  { "kind": "equivalent", "left": "A => B", "right": "!B => !A", "expected": true },
  { "kind": "classify", "formula": "A | !A", "expected": "tautology" },
  { "kind": "value", "formula": "A => B", "assignment": { "A": true, "B": false }, "expected": false }
]
```

- Only a linked `table` entry compares an item's stored `answer` with the supplied formula. Include one for **every** truth-table item (variables from the item's `variables`, default `A`, `B`). Rows must cover every labelled Boolean assignment exactly once with Boolean key values. Repeated checks do not inflate item coverage; any failed comparison still fails the run.
- `equivalent`, `classify` and `value` are **supplemental** checks. Their `expected` values come from the manifest, not the bank. Even an attached exercise ID does not make them answer-key verification. Equivalence/classification enumerate the supplied formulas’ finite Boolean domains; a `value` check tests **only its one supplied assignment**, not the whole formula.
- Output lists matched, failed and unchecked truth-table IDs, single-choice IDs outside automatic verification, and supplemental outcomes. Empty/malformed manifests, failed checks and any omitted truth-table item exit 1; missing CLI arguments exit 2. A bank with no truth tables can pass supplemental checks (exit 0), explicitly stating that no stored keys were automatically verified.
- A successful fully covered run means only that every truth-table key matches its supplied formula. It does not validate the full bank schema, select the right formula, prove uniqueness of choice answers, check prose/translation, or approve publication. Record these remaining review obligations, including when a helper cannot run.
- Syntax: variables, `true`/`false`, `! & | ^ => <=>` and parentheses, or `¬ ∧ ∨ ⊕ ⇒ ⇔`. Tightest first: `!`, `&`, `^`, `|`, `=>` (right-associative), `<=>`.
- It verifies keys only for propositional logic. It does not read the prompt, so the formula you write in `checks.json` must be the one the prompt shows; re-read the stem against it.

### Sets, numbers, quantifiers

No bundled key checker covers these free-form claims. Use a concise symbolic argument where a statement concerns an arbitrary or infinite domain; small enumerations alone do not prove it. Optional throwaway scripts go into `private/` (gitignored); delete them after recording reproducible inputs/results. Include negation (`∀` becomes `∃¬`) and empty-domain cases.

Label each verification with its actual scope:

| Scope | What it establishes | Limit |
| --- | --- | --- |
| Exhaustive finite checking | Every element/assignment in an explicitly finite domain satisfies the tested predicate. | Must actually cover the whole stated domain and correct predicate. |
| Counterexample search | A found valid witness refutes a universal claim. | No witness found in a bounded search does not establish the universal claim. |
| Bounded sanity check | Tested examples agree, such as naturals 0–12. | Cannot prove a claim over all natural numbers or another unbounded domain. |
| General mathematical argument | A concise derivation covers an arbitrary element under stated assumptions. | Its assumptions and each implication still need mathematical review; do not claim an automated proof checker. |

For example, enumerating naturals through 12 supports a sanity check for an unbounded inequality. Solve its bounds symbolically to justify the general answer. Enumerating a declared finite set 0–12 is exhaustive only for that finite-domain task. Report source uncertainty, contradictory checks or missing coverage as unresolved rather than forcing agreement.

## 2. Candidate comparison (design and review)

Purpose: avoid settling for the first idea.

At each decision point:

1. **Branch** — write 2–3 genuinely different candidates (not paraphrases).
2. **Score** each on the grid below; one line of justification per low score.
3. **Prune** — drop candidates that fail a *gate* (correctness, domain, unambiguity), then keep the best of the rest. If two tie, prefer the one that targets a misconception no other item in the bank targets.
4. **Descend** — continue from the survivor to the next decision.

Decision points:

| Mode | Level | Branch over |
| --- | --- | --- |
| generate | 1 | Which misconception the item targets (top 3 for the objective) |
| generate | 2 | Stem: abstract formula, concrete context, or counterexample hunt |
| generate | 3 | Distractor set: which plausible errors become options |
| review | 1 | Competing readings of an ambiguous source statement (state each, with its truth value) |
| review | 2 | Severity of a finding (blocking / major / minor) given reader impact |

Never silently choose between readings of an ambiguous source statement: report the ambiguity with page reference.

## 3. Scoring grid (0–2 each)

Gates (a 0 eliminates the candidate):

- **Correct** — key verified by two derivations.
- **Domain stated** — no free variable without a universe.
- **Unambiguous** — exactly one defensible key.

Quality (sum, higher is better):

- **Misconception value** — the item discriminates a real, common error.
- **Distractor plausibility** — each wrong option is something a student would actually pick; none is eliminable by form alone (length, "always/never").
- **Objective alignment** — tests the stated objective, not a prerequisite.
- **Difficulty honesty** — use bank-design section 1b: easy is scaffolded recognition/application (`foundation`); medium combines taught ideas and hard transfers them (`application` for both). Record prerequisites and a rationale in notes; length alone does not establish difficulty.
- **FR/EN parity** — same meaning, same notation, natural phrasing in both.
- **Accessibility** — a plain-language reading exists; no colour or layout dependence.

## 4. Second-derivation recipes

| Topic | Route A | Route B |
| --- | --- | --- |
| Propositional equivalence | Full truth table | Algebraic rewrite (De Morgan, A ⇒ B ≡ ¬A ∨ B), or check the negation is unsatisfiable |
| Implication / counterexample | Enumerate assignments | Negation: A ∧ ¬B is satisfiable exactly where the implication fails |
| Necessary / sufficient | Test A ⇒ B and B ⇒ A separately with a witness for the failing direction | Contrapositive form |
| Sets | Element-wise membership for a concrete example | Symbolic identity (distributivity, De Morgan for sets) or cardinality count |
| Power set / product counts | Explicit enumeration for n = 0, 1, 2, 3 | Formula (2ⁿ, |A|·|B|) |
| Quantifiers | Finite model: evaluate on a small explicit domain | Negation rule: ¬∀ ≡ ∃¬ and ¬∃ ≡ ∀¬; test edge cases (empty domain, self-comparison) |
| Numeric / interval | Test candidate values including boundaries | Solve the inequality symbolically; check open/closed bracket direction (`]a, b[`) |

Edge cases to test on purpose: empty set, empty domain, zero, equal elements, boundary values, vacuous truth.

## 5. Decision record for review and generation notes

Keep it compact; record decisions and concise evidence, not private scratch work. Generate mode records these in `generation-notes.md`; review modes in the review note.

```
Decision: L07-O03 distractor set
Branches: (A) swap ∧/∨  (B) drop negation  (C) wrong quantifier order
Scores: A 9, B 7, C 8   Gate failures: none
Pruned: B — duplicates L07-E02's misconception
Chosen: A + C
Check 1 (scope + input/result): …    Check 2 (scope + concise argument): …
Coverage: matched/failed/unchecked IDs; supplemental checks; remaining prose/translation review
```

State at the end: "Author self-check with a different derivation; not independent peer review."
