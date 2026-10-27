# Chapter 4 — signed-in practice extension (27 October 2026)

**Owner instruction:** “Add also a lesson around huffman's algorithm simple explanation and update PDF workbooks and add 15 exercices per lesson when you are signed in.”

## Release decision and scope

The owner requests **one seventh reading lesson (L49, Huffman)** and **15 authenticated exercises per lesson, L43–L49 (105 in total)**. The existing Supabase server-side verified-user gate protects the practice page and grading endpoint; no anonymous answer-bearing endpoint is added. The first six practice banks move to **v2** (v1 is kept unchanged in this draft PR); L49 begins with **v1**. All seven banks carry six objective IDs, 15 bilingual single-choice prompts with detailed feedback, and a server-held answer key. The correct choice is **not always option a**.

The repository's `review` and `translation.review` remain **unreviewed-exception**, under this explicit owner-requested practice availability exception. The exercises have been constructed from reviewed *definitions* and deterministic calculations, with mechanical checks for structure, unique-decoding witnesses and Huffman frequency arithmetic. **No independent human mathematical or bilingual review has occurred**. These are voluntary practice questions, **not certified assessments**; a green CI or fingerprint is not proof of educational correctness.

**Important correction:** The originally staged L45 v1 single-choice bank had some answer IDs pointing to the wrong yes/no label. Rather than serving that bank, L45 v2 derives the correct classification from the draft's verified prefix/unique-decoding flags and rotates option IDs. Other L43–L48 banks are also upgraded to 15-item v2 with newly mapped answers.

## Source boundaries

The supplied PDF covers binary messages, alphabets, substitution codes, unique decoding, symbol probabilities, average code length, self-information and entropy. **Huffman coding is not taught in that PDF.** L49 is a clearly marked independent pedagogical extension connected to pp. 14–16 (motivation only). Its deterministic example A:8, B:4, C:2, D:2 gives A=0, B=10, C=110, D=111 and weighted length 28/16 = 7/4 bits per symbol. The additional explanation follows widely taught Huffman-tree construction; one reference is Stanford CS106B's Huffman reading at https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/24-huffman/huffman_background.html.

## Printable books

Two **bilingual A4 workbooks** have been regenerated: **700 questions** (the previous 600 plus 100 original Huffman exercises) and **700 matching detailed solutions**. The PDF documents were generated in the conversation's PDF environment and can be downloaded there. The GitHub connector cannot directly materialize those local PDF bytes, so **the PDF binaries are not attached to PR #105**. The Chapter 4 downloads on the site must stay **pending** unless the actual binaries are committed under `public/pdfs/exercises/` and their SHA-256 hashes match the manifest. Never show active links to missing files.

Exercise IDs in the books are `C04-T01-E001`–`C04-T07-E100`. The **105 signed-in interactive exercises are a separate assessed selection**, not a claim that all 700 printable questions are online. Signed-in practice is answered and persisted server-side using the existing security and RLS contracts.

## Remaining gates

- [ ] Independently review and correct the 105 interactive solutions and all 700 workbook solutions.
- [ ] Review French/English wording parity and accessibility.
- [ ] Confirm authenticated sign-in, practice submission and private saved progress with real cloud credentials.
- [ ] Add the actual PDF binaries to GitHub before marking website downloads available.
- [ ] Run full CI, responsive layout and keyboard navigation tests.

No Chapter 3 files, existing chapter bank versions, or Supabase access controls are changed.
