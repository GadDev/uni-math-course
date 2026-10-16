# Changelog

Notable changes are recorded here. No application version has been released.

## Unreleased

### Fixed

- Replaced the reading-tip React/Radix island with a native keyboard-accessible disclosure that works without JavaScript, and removed the global Radix stylesheet from public pages.
- Record translation review against its French source fingerprint and derive checked release-status summaries from the authoritative registry. Preserve existing unreviewed-release exceptions.

- Keep withdrawn and archived attempts in lifetime history, read one owner-scoped database snapshot, and label historical feedback without regrading saved results.
- Require freshness records for every public reading lesson, including when practice is disabled, and align implementation documentation.

- Preserve hint exposure, active exercise and answers across language changes; keep an existing session after failed replacement sign-in and clear practice drafts on browser logout.
- Make first-attempt evidence transactional, retain historical exercise feedback by version, and preserve lifetime progress beyond 500 attempts.
- Bind served practice versions and both lesson languages to explicit review/exception fingerprints, with immutable-version and database contract checks.

- Restored French/English mobile headers with full-width navigation on the second row, including keyboard-accessible signed-in profile menus.

### Added

- Public searchable bilingual symbol glossary: 56 mathematics/logic/code entries and eight code-notation references, with spoken readings in both languages, source-page references, a page-48 correction note and language-preserving entry links.

- Signal styling for the public programme and L05 reading pages, with responsive course navigation, lesson contents, self-hosted licensed display typography and bilingual section switching.

- Selected Signal art direction: nine WebP course, learning, access and mobile concepts, with updated design guidance and asset evidence.

- Configurable bilingual Google/Supabase sign-in, server-verified cookie sessions, PKCE callback, refresh and local logout, with credential-free protocol/browser checks and hosted setup guidance.

- Astro/React public reading foundation: bilingual programme and implication pages, accessible mathematics, Radix reading disclosure, locked toolchain, Node checks and browser verification.

- Original bilingual implication lesson and six versioned exercise contracts, with mathematical and translation self-check evidence.

- Architecture and free-deployment benchmark: Astro/React versus Nuxt, Next.js and SvelteKit; Vercel Hobby recommendation, UI alternatives, session/privacy boundaries, free-plan operations and a pilot decision gate.

- Repository label sync and PR path labelling, with a mathematics-specific catalogue, trusted metadata-only workflows, and a small jq catalogue check.

- Repository foundation: README, MIT licence, contribution guidance, conduct and security policies, ownership, and GitHub issue/pull-request templates.
- Editor settings, ignore rules, line-ending conventions, and a dependency-free repository documentation check.
- GitHub Actions documentation validation and Dependabot updates for GitHub Actions.
- Proposed mission, constitution, four-lesson MVP roadmap and architecture, with a full 20-lesson course map and explicit open decisions.
- Playbook-aligned Markdown validation, shared agent instructions, content-rights policy and setup evidence record.
- Release policy and contribution conventions: manual changelog now, with Release Please deferred until a versioned application exists.
