# Repository labels

Status: configuration proposed; live execution pending merge · Owner: GadDev · Last reviewed: 2026-10-14

## Files and source

Adapted from [the AI Club repository's GitHub configuration](https://github.com/GadDev/ai-club-season-26-27-live/tree/main/.github):

- [.github/labels.json](../.github/labels.json) declares label names, colours and descriptions.
- [.github/labeler.yml](../.github/labeler.yml) maps changed paths to automatic labels.
- [label-sync.yml](../.github/workflows/label-sync.yml) creates or updates declared repository labels.
- [pr-labeler.yml](../.github/workflows/pr-labeler.yml) adds matching labels to pull requests.

The labeler configuration uses JSON syntax, which is valid YAML accepted by actions/labeler. This keeps both catalogue and rule validation dependency-free using Python's standard library. The project supports a deliberately small rule subset: changed-files with any-glob-to-any-file. Review the validator when introducing other action-supported syntax.

## Vocabulary and routing

| Label group | Treatment |
| --- | --- |
| documentation | Markdown files, including original teaching text where applicable |
| content / area: content | content/, exercises/, glossary/ |
| area: frontend | Nuxt app/ and public/ |
| area: backend | Nitro server/ |
| ci/cd / area: infrastructure | GitHub configuration, scripts, build/runtime/tooling files |
| dependencies | Package manifests and pnpm lock/workspace files |
| design | design/ and named design-system/art-direction documents |
| tests | Test directories, test/spec files, and test-runner configuration |
| bug, enhancement, accessibility, security, needs-triage | Maintainer-assigned intent or triage labels; not inferred from generic file changes |

Nuxt and content paths prepare routing for the proposed scaffold; their presence in label rules does not claim these components already exist. Workflow action updates get infrastructure labels from paths; Dependabot may add dependencies through its own metadata. Labels do not determine version bumps, approve PRs, or skip required checks. The security label is not a private reporting channel.

## Sync behaviour

Label sync runs after relevant main changes or manual dispatch on main. It validates configuration before writing, uses issues-write permission only for label creation/update, and never deletes undeclared labels. Renaming or retiring a label requires an explicit maintainer decision; changing the catalogue does not remove old labels.

The PR labeler runs for opened, synchronized, reopened, and ready-for-review pull requests. It only adds matching labels: sync-labels is false, preserving manually assigned labels. If files are reverted, an old automatic label may remain; the maintainer can remove it during review. Multiple matching areas are allowed.

The action is pinned to the verified v7.0.0 commit. It reads trusted base-repository configuration through the GitHub API without checking out PR files or executing PR code. No application/deployment secrets or contents-write permission are granted. Label creation belongs to the separate sync workflow, so PR labeling only needs pull-requests-write plus contents-read.

## Validation and first activation

Run:

```sh
python3 scripts/check_repository.py
```

The canonical check includes label validation when either label configuration file is present. Run `python3 scripts/check_labels.py` alone to diagnose labels. The docs workflow uses the same canonical command for every PR, including dependency updates. Schema/reference validation does not prove GitHub permission delivery or real labeling execution.

After merge:

1. Inspect the automatic Sync repository labels main-push run. If needed, manually dispatch it on main and confirm all declared labels exist.
2. Only after sync succeeds, open/update a real PR, or manually dispatch Label pull requests on main with an existing PR number. The labeler cannot create missing labels itself.
3. Verify the resulting labels and successful action run. Manual dispatch can backfill a real PR already open when the workflow was introduced; do not create fictitious issues or vulnerability reports.
4. Confirm unrelated/manual labels remain. Record live evidence and any permission errors before calling the automation verified.

The introduction PR cannot validate pull_request_target execution because that workflow/configuration must already exist on the trusted base branch. Do not change its trust boundary just to make an introduction PR green. Repository documentation/configuration checks still run now. Label jobs are metadata helpers rather than required application-quality gates.
