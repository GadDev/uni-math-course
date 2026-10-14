# Uni Math Course

A French/English mathematics learning pilot for university students and adults returning to mathematics.

The first course is **logic and sets**. The learning loop is: understand a concept, inspect a worked example, practise, receive feedback, and revisit mistakes.

Status: **reading foundation** · Maintainer: [GadDev](https://github.com/GadDev) · Last status review: 2026-10-14

## What works

- Public French/English programme pages and the original implication lesson (L05).
- Public searchable French/English symbol glossary, with bilingual readings, source pages and stable entry links.
- Mathematical notation with visual KaTeX and MathML output.
- Same-lesson language switching and a React/Radix reading disclosure.
- Six reviewed exercise contracts and content/mathematical checks.
- Configurable Google/Supabase sign-in, verified server sessions and local logout.

Interactive exercise delivery/grading, saved attempts and private progress are the next M2 features. Sign-in is disabled until configured; hosted authentication acceptance and production deployment remain pending. Planned lesson cards are explicitly marked as coming later.

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

The check covers repository links/structure, content parity/contracts, types, formatting, mathematical tests and production build. Browser checks cover reading, language switching, math markup, Radix keyboard behaviour, narrow layouts and authentication/session flows through the real SDK and an isolated local Auth fixture. These checks do not certify independent mathematical peer review or a working authentication deployment.

## Project direction

- [Mission](docs/MISSION.md)
- [Constitution](docs/CONSTITUTION.md)
- [Roadmap](docs/ROADMAP.md)
- [Tech stack](docs/TECHSTACK.md)
- [Content pilot review](docs/content/L05_REVIEW.md)
- [Symbol glossary](docs/content/GLOSSARY_REVIEW.md)
- [Reading foundation](docs/READING_FOUNDATION.md)
- [Authentication and sessions](docs/AUTHENTICATION.md)

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
