# Releasing

Status: Release Please activated; release PRs require CI and maintainer review; hosted pilot acceptance tracked separately · Owner: GadDev · Last reviewed: 2026-10-18

## Everyday workflow

1. Open a focused PR with a Conventional Commit title. Run `pnpm check`; inspect the preview for visible changes. Ordinary PRs do not edit CHANGELOG.md or add changeset files.
2. For database-dependent changes only, apply and verify compatible migrations before merging dependent code. See the database section below.
3. Squash-merge after current required checks pass on an up-to-date branch. Inspect the final squash message and preserve migration/compatibility details in its body.
4. Successful main `docs` calls the [release workflow](../.github/workflows/release-please.yml), which maintains one release PR with the version, manifest and generated changelog.
5. Leave that PR open while accumulating a useful batch. When a version milestone is useful, review its notes, compatibility and current checks, then squash-merge it. A release PR need not be merged after every product PR.
6. After the release merge passes main CI, automation creates the `vX.Y.Z` tag and GitHub Release. Confirm the tag points to that merge; keep published tags unchanged.

No separate approval file or acceptance-evidence PR is required to release. Hosted pilot readiness stays in [PILOT_ACCEPTANCE.md](PILOT_ACCEPTANCE.md); leave unverified rows pending.

## Deployment, versions and content

