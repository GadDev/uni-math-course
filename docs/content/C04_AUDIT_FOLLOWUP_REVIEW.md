# Chapter 4: source coverage and assessment corrections

26 November 2026. Base: `9eff7a2ebf42c140b1fa5c99042fcf87973b9cbf`.
AI-assisted mathematical and bilingual author self-check; not independent review, hosted acceptance or a learner-mastery assessment.

## Source and reading review

Reviewed the supplied `coding.pdf` (93 physical pages, SHA-256 `02e2b2a866ffb9d004f63e11cdfa10fcc3262ea61ffb025583f78cb014c6153c`), including the tables and explanation on physical pages 91–93. The final reveals repeat the comparison and add the single-letter entropy interpretation. No PDF or slide artwork is redistributed.

L57 reading v2 adds the reported King James Bible example: 4,047,392 characters, 63 symbols, costs 8/6/4.39/3.63/2.82 bits per character for byte ASCII, fixed code, Huffman and two LZW widths. Values are source-reported, not reproduced benchmarks. The text explicitly leaves full-dictionary handling and included overhead unspecified. Original calculations verify six-bit capacity (32 < 63 ≤ 64) and a relative saving of (6 − 3.63)/6 = 39.5%. This compares the displayed costs, not a guaranteed whole-file compression ratio. Single-letter entropy 4.34 does not universally bound phrase compression exploiting repetitions. Links to L46, L53 and L54 distinguish marginals, symbol-by-symbol coding and iid blocks. The older short-message cost example remains to prevent a universal-gain inference. The six L57 objectives remain unchanged; the new interpretation question is public self-study material. A new L57 v2 bank retains all six questions and answers while updating source coverage to 82–93, as required by the existing lesson/bank source-page contract. The full bilingual bank was rechecked: only pending index 5 is allowed after 1 2 3; AB? gives ABA; 1 2 3 5 gives ABABABA; first code 3 is invalid for AB; the round trip requires the same initial dictionary; and 8 codes × 4 bits = 32 bits exceeds the 24-bit reference by 8.

L53 reading v2 clarifies the title and opening: entropy is a lower bound on average length for a fixed binary uniquely decodable symbol-by-symbol code. Both full readings were compared. The existing proof remains unchanged: K = Σ2^(−ℓᵢ), qᵢ = 2^(−ℓᵢ)/K, H ≤ L + log₂ K ≤ L. Equality requires both K=1 and p=q. The L53 v1 bank remains unchanged. L44 and L55 full bilingual readings were also reread against substitution (pp. 7–9) and LZW encoding/final flush (pp. 61–68); neither reading is edited.

The chapter catalogue now maps L57 to 82–93 and L55–L57 to 61–93. Historical implementation notes remain historical records, rather than being rewritten to imply they reviewed these changes.

## L44 v3: assess both requested outputs

The defect affects all 15 active v2 questions, not only E11–E15: prompts request an encoded word and its length, while choices previously supplied only the word. New v3 keeps IDs, objectives, difficulties, prompts and correct-option positions. Every choice now includes a word and a length. One distractor per question retains a wrong word; another gives the correct word with the source-symbol count instead of the transmitted-bit count. Its feedback identifies that specific confusion. This is still single-choice recognition, not automatic grading of written reasoning.

All 15 prompts, choices, explanations and French/English feedback were read. Concatenations were recalculated independently, preserving leading zeros:

| Item | Source | Encoded word | Bits |
| --- | --- | --- | ---: |
| E01 | xyz | 001011 | 6 |
| E02 | zyx | 100101 | 6 |
| E03 | xxy | 0010 | 4 |
| E04 | yyz | 01011 | 5 |
| E05 | zzy | 11110 | 5 |
| E06 | xyxy | 100100 | 6 |
| E07 | yxz | 010010 | 6 |
| E08 | zxx | 1000 | 4 |
| E09 | yyy | 111111 | 6 |
| E10 | zzxx | 11110000 | 8 |
| E11 | xxy | 0001 | 4 |
| E12 | yyz | 1010100 | 7 |
| E13 | zzy | 111110 | 6 |
| E14 | xyxy | 00010001 | 8 |
| E15 | yxz | 00111 | 5 |

Each word uses the table given in its own prompt. Some tables are ambiguous on messages; these questions ask only for forward substitution and make no unique-decoding claim. Every item has exactly one correct word/length pair. The whole v3 bank and unchanged bilingual reading receive an author self-check; this deliberately replaces L44's previous review exception and does not promote L43/L45–L47. New hints/feedback retain the assistance exclusions of the existing grading contract.

## L55 v2: final emission without a final addition

All six prompts, alternatives, explanations and translations were read. E06 no longer presupposes a final dictionary addition: it asks which option gives emitted codes and all added entries for ABA with A=1, B=2. The correct answer is still 1 2 1 with AB=3 and BA=4. At end of input, w=A is emitted without insertion.

The other five checks remain: an integer dictionary index is not a bit width; BA first emits 2; known AB extends w without output or insertion; missing ABA at next index 5 adds ABA=5; single-letter B emits 2 without addition. All old keys and correct-option labels are preserved. The new bank receives renewed mathematical and bilingual author self-check evidence.

## Release and compatibility

Existing banks L44 v1/v2, L55 v1 and L57 v1 are untouched and remain resolvable for historical attempts. Existing exercise IDs remain so a previously seen item does not become fresh mastery evidence. L53 reading advances independently of its unchanged bank version; L57 advances its bank solely for source-provenance alignment. French/English reading fingerprints and translation-source hashes are renewed only for changed reading pairs; L44's existing paired reading fingerprints remain unchanged. No authenticated answers are imported by public components. New public L57 questions are separate from signed-in banks.

## Validation

Results are recorded below after execution; checks do not certify independent review or hosted classroom readiness.

- Pinned Node 24.19.0 and pnpm 11.25.0 were used for validation; lockfile install succeeded without dependency changes.
- `pnpm check`: passed, including 57 bilingual content/release contracts, formatting, typecheck (zero errors/warnings, nine existing hints), all 457 tests and the Vercel production build.
- Focused regression checks recompute all 15 L44 encoded-word/bit-length pairs from the prompt tables, require a unique valid pair, and retain answer projection checks. LZW tests now check the selected releases and verify ABA's emitted codes, completed additions, absent final addition and retained IDs/keys.
- `CONTENT_BASE_REF=9eff7a2ebf42c140b1fa5c99042fcf87973b9cbf node scripts/check-immutable-exercises.ts`: passed. `git diff --check`: passed.
- Built FR/EN L57 HTML contains the comparison table and new section; built L53 titles express the lower bound correctly. No `.katex-error` elements occur in either built L57 page. This is static output inspection, not browser or print acceptance.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium pnpm test:e2e`: attempted and stopped after repeated browser-launch failures. A bounded LZW retry with `--max-failures=1` confirms the launcher cannot find `/usr/lib/chromium/chromium` (exit 127), before page execution. The standard Playwright browser installation was also attempted, but its official download endpoint returned HTTP 403 in this environment. No security or application configuration was weakened. Local browser verification remains unverified; the existing CI runner supplies Chrome and must execute the suite before merge.
- Signed-in hosted persistence, deployed revision, physical-device usability, screen-reader and printed-paper acceptance were not exercised. Later proof diagrams, workshop changes and complete C04 exam/printable expansion are separate increments.
