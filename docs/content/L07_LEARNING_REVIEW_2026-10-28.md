# L07 beginner learning review — 2026-10-28

Status: AI-assisted mathematical and bilingual author self-check by Codex. This is not independent mathematical peer review or human translation approval. No hosted or classroom acceptance is asserted.

## Scope and initial assessment

Base: main `416c57c`, French/English reading version 4. Read the full L07 lesson, prerequisites L04–L06 and following lesson L08; inspected Astro content loading, lesson routing, existing L05/L37 experiments, global styles, content contracts and historical L07 reviews. The public Vercel URL could not be retrieved with the browsing tool. Source inspection and local production rendering are the basis of this revision; the source PDF was not available. Pages 30–31 remain repository provenance.

The original definitions and both truth tables are correct. The teaching gap is progression and practice, rather than an identified error in the source mathematics.

| Priority | Original French passage (base file `content/lessons/L07/fr.md`) | Beginner difficulty | Implemented response |
| --- | --- | --- | --- |
| 1 | Lines 23–35, definition followed immediately by a completed table | No motivation or row construction; the true result for two false inputs can look mistaken | Card motivation; implication reminder; explicit construction of rows 10 and 00; two-direction diagram and row experiment |
| 1 | Lines 39–46, the two levels and criterion in one paragraph | Local agreement and a claim over all assignments can blur together | Separate P/Q notation, comparison table, proof in both directions and row-by-row evidence experiment |
| 2 | Lines 50–59, a completed equivalence table | The learner sees the answer without a reusable procedure or justification for the chosen formulas | Five-step method, row 10 worked out and independent derivation by negating the failure case |
| 2 | Line 69, “si et seulement si” | The direction of “si” versus “seulement si” is implicit | Read each direction explicitly; retain the even/divisible-by-two example and contrast divisibility by four |
| 2 | Lines 73–79, account practice and short takeaway | No public attempt-before-solution sequence or study sheet | Four progressive public exercises, separate hints/solutions, objective-linked self-assessment and revision sheet |
| 3 | No lesson-specific print rules or interactive assets | Printing cannot preserve an experiment or expand its explanations automatically | Deterministic static examples, expanded disclosures and scoped A4 print styling |

All eight previous section headings remain, preserving their generated anchors. New French and English sections align by order and depth. Lesson frontmatter advances to version 5 in both languages. Selected exercise bank v4 and every archived bank remain unchanged; reading versions and bank versions are distinct contracts.

## Interaction specifications

| Component | Objective and initial state | Student action and response | Prediction and reflection |
| --- | --- | --- | --- |
| Two directions, one AND | Derive the biconditional from its two implications; A = B = 0 | Native selects accept only 0/1. Both arrows, numeric implication values, substituted AND, explanation and highlighted complete-table row update together. Reset restores 00. | Predict which direction fails when only A becomes 1, then B; explain why two false operands give a true biconditional and why conjunction differs. |
| One row or the whole table | Separate incomplete evidence, refutation and exhaustive proof; P = A ⇒ B, Q = B ⇒ A, only 00 examined | Choose among five named formula pairs; inspect assignments using keyboard-operable buttons. Unexamined result cells remain unknown. First mismatch refutes immediately; agreement establishes equivalence only when every displayed assignment has been checked. Pair changes clear previous evidence; reset restores the original pair and one examined row. | Predict whether agreement on 00 implies equivalence. Find a differing row; then compare A with double negation and explain equivalence without either side being a tautology. |

The five choices are converse, implication/disjunction, De Morgan, a false De Morgan variant and double negation. All use at most A and B. The double-negation case explicitly explains that B is unused and the four displayed rows repeat the two necessary cases. Repeated visits do not increase the evidence count. Select values are checked against the finite allowed choices; no free formula parser or numerical approximation is introduced.

The SVG gives both directions with text and numbers, independent of colour. Tables have captions and column/row headings. Dynamic conclusions use polite atomic status regions. Controls use native selects/buttons, visible focus and 44-pixel minimum heights. There is no autoplay, dragging or pointer-only operation. The experiments are public teaching material, not recorded assessment, and import no answer-bearing exercise module.

## Astro, React and print decisions