| Operation | Authority | Takes effect |
| --- | --- | --- |
| Application deployment | Vercel production branch, environment and promotion settings | When Vercel assigns the deployment to the production domain |
| Version milestone | [Release Please](https://github.com/googleapis/release-please-action) | After a checked release PR merge produces its tag and GitHub Release |
| Course publication | [content/releases.json](../content/releases.json) and [content contracts](CONTENT_RELEASES.md) | When a deployment containing the selected content reaches learners |

The recommended production path is checked `main`: Vercel builds main merges and holds promotion for the exact commit's successful `docs` check. Confirm the production branch, environment binding and [Deployment Checks](https://vercel.com/docs/deployment-checks) in the existing project before treating this as enforced. These hosting settings and current production routing remain unverified; this change does not configure them.

Release automation neither deploys to Vercel nor changes Supabase. Product merges can reach learners before the release PR is merged. After deployment, confirm its commit and domain, open French/English pages and check the changed journey. For auth or persistence changes, verify sign-in and saved attempts with synthetic accounts. Green CI, a tag or a GitHub Release does not establish production health.

Exercise versions remain immutable and independent of app versions. The content registry selects banks and binds mathematical/translation evidence. Automation does not refresh fingerprints, approve translations or regrade attempts. Retain archived banks for historical feedback.

## Checks and superseded runs

Keep the full gate named `docs`: it includes application, release-policy/planning, immutable-bank, database and browser checks. Each main SHA has its own CI concurrency group. Main validations and release mutations are not cancelled mid-run; obsolete PR checks may be cancelled.

Preflight compares the run's SHA with current main. A superseded revision reports a notice and successful skip before creating an App token or invoking Release Please. Current main handles pending work after its own `docs` succeeds. No manual action is needed for the skip itself.

A current revision still needs successful GitHub Actions `docs` on its exact SHA and the exact merge SHA of every pending merged release PR. Newer main checks cannot substitute for unchecked release merges. API errors and inconsistent package/manifest versions remain failures. Manual dispatch follows the same rules.

## Retries and recovery

| Situation | Action |
| --- | --- |
| Superseded run | Let current main CI finish. If it fails, resolve that failure; the older run intentionally changes nothing. |
| Failed application checks | Fix the failing check. A release retry cannot bypass it. |
| Failed release job | Inspect the job and existing PR/tag/release/pending labels. Once current main has successful `docs`, use **Actions → Release Please → Run workflow → main**. Rerunning an old revision only skips it. |
| Partially created release | Reconcile the existing tag/release and pending labels before dispatching current main. Do not delete or move published tags as routine recovery. |
| Faulty automation | Set `RELEASE_PLEASE_ENABLED` to `false` while fixing it. This pauses release records, not Vercel deployments. |
| Production regression | Roll back in Vercel to a compatible production deployment, verify the domain and affected journey, then prepare a checked fix. App rollback does not reverse migrations or restore data. |

On Vercel Hobby, [Instant Rollback](https://vercel.com/docs/instant-rollback) targets the immediately previous production deployment and restores its build/configuration. New project environment-variable values are not applied to that build. Rollback disables automatic production-domain assignment: after the checked fix is ready, use **Undo Rollback** or promote the corrected deployment to restore it. Check database compatibility before selecting the rollback target.

## Database changes

Hosted migration application is an operator step; [PRACTICE.md](PRACTICE.md#data-and-keys) describes the required schema. Repository CI uses disposable PostgreSQL only.

1. Compare deployed schema and available migration history with ordered files in `supabase/migrations/`. Identify unapplied changes; do not replay migrations blindly or invent missing history.
2. Prefer additive, backward-compatible migrations. Apply and verify them while the existing application still works, before merging dependent code into the production branch.
3. Record files, date, outcome and a compatible app rollback target without secrets or learner records. Establish recovery before destructive changes.

Never run the disposable database bootstrap/runner against hosted data. Unchanged migrations need no action in ordinary releases. Missing required schema, broken authorization or failed persistence should block the affected deployment; the broader class-readiness checklist is separate.

## Contribution and version policy

The private root package is not published to npm. [Configuration](../release-please-config.json) uses one Node component; the [manifest](../.release-please-manifest.json) must match package.json. Keep Release Please as the only version/changelog authority.

| Type/change | Version policy |
| --- | --- |
| fix, including incorrect answers or translation corrections | Patch |
| feat, including a new capability or lesson | Minor |
| docs, ci, chore, refactor or test without product impact | No release by itself |
| Dependencies | Classify by actual impact |
| Breaking change before 1.0 | Minor, with ! or BREAKING CHANGE and migration guidance |
| Breaking change after 1.0 | Major, with migration guidance |
| Stable agreed contract and rollout readiness | Deliberately reviewed 1.0.0 |

Pre-1.0 settings preserve feature-to-minor and fix-to-patch behaviour. A pilot is not automatically a prerelease. Work-in-progress commits need not follow the convention; the final squash message does. Generated notes primarily use commit summaries. For already-merged summaries, use the [supported commit override mechanism](https://github.com/googleapis/release-please#how-can-i-fix-release-notes), regenerate and review rather than blindly editing bot-owned sections.

The always-update setting refreshes the waiting release PR against main even when notes are unchanged. After release-process changes merge, wait for main CI and the bot update before inspecting that PR again.

## Verification and observed evidence

Run `pnpm check`, then the locked release planner:

```sh
npm ci --prefix tools/release --ignore-scripts --no-audit --no-fund
npm --prefix tools/release test
```

Planner tests use Release Please 17.6.0, matching the pinned action's library, with an in-memory SCM. They cover bootstrap history, version bumps, private manifest updates, docs-only exclusion and reuse of one PR. Preflight tests execute the workflow shell with a fake read-only GitHub CLI and inspect token/mutation guards: superseded skips, failed/missing checks, API errors and checked current releases. Fixtures do not prove real GitHub retry behaviour or hosted acceptance.

Observed on 2026-10-18:

- The [activation run](https://github.com/GadDev/uni-math-course/actions/runs/38903040272) created [PR #42](https://github.com/GadDev/uni-math-course/pull/42). Published releases now extend through [v0.5.0](https://github.com/GadDev/uni-math-course/releases/tag/v0.5.0).
- [PR #60](https://github.com/GadDev/uni-math-course/pull/60) received successful `docs` and GitGuardian checks. Its [main run](https://github.com/GadDev/uni-math-course/actions/runs/39118152336) passed and created v0.5.0 at merge commit `c09bcbeb7aa3f1b4837b185f6f297c6c4d74c80b`.
- A real post-release rerun proving no duplicate release or tag movement remains unverified. Observe separately; do not fabricate product fixes to force a release. Production routing and hosted acceptance remain separate.

## GitHub App setup and activation

This is initial setup or credential recovery, not a per-release step. The workflow runs only when `RELEASE_PLEASE_ENABLED` equals `true`; it has no personal-token or default GITHUB_TOKEN fallback.

| Setting | Value |
| --- | --- |
| Repository variable RELEASE_PLEASE_CLIENT_ID | Release App Client ID |
| Actions secret RELEASE_PLEASE_PRIVATE_KEY | App PEM private key |
| Repository variable RELEASE_PLEASE_ENABLED | true after credentials and installation are ready |

Install the App on **GadDev/uni-math-course only**, with Contents, Issues and Pull requests read/write; Metadata read is implicit. Disable unused webhooks. Grant no administration, workflow-editing or bypass permission. The token action requests these three write permissions, defaults to the current repository and revokes its short-lived token after the job. Rotate the private key when necessary; never put it in Git, PRs, logs or chat.

App tokens let bot-created/updated PRs run CI automatically. Default GITHUB_TOKEN events have restrictions or approval requirements; keep checks intact. Verify required `docs` and GitGuardian after bot updates. After setup/recovery, dispatch Release Please on checked current main once. No PR is expected until an eligible product change exists.

## Bootstrap and preserved history

The boundary is `45a742978d68382c949016583243e82aa91ee4ee`. [PRE_AUTOMATION.md](releases/PRE_AUTOMATION.md) preserves the original manual changelog byte-for-byte as pre-release history. Only eligible later commits enter generated notes; the archive is not replayed.

The initial-version setting selected 0.1.0; tags and the manifest establish subsequent baselines. Do not move bootstrap-sha, rewrite historical tags or manually bump package.json in product PRs.

Sources: [Release Please Action](https://github.com/googleapis/release-please-action), [manifest configuration](https://github.com/googleapis/release-please/blob/v17.6.0/docs/manifest-releaser.md), [GitHub workflow triggering](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), [App token action](https://github.com/actions/create-github-app-token), [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks), and [Instant Rollback](https://vercel.com/docs/instant-rollback).
