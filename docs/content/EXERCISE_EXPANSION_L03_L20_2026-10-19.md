# L03–L20 exercise-bank publication review — 2026-10-19

**Status: AI-assisted author self-check and reviewable publication proposal, not independent peer review or human translation approval.** Prepared with ChatGPT on 2026-10-19. No human reviewer, human sign-off or source-PDF inspection during this review is asserted. Merging the publication PR is a separate maintainer decision.

## Scope and provenance

- The current `main` release-selected banks are the base, **not** the older banks named in the 2026-10-16 generation notes. Their original 116 items are carried into the new versions with exactly the same mathematical contracts, wording, options, feedback and stable IDs, changing only the per-item version. The originals remain immutable for historical feedback.
- The 270 new distinct E07–E21 IDs come from `exercises/drafts/L03/` through `L20/`, with the ten reviewed corrections listed below applied to both the inspectable authoring specifications (where present) and the draft JSON. Each lesson contributes five easy, five medium and five hard items; six objectives remain represented.
- L04 v4 already contains **eight additional E22–E29 questions**. They are carried forward too: **L04 has 29**, all other expanded banks have 21, for **386 selected items across L03–L20**. No item is deleted to satisfy a count quota.
- Lesson prose, both lesson locales, practice access flags, and lesson-translation records are unchanged. The existing French/English source fingerprints remain bound to unchanged files; new selected-bank fingerprints bind the new bytes. L01/L02 are outside this publication.
- Coverage pages are inherited from the selected bank and lesson frontmatter. The teacher's Chapter 1 PDF was not available for reinspection in this publication pass; [the chapter alignment review](CHAPTER_01_REVIEW.md) records an earlier source comparison. This is **not a new item-by-item PDF fidelity check**.

## Version and count decisions

| Lesson | Selected before → proposed | Existing kept | New | Result | Existing review state |
| --- | --- | ---: | ---: | ---: | --- |
| L03 | v2 → v3 | 6 | 15 | 21 | self-checked |
| L04 | v4 → v5 | 14 | 15 | 29 | self-checked |
| L05 | v2 → v3 | 6 | 15 | 21 | self-checked |
| L06 | v1 → v2 | 6 | 15 | 21 | self-checked |
| L07 | v3 → v4 | 6 | 15 | 21 | self-checked |
| L08 | v2 → v3 | 6 | 15 | 21 | self-checked |
| L09 | v1 → v2 | 6 | 15 | 21 | unreviewed-exception |
| L10 | v1 → v2 | 6 | 15 | 21 | unreviewed-exception |
| L11 | v1 → v2 | 6 | 15 | 21 | unreviewed-exception |
| L12 | v3 → v4 | 6 | 15 | 21 | self-checked |
| L13 | v3 → v4 | 6 | 15 | 21 | self-checked |
| L14 | v3 → v4 | 6 | 15 | 21 | self-checked |
| L15 | v3 → v4 | 6 | 15 | 21 | self-checked |
| L16 | v3 → v4 | 6 | 15 | 21 | self-checked |
| L17 | v1 → v2 | 6 | 15 | 21 | unreviewed-exception |
| L18 | v1 → v2 | 6 | 15 | 21 | unreviewed-exception |
| L19 | v2 → v3 | 6 | 15 | 21 | self-checked |
| L20 | v3 → v4 | 6 | 15 | 21 | self-checked |

## Mathematical and distractor self-check

The 270 candidate stems, intended keys, and all three offered alternatives for each of the 253 single-choice items were read against their stated finite domains, logical definitions and supplied justification, including empty sets, equality, inclusion versus membership, quantifier order, necessary/sufficient conditions, `0` in the naturals, SQL set semantics and empty Python lists. Alternative choices were checked for the stated misconception rather than simply trusting option IDs. This is **an AI-assisted editorial self-check**, not a machine-verifiable certificate or independent human review of the 253 choices. The original per-item author explanations and the lesson-specific `generation-notes.md` remain the detailed item records; no second reviewer is implied.

For the **17 stored truth-table questions**, the linked `logic-check.mjs` manifests enumerate all finite assignments of each supplied formula: **17/17 keys matched, zero failed, zero unchecked** (L03 4, L04 3, L05 3, L06 2, L07 5). Fourteen supplemental formula checks passed; they **do not** verify multiple-choice keys. The question's displayed formula was compared against the manifest formula during review; the script alone cannot perform that semantic step.

| Lessons | Independent-style reasoning applied to selected examples and distractors | Boundaries checked |
| --- | --- | --- |
| L03–L04 | Formula evaluation versus alternate assignments; De Morgan and distributivity, plus exhaustive tables | False universal claims, missing rows, all-true/all-false rows |
| L05–L06 | Implication failure as antecedent true/consequent false; contraposition versus converse/inverse; integer witnesses | Vacuous implications, $n=2$, reverse implication failure |
| L07–L08 | Biconditional per assignment versus semantic equivalence; minterms and elimination of AND | Mixed Boolean rows, false constant, $n\geq1$ |
| L09–L10 | Restricted set comprehension versus Russell's unrestricted collection; membership and subset enumeration | Empty set, nested singleton, $0\in\mathbb N$ |
| L11–L12 | Finite predicate truth assignments; negate quantifiers in reverse order | Counterexample witnesses, changing domain, empty domain |
| L13–L14 | Explicit finite filtering and element/subset enumeration; $2^n$ subset count | Domain bounds, interval endpoints, power set of empty set |
| L15–L16 | Element-wise set membership identities; bound-to-implication/conjunction expansion | Named ambient sets, empty bounded domains, outside-$X$ witness |
| L17–L18 | Ordered-pair enumeration and quantifier order; `EXISTS`/`NOT EXISTS` under stated SQL model | Empty relation, no enrollment, duplicate projected values |
| L19–L20 | Python `all`/`any` behavior and short-circuit; quantifier negation and permission countermodels | Empty/singleton lists, zero requests, necessary versus sufficient |

