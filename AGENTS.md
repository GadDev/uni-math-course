# Repository instructions

## Current scope

This is a bilingual mathematics learning project in its documentation stage. Do not describe planned accounts, quizzes, or progress as implemented. Product and architecture proposals must preserve unresolved decisions explicitly.

## Working conventions

- Read the README and relevant project documents before changing files.
- Prefer focused branches and reviewable pull requests. Do not merge unless requested.
- Run `python3 scripts/check_repository.py` after documentation or foundation changes.
- Do not invent application commands before a package manifest exists.
- Keep secrets, learner records, source PDFs, and unlicensed third-party assets out of Git.

## Mathematics and content

Use stable language-independent content IDs, version changed exercises, state domains, and preserve French course notation in both languages. Natural numbers include zero for this course. A biconditional connective and semantic equivalence are different concepts. Flag source errors with page references and clear explanations.

Each published exercise needs French/English wording and feedback, a correct answer, justification, grading contract, difficulty, prerequisites, and provenance. Automated repository checks are not mathematical peer review.

## Implementation decisions

A single Nuxt application with Nitro and Supabase is a proposal, not an approved scaffold. Nx, Convex, authentication providers, hosting, costs, and rewards remain subject to documented decisions. Do not add dependencies or infrastructure solely because they appear among the options.
