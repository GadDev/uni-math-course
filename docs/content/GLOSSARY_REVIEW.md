# Public bilingual symbol glossary

## Delivered scope

Public `/fr/glossary/` and `/en/glossary/` pages adapt the requested French-English glossary into the Signal reading experience. Shared entry identities E01-E56 preserve the original glossary order; G57-G64 cover its code/editorial appendix. Six categories contain 64 entries in total. The header, programme and L05 lesson expose the glossary. The primary navigation now offers course and glossary; L05 remains reachable from the programme.

Every entry has both languages, a shared notation/example, page references, a spoken reading, an explanation and, where relevant, a confusion note. Readers can open the other language in a native disclosure. Search includes both languages, accents normalized and mathematical glyphs as well as TeX names. Category/search parameters and entry fragments survive language switching. A direct entry fragment takes priority over filters that would hide it. Clear resets filters and returns keyboard focus to search. Without JavaScript, all entries and native disclosures remain readable; nonworking search controls are hidden.

The cards also serve as the compact reference: symbol, name and meaning precede examples and readings. No independent practice questions, answer key, grading, progress or new account access is introduced. The five revision exercises in the standalone document are deferred to the signed-in practice workstream under the constitution, rather than shipped as anonymous practice.

## Source, authorship and mathematical review

Coverage is informed by all 96 physical pages of Bruno Teheux's *Mathématiques Générales — Logique et ensembles*, University of Luxembourg, BINFO-FCE 2026-2027. The source PDF was reviewed earlier for this glossary; its slide builds were consolidated. The source PDF and artwork are not committed. Explanations and bilingual readings are original project work. Conventional formulas/notation are labelled as course formulas or additional teaching examples; this does not claim permission to redistribute substantial course text. Source rights remain as documented in [CONTENT_LICENSE.md](../../CONTENT_LICENSE.md).

The application adapts the previously prepared glossary rather than treating slide text as application copy. Shared mathematical content is intentionally invariant across locales. Review checks covered the following:

- The E15 biconditional builds an assertion, while E16 semantic equivalence compares all truth-table rows.
- E31 membership and E32 subset inclusion have different roles; inclusion allows equality.
- E23 natural numbers include zero, consistent with the even-number example on pages 54-56.
- E28 retains French interval brackets in both languages; English bracket conventions are explained as translation support.
- E38 always names the ambient complement set. For A={1,2,3} and B={2,3,4,5}, removing A from their union gives {4,5}.
- Bounded universal quantification expands with implication, while bounded existential quantification expands with conjunction.
- All implication assignments except true/false satisfy the conditional. Converse is not generally equivalent; contrapositive is.
- The page-48 strict-age discrepancy is retained explicitly: choosing y=x refutes the stated existential/universal assertion. It is not published as a true worked answer.
- The SQL teaching model remains distinguished from general SQL/NULL/duplicates. Empty-index Python cases are identified as teaching support.
- Shared math omits French connective prose where punctuation can express alternatives; bilingual descriptions explain the role. Code notation is rendered as text rather than fed to a math renderer.

This is an author self-check, with concrete truth-table, set-element and self-comparison reasoning; no independent mathematical peer review or human bilingual approval is claimed. Another reviewer and actual assistive-technology testing remain appropriate before the class pilot.

## Validation

Run `pnpm check` and `pnpm test:e2e`. Content tests validate all 64 IDs, categories, required bilingual fields, source-page bounds and KaTeX HTML/MathML rendering. Browser checks cover public discovery, bilingual/glyph search, category filtering, empty state, keyboard reset, native translation disclosures, language/query/fragment preservation, filtered deep links, no-JavaScript reading and 320/375/768/1280 px layouts in both languages. The existing reading/auth suite also remains required.

## Integration

This feature builds on the Signal public-reading implementation merged in PR #10 and targets main directly. It contains only the glossary integration. This feature PR does not merge or deploy the application.
