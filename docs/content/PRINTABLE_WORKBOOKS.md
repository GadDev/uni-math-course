# Printable workbooks — delivery and evidence

**Status (2026-10-27): Four PDF assets are committed on `main`. Download-path bug fix under review.**

The public `/fr/exercises/` and `/en/exercises/` pages follow the Signal reference-page design. They describe **940 original, independent exercises** in two French-language A4 workbook/solution pairs. This library is separate from authenticated, server-graded exercise banks; downloads do not create grading or progress records.

## Published files and integrity

These are the actual paths committed to the repository. The `exercices` folder name is intentionally French. Do not silently rename it in code or documentation without moving the files too.

| Chapter | Public file path | Pages | SHA-256 |
| --- | --- | ---: | --- |
| Logique et ensembles — 300 questions | `public/pdfs/exercices/chapter-01-exercises.pdf` | 83 | `7212c87b5bb45783a0bb88186d7123b75c46949fee352526e5a7a25913159ecd` |
| Logique et ensembles — corrigé | `public/pdfs/exercices/chapter-01-solutions.pdf` | 23 | `2bb310d4f8dfdc6dc659fb6f6386747958ec39b257c4059cd9fa1010d93c9be4` |
| Droites — 640 calculs | `public/pdfs/exercices/chapter-02-exercises.pdf` | 146 | `7c936ee21b2ed47053b9f5962338746aadb4a2c9d0174d05c8a771727d16c203` |
| Droites — corrigés détaillés | `public/pdfs/exercices/chapter-02-solutions.pdf` | 81 | `3108f51b5976721ab15d4ca07e2c6827d285bfbd5e61faa209269319aba95b0d` |

All four documents are original supplementary practice material, not the University's course PDFs.

## Root cause of missing download buttons

PR #95 originally referenced `public/pdfs/exercises/` while the four actual PDFs were committed to `public/pdfs/exercices/`. The static page uses `existsSync()` at build time to decide whether to show each download link. Because that check used the wrong folder name, every card displayed a pending-file label even though the PDFs were present.

The follow-up fix aligns the catalogue to the actual committed paths and strengthens tests:

- Content tests **require all four files to exist**, start with a valid PDF signature, and match their SHA-256 manifests; missing files now fail CI instead of passing silently.
- Browser tests require all four download links and request each URL, checking for HTTP success, PDF content type and `%PDF-` bytes.
- French and English public pages still share the same French-language PDF files; no account is required.

## Release gates

1. Run `pnpm check` and `pnpm test:e2e` with the pinned Node/pnpm/Playwright versions.
2. Inspect `/fr/exercises/` and `/en/exercises/` at 320px and desktop widths, in both themes, using keyboard navigation and locale-switch fragments.
3. Verify all four PDFs download in the deployed production build; a successful static CI build alone does not prove production deployment.
4. Confirm original-supplement publication rights, and review mathematics and detailed solutions separately. UI tests are not independent mathematical peer review.

These supplements are not affiliated with or endorsed by the University of Luxembourg.
