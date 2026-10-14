# Repository labels

Status: configuration proposed; live execution pending merge · Owner: GadDev · Last reviewed: 2026-10-14

## Files and source

Adapted from [the AI Club repository's GitHub configuration](https://github.com/GadDev/ai-club-season-26-27-live/tree/main/.github):

- [.github/labels.json](../.github/labels.json) declares label names, colours and descriptions.
- [.github/labeler.yml](../.github/labeler.yml) maps changed paths to automatic labels.
- [label-sync.yml](../.github/workflows/label-sync.yml) creates or updates declared repository labels.
- [pr-labeler.yml](../.github/workflows/pr-labeler.yml) adds matching labels to pull requests.

The labeler configuration uses ordinary YAML and the action's changed-files / any-glob-to-any-file rules. Keep rule keys aligned with names in the label catalogue when editing either file.

## Vocabulary and routing

| Label group | Treatment |
| --- | --- |
| documentation | Markdown files, including original teaching text where applicable |
| content / area: content | content/, exercises/, glossary/ |
| area: frontend | Astro src/components/, src/layouts/, src/pages/, src/styles/, src/lib/, and public/; app/ retained for the evaluated Nuxt alternative |
| area: backend | src/pages/api/ for future Astro endpoints; server/ retained for the evaluated Nitro alternative |
| ci/cd / area: infrastructure | GitHub configuration, scripts, build/runtime/tooling files |
| dependencies | Package manifests and pnpm lock/workspace files |
| design | design/ and named design-system/art-direction documents |
| tests | Test directories, test/spec files, and test-runner configuration |
| bug, enhancement, accessibility, security, needs-triage | Maintainer-assigned intent or triage labels; not inferred from generic file changes |

Astro reading paths now exist; API and alternative-framework paths prepare future routing without claiming those features are implemented. Workflow action updates get infrastructure labels from paths; Dependabot may add dependencies through its own metadata. Labels do not determine version bumps, approve PRs, or skip required checks. The security label is not a private reporting channel.

## Sync behaviour

Label sync runs after relevant main changes or manual dispatch on main. A small jq check validates the catalogue before writing, uses issues-write permission only for label creation/update, and never deletes undeclared labels. Renaming or retiring a label requires an explicit maintainer decision; changing the catalogue does not remove old labels.

The PR labeler runs for opened, synchronized, reopened, and ready-for-review pull requests. It only adds matching labels: sync-labels is false, preserving manually assigned labels. If files are reverted, an old automatic label may remain; the maintainer can remove it during review. Multiple matching areas are allowed.

The action is pinned to the verified v7.0.0 commit. It reads trusted base-repository configuration through the GitHub API without checking out PR files or executing PR code. No application/deployment secrets or contents-write permission are granted. Label creation belongs to the separate sync workflow, so PR labeling only needs pull-requests-write plus contents-read.

## Validation and first activation

Run:

```sh
python3 scripts/check_repository.py
```

The existing Python check covers documentation and repository structure. Label sync separately uses jq to require a nonempty catalogue, names of 1-50 characters, six-digit hexadecimal colours, descriptions of 1-100 characters, and unique names ignoring ASCII case. The catalogue check runs before any label mutation; it does not validate YAML rules or cross-file label references. Review those rules and confirm their behaviour during first activation.

After the Nuxt scaffold introduces Node tooling, consolidate repository checks into that toolchain. No Node dependency or application command is added at this stage.

After merge:

1. Inspect the automatic Sync repository labels main-push run. If needed, manually dispatch it on main and confirm all declared labels exist.
2. Only after sync succeeds, open/update a real PR, or manually dispatch Label pull requests on main with an existing PR number. The labeler cannot create missing labels itself.
3. Verify the resulting labels and successful action run. Manual dispatch can backfill a real PR already open when the workflow was introduced; do not create fictitious issues or vulnerability reports.
4. Confirm unrelated/manual labels remain. Record live evidence and any permission errors before calling the automation verified.

The introduction PR cannot validate pull_request_target execution because that workflow/configuration must already exist on the trusted base branch. Do not change its trust boundary just to make an introduction PR green. Repository documentation/configuration checks still run now. Label jobs are metadata helpers rather than required application-quality gates.
