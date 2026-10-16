# Reasoning protocols: chain of thought and tree of thoughts

Contents: 1 Chain of thought · 2 Tree of thoughts · 3 Scoring grid · 4 Second-derivation recipes · 5 Trace format

## 1. Chain of thought (verification)

Purpose: no wrong answer key, no hidden assumption.

For each claim you will publish or accept:

1. **Domain** — name the universe/ambient set and whether ℕ includes 0 (it does in this course).
2. **Definition** — quote the definition you apply (truth table of ⇒, definition of ⊆, quantifier semantics).
3. **Compute** — step by step, no skipped rows or elements.
4. **Conclude** — one sentence, with the edge cases that were checked (empty set, vacuous truth, zero, equal elements).
5. **Cross-check** — a *different* route (section 4). If the routes disagree, the claim is wrong or the statement is ambiguous; stop and resolve before continuing.

A repeated computation is not a cross-check. Run a script for the second route where you can; it removes arithmetic slips.

### Bundled helper for propositional items

`scripts/logic-check.mjs <bank.json> <checks.json>` brute-forces every assignment with its own parser (no `eval`). `checks.json` is an array of checks:

```json
[
  { "id": "L03-E03", "kind": "table", "formula": "(A ∨ B) ∧ ¬C" },
  { "kind": "equivalent", "left": "A => B", "right": "!B => !A", "expected": true },
  { "kind": "classify", "formula": "A | !A", "expected": "tautology" },
  { "kind": "value", "formula": "A => B", "assignment": { "A": true, "B": false }, "expected": false }
]
```

- `table` compares the truth-table item's `answer` with the formula on every row (variables from the item's `variables`, default `A`, `B`).
- Syntax: variables, `true`/`false`, `! & | ^ => <=>` and parentheses, or `¬ ∧ ∨ ⊕ ⇒ ⇔`. Tightest first: `!`, `&`, `^`, `|`, `=>` (right-associative), `<=>`.
- It verifies keys only for propositional logic. It does not read the prompt, so the formula you write in `checks.json` must be the one the prompt shows; re-read the stem against it.

### Sets, numbers, quantifiers

No bundled helper (formulas there are free-form). Write a small throwaway script with the file tool into `private/` (gitignored), enumerate a bounded domain (e.g. ℕ up to 12, a 3-element universe), and compare with your hand answer; delete it afterwards. Record the domain you enumerated in `generation-notes.md`. Include the negation test (`∀` becomes `∃¬`) and the empty-domain case.

## 2. Tree of thoughts (design and review)

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

## 5. Trace format for review and generation notes

Keep it compact; one block per decision. Generate mode records these in `generation-notes.md`; review modes in the review note.

```
Decision: L07-O03 distractor set
Branches: (A) swap ∧/∨  (B) drop negation  (C) wrong quantifier order
Scores: A 9, B 7, C 8   Gate failures: none
Pruned: B — duplicates L07-E02's misconception
Chosen: A + C
Check 1 (finite model): …    Check 2 (negation rule): …   Agree: yes
```

State at the end: "Author self-check with a different derivation; not independent peer review."
