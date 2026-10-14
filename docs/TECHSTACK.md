# Tech stack

Status: revised architecture proposal; deployment and UI require a pilot · Owner: GadDev · Last reviewed: 2026-10-14

## Decision criteria

Optimise for a correct, maintainable four-lesson class pilot operated by one developer. Prefer one application, deterministic grading, reusable bilingual content identities, ordinary data migrations, and minimal external services. Low recurring cost is a working assumption; a strict zero-cost budget has not been confirmed. Firebase/Google Cloud is the requested deployment direction, but the exact product and billing model remain open.

## Recommendation and critical review

Prefer **one Nuxt application on direct Cloud Run, Nuxt UI for interface components, and Supabase Auth/PostgreSQL** for the first full learning journey. This is an architectural recommendation, not an approved or tested deployment.

| Decision | Recommendation | Why / condition |
| --- | --- | --- |
| Application boundary | One Nuxt application with Nitro | UI and grading stay in one codebase and runtime |
| Deployment | Direct Cloud Run first; evaluate Firebase App Hosting as the managed alternative | Retain ordinary cookie-based SSR without classic Hosting's cookie forwarding constraint |
| UI | Nuxt UI with a small project theme | Ready-made Vue controls, Nuxt integration and limited styling work |
| Identity and data | Retain Supabase provisionally | Versioned attempts and ownership fit SQL/RLS; accept a second provider and its pause/backup limitations |
| Public content | Prerender lessons and glossary where practical | Reading does not require per-user server work |
| Private features | Server-authoritative grading and progress | Static hosting alone cannot satisfy the access/integrity contract |

The previous Vercel recommendation was convenient, but did not evaluate the requested Google deployment path. Equally, moving the site to Firebase does not require replacing its database or adding a second authentication provider. One source repository also does not automatically mean one deployment: classic Hosting plus Cloud Run introduces coordinated releases.

Avoid choosing an entire vendor stack just to host a site. SQL is useful here, but not indispensable: Firebase Auth/Firestore is a credible alternative if consolidating providers matters more than SQL migrations/reporting. That would change the identity, ownership and persistence design and deserves an explicit decision before scaffolding.

The practical risks are authentication through the chosen edge, accidental caching of private content, managed-service interruptions, and maintenance of bilingual learning controls. Resolve those with one complete journey before investing in a large UI kit, analytics, a monorepo or extra services.

## Proposed architecture

Use one Nuxt 4 application with strict TypeScript. Nitro provides server routes and deployment output within that application. Keep lesson UI, exercise delivery, grading, and progress endpoints together. The direct Cloud Run proposal runs the whole application in one service; a static-client deployment would be a separately reviewed alternative.

Use Supabase for authentication and PostgreSQL persistence. Store authored lessons and exercise definitions in Git; keep answer-key modules out of browser bundles. Use a small server-side persistence boundary so provider code does not spread through teaching or grading logic.

Pin actual stable runtime/package versions and commit the package-manager lockfile when implementation begins. There is currently no package manifest, application runtime contract, installation command, or cloud project.

## Options considered

| Option | Useful property | Cost or limitation | Current recommendation |
| --- | --- | --- | --- |
| Single Nuxt + Supabase | Accounts and relational persistence together; SQL migrations | SSR sessions, database permissions and RLS require careful implementation | Preferred proposal |
| Nuxt + Firebase Auth/Firestore | One Google ecosystem; document-oriented attempt records | Replace SQL/RLS with Firestore ownership rules and server checks; assess reporting, indexes, migrations and export | Alternative if provider consolidation is prioritised |
| Single Nuxt + Convex | Managed TypeScript functions and reactive data | Community-maintained Vue/Nuxt integration; authentication integration must be validated; backend migration requires rewriting provider functions | Viable alternative, not selected |
| Nuxt + SQLite + managed OAuth | Small persistence layer and conventional server code | Persistent hosting, backups, sessions, identity integration and multi-instance constraints become maintainer responsibilities | Prefer only if suitable persistent hosting already exists |
| Nx workspace | Task caching, generators and boundaries across projects | Adds configuration without a second app or substantial independently maintained packages | Defer until justified |

