# Number families — bilingual reading review

Status: original prerequisite support / optional enrichment · 2026-10-15

## Purpose and scope

The new public **/en/numbers/** and **/fr/numbers/** references complement lesson L10 without creating a numbered lesson or an unreviewed, published exercise bank. The nested chain ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ follows the set introduction in L10 (PDF pages 41–43 in the course map). Its extension to ℂ, irrational numbers, imaginary numbers, signs, parity and primality is **original enrichment**, not attributed to the source PDF.

## Mathematical and bilingual self-check

- ℕ includes 0, matching the project constitution. “Whole numbers” is labelled as an informal English term; ℕ is not duplicated by a supposed universal ℕ ⊊ W layer.
- ℤ includes negatives; every integer n is rational because n = n/1.
- ℚ consists of a/b with integer a,b and b ≠ 0. Terminating and eventually periodic decimals are rational.
- Irrational = ℝ \ ℚ. π, e, and √2 are irrational. Irrationals are **not** nested inside ℚ.
- Complex = a + bi, real a,b, i² = −1; reals have b = 0. Purely imaginary nonzero bi lies outside ℝ.
- 0 is neither strictly positive nor strictly negative. 1 is neither prime nor composite. 2 is the only even prime.
- The diagram and both languages agree about nesting, zero, and where irrationals and non-real complexes sit.
- Guided examples and answer disclosures are **reading**, not authenticated graded exercises; there is no saved attempt or mastery claim.
- Neither PDF content nor third-party artwork is redistributed. The illustration is CSS and semantic HTML.

## Technical review plan

- Run \`pnpm check\` (format, content, typecheck, tests, build) and \`pnpm test:e2e\`.
- Browser checks include FR/EN routes, MathML, disclosure keyboard, language-switch anchor, and widths 320/375/768/1280.
- Manually inspect table's own horizontal scroll and focus visibility at 320px. Screen-reader review and independent mathematical peer review remain outstanding.

This review is an **author self-check**, not independent peer verification.
