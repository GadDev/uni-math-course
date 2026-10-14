# Public reading foundation

## Implemented feature

M2 feature 1 provides French/English programme pages and the original L05 lesson. Reading is public. The programme labels future lessons as coming later and links to configurable sign-in and describes practice/progress as in development.

Astro prerenders the pages. React/Radix adds a reading-tip disclosure, not an anonymous exercise. KaTeX emits HTML and MathML; mathematical readings are explained in the lesson. Switching language preserves the current lesson and maps its section fragment to the corresponding translated heading. Missing paired translations or mismatched heading counts/depths block the build; heading order must also be reviewed for semantic alignment.

The [Signal implementation review](design/implementation/signal-public-reading/README.md) records the public programme/lesson styling, screenshots, validation and remaining accessibility checks. The selected art direction is implemented with CSS, a self-hosted OFL font and original decorative SVG; the concept images are not loaded by the application.

## Toolchain

Node 24.19.0, pnpm 11.25.0 and exact package versions are committed with the lockfile. TypeScript 6 is selected because the Astro checker peer range excludes TypeScript 7. The manifest version is 0.0.0 and private; no application release is created.

The existing repository Markdown checker has been ported to Node with required-file, fence/heading/whitespace, internal-link/reference and duplicate-anchor checks retained. Generated directories are excluded. The original Python check is retired; one pnpm check command covers the expanded gate.

Formatting covers application/configuration and JavaScript/TypeScript checks rather than rewriting all existing policy documents. CI retains the existing docs job name and uses reviewed commit-pinned checkout, Node and pnpm actions with contents-read permission only.

## Validation

Run pnpm check and pnpm test:e2e as described in README.md. Browser checks cover both languages, lesson identity/fragment switching, KaTeX MathML, a working hydrated Radix disclosure by keyboard, a missing route and 320/375/768/1280 px geometry.

The production build targets Vercel through the selected adapter. Browser tests exercise the local production build; a future Vercel preview must still verify deployed adapter/session behaviour. Authentication/session integration is now described in [AUTHENTICATION.md](AUTHENTICATION.md); hosted acceptance, production deployment and saved progress are still pending.

## Next features

1. Hosted Supabase account/session acceptance after project configuration and provider suitability are known.
2. Authenticated exercise delivery and server grading against immutable versions.
3. Idempotent attempt persistence and owner-only access.
4. Mistake review/private progress and full deployment acceptance.

Release Please remains its own future PR. Keep free-plan eligibility, project pauses/export/restore, retention and source rights explicit. Review the stack documents and content pilot before publishing a class pilot.
