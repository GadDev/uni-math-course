# Chapter 2 implementation review

The selected **Décalage green** direction is implemented on the public French/English Chapter 2 overview and shared chapter selector. These captures show the local production test build, not the earlier HTML design studies. No learner data is used.

| View | Capture |
| --- | --- |
| French desktop, 1440 px | [Overview](overview-fr-1440.webp) · [Open selector](selector-fr-1440.webp) |
| French mobile, 375 px | [Overview](overview-fr-375.webp) · [Open selector](selector-fr-375.webp) |
| English desktop, 1440 px | [Overview](overview-en-1440.webp) |
| English small mobile, 320 px | [Overview](overview-en-320.webp) |

The overview preserves the Signal shell, black actions, numbered sections and mobile artwork treatment. The algebra identity uses KaTeX HTML/MathML and a localized plain reading. All five course sections remain proposed content; disabled exercises and unavailable progress data make that status explicit. Existing Chapter 1 lesson URLs, practice, authentication and saved-history logic are unchanged.

The native selector provides ordinary locale-preserving chapter links and works without JavaScript. Its current item has text, a checkmark, a coloured border and `aria-current="location"`. The enhanced Escape behaviour restores trigger focus; outside click and tabbing out close the panel. Shared reference/account/progress pages use a neutral chapter trigger. The header switches deliberately to two rows at 1050 px, with a row-wide mobile panel and at least 44 px trigger/action heights.

On 2026-10-16, `pnpm check` passed on the combined implementation synchronized with main release 0.2.1: documentation/release/content checks, Astro diagnostics (zero errors/warnings/hints), formatting, 266 unit/content tests and the production build. `PLAYWRIGHT_CHROMIUM_EXECUTABLE=… pnpm test:e2e --workers=1` passed all **158** browser tests. Added coverage includes both chapters, both locales, no-JavaScript navigation, neutral shared pages, keyboard/dismissal behaviour, preparation states, MathML, 320/375/960/1440 px layouts, and 1050/1051 px header boundaries. Existing authentication, session isolation, practice and progress journeys also pass.

Captures were visually inspected for typography, panel placement and overflow. These local results do not certify deployed Supabase acceptance, independent mathematics/translation review, screen-reader behaviour or forced-colour/text-zoom accessibility. No course PDF or copied slide artwork is distributed. See the [Chapter 2 author review](../../../content/CHAPTER_02_REVIEW.md) and [content release contracts](../../../CONTENT_RELEASES.md) for publication boundaries.
