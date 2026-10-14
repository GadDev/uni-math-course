# Repository instructions

## Current scope

This is a bilingual mathematics learning project with public reading and configurable Supabase authentication/session code. Hosted authentication acceptance is pending. Do not describe planned quizzes or saved progress as implemented. Product and architecture proposals must preserve unresolved decisions explicitly.

## Working conventions

- Read the README and relevant project documents before changing files.
- Prefer focused branches and reviewable pull requests. Do not merge unless requested.
- Run `pnpm check` after changes and `pnpm test:e2e` for reading or interaction changes.
- Use the pinned Node/pnpm versions and committed lockfile. Keep server-held exercise answers out of client imports and generated pages.
- Keep secrets, learner records, source PDFs, and unlicensed third-party assets out of Git.

## Claude Code confinement

`.claude/settings.json` keeps Claude Code inside this checkout. The OS sandbox limits Bash reads and writes (home folders, credentials, `.env*` files and the Downloads, Desktop and cloud-storage folders are denied; network is limited to an allowlist and prompts otherwise; the unsandboxed retry is disabled). Read, Grep and Glob refuse any path outside the project in every mode, so PDFs and other files elsewhere on the machine are not readable. `.claude/hooks/confine-paths.mjs` checks every tool call, including MCP and upload tools: it refuses paths outside the project, secret files, the IDE kernel tool and remote agents, and writes to guardrail files and to files that run outside the sandbox (`.claude/`, `.mcp.json`, `.git`, `.vscode`, `.github/workflows`, `tests/claude`). A hook error refuses the call. The Bash check is a heuristic; the sandbox is the boundary. Change these files by hand, not through Claude, and run `pnpm test` after editing the hook. Commands that need local ports or network hosts outside the allowlist (for example `pnpm dev` or `pnpm test:e2e`) run in your own terminal. Put personal overrides in the gitignored `.claude/settings.local.json`.

## Mathematics and content

Use stable language-independent content IDs, version changed exercises, state domains, and preserve French course notation in both languages. Natural numbers include zero for this course. A biconditional connective and semantic equivalence are different concepts. Flag source errors with page references and clear explanations.

Each published exercise needs French/English wording and feedback, a correct answer, justification, grading contract, difficulty, prerequisites, and provenance. Automated repository checks are not mathematical peer review.

## Implementation decisions

Astro with React, Vercel Hobby, Supabase Free and Radix Themes is the approved implementation stack. Nuxt and Next.js are evaluated alternatives, not implementation requirements. Auth-provider suitability, free-plan limitations, data location, rewards and the complete learning journey still require the documented checks. Do not introduce a paid dependency or enable billing under the current zero-recurring-cost constraint. Do not add dependencies or infrastructure solely because they appear among the options.
