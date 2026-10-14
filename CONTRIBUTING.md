# Contributing

Contributions improving learning, mathematical accuracy, French/English wording, accessibility, or maintenance are welcome. Read the [code of conduct](CODE_OF_CONDUCT.md) first.

## Before making a change

Check existing issues and pull requests. Describe the problem and proposed scope; avoid expanding a small correction into an unrelated redesign. The repository currently contains documentation and repository tooling only, so there are no application install or run commands yet.

## Pull requests

1. Create a focused branch from `main`.
2. Make the smallest coherent change.
3. Run `python3 scripts/check_repository.py`.
4. Update [CHANGELOG.md](CHANGELOG.md) when the change affects contributors or learners.
5. Open a pull request explaining the resulting behaviour, validation, and unresolved decisions.

Use descriptive commit messages. Do not commit credentials, personal learner data, source PDFs, or third-party material without verified permission.

## Mathematical and bilingual content

State the domain and notation conventions. Include a correct answer, a justification, and useful feedback for each exercise. For multiple-choice questions, explain every option. Cite source pages without claiming that an original exercise was written by the source author.

French and English must share stable lesson, exercise, and answer identities. Preserve the course convention that natural numbers include zero. Treat mathematical corrections and translation fidelity as separate review concerns.

Flag suspected errors rather than quietly changing the professor's conventions. Content review is required before publication; repository checks do not establish mathematical correctness.

## Reporting problems

Use the issue forms for bugs, ideas, or content corrections. Follow the [security policy](SECURITY.md) for vulnerabilities instead of posting sensitive details publicly.
