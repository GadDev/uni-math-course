# Chapter 1 validation - 2026-10-18

Status: local author verification; browser/hosted acceptance is not established.

- Node v24.19.0 and pnpm 11.25.0; frozen lockfile installation succeeded with no dependency changes.
- pnpm check: passed, including documentation/release/content checks, zero Astro diagnostics, formatting, 276 tests (276 passed, zero failed), and production build. The final repeat after the responsive formula rule also passed all checks and 276 tests.
- Seven explicit validate-draft.mjs calls: L04 v4 and L12/L13/L14/L15/L16/L20 v3, all passed with zero warnings. These check structure/bilingual notation, not mathematical truth.
- logic-check.mjs on L04 v4 with this folder's L04/answer-checks.json: one of one stored truth-table keys matched (E03), zero failed, zero unchecked; 23 supplemental checks passed. Choice answers remain outside this helper's key comparison; eight independent new-choice semantic tests passed in pnpm check.
- Paired heading depth/order and mathematical strings were checked across all twenty lesson pairs. The content gate validated all 36 project lesson pairs.
- Static production inspection: all forty Chapter 1 pages built without KaTeX error markers, with every referenced diagram available in the public output.
- Seven original SVG diagrams were rasterized together and visually inspected: formula grouping, assignment tree, number families, interval endpoints, union, intersection, and complement. The supplied PDF page 17 was rendered and visually compared. No screenshots/source PDF are committed.
- pnpm test:e2e: exited 1, with 177 browser launch failures and one browser-independent test passed. Every failure reports missing chromium_headless_shell-1248. No browser assertion was reached in those failures. Both the pinned Playwright install and runtime Playwright fallback returned unusable empty/truncated browser archives; browser behavior, mobile geometry and translated-anchor interaction remain unverified locally. Browser test build succeeded. New no-JavaScript/320px image and source-part/anchor regressions are included for CI.
- git diff --check: passed.

node scripts/check-immutable-exercises.mjs passed against origin/main after committing. The branch was rebased onto main 417e91c; its only new base changes were README badges/artwork, and all reviewed lesson/bank inputs were unchanged. Existing bank archives are retained byte-for-byte; new selected archives and identical complete candidate copies are added. See docs/content/CHAPTER_01_REVIEW.md for per-key arguments, actual review scope and remaining editorial work.

## Integration update

Merged main abac4cb4df7aa3fab55c69a42f38018bb85364cc, preserving its documentation removals and the Chapter 1 content/release records. Git merged README and roadmap changes without text conflicts. The previous CI run passed 177 browser tests but failed the French 320px reading test at a 354px document width. Lesson headings now allow language-aware hyphenation with wrapping for oversized words; the regression reports the exact locale and lesson when an overflow occurs. The integration pnpm check passed all 276 tests and the production build. Browser validation is rerun by CI on the updated branch.