For Python specifics, `all([])`/`any([])` was evaluated as `True`/`False`; the corrected duplicate expression with `t=[5]` and `n=len(t)` returned `False`; `all` evaluated only one comparison before a false result on `[3,1,2]`. These executable cases corroborate their keys but are not general proof tools.

## French/English and editorial review

All 270 new pairs of FR/EN prompts were read side by side. The reproducible `scripts/audit-exercise-expansion.mjs` inspected prompts, hints, explanations, choice labels and feedback in both locales: **identical mathematical expressions across locales**, no duplicate option labels, no missing bilingual field and no obvious untranslated-English conjunctions after the corrections. Choice-key positions among the 253 new single-choice questions were **a: 81, b: 90, c: 82**; this is a balance check, not difficulty calibration. Both versions use consistent classical two-valued logic and French interval notation. Accessibility and distractor quality still warrant live learner testing; a passing string comparison does not establish natural translation or independent grading validity.

### Findings and repairs made to the proposed banks

| Severity | Exercise | Review finding and repair |
| --- | --- | --- |
| Major | L09-E07 | A set of exactly two objects needs $a\ne b$; clarified the assumption in both prompts. |
| Major | L18-E14 | SQL projection without `DISTINCT` could repeat names, unlike a set comprehension; specified `SELECT DISTINCT` in both prompts. |
| Major | L19-E20 | Python snippet used undefined `n`; established `n=len(t)` explicitly. |
| Minor | L04-E14 | French stem reversed the intended equivalence comparison; aligned it with the English question. |
| Minor | L06-E18 | Replaced French "consulter le laboratoire" with the matching access condition. |
| Minor | L11-E18 | "Capitale de l'UE" could mean an EU institutional capital; clarified "capitale d'un pays de l'Union européenne". |
| Minor | L13-E12 | English correct option contained French *mais*; translated *but*. |
| Minor | L13-E14 | English "contains its composite numbers" was less restrictive than the French filter; said "consists exactly of". |
| Minor | L14-E20 | Three English options retained French *et*; translated *and*. |
| Minor | L20-E14 | French-only identifiers in both locales were replaced with shared, explicitly defined symbols $A$ (access) and $C$ (valid code). |

No blocking discrepancy was identified in the corrected candidate answer keys during this self-check. This is **not a claim that every independent reviewer will agree**, especially on difficulty and source alignment.

## Release status and the maintainer's open gate

The existing registry already records **self-checked** mathematical/translation material for 13 of these lessons. Their original review evidence still covers the unchanged reading; this document covers the added exercise candidates and renewed bank selection. The registry's translation status/evidence is **not renewed**, because the lesson locale files were not changed.

**L09, L10, L11, L17 and L18 remain `unreviewed-exception`.** Their existing lesson-reading exceptions are not silently promoted to self-checked, and this AI-assisted candidate review does **not** invent the maintainer's authorization to extend those exceptions to a new published bank. The PR must remain **draft / not merge-ready** until the maintainer either documents a real full lesson/bank bilingual and mathematical review or explicitly authorizes and records the new exceptional publication decision in the release evidence. Do not treat a green CI build as that permission.

Before merging, a human should perform a second mathematical check of single-choice answer uniqueness and feedback, natural FR/EN readability, source fidelity against the teacher PDF, possible overlap with the Chapter 1 examples, and difficulty calibration. These checks are not fulfilled by repository tests. Hosted class acceptance and deployment are separate.

## Validation evidence

Commands run from the repository root:

```text
node scripts/audit-exercise-expansion.mjs               — 270 items; 253 choice/17 tables, FR/EN notation and labels: pass
node .claude/skills/math-course-studio/scripts/logic-check.mjs <L03–L07 draft + manifest> — 17/17 linked tables, 0 failures/unchecked; 14 supplemental pass
python3 -c '<L19 finite Python examples>'               — values matched the stated keys
node .claude/skills/math-course-studio/scripts/validate-draft.mjs <each of 18 draft banks> — 18 pass, 0 warnings
node scripts/check-repository.mjs                       — 230 Markdown files and internal links pass
node scripts/check-content.mjs                          — 36 bilingual lessons and selected bank fingerprints pass
pnpm check                                              — 279 tests pass, Astro typecheck 0 errors/warnings, Prettier and production build pass
```

The one-time bank-combination helper under local `private/` is not committed; the audit above **is committed and reproducible**. The inspectable draft specs, candidate corrections, linked table manifests, this note, published versions and fingerprints are the PR's durable evidence. These checks do not replace the maintainer's review and explicit decision for the five existing exception lessons.
