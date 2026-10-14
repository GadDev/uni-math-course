# Tech stack

Status: revised proposal; framework and deployment require a pilot · Owner: GadDev · Last reviewed: 2026-10-14

## Constraints and recommendation

Deliver a correct four-lesson French/English learning pilot with one maintainer, **€0 recurring software cost**, public reading, signed-in practice, server grading and private saved progress. Use provider subdomains initially. Do not depend on trials, paid add-ons or an assumed future upgrade.

The leading proposal is **Astro + React activities, Vercel Hobby, Supabase Free, and a small Radix Themes component set**. Nuxt remains a strong alternative; no framework, library or provider is approved or implemented by this document.

| Decision | Proposed choice | Reason / condition |
| --- | --- | --- |
| Application boundary | One Astro project containing pages and authenticated API routes | One deployable project; no separate grading service |
| Reading | Prerender original lessons, examples and glossary | Public content does not require per-user rendering |
| Practice | React activity roots and same-origin server endpoints | Reuse React skills and keep grading authoritative |
| Deployment | Vercel Hobby for an eligible personal noncommercial pilot | Managed Git deployment/previews, no container pipeline |
| Identity/data | Supabase Free provisionally | Auth and PostgreSQL together; accept pauses, quotas and manual backup work |
| UI | Radix Themes for React controls; ordinary CSS for reading | Styled controls with limited theme work; validate island integration |

Assumption: delivering the learning product matters more than learning Vue through this project. The maintainer's React/TypeScript experience is relevant to effort. If Vue practice is an explicit goal, reconsider Nuxt before scaffolding. Familiarity with Firebase Hosting reduces platform learning, but does not make its dynamic backends free.

These are judgments about project fit, not measured performance rankings. All major candidates can implement the product; content correctness, translation quality and feedback matter more than framework popularity.

## Challenge the Nuxt decision

Nuxt provides a coherent Vue application, server routes, localisation options and Nuxt UI. Nothing in the learning requirements, however, requires Vue, Nitro or an app-wide client router. The MVP is primarily authored reading with two bounded activities and a small progress area. Starting with Nuxt solely because it was the initial suggestion or because Nuxt UI looks attractive would reverse the decision order.

| Candidate | Strongest fit | Main cost for this project | Assessment |
| --- | --- | --- | --- |
| Astro + React | Markdown lessons, glossary and contained exercises | Astro/React boundary; draft persistence across page navigation; explicit API/session integration | Leading MVP proposal |
| Nuxt | A cohesive Vue app with tightly connected interactive pages | Vue/Nuxt learning if unfamiliar; content-module and hydration choices still need testing | Best alternative if Vue or continuous app navigation is prioritised |
| Next.js | React expertise and an increasingly app-like practice workspace | App Router server/client boundaries and cache behaviour need discipline; content authoring still needs a pipeline | Prefer if rich dashboards or long connected practice sessions become central |
| SvelteKit | Server forms, progressive enhancement and compact full-stack code | New Svelte skills plus content/UI decisions | Sound technically; no clear delivery advantage for this maintainer |
| Vite + React with external functions | Familiar frontend and static hosting | Separate authenticated backend, deployment and origin/session handling | Simple frontend, more integration overall |

