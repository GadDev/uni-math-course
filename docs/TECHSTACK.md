# Tech stack

Status: proposed architecture, not an implemented or approved stack · Owner: GadDev · Last reviewed: 2026-10-14

## Decision criteria

Optimise for a correct, maintainable four-lesson class pilot operated by one developer. Prefer one application, deterministic grading, reusable bilingual content identities, ordinary data migrations, and minimal external services. Low recurring cost is a working assumption; a strict zero-cost budget has not been confirmed.

## Proposed architecture

Use one Nuxt 4 application with strict TypeScript. Nitro provides server routes and deployment output within that application. Keep lesson UI, exercise delivery, grading, and progress endpoints together; do not create a separately deployed API for this scope.

Use Supabase for authentication and PostgreSQL persistence. Store authored lessons and exercise definitions in Git; keep answer-key modules out of browser bundles. Use a small server-side persistence boundary so provider code does not spread through teaching or grading logic.

Pin actual stable runtime/package versions and commit the package-manager lockfile when implementation begins. There is currently no package manifest, application runtime contract, installation command, or cloud project.

## Options considered

| Option | Useful property | Cost or limitation | Current recommendation |
| --- | --- | --- | --- |
| Single Nuxt + Supabase | Accounts and relational persistence together; SQL migrations | SSR sessions, database permissions and RLS require careful implementation | Preferred proposal |
| Single Nuxt + Convex | Managed TypeScript functions and reactive data | Community-maintained Vue/Nuxt integration; authentication integration must be validated; backend migration requires rewriting provider functions | Viable alternative, not selected |
| Nuxt + SQLite + managed OAuth | Small persistence layer and conventional server code | Persistent hosting, backups, sessions, identity integration and multi-instance constraints become maintainer responsibilities | Prefer only if suitable persistent hosting already exists |
| Nx workspace | Task caching, generators and boundaries across projects | Adds configuration without a second app or substantial independently maintained packages | Defer until justified |

