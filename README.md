# Uni Math Course

A French/English mathematics learning pilot for university students and adults returning to mathematics.

The first course is **logic and sets**. The learning loop is: understand a concept, inspect a worked example, practise, receive feedback, and revisit mistakes.

Status: **reading and practice implemented; hosted class acceptance pending** · Maintainer: [GadDev](https://github.com/GadDev) · Last status review: 2026-10-15

## What works

- Public French/English programme pages and L01–L20 lessons.
- Public searchable French/English symbol glossary, with bilingual readings, source pages and stable entry links.
- Mathematical notation with visual KaTeX and MathML output.
- Same-lesson language switching and a native reading disclosure that works without JavaScript.
- Six reviewed exercise contracts and content/mathematical checks.
- Configurable email/password Supabase sign-in for an invited group, verified server sessions and local logout.
- Authenticated practice, server grading, saved attempts and private progress. L05 is self-checked; the other banks retain the owner's explicit unreviewed release exception and display a warning.

Sign-in is disabled until configured. Hosted authentication, database/deployment acceptance and class-pilot privacy decisions remain pending. See the [content release contracts](docs/CONTENT_RELEASES.md); local implementation is not proof of a complete hosted learning journey.

## Local development

Use Node 24.19.0 and pnpm 11.25.0. Dependencies are exact and the lockfile is committed.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:4321/fr/ or http://localhost:4321/en/. The root redirects to French. See [authentication setup](docs/AUTHENTICATION.md) and .env.example to configure a development Supabase project. Reading works without those settings.

## Quality gate

```sh
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

The check covers repository links/structure, content parity/contracts, types, formatting, mathematical tests and production build. Browser checks cover reading, language switching, math markup, native disclosure keyboard/no-JavaScript behaviour, narrow layouts and authentication/session flows through the real SDK and an isolated local Auth fixture. These checks do not certify independent mathematical peer review or a working authentication deployment.

## Project direction

- [Mission](docs/MISSION.md)
- [Constitution](docs/CONSTITUTION.md)
- [Roadmap](docs/ROADMAP.md)
- [Tech stack](docs/TECHSTACK.md)
- [Content pilot review](docs/content/L05_REVIEW.md)
- [Symbol glossary](docs/content/GLOSSARY_REVIEW.md)
- [Reading foundation](docs/READING_FOUNDATION.md)
- [Authentication and sessions](docs/AUTHENTICATION.md)
- [Practice, grading and progress](docs/PRACTICE.md)
- [Content release contracts](docs/CONTENT_RELEASES.md)

## Repository guide

- [Contributing](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Release policy](docs/RELEASING.md)
- [Licence](LICENSE)
- [Content rights and attribution](CONTENT_LICENSE.md)
- [Repository setup record](docs/REPOSITORY_SETUP.md)

## Course material and attribution

The planning source is Bruno Teheux's *Mathématiques Générales - Logique et ensembles*, BINFO-FCE 2026-2027, University of Luxembourg.

The lesson and examples are original project work. No source PDF or copied slide artwork is distributed. Third-party republication permission remains unverified; attribution does not itself establish permission. This independent project does not claim university endorsement.

## Licence

Original project code and documentation are covered by the [MIT licence](LICENSE). Dependencies retain their own notices; bundled reading assets are listed in [CONTENT_LICENSE.md](CONTENT_LICENSE.md) and [third-party notices](public/THIRD_PARTY_NOTICES.txt).
