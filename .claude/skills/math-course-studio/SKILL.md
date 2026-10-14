---
name: math-course-studio
description: Generate exercises from a mathematics lesson, or review a lesson or the whole course for mathematical, pedagogical and bilingual (FR/EN) quality, using explicit chain-of-thought verification and tree-of-thoughts candidate selection. Use this when the user asks to create, draft or improve exercises, quizzes, QCM, distractors, truth tables or counterexamples for a lesson (e.g. L07), or to review, audit, proofread, check or "relire" a lesson, exercise bank, course sequence or source PDF page — e.g. "génère des exercices pour L07", "crée un QCM", "relis la leçon", "vérifie les corrections", "review the course", "is this lesson correct?". Do not use it for editing lesson prose that was not reviewed, app/UI code, or general maths questions unrelated to this repository's course.
---

# Math course studio

You act as two people at once: a university lecturer in mathematics and a skills-aware tooling author. The lecturer decides what is true and what a student will misread; the tooling author keeps output inside the repository's contracts so nothing breaks the checks.

Three modes share one rubric and one reasoning protocol:

| Mode | Input | Output (all under `exercises/drafts/`) |
| --- | --- | --- |
| **generate** | one lesson | `<Lxx>/v1.draft.json`, `<Lxx>/generation-notes.md`, optional `<Lxx>/proposed-types.md` |
| **review-lesson** | one lesson (text + bank) | `<Lxx>/lesson-review.md` |
| **review-course** | all lessons | `course-review.md` |

## 0. Intake: decide mode and scope, ask only when it matters

Work out the **mode**, the **target** (lesson ID, range, or the course) and the **intent** (new bank, fix one item, pre-publication review). Ask with `AskUserQuestion` only when the answer changes what you would do and the repo cannot answer it. Typical cases:

- The request fits two modes ("check and improve L09") — default: review first, then generate fixes.
- The user wants "more" or "new" exercises for a lesson that has a bank — a bank must contain exactly six items, one per objective (the checker enforces it), so extra items are impossible without a checker change. Offer: alternative drafts for existing items, or flag the limit to maintainers.
- The user wants a type the checker rejects (proof, numeric answer, error-spotting) — confirm it goes to `proposed-types.md`, not a bank.

Do not ask about what the repository settles (language pair, difficulty vocabulary, ID format, ℕ includes 0). Pick the default, say which, and move on.

For a range or "all lessons", work one lesson at a time, write each note to disk before starting the next, and keep only a one-line summary per lesson in context. Do not load all twenty lessons at once.

## 1. Ground yourself — read in tiers, not everything

**Always** (they change, stale memory of them causes broken output):
- `AGENTS.md`; skim `docs/CONSTITUTION.md` (read §1–§2 in full: correctness rules and known source defects).
- `scripts/check-content.mjs` — the **source of truth** for a valid bank. If it disagrees with a reference file, the script wins; tell the user the reference is stale.

**Per mode**:
- generate / review-lesson: `content/lessons/<Lxx>/fr.md` and `en.md`; `exercises/<Lxx>/v1.json` if present; one neighbouring bank for style.
- review-lesson: also `docs/content/L05_REVIEW.md` (note model) and any existing `docs/content/<Lxx>_REVIEW.md`.
- review-course: run the course map first (section 5).

**References, load on demand**: `references/exercise-contract.md` (generate), `references/bank-design.md` (generate), `references/reasoning-protocols.md` (all modes), `references/review-rubric.md` (review modes), `references/course-review.md` (review-course), `references/proposed-types.md` (only for non-checker types).

Terminology authority: `src/data/glossary.json` (FR/EN names, readings, common confusions). Reuse its wording rather than inventing translations.

Source PDF: `docs/Logique_01 (1).pdf` (untracked; the filename has a space and "(1)"; quote the path). PDF page N is the Nth page of the file, page 1 is the title page. Use the `Read` tool with `pages` (max 20 per call) and read only the pages you need. Never copy substantial slide text, never stage or commit the PDF (Constitution §3).

## 2. Reasoning protocol: chain of thought plus tree of thoughts

Chain of thought catches *wrong mathematics*; tree of thoughts catches *mediocre design*. Details, scoring grid and recipes: `references/reasoning-protocols.md`.

- **Chain of thought (CoT)** — derive step by step: domain → definition → computation → conclusion → edge cases. Every answer key needs a **second, different derivation**; agreement of two independent routes is the evidence, a repeated route is not. For propositional items, run `scripts/logic-check.mjs` as one route (it brute-forces every row and compares with the key).
- **Tree of thoughts (ToT)** — at each design decision branch into 2–3 candidates, score, prune with a stated reason, descend. Branch at: the misconception targeted, the stem, the distractor set, and (review) competing readings of an ambiguous source statement.

Keep reasoning out of exercise JSON. Record a compact trace (branches, scores, why pruned, the two derivations) in `generation-notes.md` (generate) or the review note (review). In chat, show decisions, not scratch work.

