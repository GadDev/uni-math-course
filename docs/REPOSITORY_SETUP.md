# Repository setup record

Initial audit: 2026-10-14 · Implementation reconciliation: 2026-10-16 · Accountable maintainer: [GadDev](https://github.com/GadDev) · Next review: 2026-10-21

## Identity and scope

| Field | Value |
| --- | --- |
| Repository | [GadDev/uni-math-course](https://github.com/GadDev/uni-math-course) |
| Purpose | Bilingual mathematics learning and practice for university classmates and adults returning to mathematics |
| Primary profile | Bilingual learning web application with authenticated server endpoints |
| Modifiers now | Public/distributable; contribution intake; implemented authentication and persistent progress |
| Rollout boundary | Hosted class acceptance and operational decisions remain unverified; implementation does not establish learner rollout |
| Owner / status | GadDev / experimental |
| Visibility | Public; verified through repository metadata on audit date |
| Rights | MIT for original repository work; third-party course source excluded |
| Guidance | Repository Management Standard 1.0, Setup Playbook 1.0, bundle 1.0.0 |
| Guidance source | [github-repository-playbook](https://github.com/GadDev/github-repository-playbook); access may be restricted |
| Initialization | Repository foundation delivered; reading, authentication, grading and progress implemented |
| Audited revision | Implementation baseline: `8efa2dd827b21523253690a4dc1421e1badeed15`; see [pilot acceptance evidence](PILOT_ACCEPTANCE.md) for exact tested revisions |

## Evidence and outstanding verification

| Area / controls | Status | Evidence or next action |
| --- | --- | --- |
| Identity, status, owner / ORG-01-04 | Pass for documentation | README and repository metadata; About description/topics not configured by this change |
| Reading and quality path / DOC-01-02, QA-01 | Implemented; recorded repository evidence | Pinned Node/pnpm, content/type/format/test/build gates and browser checks; see [evidence](PILOT_ACCEPTANCE.md). Hosted acceptance is separate |
| Documentation / DOC-04-09 | Files present; hosted evidence incomplete | Contribution, conduct, security, licensing, ownership and intake files; verify GitHub rendering after merge |
| CI / CI-01-04, QA-05-06 | Executed successfully on recorded revision | `docs` runs application checks, immutable-bank checks, disposable PostgreSQL contracts and Playwright; read-only contents, pinned actions and no production credentials. See [evidence](PILOT_ACCEPTANCE.md) |
| Protection / DEV-07-08 | Partially observed; required-check activation pending | On 2026-10-16, active ruleset 25064819 requires PRs with squash merges, zero approvals, resolved threads and no force pushes/deletion or bypass actors. Its required-check list is empty and strict checks are off. The reviewed [target payload](../.github/main-ruleset.json) requires `docs` from GitHub Actions and an up-to-date branch; merging that file does not change GitHub settings. Classic protection was inaccessible (403) |
| Private security reporting / SEC-09 | Pending | Native private-report delivery and maintainer notifications have not been verified. Resolve before external application use |
| Conduct reporting / DOC-07 | Pending | Confirm a monitored private contact route; public requests must contain no sensitive details |
| Dependency maintenance / SEC-03-06 | Configuration prepared | Weekly bounded GitHub Actions updates; inspect update logs after merge and the first actual Dependabot PR's checks |
| Secret detection / SEC-02, SEC-07 | Hygiene prepared; platform coverage pending | Ignore rules and no intended secrets; settings and native scanning/push-protection coverage unverified |
| Account/app access and Actions defaults / SEC-01, CI-06 | Pending | Review actual settings and notifications; file permissions do not change repository-wide settings |
| Application build, auth and data tests | Implemented and exercised in isolation | Astro/React application, Supabase protocol fixtures, SQL migrations and owner-isolation tests exist; no claim that hosted migrations or live Data API tests were executed |
| Deployment, rollback and data restoration / DEP-01-08 | Applicable; acceptance evidence pending | Vercel output and deployment configuration exist. Record deployed commit, environment separation, smoke checks, application rollback and disposable data restoration before class rollout |
| Portfolio inventory / ORG-07 | Pending | Add this repository to the maintainer's management inventory without modifying another repository in this PR |

## Main branch check requirement

The existing [Repository checks workflow](../.github/workflows/check.yml) reports one full gate named `docs`. Observed [successful main run](https://github.com/GadDev/uni-math-course/actions/runs/38881668966/job/116909616541) validates commit `00c70df219a91adf20da3bdce916a07828135919`. The check-runs API identifies its producer as GitHub Actions, integration ID `15368`. Keep this name stable.

The [reviewed target ruleset](../.github/main-ruleset.json) is the writable payload for existing [Protect main rule 25064819](https://github.com/GadDev/uni-math-course/rules/25064819). Compared with the observed live rule, it changes only the required-status-check parameters: require `docs` from GitHub Actions and set `strict_required_status_checks_policy: true`. Existing PR, squash, thread-resolution, deletion, force-push and bypass settings are preserved. This JSON is reviewable configuration, not a deployment workflow or proof of enforcement.

An operator with repository administration permission must apply it. The GitHub connector used for this change exposes read-only ruleset access and cannot activate it. In Settings → Rules → Rulesets → Protect main, add required status check `docs` with GitHub Actions as its source and enable "Require branches to be up to date before merging". Save the existing rule rather than creating a competing rule.

Alternatively, with an administrator-authenticated GitHub CLI, inspect the live rule first and compare it with the payload. Stop and reconcile any intervening settings changes before replacing it:

```sh
gh api repos/GadDev/uni-math-course/rulesets/25064819
gh api --method PUT repos/GadDev/uni-math-course/rulesets/25064819 --input .github/main-ruleset.json
gh api repos/GadDev/uni-math-course/rulesets/25064819
```

Activation acceptance remains pending until the operator records the date, effective rule and PR evidence:

- A failing or pending `docs` check blocks a disposable PR; do not merge the failing revision.
- A successful current revision can merge when its branch is up to date; stale successful runs do not satisfy a newer revision.
- Advancing main requires the PR branch to update and pass again.
- Ordinary and future bot-created release PRs have no routine bypass.
- Two ordinary PRs can describe release information without editing CHANGELOG.md.
- Review classic branch protection alongside this rule; the connector's 403 response does not establish that no classic rule exists.

For recovery, correct the check name/source or workflow failure rather than bypassing it. Before any intentional ruleset rollback, record the current settings and restore only the reviewed changes; do not overwrite unrelated protections or claim enforcement without rechecking it. Keep hosted acceptance pending until demonstrated. This gate controls merging; Vercel production promotion and database migration ordering remain separate follow-up work.

## Readiness and maintenance

Readiness: **application implemented; hosted class acceptance pending**. Applicable settings, confidential-reporting delivery and operational evidence remain unverified; this reconciliation does not certify compliance. [Pilot acceptance evidence](PILOT_ACCEPTANCE.md) separates completed repository checks from outstanding hosted checks and owner decisions. Existing content release exceptions remain authoritative in `content/releases.json`.

The owner reviews outstanding repository settings and pilot acceptance evidence, checks active issues/CI/dependency updates weekly, reviews documentation monthly, and reassesses access and lifecycle quarterly. This document creates no scheduled task or calendar event.

Reassess the profile and evidence before widening learner access, adding collaborators, changing visibility, or introducing new personal data. Keep initial adoption small; do not add paid controls or unrelated infrastructure merely to complete a checklist.
