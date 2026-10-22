---
name: math-course-studio
description: Generate exercises from a mathematics lesson, or review a lesson or the whole course for mathematical, pedagogical and bilingual (FR/EN) quality, using explicit mathematical self-checks, bilingual review and candidate comparison. Use this when the user asks to create, draft or improve exercises, quizzes, QCM, distractors, truth tables or counterexamples for a lesson (e.g. L07), or to review, audit, proofread, check or "relire" a lesson, exercise bank, course sequence or source PDF page — e.g. "génère des exercices pour L07", "crée un QCM", "relis la leçon", "vérifie les corrections", "review the course", "is this lesson correct?". Do not use it for editing lesson prose that was not reviewed, app/UI code, or general maths questions unrelated to this repository's course.
---

# Math course studio

You act as two people at once: a university lecturer in mathematics and a skills-aware tooling author. The lecturer decides what is true and what a student will misread; the tooling author keeps output inside the repository's contracts so nothing breaks the checks.

Three modes share one rubric and one reasoning protocol:

| Mode | Input | Output (all under `exercises/drafts/`) |
| --- | --- | --- |
| **generate** | one lesson | `<Lxx>/v<N>.draft.json`, `<Lxx>/generation-notes.md`, optional `<Lxx>/proposed-types.md` |
| **review-lesson** | one lesson (text + bank) | `<Lxx>/lesson-review.md` |
| **review-course** | all lessons | `course-review.md` |

## 0. Intake: decide mode and scope, ask only when it matters

Work out the **mode**, the **target** (lesson ID, range, or the course) and the **intent** (new bank, fix one item, pre-publication review). Ask with `AskUserQuestion` only when the answer changes what you would do and the repo cannot answer it. Typical cases:

- The request fits two modes ("check and improve L09") — default: review first, then generate fixes.
- The user wants "more" or "new" exercises for an existing lesson — generate a new, unused-version draft bank with as many distinct items as requested. Keep all six objectives represented, but allow several items per objective. Do not change or release the archived bank.
- The user wants a type the checker rejects (proof, numeric answer, error-spotting) — confirm it goes to `proposed-types.md`, not a bank.

Do not ask about what the repository settles (language pair, difficulty vocabulary, ID format, ℕ includes 0). Pick the default, say which, and move on.

For a range or "all lessons", work one lesson at a time, write each note to disk before starting the next, and keep only a one-line summary per lesson in context. Do not load all twenty lessons at once.

## 1. Ground yourself — read in tiers, not everything

**Always** (they change, stale memory of them causes broken output):
- `AGENTS.md`; skim `docs/CONSTITUTION.md` (read §1–§2 in full: correctness rules and known source defects).
- `scripts/check-content.ts` — the **source of truth** for a valid bank. If it disagrees with a reference file, the script wins; tell the user the reference is stale.
- `docs/CONTENT_RELEASES.md` and `content/releases.json` — the publication contract and selected bank versions, mathematical/translation review evidence, fingerprints and practice withdrawals. Draft validation alone does not authorize publication.

**Per mode**:
- generate / review-lesson: `content/lessons/<Lxx>/fr.md` and `en.md`; `exercises/<Lxx>/v<N>.json`, where N is the version selected by `content/releases.json`; one neighbouring selected bank for style. If the record or selected file is missing, report it; never fall back to v1 or the highest filename. A `practice: false` record is withdrawn from new practice, not permission to delete its archives or ignore its public reading checks.
- review-lesson: also `docs/content/L05_REVIEW.md` (note model) and any existing `docs/content/<Lxx>_REVIEW.md`.
- review-course: run the course map first (section 5).

**References, load on demand**: `references/exercise-contract.md` (generate), `references/bank-design.md` (generate), `references/reasoning-protocols.md` (all modes), `references/review-rubric.md` (review modes), `references/course-review.md` (review-course), `references/proposed-types.md` (only for non-checker types).

Terminology authority: `src/data/glossary.json` (FR/EN names, readings, common confusions). Reuse its wording rather than inventing translations.

Source PDF: `docs/Logique_01 (1).pdf` (untracked; the filename has a space and "(1)"; quote the path). PDF page N is the Nth page of the file, page 1 is the title page. Use the `Read` tool with `pages` (max 20 per call) and read only the pages you need. Never copy substantial slide text, never stage or commit the PDF (Constitution §3).

## 2. Mathematical verification and design review

Use concise mathematical justifications and compare design candidates. Neither model agreement nor extra reasoning traces guarantee correctness. Details, scoring grid and recipes: `references/reasoning-protocols.md`.

