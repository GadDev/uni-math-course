# Public bilingual symbol glossary

## Scope and use

The public `/fr/glossary/` and `/en/glossary/` pages contain 143 entries: the original 64 logic/code entries plus 79 missing terms from the Droites glossary. All existing E01–E56 and G57–G64 identities, wording and examples are preserved. New D-prefixed IDs match the standalone Droites glossary; gaps are intentional because shared concepts reuse existing entries. This is one glossary expansion, not a lesson or practice release.

Readers can search words in either language and mathematical glyphs, filter by family, open the other-language reading, and share an entry fragment. Language switching preserves filters and location. All content remains readable without JavaScript. Public examples are explanatory reading; the standalone revision questions are not added as anonymous practice.

The data schema is version 2: `sources` identifies each PDF, and every entry has `sourceId` plus its physical `sourcePages`. Cards display the source label before page numbers. This prevents a page in Droites from being attributed to Logique. The original entry IDs remain stable. No account, dependency or infrastructure change is introduced.

## Sources and deduplication

| Source | Physical pages | Coverage |
| --- | --- | --- |
| Bruno Teheux, *Mathématiques Générales — Logique et ensembles*, BINFO-FCE 2026–2027, University of Luxembourg | 96 | Original 64 entries |
| Bruno Teheux, *Mathématiques Générales — Droites : du papier à l’écran, puis au machine learning*, same course/year | 87 | 96 standalone glossary concepts: 79 additions and 17 mapped to existing entries |

The supplied Droites PDF was read page by page for the standalone glossary, including diagram labels and Python code. Page numbers count the cover as page 1. Progressive slide builds are consolidated. The source PDFs and artwork are not committed. Explanations and bilingual readings are original project work with conventional mathematical notation, under the existing [content-rights policy](../../CONTENT_LICENSE.md).

Shared concepts are reused rather than copied:

| Droites IDs | Existing app entries |
| --- | --- |
| D001 | E01, letters and variables |
| D004–D005, D008 | E21 addition/subtraction; E22 implicit multiplication |
| D011–D012, D018 | E03 grouping; E17 equality; E04 ellipsis |
| D015–D017 | E18 greater than; E20 less than or equal; E19 greater than or equal |
| D039–D041 | E26 reals; E24 integers; E31 membership |
| D044, D048, D052 | E33 set-builder notation; E39 ordered pairs; E45 predicates |
| D093 | E56 Python ranges |

Additions cover opposite signs, multiplication/division/fractions, powers and roots, absolute values, identities and equation transformations; sigma/indices/means; coordinates and distances, lines and screen transforms; residuals, centered sums, prediction and correlation; and missing Python calculation notation. Existing general symbols retain their original Logic provenance rather than inventing additional source-page claims.

## Mathematical and bilingual author self-check

- Preserve the difference between exponents and subscripts, x bar and y hat, and proof variable r_i versus correlation r. The French readings and English readings describe the same shared expressions.
- Keep French interval notation in both languages. Zero is allowed for absolute values, squares and sums of squared residuals.
- A real square root needs a nonnegative radicand; denominators must be nonzero. Integer powers on Droites page 14 use nonzero bases under the stated course hypotheses.
- Slope from two points requires different x coordinates. The unique least-squares line requires Sxx > 0; correlation additionally requires Syy > 0. Aligned horizontal/vertical data do not have a defined correlation under that formula.
- Droites page 66's “always positive” sum of squares is qualified as nonnegative. Page 81's correlation properties require the nonzero-spread domain. A visible source note records both qualifications.
- The false equation equivalence on pages 19–20 is identified as the course's error-finding example, not taught as a valid rule.
- Screen coordinates increase downward vertically on pages 53–58; Bresenham explicitly switches to an upward vertical axis on page 59. The simplified loops do not cover every endpoint/vertical-line case.
- Logique page 48's strict-age discrepancy and all earlier logic distinctions remain visible. Original numeric truth-table values are not reinterpreted as arithmetic identities.
- Four-point regression and ten-point Python calculations are different datasets. The standalone recalculation gives approximately m=0.201386, p=3.308626, r=0.992558 for the ten printed observations. No causal claim is inferred.

These are author checks using algebraic identities, set membership, direct numerical calculations and French/English comparison. They do not certify independent mathematical peer review, human translation approval or hosted class acceptance. No lesson/practice release evidence or saved learner history is modified.

## Validation

Run `pnpm check` and `pnpm test:e2e tests/e2e/glossary.spec.ts`. Content checks validate unique IDs, both languages, source-specific page limits, known categories and math rendering, including the new concept distinctions. Browser checks cover bilingual/glyph search, source labels, filtering/reset, language/query/fragment preservation, native disclosures, no-JavaScript reading and 320/375/768/1280 px layouts. Dedicated Droites journeys test sigma and regression searches in both languages. Actual screen-reader and deployed-preview acceptance remain separate checks.