[Nx's Nuxt plugin](https://nx.dev/docs/technologies/vue/nuxt/introduction) supports Nuxt 3/4. Support is not a reason to introduce a monorepo now. Shared folders inside one application can be extracted later if actual reuse emerges.

[Convex's Vue integration](https://docs.convex.dev/client/vue/overview) and [Nuxt integration](https://docs.convex.dev/client/vue/nuxt) are community-maintained. [Convex Auth](https://docs.convex.dev/auth/convex-auth) currently documents beta React/React Native support, not a ready-made Nuxt authentication path. External OpenID Connect providers are possible; do not assume auth is impossible or automatically solved.

## Deployment options: Firebase Hosting is not App Hosting

Nuxt supports Node deployment and static generation, but a static build does not retain live Nitro server endpoints. See the [Nuxt deployment guide](https://nuxt.com/docs/4.x/getting-started/deployment). Our full pilot needs server execution for grading and saved attempts.

| Option | What runs where | Main tradeoff | Fit for this pilot |
| --- | --- | --- | --- |
| Classic Firebase Hosting alone | Generated HTML, assets and client code on the CDN | No Nitro runtime; cannot grade/write trusted attempts by itself | Reading-only preview, not the complete product |
| Classic Hosting + Cloud Run rewrites | Static files on Hosting; Nitro in a Cloud Run container | Cookie forwarding and two coordinated deployment artifacts | Viable after a session/rollback spike |
| Firebase App Hosting | Managed build/rollout infrastructure for the app | Nuxt support uses the community Nitro adapter; Blaze required | Promising managed Firebase alternative |
| Direct Cloud Run | Whole Nuxt/Nitro app in one Node container | Container/CI ownership, cold starts and no Hosting CDN by default | Preferred conservative baseline |
| Vercel | Managed Nuxt deployment | Different provider; Hobby eligibility and usage limits | Fallback if minimal hosting setup wins |

### Why direct Cloud Run is the baseline

Google publishes a [Nuxt-to-Cloud Run quickstart](https://docs.cloud.google.com/run/docs/quickstarts/frameworks/deploy-nuxtjs-service). One runtime can serve public generated pages, SSR, OAuth callbacks and same-origin API routes. Start with the service URL; custom-domain/CDN work can wait until it has a demonstrated need. This recommendation trades managed framework automation for a transparent Node deployment.

The future implementation should build once from the checked revision, keep the service stateless, use request-based billing and zero minimum instances for the low-traffic pilot, and select an available EU region near the database. Validate cold-start latency before accepting that configuration. Do not use local SQLite or in-memory sessions as durable state.

### Classic Firebase Hosting + Cloud Run: session gate

[Firebase's cookie rules](https://firebase.google.com/docs/hosting/manage-cache#using_cookies) forward only the specially named `__session` cookie to a rewritten backend. Supabase's [SSR integration](https://supabase.com/docs/guides/auth/server-side/creating-a-client) relies on cookie-based session storage. Therefore, do not assume its normal session cookies survive a classic Hosting rewrite.

Before selecting this route, prove OAuth state/PKCE, callback completion, session persistence, refresh, expiry and logout through the actual Hosting URL. A `__session`-compatible session design must account for size/chunking, browser/server access and lifecycle; merely renaming one cookie is not evidence. Prefer direct Cloud Run if compatibility needs substantial custom session machinery.

Alternatively, a generated client plus bearer-token API could avoid that cookie path. It changes token storage, SSR and preview/API-origin handling, so it is not a silent substitute for the current SSR proposal.

[Hosting rewrites](https://firebase.google.com/docs/hosting/cloud-run#direct_hosting_requests_to_your_containerized_app) require billing for Cloud Run. They impose a 60-second request timeout. If adopted, `pinTag` can associate Hosting releases with Cloud Run revisions and support previews/rollback; serialize deployment and manage retained tags. Separate services/data for preview and production still need explicit configuration.

### Firebase App Hosting: useful, with a different support boundary

Firebase documents [Nuxt as community-supported through Nitro](https://firebase.google.com/docs/app-hosting/frameworks-tooling#community-supported-frameworks). Nitro documents the [`firebase_app_hosting` preset](https://nitro.build/deploy/providers/firebase). This is real support, but not the same first-party framework adapter/support path as Next.js or Angular.

App Hosting is a separate product from classic Hosting. Evaluate it if managed Git-connected builds and rollouts save enough maintenance. Verify the chosen stable Nuxt/Nitro versions, EU location, callback/refresh cookies, caching, secrets, preview isolation and rollback in a small deployment spike. Do not transfer classic Hosting's `__session` restriction to App Hosting without testing its own request path.

Git-connected auto-rollouts must match [the release policy](RELEASING.md): deploying every main merge and deploying selected releases are different choices. App Hosting and Cloud Run both require billing; neither is a guaranteed zero-cost product.

## UI components: simple controls, custom teaching surfaces

Recommend [Nuxt UI](https://ui.nuxt.com/) provisionally. Its current library is free/open source and built on Reka UI and Tailwind CSS; the [Nuxt module documentation](https://nuxt.com/modules/ui) describes integration. Confirm stable versions and licence files during the scaffold rather than pinning a package from a documentation proposal.

| Candidate | Benefit | Cost / limitation | Assessment |
| --- | --- | --- | --- |
| Nuxt UI | Styled controls, Nuxt integration and theme tokens | Tailwind/Reka dependency stack; still requires accessible composition and bundle checks | Preferred for one maintainer |
| [shadcn-vue](https://www.shadcn-vue.com/docs/introduction) | Attractive defaults; component source lives in the project | We own copied-code changes and upstream reconciliation; [Nuxt setup](https://www.shadcn-vue.com/docs/installation/nuxt) is documented | Best if extensive customisation is a concrete need |
| [Reka UI](https://reka-ui.com/) directly | Unstyled accessible primitives and design freedom | More styling, composition and interaction work | Keep as a targeted fallback, not a second full kit |
| PrimeVue | Rich controls and Nuxt integration | Current licensing/support transition needs review | Do not choose by assuming every current release is MIT |

PrimeVue's [maintainer announcement](https://github.com/primefaces/primevue) says existing MIT releases retain that licence but that repository now receives security fixes only; active development moved to PrimeUI. The [current Nuxt guide](https://primevue.dev/nuxt/) requires a licence key. Validate current eligibility/terms before reconsidering it; an old free release is not equivalent to an actively developed free default.

These assessments are project-fit judgments, not measured performance rankings. Choose one primary kit. Do not add a second form framework, data-grid package or theme system for the first two activities.

Start with buttons, labelled radio groups, inputs, feedback alerts, a disclosure for hints, and simple progress indicators. Use ordinary links for the visible FR/EN switch; preserve the language-independent activity and draft answer. Define a few colour/spacing/typography tokens for the calm notebook direction.

Keep mathematics in dedicated components: MathExpression, DefinitionBlock, WorkedExample, ExerciseFeedback and TruthTableExercise. Use semantic table headers/cell labels for truth tables, with component-local horizontal scrolling; a sortable data grid is unnecessary. Keep KaTeX markup and spoken readings separate from control labels.

Before adopting the kit, prototype one bilingual implication lesson, answer selection and truth-table completion. Check keyboard navigation, focus and feedback announcements, long French wording, 320/375/768 px layouts, SSR hydration and a production bundle report. No library's accessibility claims establish the accessibility of our assembled lesson.

## Proposed components

| Concern | Choice / contract |
| --- | --- |
| UI and server | Stable Nuxt 4, built-in Nitro, strict TypeScript |
| UI controls | Nuxt UI, one small project theme; custom mathematical activities |
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
| Hosting | Direct Cloud Run proposed; Firebase App Hosting is the managed alternative; classic Hosting + Run requires a proven session design |

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

Official documentation checked 2026-10-14. Verify account eligibility, current quotas and region-specific costs before deployment; these are not promises of free production.

| Service / route | Cost boundary | Pilot implication |
| --- | --- | --- |
| [Classic Firebase Hosting](https://firebase.google.com/docs/hosting/usage-quotas-pricing) | Current no-cost storage 10 GB and transfer 10 GB/month; backend compute is separate | Spark can serve a static preview, but cannot supply our grading runtime |
| [Cloud Run](https://cloud.google.com/run/pricing) | Billing required; request-based free tier includes 2M requests/month with CPU/memory allowances shared by billing account | Include regional compute, internet egress to Supabase/users, image storage, builds, secrets and logs |
| [Firebase App Hosting](https://firebase.google.com/docs/app-hosting/costs) | Blaze required; compute/build/storage/CDN and other underlying services have distinct allowances | A small app may fit allowances, but all supporting services must be included |
| [Supabase Free](https://supabase.com/pricing) | 500 MB database, 50,000 MAU, 5 GB egress; two active projects; pauses after one week of inactivity; no automatic backups included | Test restore/export and recovery from pauses; check project slots before promising isolated environments |
| [Vercel Hobby](https://vercel.com/docs/plans/hobby) | Personal noncommercial eligibility and usage limits | Optional managed fallback; do not retain it as the assumed deployment |

Budget alerts report costs; they do not themselves cap charges. Limit instances and request complexity, clean up previews/images, and document acceptable spend and a stop/recovery procedure before billing is enabled. If strict zero recurring cost with no billing exposure is required, revisit the runtime/provider choice rather than calling Blaze free.

Choose supported EU locations for compute and persistence if that is the agreed requirement. A region selection is not a guarantee about all identity processing, global CDN caches, builds or logs. Data-location requirements remain unconfirmed for this project.

Keeping Google compute and Supabase means two provider dashboards, cross-provider traffic and two outage paths. Prefer Supabase's HTTPS data API initially where it fits, avoiding new connection-pool management; reconsider direct database connections only for a concrete requirement. Keep content in Git, SQL migrations/export procedures explicit and persistence calls behind a small boundary. Auth replacement still requires identity/session migration.

## Checks and deployment requirements

Today run `python3 scripts/check_repository.py` using Python 3.10+. After scaffolding, define one reproducible command covering formatting/lint, types, meaningful tests, content/translation validation and production build. Consolidate the current Python repository check into Node tooling at that stage. Extend Dependabot to actual manifests only when they exist.

Keep PR checks credential-free, with no human/bot exclusions. Deploy only checked authorized revisions, identify the source commit, smoke-test the release, and document rollback. Database rollback is separate from application rollback; prove restoration before destructive migrations. For Google deployments, prefer [GitHub OIDC/Workload Identity Federation](https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines) with a scoped deployment identity rather than stored service-account keys. Use a separate runtime identity and server-only secrets. A public Cloud Run endpoint still needs application authentication/ownership checks on every private route.

Prerender only public content. Session, callback, grading and progress responses must not enter shared caches; explicitly test `Cache-Control: private, no-store` and ensure private payloads/answer-key modules do not enter generated pages. Verify deployment order and immutable revision identity when more than one artifact is involved.

No deployment workflow, dependency or cloud resource is created by this document.

## Decisions before implementation

Confirm whether managed App Hosting or explicit Cloud Run operation is preferred, whether billing exposure is acceptable, and whether Supabase's pauses/two-provider boundary are acceptable. Confirm architecture, urgent chapter order, pilot size, auth-provider availability and data-region preferences. Confirm source rights and what rewards mean. Write the first reviewed bilingual implication lesson and exercise contract before scaffolding. See [ROADMAP.md](ROADMAP.md) and [CONSTITUTION.md](CONSTITUTION.md).

## Next decision gate

After the content pilot and remaining account/budget decisions, use a focused implementation spike to prove one read/sign-in/answer/feedback/saved-progress journey on the proposed runtime with Nuxt UI. Do not scaffold all twenty lessons to test hosting.

| Evidence | Pass condition |
| --- | --- |
| Runtime | Stable Nuxt/Nitro production build; public pages plus server grading work on the actual URL |
| Session | OAuth callback, reload, refresh/expiry and logout work; cookie transport understood |
| Privacy/integrity | Unauthenticated writes fail; another learner's records are inaccessible; scores remain server-derived |
| Presentation | Both activities usable in FR/EN by keyboard and at narrow widths; no hydration errors |
| Operations | Checked immutable deployment, isolated test data, documented rollback and measured cold start |
| Cost/support | Complete service bill estimate, accepted billing exposure and confirmed adapter/licence maintenance |

Record measured findings and the final deployment choice in this document. If classic Hosting sessions require custom infrastructure, choose the simpler direct Cloud Run route; if App Hosting proves the same journey with less ongoing work, promote it to the preferred deployment.
