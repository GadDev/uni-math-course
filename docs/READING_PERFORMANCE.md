# Native reading disclosure: transfer comparison

Measured on 2026-10-16 (Europe/Luxembourg) with Node 24.19.0, pnpm 11.25.0 and Chromium 153.0.8010.0. The baseline is commit `e76ec820f9dda64c389be6684cbde488da942665` (the learning/release contract branch). Both measurements use a Vercel production build with authentication unconfigured.

## Method

`scripts/measure-reading.mjs` serves `.vercel/output/static` over loopback HTTP with real gzip responses, `Cache-Control: no-store`, and a fresh browser context per page. It reads Resource Timing's `encodedBodySize` and verifies each response against the gzip-compressed asset bytes. Compression is Node's default gzip level, identical for both builds.

The four cold loads are `/fr/`, `/en/`, `/fr/lessons/L05/`, and `/en/lessons/L05/`. Each produced the same CSS/JavaScript totals below. Count transferred CSS and external JavaScript only; HTML, inline scripts, fonts, protocol overhead, TLS, warm caches and CDN behaviour are excluded. These are measured local compressed response bodies, not a Vercel network audit or a total-page performance score. Vercel may negotiate different compression, including Brotli.

## Results per cold page load

| Resource | Before raw bytes | After raw bytes | Before gzip body bytes | After gzip body bytes |
| --- | --- | --- | --- | --- |
| Stylesheets | 728,600 | 46,871 | 93,588 | 12,226 |
| External JavaScript | 252,890 | 0 | 80,106 | 0 |
| Combined | 981,490 | 46,871 | 173,694 | 12,226 |

The combined compressed CSS/external-JavaScript payload falls by **93.0%** (161,468 bytes). Stylesheets fall from one 93.6 kB gzip response to one 12.2 kB response; five external JavaScript requests disappear. Decimal kB means 1,000 bytes.

The remaining stylesheet contains the reading layout and KaTeX styles. Existing small header/language scripts remain inline in HTML; zero external JavaScript requests does not mean zero JavaScript on the page. The disclosure itself needs none. React remains available for authenticated practice, and the Radix package remains installed for a separate dependency decision; neither is imported by public reading.

## Reproduce

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm exec playwright install chromium
node scripts/measure-reading.mjs
```

An existing compatible Chromium binary can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. To compare the baseline, copy the measurement script to that checkout and repeat the same build/browser/compression settings. Hashed asset filenames can change; the script measures resources actually requested by the browser rather than all files emitted for unrelated routes.

Keyboard and JavaScript-disabled browser tests cover the programme and lesson disclosure in both languages. Existing viewport, session/profile-menu, practice and mathematics checks remain in the full gate. Real assistive-technology testing and deployed transfer measurements remain separate checks.
