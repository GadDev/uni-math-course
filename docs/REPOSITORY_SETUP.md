# Repository setup record

Audit date: 2026-10-14 · Accountable maintainer: [GadDev](https://github.com/GadDev) · Next review: 2026-10-21

## Identity and scope

| Field | Value |
| --- | --- |
| Repository | [GadDev/uni-math-course](https://github.com/GadDev/uni-math-course) |
| Purpose | Bilingual mathematics learning and practice for university classmates and adults returning to mathematics |
| Primary profile | Learning, documentation stage; reassess as website/backend before deploying accounts |
| Modifiers now | Public/distributable; contribution intake |
| Modifiers planned | Real users, authentication, persistent personal progress; not active yet |
| Owner / status | GadDev / experimental |
| Visibility | Public; verified through repository metadata on audit date |
| Rights | MIT for original repository work; third-party course source excluded |
| Guidance | Repository Management Standard 1.0, Setup Playbook 1.0, bundle 1.0.0 |
| Guidance source | [github-repository-playbook](https://github.com/GadDev/github-repository-playbook); access may be restricted |
| Initialization | Minimal README on main; repository foundation and planning proposed through a bootstrap PR |
| Audited revision | See the commit associated with this file and the bootstrap PR; CI evidence must match the latest revision |

## Evidence and outstanding verification

| Area / controls | Status | Evidence or next action |
| --- | --- | --- |
| Identity, status, owner / ORG-01-04 | Pass for documentation | README and repository metadata; About description/topics not configured by this change |
| Reading and quality path / DOC-01-02, QA-01 | Local validation prepared | Pinned Node/pnpm toolchain; run `pnpm check` and `pnpm test:e2e` from a clean checkout and inspect PR CI |
| Documentation / DOC-04-09 | Files prepared | Contribution, conduct, security, licensing, ownership and intake files; verify GitHub rendering after merge |
| CI / CI-01-04, QA-05-06 | Configuration prepared | `docs` job, read-only contents, hosted runner, timeout, cancellation, verified checkout v7.0.1 SHA; no bot exclusions or deployment credentials |
| Protection / DEV-07-08 | Pending | No claim of enforced checks. After observing passing `docs`, configure one effective main rule: PRs, zero solo approvals, required docs check, no force pushes/deletion or routine bypass |
| Private security reporting / SEC-09 | Pending | Native private-report delivery and maintainer notifications have not been verified. Resolve before external application use |
| Conduct reporting / DOC-07 | Pending | Confirm a monitored private contact route; public requests must contain no sensitive details |
| Dependency maintenance / SEC-03-06 | Configuration prepared | Weekly bounded GitHub Actions updates; inspect update logs after merge and the first actual Dependabot PR's checks |
| Secret detection / SEC-02, SEC-07 | Hygiene prepared; platform coverage pending | Ignore rules and no intended secrets; settings and native scanning/push-protection coverage unverified |
| Account/app access and Actions defaults / SEC-01, CI-06 | Pending | Review actual settings and notifications; file permissions do not change repository-wide settings |
| Application build, auth and data tests | N/A now | No application, package manifest, database, or deployed users; required with implementation |
| Deployment, rollback and data restoration / DEP-01-08 | N/A now | No deployment or learner data; evidence required before class rollout |
| Portfolio inventory / ORG-07 | Pending | Add this repository to the maintainer's management inventory without modifying another repository in this PR |

## Readiness and maintenance

Readiness: **foundation proposed for review**, not deployment-ready. Standard compliance: **does not yet meet**; applicable settings and confidential-reporting evidence remain pending. No exception has been silently accepted on behalf of the maintainer.

The owner reviews outstanding bootstrap settings after the PR, checks active issues/CI/dependency updates weekly, reviews documentation monthly, and reassesses access and lifecycle quarterly. This document creates no scheduled task or calendar event.

Revisit the profile before deploying accounts, adding collaborators, changing visibility, or storing real learner data. Keep initial adoption small; do not add paid controls or unrelated infrastructure merely to complete a checklist.
