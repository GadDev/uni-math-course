# Chapter 3 English challenge questions: artifact correction

Date: 26 November 2026. Base: `9eff7a2ebf42c140b1fa5c99042fcf87973b9cbf`.

The published English challenge question PDF contained worked answers in place of question stems. For example, L37-P041 began with the denominator's zeros rather than asking for the domain. The English 600-question workbook and English challenge-solutions PDF contain the intended original question. The French challenge question PDF also confirms the question's role.

Restore all 72 English question stems from the existing original workbook. Preserve their IDs, selection, order, mathematical wording and three-paper structure (24 questions, four per lesson). Keep the separate solution PDF and every graded JSON exercise bank byte-for-byte unchanged. This corrects a printable artifact, not a grading contract or historical attempt.

The corrected 22-page A4 booklet provides a cover, instructions, progress sheet, contents and one page of four questions for each lesson in each paper. Timing and marks are explicitly suggested practice conventions, not official examination rules. Caret/underscore notation is explained; the derivative apostrophe is normalized typographically without changing meaning. No source university PDFs or copied slide artwork are distributed.

The reviewed question source is `scripts/data/chapter-03-challenges-en.json`. Rebuild with Python 3 and ReportLab using `python3 scripts/build-chapter-03-challenge-en.py`. This is an offline authoring tool, not an application dependency. Its output is deterministic and uncompressed for a dependency-free Node content test of the actual rendered PDF strings. The download manifest binds the corrected PDF's new hash and 22-page count.

Verification: extracted all 72 question stems from the resulting PDF and compared them with the source data; checked unique IDs and lesson/paper distribution. A regression test checks the delivered PDF's complete stems and rejects the former answer-only passages, beyond existing hash checks. All 22 pages were rendered for visual review. These checks preserve original question meaning; they are not independent human mathematical review or hosted acceptance.

## Executed checks

- Pinned Node 24.19.0 and pnpm 11.25.0: `pnpm check` passed (456 tests, production build and documentation/content/type/format gates).
- Rebuilding the final PDF is deterministic; the new PDF-content and download-catalog tests pass after regeneration. All 22 pages were inspected, including the final progress-page wording.
- `node scripts/check-immutable-exercises.ts` passed; graded banks and all solution PDFs remain unchanged.
- Download-page Playwright suite: 15/15 passed in French/English, including valid PDF responses, 320/375/501/650/768/1280px layouts and section-preserving language switching. The system Chromium launcher was unusable and the standard download unavailable; a temporary Chromium 158 executable supplied the existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE` option. No project dependency or browser configuration changed. Hosted verification remains separate.
