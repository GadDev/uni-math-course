# Tech stack and decisions

Owner: GadDev · Updated: 2026-10-18 · Implemented application stack; hosted class acceptance still pending.

## Current architecture

| Layer | Implemented choice | Why it fits |
| --- | --- | --- |
| Public lessons and routes | **Astro 7**, TypeScript 6, Markdown/MDX content collections | Fast prerendered French/English reading without a client-side app shell |
| Interactive practice | **React 19** with a limited Radix Themes dependency | Client interaction only where necessary; L37 has inline animated React islands, while native reading disclosures do not load React or global Radix CSS |
| Mathematical notation | **KaTeX** with MathML and local plain-language readings | Readable notation alongside accessible text |
| Identity and data | **Supabase Auth** and **PostgreSQL** with row-level security | Verified invited-account sessions and private attempt history |
| API and grading | Astro server routes, immutable exercise banks and transactional PostgreSQL RPC | Answers remain server-held; grading and first-attempt eligibility are authoritative |
| Hosting | **Vercel Hobby** with the Astro adapter | One application, Git integration and managed deployment under the zero-recurring-cost target |
| Tooling and tests | Node.js 24.19.0, pnpm 11.25.0, native Node tests, Playwright and disposable PostgreSQL checks | Locked installs and a single local quality command, `pnpm check` |

This is an independent non-commercial pilot for one maintainer. A free-tier label is not proof of eligibility, sufficient quota, backup/recovery capability or EU data handling. Verify actual account terms and deployment settings before expanding real-user access. Do not introduce billing or paid infrastructure by default.

## Boundaries that matter

- **Reading vs private activity:** lessons and the symbol glossary are public and prerendered; sign-in, exercise delivery, grading and progress are on-demand and verify server identity. Direct APIs enforce access independently of navigation.
- **Answers vs prompts:** immutable answers and feedback logic are server-only; browser responses get question content without grading secrets. A released bank version must not be silently modified.
- **Saved attempts:** idempotent submission IDs, versioned history and a single owner-scoped `read_attempt_history()` snapshot preserve exact historical feedback. A prior or hinted answer cannot silently become current independent mastery evidence.
- **Bilingual consistency:** stable IDs, version/fingerprint checks and explicit author/reviewer decisions determine publication. Automated tests detect structural changes but do not establish mathematical correctness or translation fidelity.
- **Security:** use server-held Supabase secret credentials only in on-demand server code; client roles must not gain write privileges. Keep source PDFs, personal learner data and credentials outside Git.
- **Operations:** additive and verified database migrations precede dependent application code. A GitHub Release identifies a versioned code snapshot, not proof of successful Vercel deployment or course approval.

The maintained implementation contracts are in [authentication](AUTHENTICATION.md), [practice and data](PRACTICE.md), [content publication](CONTENT_RELEASES.md), [release operations](RELEASING.md) and [pilot acceptance](PILOT_ACCEPTANCE.md). Refer to those documents instead of copying current API/schema procedures here.

## Why these choices

The course is predominantly reading plus bounded authenticated activities. Astro prerenders that reading; React adds focused activity islands. Nuxt and Next.js remain viable alternatives, but a full application router would add no demonstrated value to this pilot. Firestore/Convex, Firebase/Cloud Run and other hosts are alternatives only if measured capacity, operational or product needs change. A monorepo, second UI kit, realtime layer or custom auth service is not justified by the current single-application scope.

The original, much longer framework/provider comparison is retained as [historical decision research](https://github.com/GadDev/uni-math-course/blob/abac4cb4df7aa3fab55c69a42f38018bb85364cc/docs/TECHSTACK.md); its old provider prices and tentative implementation statements should not be read as current operational facts.

## Verify a change

Run `pnpm check` and the relevant browser suite (`pnpm test:e2e`); use an **empty disposable database** for `tests/database/run.sh`. The GitHub Actions gate retains the required job name `docs`. Hosted authentication, production configuration, Data API isolation, cost/eligibility, privacy and human course reviews remain separate acceptance work, even with green CI. See the [roadmap](ROADMAP.md) and [acceptance record](PILOT_ACCEPTANCE.md).

## Inline lesson panels

L37 uses the official MDX integration to keep French/English prose in the existing content collection and embed `FunctionPanel` React islands beside its examples. Each island uses `client:visible`; the static lesson and diagrams render before hydration and without JavaScript. The graph links a selected input, rule parameter, calculation, table and animated point; playback is opt-in and respects reduced motion. Other lessons remain Markdown. Full-byte reading fingerprints and translation-source freshness apply to both file types; exactly one source per language is required. See [L37 review](content/L37_REVIEW.md).
