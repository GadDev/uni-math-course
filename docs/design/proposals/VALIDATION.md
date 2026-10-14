# Design validation and reproduction

Scope: original design fixture and image exports only. No production authentication, grading, persistence, privacy policy, deployment or assistive-technology behaviour is certified.

## Checks performed

- Exported and inspected all 14 WebP proposals. RIFF/WEBP signatures, actual image format, width and full-page height checked. Lossless encoding retains small mathematical text. File hashes are recorded in [render evidence](render-evidence.json).
- DOM layout checks passed for all exports and 64 additional layouts: eight screens × French/English × 320/375/768/1280 px. No viewport overflow, elements outside the horizontal viewport, or clipped horizontal containers. Desktop navigation stays on one line at 1280 and 1440.
- Contact-sheet review covered all 14 exports; individual inspection confirmed French lesson and phone practice text and formula rendering. No visible clipped copy, corrupted symbols, accidental header wraps or inconsistent core components found. Legitimate multi-line French labels remain readable at 320.
- Local fixture checks passed: French → English preserves the selected option and shown hint on practice; skip link receives first keyboard focus; hint has a visible focus outline; glossary query filters original entries.
- Contrast calculations cover body/supporting text, teal on tint, white action text, review text, disabled text, focus and radio boundary. Each tested pair exceeds 4.5:1. These are token-level checks, not an automated accessibility audit of the complete UI. Decorative pale dividers do not carry status or replace radio boundaries.
- Mathematical self-check: full implication truth table plus negated-implication derivation; worked n=7 example checked by truth assignments and odd-number decomposition. Bilingual copy/notation compared within the authoring session. Details and limitations in [content review](CONTENT_REVIEW.md).
- Repository Markdown/link check: `python3 scripts/check_repository.py`. JavaScript parse checks cover the renderer and inline fixture script. No application test/build command exists yet.

## Reproduce the exports

Files: [presentation fixture](source/prototype.html), [renderer](source/render.mjs). Open the fixture locally with `?screen=lesson&lang=fr` or `?screen=feedback&lang=en`; screens are overview, lesson, worked, glossary, practice, feedback, progress and gate. There are no network requests, backend services or learner records. Exercise submit only states that the fixture does not grade/save.

Use an isolated tooling environment with Node, Playwright and sharp available; install Chromium through that environment if needed. This design does not add an application dependency manifest. The recorded run used Node 24, Playwright 1.62.1, sharp 0.35.5 and Chromium 153 supplied by external `@sparticuz/chromium@153.0.0` tooling. No browser binary or tooling package is committed.

From the repository root:

```sh
node docs/design/proposals/source/render.mjs
```

The renderer resolves normal installed modules, or the Work runtime's `CODEX_PRIMARY_RUNTIME_NODE_MODULES` when set. Set `DESIGN_CHROMIUM_PATH` if Chromium lives outside Playwright's default browser directory. Captured fonts use host DejaVu Sans/Serif fallbacks; exact raster results depend on fonts/browser. Do not require byte-identical images across different rendering environments. The source hash and image dimensions make the supplied run auditable.

Rendering updates `images/` and `render-evidence.json`; inspect changed images before committing. Full-page exports prevent content from being silently omitted beyond an arbitrary viewport height.

## Limitations and follow-up

- Static screens cannot prove keyboard completion, screen-reader equation readings, live feedback announcements, touch behaviour or zoom/reflow. Test those against the real application on actual assistive technology.
- The source PDF was not inspected; locators are explicitly taken from the roadmap. Direct verification and content approval are release gates.
- Language preservation is exercised in a presentation fixture, not a real authenticated session or saved-progress backend.
- The phone feedback page is long by design (submitted response → explanation → table → retry). Test this reading burden with adult learners before implementation; an alternative compact response summary may improve it.
- Sign-in provider, architecture, hosting, data policies and mastery evaluation remain proposals. No automatic proof checker or fictional production service is implied.
