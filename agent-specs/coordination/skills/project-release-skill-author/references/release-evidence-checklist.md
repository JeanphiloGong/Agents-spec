# Release Evidence Checklist

Collect only the evidence needed to author the repository's release skill.

## Primary Evidence Sources

- release workflows under `.github/workflows/`, `.gitlab-ci.yml`, or equivalent
- release helper scripts under `scripts/`, `tools/`, `hack/`, or equivalent
- release docs in `README`, `docs/`, `CHANGELOG`, `RELEASING`, or equivalent
- manifests or config files that the release path reads directly

## Facts to Extract

### Release Notes Shape

- What public section headings does the repository use in release notes?
- Does it group changes by user-facing outcome, technical area, or commit type?
- Does it include a `Full Changelog` or compare range line?
- Are PR numbers, issue numbers, or author attributions shown inline?

### Trigger and Entry

- How is a release started?
- Is the release triggered by tag push, workflow dispatch, script, or manual
  UI action?
- Which workflow or script is authoritative?

### Tag Rule

- What tag format is required?
- Are prerelease tags allowed?
- Is the tag immutable once published?

### Version Source

- Which file or workflow output defines the release version?
- Must the tag match a manifest version exactly?
- Is there more than one package version to coordinate?

### Release Notes Source

- Are release notes taken from the tag message, commit message, changelog, or
  generated artifact?
- Is there a required template or body format?

### Build and Artifact Staging

- Which jobs or scripts build release artifacts?
- Which platforms or bundles are required?
- Which artifact names are published?

### Hosted Release

- Is there a GitHub Release, GitLab Release, or other hosted release page?
- Which assets are attached?
- Is prerelease versus stable behavior explicit?

### Downstream Publication

- Which registries or package channels are published?
- Which channels are stable-only versus prerelease-capable?
- Are there retry or idempotency rules for already-published versions?

### Post-Release Side Effects

- Does release update a branch, deploy docs, notify another system, or trigger
  a website hook?
- Which of those actions are required versus best-effort?

### Manual Gates and Permissions

- Are there environment approvals, human sign-offs, or protected branches?
- Which secrets, roles, or tokens are required conceptually?
- Do not record secret values; record only the existence of the dependency.

### Failure and Recovery

- What makes the release unsafe to retry?
- Which publish targets are immutable?
- Is rollback or hotfix behavior documented?

## Output Discipline

- Convert repository facts into release-skill steps only after locating
  evidence.
- Convert release-note structure into reusable section rules only after
  locating evidence.
- Mark non-critical gaps as `TODO(repo-verify)`.
- Mark safety-critical gaps as `BLOCK`.
- When no authoritative release path exists, say so directly instead of
  fabricating one.
