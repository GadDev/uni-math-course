# Chapter 4 reading-only publication decision — 27 October 2026

**Change owner request:** “Push them as published lessons in PR #104.” The request authorizes inclusion of the six source-derived bilingual reading pages in the public lesson collection on merging PR #104. It **does not** state that the exercise answers or the translations were independently reviewed, and it is not authorization to serve practice questions.

## Scope and release status

- Public reading pages: **L43–L48**, six FR/EN lesson pairs. L37–L42 are held for the separate Chapter 3 six-lesson design plan in PR #106. Chapter 3 itself remains untouched.
- Source: supplied 20-page `coding.pdf` (BINFO-LLL 2022–2023). Rewritten original explanations; PDF not redistributed.
- Frontmatter: `extended`, `version: 1`, exactly six stable objectives per lesson; paired formulas and section counts checked by `check-content`.
- Bank files: six original *minimum contract* banks with six bilingual single-choice questions each (one per lesson objective). They are intentionally **not served**: all new release records set `practice: false`. These bank contents are **not** the 600-item draft banks in PR #107; those remain in the editorial draft PR for later review and conversion.
- Registry states: **`unreviewed-exception`** for both mathematical and FR→EN translation review. This states the review has **not** happened; no reviewer or self-check is invented. The only authority for the exception is the maintainer request to expose the reading pages, and only the reading pages, from this PR.
- Hashes: SHA-256 of exact FR/EN Markdown and selected v1 bank bytes, bound in `content/releases.json`. Recording hashes is a reproducibility gate, **not mathematical review**.
- Consequence: **42** public bilingual reading lessons across Chapters 1, 2 and 4, **36** publicly served practice banks. Chapter 3 remains a design proposal and is not live.

## Source-sensitive findings carried into lessons

- PDF p. 9: `c(z)=10=c(yx)` is an ambiguous code.
- PDF pp. 14–15: `c1(x)=001=c1(zy)` means `c1` is *not* uniquely decodable, even though p. 10 states later codes are uniquely decodable. `c2` is uniquely decodable, but not prefix-free.
- PDF p. 15: `L(c1)=2.25`, `L(c2)=1.75` do not prove optimality; a supplementary prefix code has average length `1.5`.
- PDF p. 20: per-symbol self-information `I(s)=-log2(p(s))` is distinguished from source entropy `H(S)`; the last slide ends `Exemples. [...]` and provides no finished numerical examples.
- New content is clearly identified as *additional teaching work* rather than invented slide text.

## Open review work — blocks enabling practice

- [ ] Full independent/qualified mathematical review of lesson claims, derivations and 600 draft exercises.
- [ ] French/English pedagogical review and source alignment (the formula parity check does not prove translation fidelity).
- [ ] Review the 36 staged production-format exercise choices/options and all feedback before serving any bank.
- [ ] Complete print-ready A4 exercise/correction books and assessment exams independently of the source PDF.
- [ ] Run CI and real browser/keyboard/mobile QA for the Chapter 4 overview and lesson routes.

The PR remains draft pending CI and owner visual/editorial acceptance. Merging it publishes the **reading** content; neither the exercise drafts nor the 36 staged questions are public practice, and no class-pilot review is claimed.
