# Chapter 4 revision and assessment coverage

Scope: partial implementation of issue #164, linked to #160, 20 November 2026.
This change adds revision support and corrects coverage descriptions. It does
not add or independently review an assessment bank, establish official exam
rules, or certify hosted acceptance.

## Evidence and source limitation

The branch was compared with freshly fetched main at
`8b5a425c13dbd6551fcbbdd0acd3df12bb64e068`. The handoff recorded the production
exam catalogue listing C01–C03 and excluding L50–L57. Existing review records
were read: [Chapter 4 update](CHAPTER_04_UPDATE_REVIEW.md),
[LZW](LZW_REVIEW.md), [chapter exams](TRAINING_EXAMS_REVIEW.md) and
[final exam](FINAL_EXAM_REVIEW.md).

The first record describes a 60-page source; the LZW record describes the newer
93-page `coding.pdf`. The current source PDF was not available in this session.
No new source inspection or confirmation of examinable topics is claimed.
Current source inspection and confirmation of official reference/calculator
rules remain open. New C04 assessment coverage, including suitable L50–L57
questions, must follow that confirmation and the existing versioned-bank,
provenance, server-held-answer and mathematical/translation review contracts.
Issue #164 therefore remains incomplete.

## Delivered scope

- The bilingual online reference adds L43–L57 pointers, individual lesson
  links and the public LZW workshop. Formulas were checked against the
  implemented lessons, not newly against the PDF. The summary states positive
  normalised probabilities, uniquely decodable binary codes, the distinction
  between Kraft existence and a particular assignment, the joint equality
  conditions for the entropy bound, iid complete-block assumptions and units,
  and LZW's next-free-code special case. Complete proofs remain in the lessons.
- The final catalogue and prestart notice explicitly exclude L50–L57;
  printable C04 workbooks explicitly cover only L43–L49. The catalogue states
  that no dedicated C04 paper exists. Chapter prestart notices derive their
  selected lesson IDs from the answer-free question projection. Existing banks,
  timing, scoring and PDF files are unchanged.
- Reference-allowed practice and closed-book recall have separate bilingual
  descriptions. The existing no-calculator recommendation is confined to
  closed-book training; official rules remain to be confirmed with the teacher.
  English pages retain explicit French-only labels where applicable.
- The offline manager derives the available bilingual lesson count from the
  build manifest, separately from download completion on the device. The public
  path allowlists exclude exams, workshops, the quick reference and PDFs.
  See [offline scope](../OFFLINE.md).

## Verification scope

Required commands are `pnpm check` and `pnpm test:e2e`, using Node 24.19.0 and
pnpm 11.25.0. Actual results are recorded in the PR. Browser regressions cover
bilingual coverage notices and resource links, keyboard reference navigation,
320px light/dark reference layouts, chapter and final exam prestart notices,
and pack downloads followed by offline first visits to L50/L54/L55/L57 in both
languages. Existing tests retain the complete exam marking flows and PDF
downloads. Screenshots of the new section are saved as local test artifacts.

Local synthetic-account tests do not establish hosted sign-in acceptance,
real-device offline reliability, independent mathematical review or complete
accessibility compliance.