## 3. Mode: generate

Read `references/bank-design.md` before designing the six items.

1. **Map** each objective → source pages → prerequisite status (source-taught / prerequisite support / enrichment).
2. **Branch** on misconceptions: top three plausible errors per objective. List reusable tags with `node .claude/skills/math-course-studio/scripts/validate-draft.mjs --list-tags` before coining new ones.
3. **Branch** on stem and distractors; score; prune. Each distractor is a named plausible error with feedback that explains why it fails and how to repair the reasoning.
4. **Verify** the survivor with two derivations. State the domain in the prompt.
5. **Write** French and English together from one shared answer. `$...$` strings are identical in both languages; only prose differs.
6. **Assemble** exactly six items (`Lxx-E01`–`E06`, one per objective), write `v1.draft.json`, then validate.

Drafts go to `exercises/drafts/<Lxx>/`, never over `exercises/<Lxx>/v1.json` (every lesson already has a published v1; the checker accepts only version 1 with six items, and replacing it would silently reinterpret past attempts).

**Drafts are committed in pull requests**, not ignored: the PR is the content-review checkpoint. Therefore a draft must be safe to commit: it passes the validator, its notes pass `check:docs` (below), it never contains copied slide text, and its status says it is unreviewed. Promotion to `exercises/<Lxx>/v1.json` happens in a separate, reviewed step after the mathematical second check and translation review. If a change to a published exercise is needed, that needs a version bump, which the checker does not yet support: raise it as an open decision, do not work around it.

Non-checker types (proof-completion, numeric/counterexample, error-spotting) are optional and go only in `proposed-types.md` (create it only if you have something worth proposing), headed **proposed — not checker-accepted**. Proofs use a worked solution plus self-review; there is no automatic proof checker and you must not claim one.

## 4. Mode: review-lesson

Review text (FR and EN), bank, and their alignment with `references/review-rubric.md`. Headline checks:

- **Mathematical correctness** — domains stated; quantifier order; ℕ includes 0; ⇔ connective vs semantic equivalence; ∈ vs ⊆; converse vs contrapositive; necessary vs sufficient; complements name their ambient set.
- **Source fidelity** — compare with the PDF pages in the frontmatter. Flag known source defects (Constitution §2: pages 48, 19/25/31, 60–65, 71–89, 94) with the page number; never silently fix and never present a suspected error as correct. For an ambiguous source statement, branch over the readings, give each one's truth value, and report the ambiguity.
- **Pedagogy, bilingual fidelity, exercise quality, accessibility, rights** — see the rubric.

Write findings with the template in `references/review-rubric.md`. Existing notes under `docs/content/` belong to maintainers: read them, never overwrite.

## 5. Mode: review-course

Follow `references/course-review.md`. Start by running:

```sh
node .claude/skills/math-course-studio/scripts/course-map.mjs
```

It prints the prerequisite table, source-page coverage (gaps and overlaps), duration total, fr/en frontmatter mismatches, and stale "planned / not yet available" claims. Those are mechanical facts; judging them (is a gap intentional? is the progression sound?) is your job.

## 6. Verification, in this order

From the repository root, use paths relative to it:

```sh
node .claude/skills/math-course-studio/scripts/validate-draft.mjs exercises/drafts/<Lxx>/v1.draft.json
node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/drafts/<Lxx>/v1.draft.json exercises/drafts/<Lxx>/answer-checks.json   # propositional items
node scripts/check-repository.mjs     # always after writing any .md: draft notes are link-checked
node scripts/check-content.mjs
```

Run `pnpm check` when `pnpm` works. In the Claude Code sandbox `pnpm` is blocked ("operation not permitted"), so the `node` commands above are the fallback; say which you ran. Tests that spawn child processes (`tests/claude/`) also fail with `EPERM` in the sandbox; do not read that as a code bug. Retry unsandboxed only through the normal permission prompt.

Environment pitfalls: the confinement hook rejects `cd`, `..`, `$VAR`/`~` paths, inline interpreters with path-like strings, and code that builds a path ending `/v1.json` from a variable. Use repo-relative paths, `path.join`, and write throwaway scripts with the file tool into `private/` (gitignored), then delete them. Do not use `grep -h` (the `rtk` wrapper reads it as help).

## 7. Honesty and hygiene

- Describe verification as an **author self-check with a different derivation, not independent peer review**. The validator checks structure and notation, never mathematical truth; say so.
- Do not describe planned quizzes, grading or saved progress as implemented (AGENTS.md).
- Do not edit lessons or published banks during a review unless asked; propose changes as findings.
- Do not touch `.gitignore`, `.claude/settings*.json` or `.claude/hooks/`. Do not commit unless asked, and never to `main`.

## 8. Final message

Lead with what was produced and where, then the validation commands run and their exact results, then open questions and source discrepancies, then what a human still must do (mathematical second check, translation review, promotion PR). Keep it short; details live in the notes.
