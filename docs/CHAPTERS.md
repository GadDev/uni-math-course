# Chapters

## Chapter 2 overview

The public French/English Chapter 2 overview is served at `/fr/chapters/C02/` and `/en/chapters/C02/`. The selected visual direction is **Décalage in green (`#18704F`)**; see the [selected design reference](design/proposals/chapter-02-droites/selected/README.md).

The overview contains an algebra starting point and four further proposed sections: Cartesian coordinates, lines, screen rasterisation and regression. Sections are an outline, not published lesson IDs. They show preparation status without invented lesson durations, exercise totals, completions or learner results. The progress panel is an unavailable-data preview, not private account evidence. Exercises remain disabled.

The structure follows the supplied Bruno Teheux *Droites: du papier à l’écran, puis au machine learning*, BINFO-FCE 2026–2027, 87-page PDF: algebra pages 3–26; coordinates 27–35; lines 36–51; screen graphics 52–60; regression 61–87. Page 1 is the title; repeated builds are consolidated. The copy and decorative SVG are original project work; the source PDF and slide artwork are not distributed. This adds no mathematical or translation-review certification.

## Identities and release boundaries

`src/lib/chapters.ts` defines chapter identity, localized titles, public overview paths and explicit lesson membership. Chapter 1 retains `/fr/`, `/en/` and all existing L01–L20 lesson/practice URLs. Its membership comes from the existing programme. Chapter 2 has no released lessons yet. `content/releases.json` remains authoritative for released lesson versions, practice availability and translation review; the chapter catalogue does not release content.

Keep future lesson IDs globally unique. Never restart L01 in Chapter 2 or rewrite saved attempts. Populate chapter membership only when actual content is authored and released through the existing versioned workflow. Global glossary, number-family, account and progress pages have no active chapter; do not guess membership from a numerical prefix or store a learner's last chapter solely for navigation.

The overview uses the shared Base shell and SignalGeometry with an optional `decalage` variant; the default logic composition remains unchanged. The green accent is scoped to the overview. No feedback colours, server grading, authentication, database records or existing progress calculations change. Both locales share the `parcours` fragment so language switching preserves that position.

## Review order

The overview and chapter catalogue are one implementation PR. A following dependent PR integrates the chapter selector into the shared header. The overview can be reviewed directly before the selector is merged. Merge the overview PR first; no PR is merged automatically.

Checks: run `pnpm check` and `pnpm test:e2e`. Browser coverage checks public access, preparation status, MathML, same-chapter/fragment locale switching, mobile reflow and no-JavaScript reading. Local checks do not establish hosted Supabase or assistive-technology acceptance.
