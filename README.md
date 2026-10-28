# Uni Math Course

[![Repository checks](https://github.com/GadDev/uni-math-course/actions/workflows/check.yml/badge.svg?branch=main)](https://github.com/GadDev/uni-math-course/actions/workflows/check.yml)
[![Pilot status](https://img.shields.io/badge/status-learning_pilot-6A5ACD)](docs/PILOT_ACCEPTANCE.md)
[![French and English](https://img.shields.io/badge/languages-FR_%2F_EN-087E8B)](#features)
[![Node.js](https://img.shields.io/badge/Node.js-24.19.0-339933?logo=nodedotjs&logoColor=white)](.node-version)
[![pnpm](https://img.shields.io/badge/pnpm-11.25.0-F69220?logo=pnpm&logoColor=white)](package.json)
[![MIT licence](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

A **French/English mathematics learning pilot** for university students and adults returning to mathematics. The first course explores **logic and sets** through short lessons, worked examples and practice with feedback.

**[Explore in French](https://uni-math-course.vercel.app/fr/)** · **[Explore in English](https://uni-math-course.vercel.app/en/)** · [Project roadmap](docs/ROADMAP.md)

![Decorative mathematics illustration with coordinate axes, a plotted curve, intersecting circles and geometric planes in red, green and black](docs/assets/readme-math-geometry.webp)

Public lessons and the symbol glossary can be read without an account. Practice and private progress require an invited account and a configured Supabase deployment.

## Features

- Public French/English programme pages and lessons.
- Public [Chapter 2 overview](https://uni-math-course.vercel.app/fr/chapters/C02/) for straight lines, with the selected green Décalage artwork. The learning path contains 16 bilingual lessons (L21–L36), worked examples and 240 exercises with saved practice; see the [Chapter 2 review](docs/content/CHAPTER_02_REVIEW.md) and [implemented layouts](docs/design/implementation/chapter-02/README.md).
- Public searchable French/English symbol glossary, with bilingual readings, source pages and stable entry links.
- Mathematical notation with visual KaTeX and MathML output.
- Light/dark header toggle that follows the system preference initially and remembers an explicit choice across pages and languages.
- Same-lesson language switching and a native reading disclosure that works without JavaScript.
- Versioned exercise contracts and content/mathematical checks.
- Configurable email/password Supabase sign-in for an invited group, verified server sessions and local logout.
- Manual, reversible lesson completion with bilingual checkmarks and chapter counters, saved to the learner account. Apply the completion migration before use; see [setup and local review](docs/PRACTICE.md#manual-lesson-completion).
- Authenticated practice, server grading, saved attempts and private progress. Unreviewed banks display a warning.

## Pilot status

**Reading and practice are implemented; hosted class acceptance is pending.** This is an independent learning project, not a university-approved course or a fully accepted class service.

Maintainer: [GadDev](https://github.com/GadDev) · Last status review: 2026-10-16

<!-- release-status:start -->
Release status (generated from content/releases.json): 49 public bilingual lessons; 49 served practice banks. Mathematical author self-check: L01, L02, L03, L04, L05, L06, L07, L08, L12, L13, L14, L15, L16, L19, L20, L21, L22, L23, L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35, L36, L37, L38, L39, L40, L41, L42; explicit unreviewed release exceptions: 12 banks. Translation self-check: L01, L02, L03, L04, L05, L06, L07, L08, L12, L13, L14, L15, L16, L19, L20, L21, L22, L23, L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35, L36, L37, L38, L39, L40, L41, L42; explicit unreviewed translation exceptions: 12 lesson pairs. These records do not certify independent review or hosted class readiness.
<!-- release-status:end -->

Sign-in is disabled until configured. Hosted authentication, database/deployment acceptance and class-pilot privacy decisions remain pending. See the [content release contracts](docs/CONTENT_RELEASES.md); local implementation is not proof of a complete hosted learning journey.

## Technology

[![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Data-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-0.19-247BA0)](https://katex.org/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)

[Astro](https://astro.build/) and [React](https://react.dev/) with TypeScript power the lessons and practice. [KaTeX](https://katex.org/) renders notation; Supabase provides invited-user authentication and PostgreSQL persistence; Vercel hosts the application. See the [tech stack and decisions](docs/TECHSTACK.md) for scope and limitations.

## Run locally

Requires **Node.js 24.19.0** and **pnpm 11.25.0** (pinned in `.node-version` and `package.json`). The project scripts and tests are TypeScript ESM files run directly by Node 24’s built-in type stripping; no additional runner or compilation step is needed. `pnpm typecheck` checks the application and tooling, including `.claude` scripts.

Install from the committed lockfile:

```sh
git clone https://github.com/GadDev/uni-math-course.git
cd uni-math-course
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:4321/fr/](http://localhost:4321/fr/) or [http://localhost:4321/en/](http://localhost:4321/en/). The root redirects to French. **Public reading needs no credentials.**

To test authentication, grading and saved progress, configure a separate development Supabase project using [`.env.example`](.env.example) and the [authentication setup guide](docs/AUTHENTICATION.md). Use synthetic accounts; do not commit credentials or learner data.

## Verify changes

```sh
pnpm check                       # documentation, content, types, tests and build
pnpm exec playwright install chromium
pnpm test:e2e                    # local browser journeys
```

The [repository checks workflow](.github/workflows/check.yml) also runs release, exercise-immutability and disposable PostgreSQL contract checks, plus browser tests. The required job is named `docs`. Local browser tests use an isolated Auth/Data API fixture; passing CI does **not** establish independent mathematical review, hosted authentication or class readiness.

Hosted acceptance is separate and opt-in. Follow [hosted E2E setup](docs/HOSTED_TESTS.md) with dedicated synthetic accounts, and record real results in the [pilot acceptance checklist](docs/PILOT_ACCEPTANCE.md).

## Product and learning documentation

- [Constitution](docs/CONSTITUTION.md)
- [Roadmap](docs/ROADMAP.md)
- [Tech stack](docs/TECHSTACK.md)
- [Content pilot review](docs/content/L05_REVIEW.md)
- [Lesson clarity review and implementation proposals](docs/content/LESSON_CLARITY_REVIEW_2026-10-23.md)
- [Symbol glossary](docs/content/GLOSSARY_REVIEW.md)
- [Authentication and sessions](docs/AUTHENTICATION.md)
- [Practice, grading and progress](docs/PRACTICE.md)
- [Content release contracts](docs/CONTENT_RELEASES.md)
- [Pilot readiness and acceptance evidence](docs/PILOT_ACCEPTANCE.md)

## Contribute and maintain

Corrections to mathematics, translations, accessibility and developer experience are welcome. Follow the repository policies below and keep pull requests focused.

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

## Offline reading (PWA)

Install Uni Math Course from the browser and use the [offline download page](https://uni-math-course.vercel.app/fr/offline/) to save public French and English lessons, diagrams and client-only React explorers. Authenticated exercises, grading, synchronized progress and PDFs still require a connection. See [offline documentation](docs/OFFLINE.md).
