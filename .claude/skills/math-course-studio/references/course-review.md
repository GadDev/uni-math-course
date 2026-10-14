# Course-level review

A lesson can be correct and the course still be wrong: gaps, forward references, stale statements, uneven workload. This mode looks across lessons.

## Procedure

1. **Run the map**: `node .claude/skills/math-course-studio/scripts/course-map.mjs`. Treat the output as facts to judge, not verdicts.
2. **Prerequisite graph** — for each lesson, are its prerequisites earlier, necessary and *sufficient*? A prerequisite that is never taught (or taught later) is a defect; so is an unstated one (a lesson uses an idea that no earlier lesson or prerequisite names). Free-text prerequisites (e.g. L01) refer to prior knowledge outside the course; check that it is realistic. The map only checks declared edges, so do the sufficiency check yourself: for each lesson, list the notations and results its text and bank use (∈, ∀, ⇒, ≡, ℕ, intervals, SQL/Python constructs…), find where each is first taught, and confirm that lesson is a declared prerequisite or an ancestor of one. Report missing edges per lesson (a per-lesson list is the most actionable form). Compare the declared prerequisites in the lesson frontmatter with the ones copied into `exercises/<Lxx>/v1.json`; they must agree.
3. **Coverage** — list source pages not covered by any lesson (the title page and slide-build pages may be legitimately uncovered) and pages covered twice. For each gap decide: intentional, consolidated repeated build, or missing content. Read the PDF page before deciding (`Read` with `pages`).
4. **Progression** — does difficulty rise gently? Are confusable concepts (⇒ vs ⇔, ∈ vs ⊆, converse vs contrapositive, ∀∃ vs ∃∀) taught close together and contrasted? Is each lesson's objective set consistent with its length (`minutes`)?
5. **Consistency** — notation, terminology and conventions identical everywhere (ℕ includes 0, French intervals, naming of ambient sets, connectives). One concept, one name; check against `src/data/glossary.json`. Also check that a symbol keeps its definition when its scope widens:
   - `≡` defined by "same truth table" (propositional) but later applied to quantified statements — is the extended meaning stated?
   - "domain", "universe" and "ambient set" used interchangeably — is each defined once and reused unchanged?
   - ∀/∃ read over a named domain in one lesson and over a larger universe with a restriction in another.
   - "atomic", "statement" and "assertion" defined in an early lesson and then stretched by later connectives.
6. **Stale claims** — the map flags lessons that call another lesson "planned" or "not available" when it exists. Confirm each, and propose the corrected sentence in both languages.
7. **Status and release readiness** — `pilot` vs `extended`, and the Constitution's publication gates (verified answers, second check, translation review). Say which gates are evidenced and which are not. Read the milestone and pilot scope in `docs/ROADMAP.md` and check that the lessons it ships form a closed set: every prerequisite of a piloted lesson must itself be in the pilot (or the lesson must be self-contained). Also note where the roadmap's description of the course (planned / not published) no longer matches the repository.
8. **Source defects across the course** — walk the Constitution's known list (p. 48, 19/25/31, 60–65, 71–89, 94) and check each affected lesson handles it (flagged, not silently fixed).
9. **Bank spread** — across all banks: misconception tags used (`validate-draft.mjs --list-tags`), balance of `foundation`/`application`, item types, and lessons whose bank leans on a single pattern.

Use tree-of-thoughts for judgment calls: for each gap or ordering concern, write the competing explanations (intentional / defect / consolidated) with the evidence for each, then conclude, or report the ambiguity.

## Output: `exercises/drafts/course-review.md`

```markdown
# Course review — <date>

Status: author self-check, not independent peer review.

## Scope
Lessons covered, source PDF pages read, what was not checked.

## Map summary
Lessons, total minutes, page coverage, prerequisites at a glance.

## Findings
| # | Severity | Lessons | Dimension | Evidence (file:line, PDF page) | Finding | Suggested repair |
| --- | --- | --- | --- | --- | --- | --- |

## Reasoning trace
Compact tree-of-thoughts blocks for judgment calls.

## Open decisions for maintainers
```

Keep the Findings table to the **15 most important** findings (all Blocking and Major first). Put the rest in a compact "Appendix: minor findings" list of one line each, so a maintainer can act on the table without wading through polish. Several findings from one root cause (e.g. one reordering) become a single row.

Severity scale is in `review-rubric.md`. Write notes with plain-text paths (not Markdown links) so `check:docs` cannot trip on a broken link, and run `node scripts/check-repository.mjs` after writing it.
