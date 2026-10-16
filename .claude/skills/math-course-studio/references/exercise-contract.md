# Exercise contract (summary — `scripts/check-content.mjs` wins)

Re-read `scripts/check-content.mjs` before generating. This file explains the intent and gives skeletons; if the script has changed, follow the script and tell the user this summary is stale.

## Hard constraints observed in the checker

| Rule | Consequence for generation |
| --- | --- |
| `bank.lessonId` matches `^L\d{2}$`, positive integer `version`, `exerciseCount === 6`, six exercises | Exactly six items per bank |
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

Example correction version 2: choose the next unused version for the actual lesson, and use it consistently in the bank and every item.

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
  "version": 2,
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

Example bank envelope: `{ "lessonId", "version": 2, "status": "review-candidate", "exerciseCount": 6, "exercises": [...] }`.

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
- A changed published exercise needs a new immutable version. Read the selected version from `content/releases.json`, retain every existing bank, and choose an unused version above all existing versions. The checker accepts positive integer versions; bank and item versions must match.

## Limits that surprise people

- A bank is **exactly six items, one per objective**. "Add more exercises to L07" cannot be satisfied inside the checker; offer alternative drafts for existing items or flag it to maintainers.
- Only `single-choice` and `truth-table` exist. Sets, relations and quantifier lessons usually have no truth-table material.
- Version selection is explicit in `content/releases.json`, not inferred from filenames or bank `status`. A structurally valid draft is not a reviewed or selected release. Missing records/files are errors, not a reason to fall back to v1.
- The `drafts/` folder escapes the content check only because its name does not match `^L\d{2}$` (re-confirm in the script each run). Do not rename it to look like a lesson ID.
- `scripts/check-repository.mjs` link-checks **every** Markdown file outside its ignore list, including draft notes. A broken link, unknown anchor or unclosed code fence in a draft note fails `check:docs`.

## Drafts and promotion

`docs/CONTENT_RELEASES.md` is authoritative for publication; read it and `content/releases.json` before drafting or reviewing a bank.

- Review the registry-selected `exercises/<Lxx>/v<N>.json`. Read archives only for an explicit historical comparison. `validate-draft.mjs --list-tags` collects tags from each registry-selected bank, including withdrawn practice records; it does not aggregate historical versions.
- Draft files: `exercises/drafts/<Lxx>/v<N>.draft.json` plus `generation-notes.md` (and optional `proposed-types.md`, `answer-checks.json`). Use the next unused version for a correction. Keep the bank's `status` as `review-candidate` and notes explicitly unreviewed. Replace placeholders before running commands.
- Validate structure, lesson alignment and notation parity: `node .claude/skills/math-course-studio/scripts/validate-draft.mjs exercises/drafts/<Lxx>/v<N>.draft.json`.
- Validate propositional truth-table keys against a formula: `node .claude/skills/math-course-studio/scripts/logic-check.mjs exercises/drafts/<Lxx>/v<N>.draft.json exercises/drafts/<Lxx>/answer-checks.json` (format in `reasoning-protocols.md`). These checks do not verify the release registry or certify mathematical/translation review.
- Stop at the draft unless promotion is requested. Do not update release fingerprints to make a draft pass.

For a separately authorized promotion:

1. Add the new immutable `exercises/<Lxx>/v<N>.json`; never replace, delete or rename an existing bank. Preserve stable exercise IDs for corrections. An already-seen ID remains practice-only across versions; fresh-evidence item design is a separate contract decision under the six-ID limit.
2. Record actual mathematical and French/English review for the changed material in an evidence document. Old review evidence does not automatically certify a new version. Existing unreviewed exceptions do not authorize additional exceptions; any exception requires an explicit owner decision. Never fabricate reviewer names or dates.
3. Select the new version in `content/releases.json` and renew its mathematical/translation review states and evidence as appropriate. Update SHA-256 fingerprints for the selected bank and both full lesson files only after the review decision. If the French source changed, deliberately renew `translation.sourceFingerprint` after checking English fidelity or obtaining an explicit authorized exception; refreshing only `fingerprints` is insufficient. Paired lesson frontmatter versions must match each other; they are separate from bank version selection.
4. Preserve any `practice: false` withdrawal unless reactivation is explicitly requested. Keep its reading freshness records and historical banks; never remove a record to bypass checks.
5. Run `pnpm sync:release-status` after a deliberate registry change, then `pnpm check` and `node scripts/check-immutable-exercises.mjs` against the PR base. The immutable-bank check is a separate CI gate, not part of `pnpm check`. If any required check cannot run, report it as unverified.

History must retain original grades and resolve feedback from the exact archived version. Missing archives must never borrow current feedback.

## `generation-notes.md` template

```markdown
# <Lxx> exercise draft notes — <date>

Status: unreviewed draft; author self-check, not independent peer review.

## Versions and release scope
Selected base version, proposed unused version, registry review/translation states and withdrawal status. Draft only; publication not authorized by validation.

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
