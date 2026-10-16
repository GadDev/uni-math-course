# Releasing

Status: Release Please configured; operator activation and hosted pilot acceptance pending · Owner: GadDev · Last reviewed: 2026-10-16

## One application, one release PR

[Release Please](https://github.com/googleapis/release-please-action) is the application version and changelog authority. The root private package is not published to npm. Ordinary feature, fix, documentation and maintenance PRs do not edit CHANGELOG.md or add changeset files. Use focused PRs and Conventional Commit titles, then inspect the final squash message.

The [configuration](../release-please-config.json) uses the Node strategy and one root component. The [manifest](../.release-please-manifest.json) tracks the same version as package.json. The first proposed release is 0.1.0; no application release is claimed while the version is 0.0.0. Do not introduce Changesets or semantic-release alongside this workflow.

1. Feature/fix PRs pass required checks and are squash-merged.
2. The successful main `docs` job calls the [release workflow](../.github/workflows/release-please.yml).
3. When enabled, Release Please creates or updates one release PR with the version, manifest and generated changelog.
4. That PR runs ordinary CI. Review release wording, compatibility, migration actions and limitations; merge deliberately.
5. After its checked main merge, automation creates the immutable `vX.Y.Z` tag and GitHub release.
6. Deployment identity and health are verified separately. A tag, green CI or GitHub release is not proof of a successful production deployment.

The stable `docs` gate includes application, release-policy, release-planning, immutable-bank, database and browser checks. The release workflow also verifies that its SHA is still main and has a successful `docs` check from GitHub Actions. Before tagging, it checks the exact merge SHA of every pending merged release PR as well; a successful newer main cannot substitute for those checks. Older queued runs fail with instructions to dispatch current main. Each main SHA has its own CI concurrency group so pending main validations cannot replace each other. Main runs and release mutations are not cancelled mid-run; obsolete PR checks can still be cancelled.

## Bootstrap and preserved history

The bootstrap boundary is commit `45a742978d68382c949016583243e82aa91ee4ee`, immediately before this automation change. [PRE_AUTOMATION.md](releases/PRE_AUTOMATION.md) preserves the manual changelog at that revision byte-for-byte. Those notes describe pre-release development, not fictional past application releases.

The new CHANGELOG.md links to that archive. Only eligible commits after the boundary are generated into release notes; older notes are not replayed. A ci/docs-only setup merge does not itself create a release PR. The next eligible feat/fix commit starts the first proposal. Release tooling tests verify this boundary, archive integrity, initial version and subsequent bumps.

The initial-version setting applies only before a first release; there is no permanent release-as override to remove. After a release, the published tag and manifest establish the next baseline. Do not move bootstrap-sha to hide changes, rewrite historical tags or manually bump package.json in product PRs.

## Hold the first 0.1.0

[Release approval](../.github/release-approval.json) starts with `approved: false`. The scaffold at 0.0.0 can pass CI so the automation can be installed. Any released application version fails `pnpm check:release` until actual acceptance is recorded and approved. This blocks the generated first release PR through the required `docs` check; marking it ready or editing its title cannot satisfy the gate.

Complete the hosted and operational acceptance work in [PILOT_ACCEPTANCE.md](PILOT_ACCEPTANCE.md), including the actual deployment/migration baseline, sessions, persistence/isolation, bilingual accessibility, privacy, recovery, content and rights decisions. In a separate reviewed evidence PR, record actual outcomes and set:

- `approved: true`.
- `approvedBy` to the actual accountable operator.
- `approvedAt` to the actual ISO timestamp.
- `evidence: "docs/PILOT_ACCEPTANCE.md"`.

Do not fabricate evidence or approval to make CI green. The checker verifies an explicit approval record and its evidence file; it does not independently prove hosted acceptance. The always-update setting refreshes the waiting release PR against main even when its notes are unchanged, so the merged acceptance evidence reaches that branch. Once the evidence PR merges, verify the refresh and rerun CI if needed, review the exact notes and merge it when ready. Approval is not a recurring per-release button: subsequent release PRs still need normal review and applicable validation.

## GitHub App setup and activation

The workflow is dormant unless repository variable `RELEASE_PLEASE_ENABLED` equals `true`. It does not fall back to a personal token or the default GITHUB_TOKEN. Configure the following as repository settings; never place the key in Git, PRs, logs or chat:

| Setting | Value |
| --- | --- |
| Repository variable RELEASE_PLEASE_CLIENT_ID | Client ID of the release GitHub App |
| Actions secret RELEASE_PLEASE_PRIVATE_KEY | The App's PEM private key |
| Repository variable RELEASE_PLEASE_ENABLED | true, only after credentials and installation are ready |

Create a GitHub App owned by the maintainer, disable webhooks if unused, and install it on **GadDev/uni-math-course only**. Grant repository Contents, Issues and Pull requests read/write; Metadata read is implicit. Grant no administration, workflow-editing or bypass permission. The token action requests only these three write permissions and defaults its token scope to the current repository. Installation tokens are short-lived and revoked after the job; the App private key remains an operator-managed secret that needs rotation.

Using an App token allows release PR creation/updates to trigger ordinary CI automatically. The default GITHUB_TOKEN has event-trigger restrictions or approval requirements; do not weaken checks to accommodate missing runs. Verify both the initial bot PR and a later bot update. The existing ruleset also requires GitGuardian; confirm it reports for the bot PR rather than bypassing it.

After merging the implementation, enable the variable and manually run Release Please **on main** once to verify setup. The manual route requires successful docs on the exact main SHA, so wait for main CI to finish. There may be no release PR until an eligible product change exists. Repository/secret creation cannot be performed by this connector and remains an operator step.

## Contribution and release notes

Use a Conventional Commit PR title; work-in-progress commits need not follow the convention. Preserve migration and compatibility details in the final squash body and link relevant documentation. Generated notes primarily use commit summaries; inspect the actual release PR rather than assuming every paragraph in a product PR will appear.

| Type/change | Version policy |
| --- | --- |
| fix, including an incorrect answer or translation correction | Patch |
| feat, including a new learner capability or lesson | Minor |
| docs, ci, chore, refactor or test without product impact | No release by itself |
| Dependency change | Classify by actual impact; use fix/feat or breaking markers when appropriate |
| Breaking change before 1.0 | Minor, with ! or BREAKING CHANGE and migration guidance |
| Breaking change after 1.0 | Major with migration guidance |
| Stable agreed product contract and rollout readiness | Deliberately reviewed 1.0.0 |

The explicit pre-1.0 settings preserve feature-to-minor and fix-to-patch behaviour. A pilot is not automatically a SemVer prerelease. Additional channels, npm publication and release branches are not configured.

Improve summaries before squash merging. For already-merged changes, use Release Please's [supported commit override mechanism](https://github.com/googleapis/release-please#how-can-i-fix-release-notes) on the source PR, then regenerate and review. Do not hand-edit bot-owned generated sections without accounting for regeneration. Never claim planned lessons, independent review or hosted readiness from automated checks.

## Content, migrations and production

Application versions identify software/content snapshots. Exercise versions remain immutable and independent; [content/releases.json](../content/releases.json) selects served banks and binds review/translation evidence. Automation does not refresh fingerprints, approve translations or regrade attempts. An app patch can add a corrected bank while archived attempts retain their original grading context.

Hosted migrations remain a deliberate operator step before deploying code that depends on them; see [PRACTICE.md](PRACTICE.md). Prefer compatible migration-first changes and preserve a compatible application rollback target. Do not run the disposable database bootstrap against hosted data. An application rollback does not reverse a migration or restore data.

Production promotion still needs its own same-revision CI gate and smoke evidence. This workflow creates release records only; it neither deploys to Vercel nor changes Supabase. Whether production follows checked main merges or selected releases must be verified in hosting settings. Merging a release PR does not by itself prevent earlier product merges reaching learners.

## Verification, retries and recovery

Run `pnpm check` for the release approval contract. Run the real release planner in isolation with:

```sh
npm ci --prefix tools/release --ignore-scripts --no-audit --no-fund
npm --prefix tools/release test
```

The locked toolchain tests the same Release Please 17.6.0 library bundled in the pinned action. It uses an in-memory SCM without credentials: first 0.1.0, historical boundary, private manifest updates, fix/feat/breaking bumps, docs-only exclusion, stable branch and archived bytes. Native tests verify first-release blocking and incomplete approval failures. Fixtures are not proof of real GitHub write/retry behaviour.

After activation, record evidence that one bot PR is maintained across updates, its docs/GitGuardian checks execute, merging an accepted release produces a tag pointing to that merge, and rerunning the release workflow does not create another release or move a tag. These hosted acceptance checks remain pending until actually exercised. Do not create fake product fixes just to force a release.

When a job fails, inspect its run and any existing PR/tag/release before retrying. Dispatch current main after its docs check succeeds. For a partially completed release, reconcile the existing tag/release and pending labels before retrying; do not delete or move an already published tag as routine recovery. If automation itself is faulty, set RELEASE_PLEASE_ENABLED to false while fixing it. Keep approval false until hosted acceptance is complete.

Sources: [Release Please Action](https://github.com/googleapis/release-please-action), [manifest configuration](https://github.com/googleapis/release-please/blob/v17.6.0/docs/manifest-releaser.md), [GitHub workflow triggering](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), and [GitHub App token action](https://github.com/actions/create-github-app-token).
