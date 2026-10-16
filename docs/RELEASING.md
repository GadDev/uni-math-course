# Releasing

Status: PR-based release information; automation deferred · Owner: GadDev · Last reviewed: 2026-10-16

## Current stage: PR-based release information, unreleased application

The reading foundation has a private package manifest at 0.0.0, which is an unreleased scaffold version. The read/sign-in/practise/progress journey is implemented and checked locally; hosted class-pilot acceptance is pending. No class-pilot release is claimed.

Preserve the existing [CHANGELOG.md](../CHANGELOG.md) history. Ordinary product, documentation and maintenance PRs no longer edit its shared Unreleased section. Record meaningful learner/contributor outcomes, migration actions and compatibility limitations in the PR description and final Conventional Commit squash message instead. This transition removes concurrent changelog edits before release automation is enabled; it does not generate a changelog automatically.

Do not invent a package version, add Changesets files, or create an application release for every documentation or tooling PR. Small internal edits need no separate release note. Historical corrections can use a dedicated documentation PR. For open branches, retain release information in the PR and squash message, remove only their own new changelog edits, and preserve main's existing history.

This policy adds no release workflow, package dependency, publishing token, tag, GitHub release, or deployment. The scaffold now introduces an application version; Release Please implementation remains a separate focused PR. Do not activate it merely by merging the scaffold.

## Contribution and commit convention

Use short-lived branches, focused PRs, and squash merges. The final squash commit should follow Conventional Commits; use the PR title as its proposed message and inspect the actual squash message before merging. Copy important release details from the PR description into the final squash commit body; PR prose alone is not input to the future Conventional Commit parser. Individual work-in-progress commits need not each generate release notes.

The existing `docs` job in `.github/workflows/check.yml` is the stable required-check name for the full repository/application gate, including immutable exercise banks, disposable database contracts and browser checks. Do not rename it without updating effective branch rules. Configure GitHub to require a successful current check and an up-to-date branch; the workflow file alone cannot enforce merging. See [main protection setup](REPOSITORY_SETUP.md#main-branch-check-requirement) for the reviewed settings and remaining hosted verification.

| Type | Meaning | Example |
| --- | --- | --- |
| feat | New learner capability or course content | feat(content): add French and English quantifier lessons |
| fix | Correct existing product behaviour or learning content | fix(grading): correct negation of implication |
| docs | Contributor/project documentation without a product change | docs: clarify local setup |
| chore | Maintenance without a direct product change | chore(ci): update checkout action |
| refactor / test | Internal structure or verification | test(grading): cover false antecedents |

A new lesson is a feature and an incorrect answer is a bug; do not hide them under docs just because the file is Markdown or JSON. Record security-relevant or compatibility-impacting dependency updates explicitly where appropriate. A real breaking change must carry a breaking-change marker and a migration explanation, irrespective of its commit type.

Do not enforce a changeset file for every PR. Labels are triage metadata, not the release-version authority.

## Target workflow: Release Please

The application already has a private versioned manifest. In a separate implementation PR, adopt [Release Please](https://github.com/googleapis/release-please) as the single application version/changelog authority. Do not run Changesets or semantic-release alongside it for the same application.

1. Feature/fix PRs pass applicable checks and are reviewed before merging.
2. Release Please reads eligible Conventional Commits on main and accumulates changes in a release PR.
3. The release PR updates the application version and CHANGELOG.md; review version selection, generated wording, corrections, and migration implications.
4. Run the same relevant quality gates on the release PR. The maintainer chooses when to merge it; do not auto-approve or bypass checks.
5. After the merge, release automation creates the corresponding tag and GitHub release.
6. Deployment separately uses the exact checked release revision, records its identity, and verifies health. A GitHub release is not proof that production was deployed.

Preserve existing manual history during adoption. Record the bootstrap boundary explicitly so initial automation does not infer a fictional application release from documentation-only commits. The package manifest becomes the canonical application version when it exists; align the release manifest, tag and notes to it rather than inventing multiple independently edited version files.

Until automation is enabled, new release information stays in PR descriptions and final squash messages; existing changelog history stays intact. The bootstrap PR must explicitly reconcile that history with eligible commits so notes are neither lost nor duplicated. After activation, only the release PR routinely updates CHANGELOG.md; ordinary product PRs do not add Unreleased entries or rewrite generated sections. Review and edit proposed release notes in the release PR through the supported Release Please mechanisms so regeneration does not lose corrections. GitHub release notes derive from that same reviewed release information.

## Version policy

| Change | Policy |
| --- | --- |
| First usable class pilot | 0.1.0, after the real read/sign-in/practise/progress journey works |
| Compatible correction | Patch, for example 0.1.0 to 0.1.1 |
| Added learner capability or lessons | Minor, for example 0.1.1 to 0.2.0 |
| Incompatible change before 1.0 | Explicit minor bump and migration notes; breaking-change markers remain mandatory |
| Stable agreed product contract | 1.0.0 when agreed behaviour and rollout/operational requirements are satisfied |
| Breaking public contract after 1.0 | Major bump with migration information |

This is the project's pre-1.0 policy, not an assumption about the release tool's defaults. Configure and verify minor/patch and breaking-change behaviour before activating automation. The first 1.0 release need not wait for every planned course chapter.

A class pilot is not automatically a SemVer prerelease. Use a suffix such as beta.1 and the corresponding GitHub prerelease status only if a separate prerelease channel is intentionally introduced and tested.

## Application versions and exercise versions

Application releases identify delivered software/content snapshots. Each exercise also has a stable ID and immutable version. The [content release registry](CONTENT_RELEASES.md) selects served versions and binds both lesson languages and the bank to recorded review/exception evidence. CI rejects edits or deletions of bank versions already present on the base revision. An application patch may introduce exercise L05-E03 version 2 while historical attempts continue to reference version 1 and its original grading context.

Do not silently regrade historical attempts after changing an answer or domain. State any proposed regrading or data migration explicitly, assess its impact, and preserve recoverability. Corrections need mathematical and French/English fidelity checks as well as software checks.

## Release-note quality

Explain the learner-visible outcome rather than listing implementation internals. For example: "Corrected an implication exercise that accepted the converse as equivalent. Previous attempts remain available with their original grading context."

Include new learning capabilities, meaningful corrections, compatibility changes, migration actions and relevant limitations. Do not claim unreleased lessons or planned authentication already work. Future French/English What's changed summaries should derive from the same release, rather than becoming competing technical changelogs. Review translations before publishing those summaries.

## Automation and deployment acceptance checklist

The future focused implementation PR must verify:

- Exact action pins and minimal job-specific permissions; no production credentials in PR checks.
- Real CI execution on bot-created release PRs, including Dependabot where relevant. The ordinary GITHUB_TOKEN can suppress subsequent workflow triggers; choose and validate an explicit supported token/event strategy without weakening required checks.
- Correct first-release/bootstrap handling, version selection, changelog updates and release identity in a dry run or safe test.
- No duplicate releases when automation is retried; serialized release mutation and no routine bypass of main protections.
- Clear production policy: every checked main merge or selected releases. If hosting auto-deploys main, a release PR alone does not control when features reach learners.
- If selected releases are chosen, deploy the verified immutable revision, smoke-test it, and record the version/commit and hosting revision. Application rollback does not undo database changes.

See [TECHSTACK.md](TECHSTACK.md) for architecture proposals, [ROADMAP.md](ROADMAP.md) for pilot acceptance criteria, and the [Release Please Action documentation](https://github.com/googleapis/release-please-action) for automation inputs and token behaviour. No new credential or release job is activated by adopting this document.
