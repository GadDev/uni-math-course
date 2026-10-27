# Chapter 4 — Ember Signal implementation

**Status: six bilingual reading lessons staged for publication on merge; interactive practice withheld pending review.** This is the selected **Ember Signal** visual direction from [design PR #104](https://github.com/GadDev/uni-math-course/pull/104), not an approval to publish Chapter 4 lessons.

## Design decision

- Chapter **C04**, titled **Théorie de l’information / Information theory**. Chapter 03 is not part of this work.
- **Ember orange** `#F47B44` (light), `#FFA76C` (dark) is used for decorative geometry and large markers.
- Deep orange `#923B1D` (light) / pale orange `#FFD2B2` (dark) is used for small labels and links rather than using the brighter accent as foreground text.
- Keep the Signal typography, page and header shell, **black main call-to-action**, original numbered section treatment and Chapter 2's mobile artwork behaviour: decorative art is hidden below 700px.
- The artwork is a source-controlled, original **SVG geometric signal grid** added as `SignalGeometry variant="ember"`, alongside the unchanged `logic` and `decalage` variants. with quarter-circle, rectangle and triangle motifs. It uses existing CSS design tokens; no rasterized formulas, copied source-PDF images, dependencies or external fonts.
- Keep the existing native keyboard-accessible chapter selector. Chapter 4 appears as **Reading available** with six bilingual lesson links.

## Content and release boundary

The six illustrated learning-path groups reflect the provided 20-page information-theory PDF: bits/messages (pp. 2–6), coding (pp. 7–9), unique decoding (pp. 9–10), symbol probabilities (pp. 11–13), average codeword length (pp. 14–16), and entropy (pp. 17–20). These topics correspond to **L43–L48, the bilingual reading lessons in this PR**. The formula rendered through KaTeX/MathML is the source's map from source alphabet to binary codewords. The overview does not assign attempts, falsely display mastery progress, or navigate to unavailable lessons.

Chapter 4 reading links are now included in the chapter outline. New lesson banks are present for the content contract but disabled for online practice. All 36 existing lesson releases and immutable exercise archives are untouched.

## Review checklist

- [ ] Run `pnpm check` on Node 24 / pinned pnpm; resolve failures.
- [ ] Run `pnpm test:e2e` including the new Chapter 4 responsive/no-JS coverage.
- [ ] Capture real Chapter 4 overview at 320/375/960/1440px in French and English, in light and dark themes.
- [ ] Keyboard test chapter picker, Escape, language switch and skip link.
- [ ] Validate colour contrast, 200% zoom, long translated labels and screen-reader math reading.
- [ ] Verify progress-page navigation has no Chapter 4 dead anchor until the first released lesson exists.
- [ ] Complete source-aligned lessons, bilingual review, immutable exercise-bank release metadata and PDFs in separate approved changes.

Do not treat SVG design studies as browser screenshots or tests. Nothing here is merged or deployed.

## Reading-only release

Lesson IDs L43–L48 have `practice: false`, with explicit unreviewed review/translation exceptions in `content/releases.json`. For the actual decision and review gaps see [content release decision](../../../content/chapter-04/RELEASE_DECISION.md). The 600 printable exercises and worked solutions are separate from online grading, and are not evidence of independent review.