[Nx's Nuxt plugin](https://nx.dev/docs/technologies/vue/nuxt/introduction) supports Nuxt 3/4. Support is not a reason to introduce a monorepo now. Shared folders inside one application can be extracted later if actual reuse emerges.

[Convex's Vue integration](https://docs.convex.dev/client/vue/overview) and [Nuxt integration](https://docs.convex.dev/client/vue/nuxt) are community-maintained. [Convex Auth](https://docs.convex.dev/auth/convex-auth) currently documents beta React/React Native support, not a ready-made Nuxt authentication path. External OpenID Connect providers are possible; do not assume auth is impossible or automatically solved.

## Proposed components

| Concern | Choice / contract |
| --- | --- |
| UI and server | Stable Nuxt 4, built-in Nitro, strict TypeScript |
| Package management | pnpm, exact runtime/package-manager versions, committed lockfile at scaffold time |
| Lessons | Markdown with validated objective, prerequisite, source, ID and version metadata |
| Exercises | Validated bilingual JSON; shared answer identity; separate server-held answer contract |
| Localisation | Nuxt i18n, explicit /fr/ and /en/ routes, French default |
| Mathematics | KaTeX HTML + MathML output with plain-language readings; screen-reader verification |
| Input/content validation | Zod at API and content boundaries |
| Accounts | Supabase Auth; Google OAuth proposed pending classmate availability |
| Data | Supabase PostgreSQL; migrations in Git |
| Tests | Vitest for grading/content; integration tests for auth/ownership/persistence; Playwright for critical browser paths |
| CI | Existing documentation check now; one expanded application quality gate after scaffold |
| Hosting | Vercel Hobby proposed for an eligible personal noncommercial pilot; Node hosting remains an alternative |

Nuxt's [server](https://nuxt.com/docs/4.x/getting-started/server) and [deployment](https://nuxt.com/docs/4.x/getting-started/deployment) documentation describe integrated server routes and deployment targets. [Nuxt i18n](https://i18n.nuxtjs.org/docs/guide) supports locale prefixes. [KaTeX options](https://katex.org/docs/options.html) include combined visual HTML and accessibility MathML; this does not replace actual accessibility testing.

## Authentication and request flow

A visitor reads public lessons without account-data requests. A learner signs in through the selected provider, returns via an allowlisted callback, and obtains a session. Supabase's [SSR integration](https://supabase.com/docs/guides/auth/server-side) uses cookies; verify server identity with getClaims or an appropriate server-confirmed lookup, not an unverified getSession user object.

Protect every practice/progress endpoint on the server, not only through page navigation. The grading endpoint validates identity and request origin, loads the correct exercise version, validates the response, computes feedback/result, writes one idempotent attempt, and returns learner-facing feedback. Progress reads derive from the authenticated user's attempts.

[Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google) is a proposal because it avoids application-sent verification email for the basic provider flow. If classmates need email/password or magic links, configure suitable SMTP and test callbacks, delivery and recovery. Supabase's [default email service](https://supabase.com/docs/guides/auth/auth-smtp) is restricted to project-team addresses and currently two messages per hour; it cannot support normal classroom email onboarding as-is.

## Data and authorization

| Record | Minimal purpose |
| --- | --- |
| Profile | Auth user ID, preferred language, optional display name |
| Lesson completion | User, lesson/version, completion timestamp |
| Attempt | User, exercise/version, response, server result, hints/solution state, timestamp, submission ID |
| Reward award, later | User and unique milestone/version; no client-writable reward total |

Use database grants and [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) so learners read only their records. Deny direct client writes to scored attempts and rewards. The trusted grading path writes these records; a privileged service credential bypasses RLS, so explicitly validate ownership there and never expose that credential to the client.

Reject caller-supplied scores and owner IDs. Bound request sizes and grading complexity. Separate preview/test records from real learner data. Define retention, deletion/export, backups and verified restore before real classmate use.

Keep exercise versions immutable once attempted. A correction creates a new version; old attempts retain their original grading context. Derive progress from attempts rather than maintaining an independent mutable score store initially.

## Grading and reward integrity

Start with option IDs, Boolean values and labelled truth-table cells. Later use finite-set comparison and restricted formula syntax trees. Accept semantic equivalence only when the objective allows it; transformation exercises must verify the requested structure. Do not execute arbitrary user code or claim automatic free-text proof grading.

Server grading prevents fabricated database results, not answer discovery. The public repository and post-answer feedback may reveal answers. This is a learning application, not an exam platform; keep rewards private and low-stakes.

## Costs and service dependencies

Snapshot from official documentation reviewed 2026-10-14; recheck on deployment and do not treat these values as permanent guarantees.

| Service | Relevant free allowance | Limitation |
| --- | --- | --- |
| [Supabase Free](https://supabase.com/pricing) | 500 MB database, 50,000 monthly active users, 5 GB egress, two active projects | Projects pause after one week of inactivity; confirm available project slots and recovery/export needs |
| [Vercel Hobby](https://vercel.com/docs/plans/hobby) | Free; 100 GB fast data transfer, 1 million function invocations, four CPU-hours | Personal noncommercial use only; over-limit usage can be suspended |
| [Convex Free](https://docs.convex.dev/production/state/limits), alternative | 0.5 GB database, 1 GB database I/O/month, 1 million function calls/month | Hard caps; an external auth provider has separate limits/costs |

A small pilot might remain at zero recurring platform cost within these allowances; this is conditional on eligibility and usage. Supabase offers [European regions](https://supabase.com/docs/guides/platform/regions); Convex offers [Ireland](https://docs.convex.dev/production/regions), with a 30% surcharge on billed non-US usage. A database region alone is not an EU-only guarantee for all processing or logs. Data-location requirements are not yet confirmed for this project.

Dependencies are hosting, the account provider, and managed persistence. Keep content in Git, SQL migrations/export procedures explicit, and persistence calls behind a small boundary. Supabase Auth replacement still requires identity/session migration. Nitro supports alternative hosting, but portability must be tested rather than assumed.

## Checks and deployment requirements

Today run `python3 scripts/check_repository.py` using Python 3.10+. After scaffolding, define one reproducible command covering formatting/lint, types, meaningful tests, content/translation validation and production build. Extend Dependabot to actual manifests only when they exist.

Keep PR checks credential-free, with no human/bot exclusions. Deploy only checked authorized revisions, identify the source commit, smoke-test the release, and document rollback. Database rollback is separate from application rollback; prove restoration before destructive migrations. No deployment workflow or cloud resource is created by this document.

## Decisions before implementation

Confirm architecture, urgent chapter order, pilot size, auth-provider availability, budget, hosting and data-region preferences. Confirm source rights and what rewards mean. Write the first reviewed bilingual implication lesson and exercise contract before scaffolding. See [ROADMAP.md](ROADMAP.md) and [CONSTITUTION.md](CONSTITUTION.md).
