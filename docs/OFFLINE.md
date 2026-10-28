# Offline study (PWA)

The website is installable as a Progressive Web App. The bilingual offline
manager lives at `/fr/offline/` and `/en/offline/`.

- Visit the deployed HTTPS site and install it through the browser's app menu.
  In Safari on iOS/iPadOS use Share → Add to Home Screen.
- While connected, choose **Download for offline use**. This stores the
  prerendered public lessons in both languages, chapter pages, glossary,
  number guide, exercise *index*, diagrams, styles, fonts and built JS assets
  for client-only React lesson explorers.
- Offline, the service worker serves downloaded reading pages. Pages not yet
  available show the offline manager instead.
- Authenticated practice, server grading, sign-in, progress synchronization,
  APIs and PDFs are deliberately excluded. Do not move answers or
  personalized content into a client-side bundle.
- The browser can evict cached pages when storage is tight. Use the manager
  to download again after deployments or to remove the downloaded pack.

`scripts/offline-manifest.ts` runs after Astro's build and collects only
prerendered **public** pages and their static generated assets into
`offline-index.json`. `public/sw.js` uses an explicit same-origin allowlist.
No personalized responses, protected routes, cross-origin content or PDFs
are stored in the offline cache. The app remains functional without the
service worker for ordinary online reading.

Verification: `pnpm check`, `pnpm test:e2e`, then download while online,
switch to airplane mode, navigate FR/EN lessons and use a React island.