React and MDX already exist in `astro.config.ts` and the committed dependencies; L37 supplies an in-content island precedent. Convert only the paired L07 reading files to MDX and insert two `client:visible` islands beside the relevant explanations. React keeps the selected formulas, visited-row evidence, diagram and conclusions synchronized. Native JavaScript would also be possible, as in L05, but would require manual coordination of those states. No package, lockfile, global route or infrastructure change is needed.

Astro renders all prose, proofs, tables, diagrams, exercises and reference examples on the server. Interactive controls appear only after hydration; without JavaScript the complete reference examples and native solution disclosures remain usable. Print CSS always substitutes the original deterministic examples, independent of the student's last input, and expands all hints/solutions. It is scoped to L07, with no PDF-generation feature or change to other lessons' printing.

## Mathematical and bilingual self-check

- Both implications have column 1101 in assignment order 00, 01, 10, 11 when read in their own input order. On the common A/B rows, the converse has 1011. Their conjunction is 1001, independently matching equality of the two inputs.
- The general equivalence criterion follows directly from equal row values in both directions, without extrapolating examples to arbitrary formulas.
- The implication/disjunction pair has columns 1101/1101; De Morgan 1110/1110; the incorrect De Morgan pair 1110/1000; double negation 0011/0011 on the displayed two-variable table. Explicit tests use independent literal columns rather than trusting the UI evaluator as its own oracle.
- The alternative biconditional expression is true precisely at 00 and 11: its conjunction branches isolate those two assignments. The four exercise solutions follow respectively from implication failure, De Morgan's complete table, a 01 counterexample and this two-case construction.
- The implication derivation negates its unique failure case, then uses De Morgan and double negation. All transformations preserve the whole truth function.
- The integer example states natural numbers include zero; proof for a whole domain is distinguished from evaluating a fixed integer. “Si” and “seulement si” have the correct respective directions.
- Read French/English prose and component copy side by side. Both preserve definitions, domains, caveats, hints, feedback and exercise solutions. Mathematical expressions occur in the same sequence in the paired sources, checked by the repository content gate. Bilingual heading alignment and language-switch anchors are checked in the production/browser paths.

The selected v4 bank retains the review recorded in [the previous clarity review](LESSON_CLARITY_REVIEW_2026-10-23.md); its hash is unchanged. This note renews the reading mathematical/translation self-check and French translation-source fingerprint for the actual version 5 files. It does not claim a new independent review of the unchanged bank or alter historical grades.

## Validation

Executed with Node 24.19.0 and pnpm 11.25.0, using the installed Chromium executable for local browser checks:

- `pnpm check`: passed, including documentation/release/content gates, type checking, formatting, 310 tests and the Vercel production build. Three of those tests specifically check the public L07 evaluator against independent truth columns and all subsets of visited rows.
- `pnpm test:e2e tests/e2e/l07-explorers.spec.ts`: all 10 passed on the final implementation. Covers every biconditional input, all five formula choices, partial/full/repeated evidence, reset and pair changes, native keyboard controls and focus, no-JavaScript reading and disclosures, 320-pixel dark/reduced-motion layout, fixed print examples after manipulation, expanded print solutions and language-switch anchors.
- Full `pnpm test:e2e`: 290 passed, 3 failed. All three failures are the existing French 1051-pixel header geometry assertions in `chapter-navigation.spec.ts`, `reading.spec.ts` and `theme.spec.ts`. Reproduced each failure on an isolated, unchanged `416c57c` main worktree with the same runtime/browser. These failures are not fixed or waived by this L07 change; the full browser gate is not green.
- Served the final Vercel static output locally and manipulated both islands in both languages: no browser page exceptions. Inspected desktop French experiments and a 320-pixel dark rendering.
- Printed both final production reading pages to A4 after changing the interactive inputs. Rendered and inspected all 10 pages per language, including the fixed 00 example, complete converse counterexample table, all four explained solutions and the separate revision/self-assessment page. Text-bound checks found no horizontal clipping; print output contains no reset controls. Reduced the English SVG label to avoid overlapping the operand boxes and kept paragraphs/reference experiments together where possible.
- Published exercise files have no changes relative to main. Practice continues selecting bank v4; lesson reading advances independently to v5.

Screenshots: [two-direction explorer](../assets/l07/row-explorer-fr.png) and [counterexample explorer](../assets/l07/equivalence-explorer-fr.png).

Hosted sign-in/persistence acceptance, actual printer/device and screen-reader testing, source-PDF comparison and human mathematical/translation review remain separate. Automated checks and this author self-check do not certify them.
