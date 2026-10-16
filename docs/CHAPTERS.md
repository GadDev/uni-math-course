# Chapters

## Chapter 2: Droites

The public French/English overview is served at `/fr/chapters/C02/` and `/en/chapters/C02/`. It links 16 bilingual lessons, L21–L36, in five groups: algebra, coordinates/curves, lines/regions, screen graphics and regression/models. Every lesson has 15 original questions: 5 easy, 5 medium and 5 hard, with hints, answers and worked feedback. Reading remains public; practice and saved progress require sign-in.

The selected visual direction is **Décalage in green (`#18704F`)**; see the [selected design reference](design/proposals/chapter-02-droites/selected/README.md). The overview retains the Signal layout. Chapter 2 readings and practice use the same decoration and green chapter identity. Feedback keeps explicit correct/incorrect labels.

The [PDF-to-lesson map](../exercises/drafts/chapter-02/README.md) consolidates the supplied 87-page Bruno Teheux *Droites* course and records the source qualifications. The [mathematical and bilingual self-check](content/CHAPTER_02_REVIEW.md) describes the actual verification. The prose, examples, questions and decorative SVG are original project work; no source PDF or slide artwork is distributed. Author self-check is not independent peer review or hosted class acceptance.

## Identity, releases and saved progress

`src/lib/chapters.ts` defines chapter identity, localized titles, overview paths and explicit lesson membership. Chapter 1 retains `/fr/`, `/en/` and all L01–L20 URLs. `src/lib/droites-lessons.ts` contains Chapter 2 membership and grouping without answers; titles and durations come from the bilingual content collection. Reading and practice outlines use the current chapter, and breadcrumbs return to its overview. Chapter 2 does not reuse Chapter 1 lesson or exercise IDs.

`content/releases.json` remains authoritative for selected immutable bank versions, practice availability and mathematical/translation review evidence. A catalogue entry cannot release a bank by itself. The new v1 archives use the existing server grader and saved-attempt contract. No existing bank is changed, history is not reset and no database migration is needed. Authentication return destinations consult the registry, preserving the selected lesson/question while rejecting unknown or unsafe routes.

Private progress contains both chapters, with actual per-chapter attempted/total counts, per-lesson results and archived-version history. The public overview links to this authenticated page; it does not display invented personal metrics. Global glossary, number-family, account and progress routes retain neutral chapter navigation.

## Shared chapter navigation

The Base header uses a native disclosure with ordinary links and works without JavaScript. Enter/Space toggles it; Escape restores trigger focus; outside clicks and focus leaving dismiss it. Explicit membership determines the current chapter. The current item uses text, a checkmark and `aria-current="location"`, alongside colour.

Chapter switching preserves language. Locale switching preserves the lesson/activity; translated section anchors are matched by heading position. Practice retains unfinished responses and recorded feedback through the existing session lifecycle. No last-chapter preference is stored in learner records or local storage solely for navigation.

Full names appear in the dropdown and accessible trigger name, with short visible labels on small screens. Above 1050 px the header uses one row; at and below that width, navigation occupies a second row. The mobile dropdown has a bounded scroll area and 44 px targets. The existing account menu and focus outlines remain available.

## Review and validation

The earlier overview/navigation PRs are merged. The content checkpoint remains inactive; the following promotion/integration PR selects the new content and connects practice. Review the content checkpoint before the dependent activation change. No merge is performed automatically.

`pnpm check` passed with 267 application/content tests and zero Astro diagnostics. The browser suite passed 172 tests, including all 16 new readings in both languages at 320/1280 px, overview reflow, no-JavaScript reading, Chapter 2 question 15, sign-in returns, saved feedback after reload/language switching, fresh sign-in history and account isolation. Existing Chapter 1 journeys also pass. These local protocol fixtures do not certify a hosted Supabase installation or actual screen-reader acceptance.
