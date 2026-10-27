# Printable workbooks — delivery and evidence

**Status (2026-10-27): Draft — page code committed; four binary PDFs still need to be committed.**

The public `/fr/exercises/` and `/en/exercises/` pages follow the existing Signal reference-page design. They describe **940 original, independent exercises** in two French-language A4 workbook/solution pairs. This library is separate from the authenticated, server-graded exercise banks; it does not create graded attempts or completion records.

## Files to upload

Place the **exact original uploaded PDFs**, without regenerating or modifying them, at these paths:

| Chapter | Public path | Pages | SHA-256 |
| --- | --- | ---: | --- |
| Logique et ensembles — 300 questions | `public/pdfs/exercises/chapter-01-exercises.pdf` | 83 | `7212c87b5bb45783a0bb88186d7123b75c46949fee352526e5a7a25913159ecd` |
| Logique et ensembles — corrigé | `public/pdfs/exercises/chapter-01-solutions.pdf` | 23 | `2bb310d4f8dfdc6dc659fb6f6386747958ec39b257c4059cd9fa1010d93c9be4` |
| Droites — 640 calculs | `public/pdfs/exercises/chapter-02-exercises.pdf` | 146 | `7c936ee21b2ed47053b9f5962338746aadb4a2c9d0174d05c8a771727d16c203` |
| Droites — corrigés détaillés | `public/pdfs/exercises/chapter-02-solutions.pdf` | 81 | `3108f51b5976721ab15d4ca07e2c6827d285bfbd5e61faa209269319aba95b0d` |

The separately provided `uni-math-exercises-pdfs.zip` archive contains this exact `public/pdfs/exercises/` directory structure. From the repository root, **on the PR branch**:

```sh
unzip /path/to/uni-math-exercises-pdfs.zip -d .
git add public/pdfs/exercises
git commit -m "docs(exercises): publish four original printable workbooks"
git push
```

Alternatively, upload all four files to `public/pdfs/exercises/` using GitHub's **Add file → Upload files** workflow on the PR branch. Do not upload them to `main` directly.

## Behaviour

- The pages are static, bilingual in interface copy, and publicly readable. The PDF content is French-only, disclosed in both locales.
- Each document card displays the PDF type, format and page count.
- A download link is only rendered when the corresponding `public/` file exists **at build time**. Missing files render a non-clickable pending label instead of a broken link.
- After committing the four PDF files, trigger a **new build**; the download links will appear as stable first-party `/pdfs/exercises/*.pdf` URLs.
- The content test checks the SHA-256 of any present PDF file and the file's PDF signature to catch wrong/mixed assets.

## Release gates

1. Verify all four binary PDFs are committed to this branch, and that their fingerprints match the table.
2. Run `pnpm check` and `pnpm test:e2e` with the project's pinned Node/pnpm and browser configuration.
3. Inspect `/fr/exercises/` and `/en/exercises/` at 320px and desktop widths, both themes, keyboard-only navigation, and language-switch fragments.
4. Confirm each of the **four** download links returns a valid PDF, opens/downloads as expected, and contains the original exercise/solution pair.
5. Review publication rights for these **original** exercise supplements. They are expressly non-official and independent; the underlying University of Luxembourg course PDFs and artwork are **not** included.

Do not mark publication complete until the binary files are present and links are tested in the deployed preview. The accompanying mathematical answer keys have not been newly independently peer-reviewed in this UI-only change.
