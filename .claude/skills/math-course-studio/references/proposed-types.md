# Proposed exercise types — not checker-accepted

`scripts/check-content.mjs` accepts only `single-choice` and `truth-table`. The types below are **proposals**. Put them in `exercises/drafts/<Lxx>/proposed-types.md`, never in a bank JSON, and head the file with:

> **Proposed — not checker-accepted.** These types are not implemented in the application or the content checker. Adopting any of them needs a maintainer decision and checker/UI work.

Every proposal still needs: stable ID, objective ID, difficulty, prerequisites, misconception tags, provenance, bilingual prompt/hint/explanation, domain statement, and a verified answer (two derivations).

## 1. Proof-completion / worked solution

- Prompt gives a proof skeleton with named gaps; the learner fills each gap or compares with the model solution.
- **Grading contract (proposed):** no automatic grading. Learner self-reviews against a checklist of required moves (assumption stated, definition unfolded, case split complete, conclusion matches claim). Worked solution is shown after the attempt and labelled *original work*.
- Evidence: a revealed solution is not fresh mastery evidence.
- Constitution: free-text proofs use worked solutions and self-review, not an unsupported proof checker.

## 2. Counterexample / numeric answer

- Prompt asks for a value (or small set) satisfying a stated condition, over an explicitly stated finite or named domain (ℕ includes 0).
- **Grading contract (proposed):** deterministic predicate: the submitted value is accepted iff it satisfies the stated condition (e.g. `n > 5 ∧ ¬(n > 10)` over ℕ). Do not compare to a single "expected" number when several are valid. Define input parsing (integers only, trimmed), range limits and rejection of unknown fields. Provide the full accepted set in the explanation (e.g. 6–10).
- Edge cases to specify: empty input, non-integer, out-of-domain, duplicates.

## 3. Error-spotting

- Prompt shows a short argument (3–6 numbered steps) containing exactly one flawed step; learner picks the step, then optionally selects the error type.
- **Grading contract (proposed):** exact match on step ID (like `exact-option-id`); optional second field matched against a closed list of error types. Feedback per step explains why each step is or is not the flaw.
- Design rule: the flaw must map to a named misconception tag, and the other steps must be genuinely valid (verify each with a derivation) — a "correct" step that is subtly wrong ruins the item.

## Template

```markdown
### <Lxx>-P01 — <type> (proposed)
- Objective: <Lxx-Oxx> · Difficulty: <easy|medium|hard> (historical foundation/application also understood) · Prerequisites: […] · Misconceptions: […]
- Domain: …
- Prompt (FR): … / (EN): …
- Hint (FR/EN): …
- Model answer / accepted set: …
- Verification: Route A …; Route B …
- Proposed grading contract: …
- Provenance: original-project-work; coverage pages […]
```