Capability sources: Astro's [islands](https://docs.astro.build/en/concepts/islands/), [content collections](https://docs.astro.build/en/guides/content-collections/) and [live endpoints](https://docs.astro.build/en/guides/endpoints/); Nuxt's [server engine](https://nuxt.com/docs/4.x/getting-started/server); Next.js [server/client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components); SvelteKit [form actions](https://svelte.dev/docs/kit/form-actions) and [Vercel adapter](https://svelte.dev/docs/kit/adapter-vercel).

### Why Astro leads, and where it can lose

Astro supports [React integration](https://docs.astro.build/en/guides/integrations-guide/react/) and [on-demand pages/endpoints](https://docs.astro.build/en/guides/on-demand-rendering/). Public reading can remain prerendered while callbacks, exercise delivery, grading and progress execute on the server. Its [Vercel adapter](https://docs.astro.build/en/guides/deploy/vercel/) keeps both in one deployment; Astro does not imply a static-only backend or mandatory external functions.

Use one React root per cohesive activity, not an island per input. Hydrate the activity when available; keep private questions behind authenticated delivery. Persist unfinished responses explicitly by stable activity ID/version so page or language navigation cannot silently discard them. Do not store tokens or learner histories in that draft store; clear drafts at logout/account changes and handle incompatible exercise versions.

Astro adds a boundary between reading templates and React state. If the pilot needs persistent app-wide state, many cooperating islands or a React SPA embedded across most pages, reconsider Next.js or Nuxt. Nuxt and Next can also prerender content and limit client work: Astro is not automatically faster, cheaper or more accessible. Measure the actual first journey before final selection.

No application exists yet, so this is a proposal change rather than a code migration. Keep grading, content schemas and persistence independent of page-framework APIs to make later changes manageable.

## Proposed application and content model

Use strict TypeScript, pnpm and a committed lockfile. Select stable runtime/framework/adapter versions together when scaffolding; this document does not prescribe untested latest-version combinations. Keep one repository and defer Nx or separately maintained packages until real reuse exists.

Store original lessons as Markdown with validated bilingual metadata in Git. Astro content collections are the proposed reading pipeline; keep exercise grading contracts separate from any public content collection. Markdown processing must preserve KaTeX output and the source course's notation. Do not turn authored answer modules into browser imports or serialised activity props.

| Concern | Proposed choice / contract |
| --- | --- |
| Pages and API | Astro with Vercel adapter; public prerendering and explicit on-demand private routes |
| Activities | React; answer selection and labelled truth-table completion first |
| UI controls | Small Radix Themes set, subject to SSR/hydration/keyboard checks |
| Lessons | Markdown, validated ID/version/objective/prerequisite/source metadata |
| Exercises | Bilingual definitions; shared answer identity; server-held grading modules |
| Localisation | Explicit /fr/ and /en/ routes; stable language-independent IDs |
| Mathematics | KaTeX HTML + MathML plus plain-language readings |
| Validation | Zod at authored-content and API boundaries |
| Accounts | Supabase Auth; Google OAuth pending classmate availability |
| Persistence | Supabase PostgreSQL; SQL migrations and ownership policies |
| Verification | Vitest grading/content checks; auth/persistence integration; Playwright critical journeys |
| CI and releases | One quality gate; manual changelog until Release Please is activated |

Astro documents [i18n routing](https://docs.astro.build/en/guides/internationalization/). Routing alone does not translate UI, validate French/English parity or preserve answers; implement those contracts explicitly. If Nuxt is selected, use its i18n module and Nitro routes instead. If Next.js is selected, revisit localisation/content wiring rather than assuming framework substitution is configuration-only.

## Deployment benchmark under the €0 constraint

Compare hosting against the complete read/sign-in/answer/feedback/progress journey, not a static homepage. Free-plan quotas are service limits, not a guarantee that the product will remain available at any traffic level.

| Route | Setup / maintenance judgment | Free boundary | Recommendation |
| --- | --- | --- | --- |
| Vercel Hobby | Very low; managed framework deployment and Git previews | Personal noncommercial eligibility; usage limits | Preferred for this personal pilot |
| Netlify Free | Very low; managed deployment and previews | Current credit-based Free plan: 300 credits/month, hard limit; production deploys use credits | Closest alternative; verify account plan and budget |
| Cloudflare Workers Free | Low-medium; adapter/runtime validation needed | 100,000 requests/day and 10 ms CPU per invocation | Good alternative after auth/SSR/grading CPU tests |
| Classic Firebase Hosting alone | Very low, familiar deployment | Static files on Spark; no trusted server grading by itself | Public reading preview only |
| Hosting + Supabase Edge Functions | Medium; static frontend and separate authenticated API | Both free allowances apply independently | Viable if keeping Hosting outweighs one-deployment simplicity |
| Firebase App Hosting | Low-medium; managed builds and framework adapter | Requires pay-as-you-go Blaze | Defer while no billing exposure is accepted |
| Cloud Run, direct or through Hosting | Medium; runtime/image/IAM and release management | Billing account required; free compute allowances are conditional | Defer under the current free-first requirement |

Sources: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Netlify current plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [Netlify credit use](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/), [Cloudflare pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Firebase Hosting quotas](https://firebase.google.com/docs/hosting/usage-quotas-pricing), [App Hosting costs](https://firebase.google.com/docs/app-hosting/costs), [Hosting/Cloud Run billing](https://firebase.google.com/docs/hosting/cloud-run) and [Supabase Edge Functions](https://supabase.com/docs/guides/functions).

Netlify currently charges 15 credits for each successful production deploy: 20 would consume all 300 credits before compute/traffic. That is a theoretical ceiling, not a useful deployment budget. Its Free plan cannot auto-recharge, and exhausted credits pause sites. Cloudflare's CPU allowance excludes network wait, but rendering/token verification still need measurement. Neither should be rejected purely because it is less familiar.

Vercel Hobby currently includes 100 GB fast transfer, one million function invocations and four CPU-hours. Keep the project eligible for personal noncommercial use, avoid paid features/trials, and monitor the dashboard. If scope becomes commercial or quotas insufficient, re-evaluate hosting within the budget rather than assuming a paid upgrade.

### Google remains a future option

Google experience is a valid maintenance consideration, not a requirement to deploy all projects there. Cloud Run and App Hosting may stay within allowances at pilot traffic, but require billing and have supporting-service costs. Google allowances can be shared across projects by billing account.

Classic Hosting also [forwards only the __session cookie](https://firebase.google.com/docs/hosting/manage-cache#using_cookies) to a rewritten backend. Prove Supabase cookie compatibility before using Hosting + Cloud Run; merely renaming a cookie does not establish PKCE, refresh or chunk handling. A static client with bearer-token functions avoids that route but changes the SSR/session architecture.

[Firebase App Hosting supports Nuxt through a community Nitro adapter](https://firebase.google.com/docs/app-hosting/frameworks-tooling). Do not assume that capability establishes support for a different chosen framework. Direct Cloud Run's Node deployment remains a portability option if budget/operations priorities change. Neither route is the current baseline.

## UI library follows the framework

| Choice | Benefit | Cost / condition |
| --- | --- | --- |
| [Radix Themes](https://www.radix-ui.com/themes/docs/overview/getting-started) with React | Styled controls and a small theme API; [MIT source](https://github.com/radix-ui/themes/blob/main/LICENSE) | Put its provider inside each React activity root; test CSS, SSR, portals and focus in Astro |
| [shadcn/ui](https://ui.shadcn.com/docs) with React | Attractive editable component source | Copied-code updates and styling become project work; choose if customisation justifies it |
| [Nuxt UI](https://ui.nuxt.com/) with Nuxt | Free styled Vue controls, Reka UI/Tailwind and Nuxt integration | Best if Nuxt wins; do not choose Vue solely to use this library |

Recommend Radix Themes provisionally for the Astro/React candidate. There is no demonstrated need for two UI kits, a data grid or a separate forms framework. Use ordinary CSS for the notebook reading layout; a React provider cannot style or share context across unrelated Astro islands automatically.

Start with labelled radios/inputs, buttons, deliberate hints and feedback. TruthTableExercise, WorkedExample and MathExpression remain custom teaching components. Use semantic table headers/cell labels and component-local scrolling. Keep the FR/EN switch visible and preserve activity identity/drafts.

PrimeVue is not a free-by-default recommendation: its [maintainer announcement](https://github.com/primefaces/primevue) distinguishes legacy MIT releases/security fixes from active PrimeUI development, and its [current Nuxt guide](https://primevue.dev/nuxt/) requires a licence key. Recheck terms if it is reconsidered.

Library claims do not establish the accessibility of our lessons. Verify long French wording, announced feedback, visible focus, keyboard behaviour, mathematical alternatives, narrow layouts and production hydration.

## Authentication, grading and persistence

Use the selected framework's server cookie adapter with current [Supabase SSR guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client). Astro has a [Supabase integration guide](https://docs.astro.build/en/guides/backend/supabase/), but examples do not replace current session/security requirements. Verify identity through getClaims or an appropriate server-confirmed lookup; do not trust an unvalidated getSession user.

Public pages make no private data requests during prerendering. Mark OAuth callbacks, exercise delivery, grading and private progress as on-demand. Protect direct API calls, not only navigation. A browser redirect or disabled control cannot enforce access.

The grading endpoint verifies identity and request origin, loads the immutable exercise version, validates bounded inputs, computes feedback and writes one idempotent attempt. Derive ownership from verified authentication and reject caller-supplied scores/owner IDs. Authenticated questions and explanations may reach the browser; this is a learning tool, not an examination system.

| Record | Purpose |
| --- | --- |
| Profile | Auth user ID, preferred language, optional display name |
| Lesson completion | User, stable lesson ID/version and time |
| Attempt | User, exercise/version, response, server result, hint/solution state, time and submission ID |
| Reward award, later | Unique user/milestone/version; no client-writable totals |

Use database grants and [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) for owner-only reads. Deny direct client writes to scored attempts/rewards; the trusted grading path writes them. A privileged service credential bypasses RLS, so enforce ownership in that path and keep credentials server-only.

Exercise corrections create new versions; never silently reinterpret historical attempts. Derive progress from attempts rather than a separate mutable score store. Preserve the distinction between reading completion, history and mastery evidence.

Google OAuth is provisional. Email/password or magic links need a suitable SMTP plan: Supabase's [default email service](https://supabase.com/docs/guides/auth/auth-smtp) is restricted to project-team addresses and currently two messages/hour. Do not introduce a paid email dependency without revisiting the budget.

## Data-platform alternatives and free-plan operations

Retain Supabase provisionally; hosting on Vercel does not require a Vercel database. Relational attempts/version/history queries are useful but do not make SQL mandatory.

| Alternative | Potential advantage | Reason to defer |
| --- | --- | --- |
| Firebase Auth/Firestore | Consolidated Google tooling and document attempt records | New ownership/session/query/index model; Hosting still does not supply free server grading |
| Convex | Managed reactive persistence/functions | Provider-specific model and community [Vue/Nuxt integration](https://docs.convex.dev/client/vue/overview); no realtime need in MVP |
| SQLite + managed OAuth | Conventional small persistence layer | Durable hosting, backups and sessions become maintainer responsibilities |
| Nx workspace | Shared package/task orchestration | One application has no demonstrated monorepo need |

[Supabase Free](https://supabase.com/pricing) currently includes 500 MB database, 50,000 MAU, 5 GB egress and two active projects. Projects pause after one week of inactivity; automatic backups are not included. Confirm available slots, test resume/export/restore and accept the holiday interruption risk before classmate use. Do not add artificial traffic as a substitute for an accepted availability policy.

Define retention, deletion and export; keep preview data apart from real attempts. Choose available EU regions if that is the agreed requirement, without equating database location with an EU-only guarantee for auth, global caches, builds or logs. Data-location preferences remain open.

Use Supabase's HTTPS data API where it fits before adding direct-connection pooling. Content remains in Git, SQL migrations/export procedures remain explicit, and provider access stays behind a small boundary. Free hosting and free persistence are independent allowances and failure paths.

## Delivery, validation and decision gate

Run the existing python3 scripts/check_repository.py today. After the chosen application scaffold, consolidate repository checks into Node tooling and define one gate for format/lint, types, grading/content tests, translation parity and production build. Extend Dependabot only for actual manifests. Manual changelog maintenance continues until Release Please is enabled; a versioned application enables its separate implementation PR.

Keep PR checks free of production credentials. Separate preview/production configuration and data, register exact auth callbacks, verify deployed revision identity, and smoke-test login plus one saved attempt. Private/session responses use Cache-Control: private, no-store; test that secrets, private questions and grading keys do not enter static output or browser bundles.

Production must explicitly follow checked main merges or selected releases, consistent with [RELEASING.md](RELEASING.md). Hosted auto-deploys do not by themselves enforce CI or release approval. Document application rollback separately from data migration/restore. If Google deployment is later chosen, prefer scoped OIDC/Workload Identity Federation over stored service-account keys.

After the bilingual content pilot, prove the same complete learning journey on the leading framework; do not build two full applications or all twenty lessons to settle this choice.

| Evidence | Pass condition |
| --- | --- |
| Framework/runtime | Public lesson plus on-demand auth/grade/progress routes deploy correctly |
| State/languages | Switch FR/EN and navigate/reload without losing a compatible draft; no cross-account draft leakage |
| Session/integrity | Callback, refresh/expiry and logout work; unauthenticated writes fail; grades and ownership stay server-derived |
| Content/UI | Both activities usable at 320/375/768/1280 px and by keyboard; no hydration errors; correct math readings |
| Cost/operations | Accepted free quotas/pauses, isolated test data, export/restore and checked rollback evidence |
| Decision | Astro boundaries remain small; otherwise revisit Nuxt or Next with recorded reasons |

Confirm framework, personal noncommercial eligibility, Supabase pauses/backups, auth-provider availability, pilot size, data region, rights and rewards before implementation. See [ROADMAP.md](ROADMAP.md) and [CONSTITUTION.md](CONSTITUTION.md). No dependencies, account setup, billing change or deployment is activated here.