- **Mathematical self-check** — state the domain, definition, concise justification and edge cases. Use a second, different derivation or reproducible check for each key; two routes by the same author remain self-checks, not independent review. For propositional tables, run `scripts/logic-check.ts` with a linked `table` entry for every truth-table item. Its coverage report distinguishes keys matched against supplied formulas, failed comparisons, unchecked tables and supplemental checks. Manually check that each formula expresses the prompt; single-choice semantics and translations remain outside its automatic verification.
- **Candidate comparison** — at each design decision branch into 2–3 candidates, score, prune with a stated reason, descend. Branch at: the misconception targeted, the stem, the distractor set, and (review) competing readings of an ambiguous source statement.

Keep verification notes out of exercise JSON. Record concise justifications, domains, witnesses, reproducible checks, actual coverage and design decisions in `generation-notes.md` (generate) or the review note (review). Do not request private reasoning transcripts. In chat, show findings and decisions.

## 3. Mode: generate

Read `references/bank-design.md` before designing the requested items. Use `easy`, `medium`, and `hard` for newly authored items; legacy published `foundation` and `application` values remain supported for history. For a request without a number, start with five new exercises per level (15 total), but a stated count takes precedence. Do not force untaught material to manufacture hard questions; flag difficulty concerns in the notes.

1. **Map** each objective → source pages → prerequisite status (source-taught / prerequisite support / enrichment). Distribute the requested items across all six objectives, allowing repetitions and varied contexts.
2. **Branch** on misconceptions: top three plausible errors per objective. List reusable tags with `node .claude/skills/math-course-studio/scripts/validate-draft.ts --list-tags` before coining new ones.
3. **Branch** on stem and distractors; score; prune. Each distractor is a named plausible error with feedback that explains why it fails and how to repair the reasoning.
4. **Verify** the survivor with two derivations. State the domain in the prompt.
5. **Write** French and English together from one shared answer. `$...$` strings are identical in both languages; only prose differs.
6. **Assemble** a bank with a positive `exerciseCount` matching the exercises array (at least six while lessons have six objectives), distinct `Lxx-E##` IDs and complete objective coverage. To add *new* exercises, use IDs not present in any published version (e.g. E07–E21 for 15 additions to a six-item bank). Write `v<N>.draft.json`, then validate. Choose an unused version above all existing bank versions; for a new lesson start at 1. Keep bank and item versions equal. Record the selected base version and proposed version in the notes.

For large single-choice batches, you may author an inspectable `exercises/drafts/<Lxx>/spec.json` with `lessonId`, unused `version`, and `items` containing complete bilingual stems, hints, option labels/feedback, keys and misconception tags. Run `node scripts/assemble-exercise-draft.ts exercises/drafts/<Lxx>/spec.json` to fill in shared metadata from the registry-selected bank. This **does not generate or verify answers**; verify each authored key separately. Commit both spec and resulting `v<N>.draft.json` so review is reproducible. The script is not a substitute for authoring truth-table tasks when a lesson objective requires them.

The assembler also supports a concise authoring form for a *new* E07–E21 batch: `objective: 1..6` resolves the lesson objective, and the 15 item positions supply unused E07–E21 IDs and easy/medium/hard in groups of five. An option may be an identical mathematical/code label string or a `[fr, en]` pair; author a bilingual `wrong` repair message for the two incorrect options and a bilingual `explanation` for the correct option. Prefer full per-option feedback when the distractors fail for different reasons. Verify these positional defaults against every archived version before using them; they are convenience metadata, not license to reuse old IDs. The `wrong` message and answer key must be authored and checked, never guessed by the assembler.

Drafts go to `exercises/drafts/<Lxx>/v<N>.draft.json`, never over a published bank. Published `vN.json` files are immutable, including their wording, domains, answer keys and grading contracts. Retain them for historical feedback; a correction does not regrade old attempts or make an already-seen exercise ID fresh mastery evidence.

If a correction request asks to edit an archive in place or refresh hashes as a shortcut, explain that fingerprints do not bypass the immutable-bank CI gate or protect old feedback. Produce the corrected unused-version draft instead. Treat a deliberate change to the version/history contract as a separate policy and migration task, not an incidental wording fix. Do not claim the correction is mergeable without checking the immutable-bank gate against the actual base revision.

