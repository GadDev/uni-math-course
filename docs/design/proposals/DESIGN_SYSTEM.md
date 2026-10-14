# Design tokens and component guidance

Status: proposed. Implement only after design review; no UI-library decision is made here.

## Tokens

| Token | Value | Purpose |
| --- | --- | --- |
| Paper | `#F6F3EB` | Reading canvas |
| Surface | `#FFFEFA` | Content and response surfaces |
| Ink | `#243832` | Body, headings |
| Muted | `#56645E` | Supporting copy; keep readable |
| Teal | `#175A50` | Actions and selected navigation |
| Teal soft | `#E8EFE8` | Formula and context backgrounds |
| Rust | `#834528` | Error-review text and border |
| Rust soft | `#FBEFE5` | Review background |
| Divider | `#D5D9CC` | Decorative structure, not sole input boundary |
| Focus | `#075CAB`, 3 px, 4 px offset | Visible keyboard focus |
| Radii | 6, 9, 12, 16 px | Controls → content surfaces |
| Spacing | 4, 8, 12, 16, 20, 24, 32, 48 px | Consistent rhythm |

Headings: Georgia / DejaVu Serif fallback, 48 px desktop, 36 px mobile, 33 px at 320. Body: Arial / DejaVu Sans fallback, 16 px desktop, 15 px mobile. Math: DejaVu Serif, 30 px desktop, 24–26 px phone. Supporting copy: 12–14 px; 10–11 px is restricted to nonessential proposal annotations and compact metadata. Production should validate actual font rendering before keeping small annotations.

Desktop header: 88 px; page max width 1312 px including padding; sidebar 216 px and 52 px gap. At 1050 px, compact spacing and single-column teaching panels. At 700 px and below, hide the sidebar, show a course-outline link, use a two-row header and stack panels in reading order. Phone gutters: 20 px, 16 px at 320. No truncation or forced single-line French explanations.

## Components

| Component | Contract |
| --- | --- |
| Header and locale pair | Reading language stays in the action area. FR and EN have full accessible names. Keyboard-operable buttons, active pressed state, preserve content identity and response state. |
| Course outline | Four pilot topics; only implication has a designed lesson. Others are clearly to be authored. Unreleased later chapters do not pretend to be available. |
| Domain card | State assertions, truth-value domain and logical framework before the mathematical definition or question. |
| Formula block | Meaningful MathML, visible equation and adjacent spoken reading; never use a raster formula as the sole accessible representation in production. |
| Truth table | Caption, scoped headings, readable row labels. False row says “Faux / False”, not colour alone. Keep notation V/F in English and explain it explicitly. |
| Response group | Native fieldset, legend, radio inputs, whole-label target. Use stable answer IDs and arrow-key radio behaviour. |
| Hint | Separate deliberate action, visible focus, contextual note after reveal. Production must announce its expansion and flag the response as aided. |
| Feedback | Original submitted response remains visible and read-only. Text identifies the error and explains repair. Production moves focus to a feedback heading or announces one complete update; avoid duplicate announcements. |
| Progress | Three independent measures, no public ranking. Mastery explicitly a proposal. Attempts retain exercise/version and hint/reveal context. |
| Sign-in gate | Return-to-reading action; provider-agnostic until selected. Do not imply implemented auth, promised storage periods or approved policy. |

## Keyboard, input and status behaviour

Proposed order: skip link → brand → course/glossary/private-space navigation → language buttons → sign-in/private-space action → course outline → main content/actions. On mobile the visual sidebar is removed from the focus order. The first fixture Tab lands on the skip link; Enter brings navigation to main.

Exercise: radio group → optional hint → enabled submit → worked-example link. No response selected: disable submit and explain why in text. Invalid/missing response returned by the future server: preserve input, render a labelled error adjacent to the group, associate it through `aria-describedby`, and focus the group or error summary. Network failure: say no saved result was received, retain the selection, and retry the same submission identity. These error states are specified, not implemented.

Hint controls should use `aria-expanded`/`aria-controls` and a clear announced hint. Feedback should use an announced status region after a submission; the static fixture's status markup is not proof that a real asynchronous update is announced. The disabled sign-in fixture is illustrative; a real gate needs an enabled action only once authentication is functional.

Production acceptance: manually traverse the whole journey with keyboard; test NVDA/Firefox and VoiceOver/Safari for equations, radio choices, errors, hints and feedback; inspect zoom/reflow and touch input. A checked screenshot cannot establish these behaviours.

## Assets and rights

All WebP files are original UI renders of the [local fixture](source/prototype.html), authored for this proposal. No third-party artwork, source slide image, copied course passage or PDF is embedded. The abstract ∴ mark is original text styling, not a university logo. Original code and documentation use the repository MIT licence.

No fonts are bundled. Screens use host-installed DejaVu Sans/Serif through system fallbacks; DejaVu's glyph designs derive from Bitstream Vera with the DejaVu/Bitstream licence and applicable notices in the host font package. Browser/rendering dependencies are external tooling, not shipped app assets. A future bundled web font requires its own licence/notices record under [the content policy](../../../CONTENT_LICENSE.md).
