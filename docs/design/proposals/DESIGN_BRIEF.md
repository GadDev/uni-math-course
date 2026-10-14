# Signal design brief

Status: selected visual direction; raster concepts for review. Owner: GadDev. Updated: 2026-10-14.

## Decision and scope

The owner selected **Signal** after reviewing three artistic directions in chat: Signal (Swiss editorial graphics), Orbit (midnight scientific observatory), and Forma (expressive colour-field studio). Signal uses near-white, black and vermilion; condensed grotesk display type; precise rules; oversized chapter numerals; square controls; abstract arrows and circles.

This directory contains the nine selected Signal concepts: course overview, lesson, worked example, glossary, unanswered practice, incorrect feedback, private progress, sign-in gate and mobile practice. The previous annotated-notebook images, HTML fixture, renderer and associated test evidence are removed. Orbit and Forma are not included in this selected gallery.

The user approved the artistic direction, not production behaviour or publication of raster mathematical text. The corrected practice and progress images are used: implication stays chapter 05 and progress highlights Mon parcours. The homepage's generated implication paragraph has also been corrected to the unique falsifying case.

## Current repository and implementation boundary

PR #5 is brought up to main at `eded66590fee2021f401785616f110a1936835d2` to retain the public reading foundation and resolve the changelog conflict. [The approved stack](../../TECHSTACK.md) is Astro + React, Vercel Hobby, Supabase Free and Radix Themes. Public reading and configurable Google/Supabase authentication/session code exist; hosted authentication acceptance, private practice, server grading and saved private progress remain separate work. This PR changes design references, not application behaviour.

The supplied constitution matches [the governing principles](../../CONSTITUTION.md). No mathematical, bilingual, access or privacy principle changes with this visual replacement.

## Learning journey

- Public overview → implication lesson → original worked example → sign-in gate.
- Private practice shows one unanswered single-choice exercise and a deliberate optional hint.
- Feedback retains the submitted choice, explains why it fails, identifies the unique falsifying assignment and offers a respectful retry.
- Private progress separates reading, attempts and proposed mastery evidence. Counters are fictional; the proposed rule remains subject to pilot evaluation.
- The bilingual glossary places French and English readings alongside the same symbols. Language switching must preserve location, unfinished answers and progress in implementation.

The shared sample exercise has option B as its answer and option C as the illustrated error. The [content review](CONTENT_REVIEW.md) specifies the mathematical and grading contract.

## Graphic system and UX intent

The homepage carries the strongest typographic and geometric expression. Interior pages use ruled sections and clear hierarchy: assumptions before claims, steps before conclusions, response before feedback. Black is the default action colour; red is an identity accent and labelled review signal. It is never the only indicator of meaning.

Course navigation retains IDs 01, 02, 03 and 05. Practice is an activity inside chapter 05, not an extra chapter. The glossary has its own active navigation; progress highlights Mon parcours. Header language controls remain separate from course navigation.

The mobile image explores two-row navigation, full-width answer rows and a visible hint-focus treatment. Its native raster is 809 × 1942; it is not proof of a working 375 px viewport. No 320 px implementation acceptance is claimed.

## Refinements before implementation

1. Reduce headline height and decorative geometry on repeated practice/progress pages while retaining the condensed typography and chapter numbering.
2. Specify one consistent sidebar and header geometry; generated variations are reference intent, not exact component measurements.
3. Use tested semantic controls and live mathematical markup. The artwork cannot replace accessible equations or text.
4. Finish matched English page layouts and test long French labels at 320/375/768/1280 px in the actual application.
5. Review source mapping and bilingual fidelity before publishing content. Authentication provider suitability, data retention/deletion/export and the mastery heuristic remain implementation gates.

These are visual references. Their buttons, search, radio choices, focus outlines and sign-in controls do not demonstrate functioning interaction or accessibility compliance.