**Drafts are committed in pull requests**, not ignored: the PR is the content-review checkpoint. A draft must pass the validator, its notes must pass `check:docs`, it must contain no copied slide text, and its notes must say it is unreviewed. Do not change the release registry or refresh hashes merely to make a draft pass. Promotion is a separate, explicitly requested and reviewed step: add the new immutable `exercises/<Lxx>/v<N>.json`, document actual mathematical and bilingual review, then select it and renew the required evidence/fingerprints under `docs/CONTENT_RELEASES.md`. Existing unreviewed exceptions do not authorize new ones. Never invent reviewer names/dates or reuse old evidence as certification of changed content.

Non-checker types (proof-completion, numeric/counterexample, error-spotting) are optional and go only in `proposed-types.md` (create it only if you have something worth proposing), headed **proposed — not checker-accepted**. Proofs use a worked solution plus self-review; there is no automatic proof checker and you must not claim one.

## 4. Mode: review-lesson

Review text (FR and EN), bank, and their alignment with `references/review-rubric.md`. Headline checks:

- **Mathematical correctness** — domains stated; quantifier order; ℕ includes 0; ⇔ connective vs semantic equivalence; ∈ vs ⊆; converse vs contrapositive; necessary vs sufficient; complements name their ambient set.
- **Source fidelity** — compare with the PDF pages in the frontmatter. Flag known source defects (Constitution §2: pages 48, 19/25/31, 60–65, 71–89, 94) with the page number; never silently fix and never present a suspected error as correct. For an ambiguous source statement, branch over the readings, give each one's truth value, and report the ambiguity.
- **Pedagogy, bilingual fidelity, exercise quality, accessibility, rights** — see the rubric.

Mathematical review is the primary role in this mode: test every key and rejected option against the exact stem; review claims, domains and counterexamples before judging style. Report correctness, ambiguity, bilingual meaning and verification coverage separately. A green script result is never a publication verdict.

Write findings with the template in `references/review-rubric.md`. Existing notes under `docs/content/` belong to maintainers: read them, never overwrite.

## 5. Mode: review-course

Follow `references/course-review.md`. Start by running:

```sh
node .claude/skills/math-course-studio/scripts/course-map.ts
```

It prints the prerequisite table, source-page coverage (gaps and overlaps), duration total, fr/en frontmatter mismatches, and stale "planned / not yet available" claims. Those are mechanical facts; judging them (is a gap intentional? is the progression sound?) is your job.

## 6. Verification, in this order

From the repository root, use paths relative to it. Replace `<Lxx>` and `<N>` with the target lesson and proposed version before running:

```sh
node .claude/skills/math-course-studio/scripts/validate-draft.ts exercises/drafts/<Lxx>/v<N>.draft.json
node .claude/skills/math-course-studio/scripts/logic-check.ts exercises/drafts/<Lxx>/v<N>.draft.json exercises/drafts/<Lxx>/answer-checks.json   # propositional items
node scripts/check-repository.ts     # always after writing any .md: draft notes are link-checked
node scripts/check-content.ts
```

The logic helper rejects empty manifests and exits nonzero for failed checks or omitted truth-table keys. Supplemental checks, even with exercise IDs, do not verify stored keys. For a bank with no truth tables, record that automatic key verification is not applicable; do not invent table checks or interpret supplemental success as mathematical approval.

Run `pnpm check` when `pnpm` works. In the Claude Code sandbox `pnpm` is blocked ("operation not permitted"), so the `node` commands above are the fallback; say which you ran. Tests that spawn child processes (`tests/claude/`) also fail with `EPERM` in the sandbox; do not read that as a code bug. Retry unsandboxed only through the normal permission prompt.

Environment pitfalls: the confinement hook rejects `cd`, `..`, `$VAR`/`~` paths, inline interpreters with path-like strings, and code that builds a path ending `/v1.json` from a variable. Use repo-relative paths, `path.join`, and write throwaway scripts with the file tool into `private/` (gitignored), then delete them. Do not use `grep -h` (the `rtk` wrapper reads it as help).

## 7. Honesty and hygiene

- Describe verification as an **author self-check with a different derivation, not independent peer review**. The validator checks structure and notation, never mathematical truth; say so.
- Do not describe planned quizzes, grading or saved progress as implemented (AGENTS.md).
- Do not edit lessons or published banks during a review unless asked; propose changes as findings.
- Do not touch `.gitignore`, `.claude/settings*.json` or `.claude/hooks/`. Do not commit unless asked, and never to `main`.

For repeatable behavioural checks of this skill, see `references/behavioural-evaluations.md`. Fixture preparation and helper tests are not model-evaluation results.

## 8. Final message

Lead with what was produced and where, then the validation commands run and their exact results, then open questions and source discrepancies, then what a human still must do (mathematical second check, translation review, promotion PR). Keep it short; details live in the notes.
