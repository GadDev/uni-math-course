# Signal tokens and component guidance

Status: visual direction selected; implementation measurements and accessibility checks pending.

## Proposed tokens

| Token | Target value | Purpose |
| --- | --- | --- |
| Canvas | `#F4F4EF` | Bright reading surface |
| Ink | `#111111` | Headings, body, rules, primary actions |
| Vermilion | `#F13E2B` | Large chapter numerals and geometric artwork |
| Functional red | `#B92819` | Proposed darker red for small text; validate before use |
| Review tint | `#FCE7E3` | Response-review background with explicit text |
| Focus | `#075CAB` | Keyboard outline distinct from brand red |
| Corners | 0–2 px | Square editorial controls |
| Rules | 1 px ink | Structure and grouping |
| Spacing | 8, 16, 24, 32, 48, 64 px | Proposed reading rhythm |

These are implementation targets, not sampled pixel guarantees: generated images include texture and local colour variation. The raster palette is not a passing contrast audit. Use black/white primary actions; test foreground/background combinations rather than assuming white text on vermilion is readable at every size.

Typography: bold condensed grotesk display face for brand, chapter numerals and headings; ordinary sans-serif for explanations and controls; correctly typeset mathematics through KaTeX HTML/MathML. No font family has been selected or bundled. Use large display type for entry pages, then reduce it for repeat activities. Test French accents, English expansion and mathematical glyph coverage in the chosen fonts.

## Component contracts

| Component | Signal treatment | Behaviour to implement |
| --- | --- | --- |
| Header | Wordmark, short navigation, thin rule, boxed FR/EN control | Full accessible language names, current section, keyboard access; preserve content and response identity |
| Course outline | Numbered ruled list, red active chapter | Stable IDs 01/02/03/05; practice remains inside chapter 05 |
| Lesson | Assumptions, formula, plain reading, truth table | Accessible semantic equations and table headings; no bitmap-only mathematics |
| Worked example | Three numbered steps, concise derivation | Identify original authorship and domain before evaluating |
| Glossary | Symbol / French / English ruled columns | Separate membership/inclusion identities; search labels and announced result counts |
| Answer group | Full-width outlined rows with radio controls | Native fieldset/legend and radio arrow-key behaviour; stable answer IDs; preserve unfinished answer |
| Hint | Separate underlined or outlined action | Optional, expanded state and announcement; mark aided evidence |
| Feedback | Submitted choice beside explicit repair explanation | Read-only response, one announced update or focused heading, retry without shame |
| Progress | Reading / attempts / proposed mastery in separate columns | Server-derived records, immutable exercise versions, private data, no rankings |
| Sign-in gate | Provider-neutral preview, useful reading exit | Real provider and sessions in the separate authentication feature; no invented policy |

## Keyboard and responsive acceptance

Proposed order: skip link → brand → primary navigation → locale actions → account action → course outline → main content. For practice: radio group → optional hint → submit → worked-example link. Show visible focus and associate validation text with the group. Preserve response on network failure and use the same submission identity on retry.

The mobile concept uses two navigation rows and full-width answers. Actual implementation must support 320 px, zoom and reflow without horizontal overflow, maintain adequate targets and prevent header/action collisions. Do not derive CSS viewport measurements from the raster size. Long headings should wrap naturally; decorative artwork should shrink or disappear when it displaces tasks.

Feedback, hint expansion, form errors, equations and truth-table navigation need manual keyboard and assistive-technology checks. Screenshots cannot prove announcements, focus movement, screen-reader readings or usable touch targets.

## Asset register and rights

The nine images are generated original UI concepts in the selected Signal direction, converted without resizing to lossless WebP. The [manifest](source/signal-screens.json) records selected source variants; [asset evidence](asset-evidence.json) records hashes and conversion checks. The corrected practice/progress versions and the homepage caption correction are included.

No source PDF, slide artwork, university logo, external illustration or font file is bundled. Typography inside the generated raster does not identify an actual licensed web font. Any implementation font must receive its own origin/licence/notices record under [the content policy](../../../CONTENT_LICENSE.md). Original project documentation and conversion code use the repository MIT licence.
