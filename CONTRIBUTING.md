# Contributing

Contributions improving learning, mathematical accuracy, French/English wording, accessibility, or maintenance are welcome. Read the [code of conduct](CODE_OF_CONDUCT.md) first.

## Before making a change

Check existing issues and pull requests. Describe the problem and proposed scope; avoid expanding a small correction into an unrelated redesign. The repository contains a public Astro/React reading foundation. Follow README.md for pinned installation and commands. Accounts, grading and saved progress are separate features.

## Pull requests

1. Create a focused branch from `main`.
2. Make the smallest coherent change.
3. Run `pnpm check`; run `pnpm test:e2e` for reading or interaction changes.
4. Until Release Please is enabled, update [CHANGELOG.md](CHANGELOG.md) for meaningful contributor/learner changes; afterwards supply release information through the agreed commit/release-PR workflow.
5. Open a pull request explaining the resulting behaviour, validation, and unresolved decisions.

Use a Conventional Commit PR title and inspect the final squash-merge message: `feat(content): add quantifier lessons`, `fix(grading): correct implication feedback`, or `docs: clarify setup`. Work-in-progress commits do not each need release notes. Prefer squash merges for focused PRs.

Do not commit credentials, personal learner data, source PDFs, or third-party material without verified permission.

## Changelog and releases

Follow [the release policy](docs/RELEASING.md). Keep CHANGELOG.md manual under Unreleased until Release Please is enabled. Add an entry for meaningful learner/contributor changes; do not require changeset files for every PR. New lessons are features and incorrect answers are bugs, even when stored as Markdown or JSON.

After the chosen application scaffold introduces an application version, a focused PR will add Release Please. It will collect eligible commits into a checked release PR that the maintainer reviews and merges deliberately. Do not add release automation, publishing credentials, or application tags as part of documentation-only work. Exercise versions remain independent of application versions.

## Mathematical and bilingual content

State the domain and notation conventions. Include a correct answer, a justification, and useful feedback for each exercise. For multiple-choice questions, explain every option. Cite source pages without claiming that an original exercise was written by the source author.

French and English must share stable lesson, exercise, and answer identities. Preserve the course convention that natural numbers include zero. Treat mathematical corrections and translation fidelity as separate review concerns.

Flag suspected errors rather than quietly changing the professor's conventions. Content review is required before publication; repository checks do not establish mathematical correctness.

## Reporting problems

Use the issue forms for bugs, ideas, or content corrections. Follow the [security policy](SECURITY.md) for vulnerabilities instead of posting sensitive details publicly.
