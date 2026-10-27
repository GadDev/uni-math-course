# Chapter 4 — Information Theory: orange design proposals

**Status (2026-10-27):** **01 Ember Signal selected** by the course owner. Three alternatives remain here for visual comparison. This PR contains static concepts, not production code. Implementation is prepared in [draft PR #105](https://github.com/GadDev/uni-math-course/pull/105). Chapter ID **C04** and number 04 are intentional; Chapter 03 remains independent.

References: [Chapter 2 production design](../../implementation/chapter-02/README.md) · [Signal design system](../DESIGN_SYSTEM.md) · [Signal design brief](../DESIGN_BRIEF.md).

## Gallery

| Direction | Desktop FR | Desktop EN | Mobile FR | Canvas | Accent |
| --- | --- | --- | --- | --- | --- |
| Ember Signal | [View](01-ember-signal-fr-desktop.svg) | [View](01-ember-signal-en-desktop.svg) | [View](01-ember-signal-fr-mobile.svg) | `#F4F4EF` | `#F47B44` |
| Amber Circuit | [View](02-amber-circuit-fr-desktop.svg) | [View](02-amber-circuit-en-desktop.svg) | [View](02-amber-circuit-fr-mobile.svg) | `#F7F4E9` | `#F5AF3C` |
| Copper Notebook | [View](03-copper-notebook-fr-desktop.svg) | [View](03-copper-notebook-en-desktop.svg) | [View](03-copper-notebook-fr-mobile.svg) | `#FCF6EC` | `#CA754B` |
| Night Transmission | [View](04-night-transmission-fr-desktop.svg) | [View](04-night-transmission-en-desktop.svg) | [View](04-night-transmission-fr-mobile.svg) | `#181C21` | `#FF9854` |

## Four directions

**01 — Ember Signal.** A close relative of Chapter 2's Decalage green: chapter-specific orange tiles, familiar Signal split hero, ink-first typography and numbered sections. Recommended first choice: easiest to unify across course chapters. Risk: oversized artwork may crowd small screens.

**02 — Amber Circuit.** Strong amber welcome banner and a five-line binary ribbon referencing transmitted messages. Makes information theory feel playful and distinct. Risk: full-width colour blocks should give way to a neutral reading background for longer lessons.

**03 — Copper Notebook.** Muted copper, warm paper, oversized 04 and a simple entropy/histogram graphic. Best for a restrained, study-first tone. Risk: display-size numeral must not displace the learning goal on mobile.

**04 — Night Transmission.** Charcoal, orange and binary signal grid for a technical atmosphere. Best as a dark-mode study; not assumed to be the default lesson treatment. Risk: prolonged-reading comfort, colours, charts and focus states need special testing.

## Invariants and limitations

- Keeps the existing Signal typography hierarchy, strong rules, black actions where contrast permits, numbered chapter and lesson path, and a consistent FR/EN desktop concept.
- The proposed six lesson labels are placeholders pending the mathematics/content architecture review. No Chapter 4 lesson, bank, glossary or navigation release is included.
- These original SVGs are **static 1440×900 and 390×850 concept compositions** with text drawn as SVG. They are not production browser screenshots; clickability, 320px reflow, actual English mobile, text zoom, keyboard controls, screen-reader output, MathML and both themes have not been tested.
- Production mathematics must use KaTeX/MathML and real headings; never ship illustrated equations as a substitute for semantic mathematical content.
- No external font files, copied slide artwork, uploaded source PDFs or dependencies are included.

## Review and follow-up

1. **Selected:** 01 Ember Signal. The other concepts remain as historical design alternatives.
2. **Approved constraints:** orange accents only, no redesign of the shared Signal shell.
3. **Implementation in draft PR #105:** reuse Astro and the existing ChapterSelector, preserving locales and keyboard behaviour.
4. Check real browser layouts at 320/375/960/1440px in both themes, contrast, zoom, assistive technology, KaTeX and mathematics provenance.
5. Only publish bilingual lessons or server-graded banks after release/fingerprint/review gates. Do not edit immutable published exercise archives.

**Owner decision:** select 01 Ember Signal, use orange `#F47B44`, and preserve the existing Signal shell, black actions, numbered sections and mobile artwork treatment. The original geometric signal artwork and bilingual overview are implemented for review in [draft PR #105](https://github.com/GadDev/uni-math-course/pull/105). Nothing here is merged or deployed.
