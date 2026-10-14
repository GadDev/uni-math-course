# Exercise contract (summary — `scripts/check-content.mjs` wins)

Re-read `scripts/check-content.mjs` before generating. This file explains the intent and gives skeletons; if the script has changed, follow the script and tell the user this summary is stale.

## Hard constraints observed in the checker

| Rule | Consequence for generation |
| --- | --- |
| `bank.lessonId` matches `^L\d{2}$`, `version === 1`, `exerciseCount === 6`, six exercises | Exactly six items per bank |
| Item IDs `Lxx-E01`…`Lxx-E06`, unique | Number items in order |
| `objectiveId` `Lxx-O01`…`Lxx-O06`, unique, one item per objective | One item per objective; six objectives |
| `difficulty` ∈ `foundation`, `application` | No other labels |
| `prerequisites` and `misconceptions` non-empty | Always tag |
| `provenance.origin === "original-project-work"`; `coveragePages` non-empty and **identical across the bank** | Cite the lesson's `sourcePages` on every item |
| `grading.rejectUnknownFields === true` | Keep it |
| `evidence.hintsOrRevealedSolutionsEligible === false`, `retriesEligible === false` | Copy block verbatim |
| `prompt`, `hint`, `explanation` have exactly keys `en` and `fr`, non-empty | Always bilingual |
| `single-choice`: `grading.kind: "exact-option-id"`, unique option IDs, `answer` is an option ID, each option has bilingual `label` and `feedback` | Feedback on **every** option |
| `truth-table`: `grading.kind: "labelled-boolean-cells"`, `rows` ids are binary strings in standard order, `answer` keyed by row id, bilingual `feedback`; optional `variables` (default `["A","B"]`) | Row id = variable values concatenated, e.g. `101` |
| Lesson frontmatter `objectives` equals the bank's objective set; `sourcePages` equals `coveragePages`; FR/EN lessons have the same section count and identical `$...$` strings | If a draft implies lesson changes, report them; do not edit lessons unasked |

## Single-choice skeleton

```json
{
  "id": "L05-E01",
  "objectiveId": "L05-O01",
  "difficulty": "foundation",
  "misconceptions": ["implication-failure"],
  "type": "single-choice",
  "prompt": { "fr": "…", "en": "…" },
  "hint": { "fr": "…", "en": "…" },
  "options": [
    { "id": "a", "label": { "fr": "…", "en": "…" }, "feedback": { "fr": "…", "en": "…" } }
  ],
  "answer": "a",
  "explanation": { "fr": "…", "en": "…" },
  "lessonId": "L05",
  "version": 1,
  "prerequisites": ["L01", "L02"],
  "provenance": {
    "origin": "original-project-work",
    "sourceTitle": "<copy from the neighbouring bank>",
    "coveragePages": [20, 21],
    "referenceBasis": "repository-course-map; these are not copied PDF exercises"
  },
  "grading": { "kind": "exact-option-id", "rejectUnknownFields": true },
  "evidence": {
    "eligibleOnFirstIndependentResponse": true,
    "hintsOrRevealedSolutionsEligible": false,
    "retriesEligible": false
  }
}
```

Bank envelope: `{ "lessonId", "version": 1, "status": "review-candidate", "exerciseCount": 6, "exercises": [...] }`.

## Truth-table specifics

```json
"type": "truth-table",
"variables": ["A", "B", "C"],
"rows": [{ "id": "000", "A": false, "B": false, "C": false }],
"answer": { "000": true },
"feedback": { "fr": "…", "en": "…" },
"grading": { "kind": "labelled-boolean-cells", "rejectUnknownFields": true }
```

Derive `answer` by computation (script or hand enumeration of all 2ⁿ rows), never by pattern-guessing. Omit `variables` only for the two-variable default.

## Conventions the checker cannot see but the Constitution requires

- State the domain in the prompt ("for every natural number $n$ (0 included)…").
- Single-choice distractors are plausible errors, never filler; no "all/none of the above".
- Feedback explains *why it fails and how to repair the reasoning*, without shaming language.
- Option IDs are stable and language-independent; the correct option should not always be in the same position across the bank.
- Keep the same mathematical strings in FR and EN; translate the reading of the formula, not the notation.
- Reuse existing misconception tags where one fits (grep other banks); coin new kebab-case tags only for a genuinely new error.
- A changed published exercise needs a new version; the checker currently accepts only `version: 1`, so a v2 requires a maintainer decision and a checker change. Raise it as an open decision, do not work around it.

## Limits that surprise people

- A bank is **exactly six items, one per objective**. "Add more exercises to L07" cannot be satisfied inside the checker; offer alternative drafts for existing items or flag it to maintainers.
- Only `single-choice` and `truth-table` exist. Sets, relations and quantifier lessons usually have no truth-table material.
- There is no `version: 2` support yet. A corrected published exercise needs a maintainer decision plus a checker change.
- The `drafts/` folder escapes the content check only because its name does not match `^L\d{2}$` (re-confirm in the script each run). Do not rename it to look like a lesson ID.
- `scripts/check-repository.mjs` link-checks **every** Markdown file outside its ignore list, including draft notes. A broken link, unknown anchor or unclosed code fence in a draft note fails `check:docs`.

## Drafts and promotion

- Draft files: `exercises/drafts/<Lxx>/v1.draft.json` plus `generation-notes.md` (and optional `proposed-types.md`, `answer-checks.json`). Drafts are committed in pull requests for review; the bank's `status` stays `review-candidate`, and the notes state it is unreviewed.
- Validate structure, lesson alignment and notation parity: `node .claude/skills/math-course-studio/scripts/validate-draft.mjs exercises/drafts/<Lxx>/v1.draft.json`.
- Validate answer keys of propositional truth-table items against a formula: `node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/drafts/<Lxx>/v1.draft.json exercises/drafts/<Lxx>/answer-checks.json` (format in `reasoning-protocols.md`).
- Promotion (replace `exercises/<Lxx>/v1.json`) is a separate reviewed step: mathematical second check, translation review, then `pnpm check` (or the `node` fallbacks in SKILL.md).

## `generation-notes.md` template

```markdown
# <Lxx> exercise draft notes — <date>

Status: unreviewed draft; author self-check, not independent peer review.

## Coverage
Objective → source pages → source-taught / prerequisite / enrichment.

## Reasoning trace
One tree-of-thoughts block per item (see reasoning-protocols.md section 5).

## Answer-key verification
Per item: key, route A, route B, agreement, edge cases tested.

## Bilingual notes
Terminology choices (with glossary reference) and any meaning risks.

## Validation
Exact commands run and their output.

## Open decisions
What a human must still do.
```
