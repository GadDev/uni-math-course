# Chapters

## Chapter 2 overview

The public French/English Chapter 2 overview is served at `/fr/chapters/C02/` and `/en/chapters/C02/`. The selected visual direction is **Décalage in green (`#18704F`)**; see the [selected design reference](design/proposals/chapter-02-droites/selected/README.md).

The overview contains an algebra starting point and four further proposed sections: Cartesian coordinates, lines, screen rasterisation and regression. Sections are an outline, not published lesson IDs. They show preparation status without invented lesson durations, exercise totals, completions or learner results. The progress panel is an unavailable-data preview, not private account evidence. Exercises remain disabled.

The structure follows the supplied Bruno Teheux *Droites: du papier à l’écran, puis au machine learning*, BINFO-FCE 2026–2027, 87-page PDF: algebra pages 3–26; coordinates 27–35; lines 36–51; screen graphics 52–60; regression 61–87. Page 1 is the title; repeated builds are consolidated. The copy and decorative SVG are original project work; the source PDF and slide artwork are not distributed. This adds no mathematical or translation-review certification.

## Identities and release boundaries

`src/lib/chapters.ts` defines chapter identity, localized titles, public overview paths and explicit lesson membership. Chapter 1 retains `/fr/`, `/en/` and all existing L01–L20 lesson/practice URLs. Its membership comes from the existing programme. Chapter 2 has no released lessons yet. `content/releases.json` remains authoritative for released lesson versions, practice availability and translation review; the chapter catalogue does not release content.

Keep future lesson IDs globally unique. Never restart L01 in Chapter 2 or rewrite saved attempts. Populate chapter membership only when actual content is authored and released through the existing versioned workflow. Global glossary, number-family, account and progress pages have no active chapter; do not guess membership from a numerical prefix or store a learner's last chapter solely for navigation.

The overview uses the shared Base shell and SignalGeometry with an optional `decalage` variant; the default logic composition remains unchanged. The green accent is scoped to the overview. No feedback colours, server grading, authentication, database records or existing progress calculations change. Both locales share the `parcours` fragment so language switching preserves that position.

## Shared chapter navigation

The Base header replaces “Le cours” with a native chapter disclosure containing normal links. It works without JavaScript. Keyboard Enter/Space toggles it; the enhancement closes it on Escape (restoring trigger focus), outside click and focus leaving the disclosure. Current chapter identity comes from the explicit catalogue and locale-relative route; shared resources use a neutral “Chapitres / Chapters” trigger. Current chapter status uses text, a checkmark and `aria-current="location"` rather than colour alone.

Chapter switching opens the selected overview in the same locale. Locale switching preserves Chapter 2 and its shared `parcours` fragment. No navigation state is stored in learner records or local storage. Full chapter names appear in the dropdown and the trigger's accessible name; short visible labels fit small screens. Global number-family access uses the compact “Nombres / Numbers” header label; the reference page itself is unchanged. French header sign-in uses “Connexion”; forms keep their existing labels.

Desktop uses one row above 1050 px. At and below 1050 px, brand/language/account occupy the first row and navigation the second. The dropdown spans the mobile navigation row and has a viewport-bounded scroll area for future catalogue growth. Focus outlines, 44 px header targets and the existing account/profile menu remain available. Green header styling is scoped to Chapter 2 identity, not feedback or grading semantics.

## Review order

The overview and chapter catalogue are one implementation PR. The dependent navigation PR integrates the chapter selector into the shared header. Merge the overview PR first, then retarget the navigation PR to main if GitHub has not done so automatically; no PR is merged automatically.

Checks: run `pnpm check` and `pnpm test:e2e`. Browser coverage checks public access, preparation status, MathML, same-chapter/fragment locale switching, mobile reflow and no-JavaScript reading. Local checks do not establish hosted Supabase or assistive-technology acceptance.
