# Delivery Workflow Skills

Delivery workflow skills cover the traceability and publication path after
work is planned or implemented: issues, commits, split PR/MR publication,
review publication, and release tagging.

Use the smallest skill that matches the current delivery stage. Do not run the
whole package as a ritual sequence.

## Route by Situation

| Situation | Use |
| --- | --- |
| Planned work needs canonical issue traceability, issue drafts, task-to-issue mapping, or a commit `Refs` bridge. | [`issue-gate-skill`](issue-gate-skill/SKILL.md) |
| Verified local changes need staging, split decisions, and structured `Why / What / Impact / Tests / Refs` commits. | [`git-commit-skill`](git-commit-skill/SKILL.md) |
| One mixed branch needs independent review slices, branches, and one PR/MR per accepted slice. | [`split-pr-publish-skill`](split-pr-publish-skill/SKILL.md) |
| A GitHub PR or GitLab MR needs evidence-backed findings, a verdict, and optional review publication. | [`pr-mr-review-publish-skill`](pr-mr-review-publish-skill/SKILL.md) |
| An explicit tag, target, notes, and hosting platform need release preparation, execution, or verification. | [`tag-release-skill`](tag-release-skill/SKILL.md) |

## Common Paths

### Normal Local Change

```text
$issue-gate-skill
$git-commit-skill
```

Use `issue-gate-skill` first when repository policy requires tracked work.
Then use `git-commit-skill` for the verified save point.

### Mixed Branch to Reviewable PRs or MRs

```text
$split-pr-publish-skill
```

Use this when one source branch contains more than one reviewable delivery
slice. It may call issue and commit workflows for each accepted slice, but it
owns the split boundary.

### Review Publication

```text
$pr-mr-review-publish-skill
```

Use this after a target PR/MR or local diff boundary is clear. It normalizes
findings and publishes only when the target and verdict are safe.

### Release

```text
$tag-release-skill
```

Use this only after the release target, tag, notes, changelog range, hosting
platform, and execution mode are explicit. If the candidate still lives on a
mixed branch, use `split-pr-publish-skill` first.

## Boundaries

- These skills do not implement product changes, fix CI, or perform broad code
  review by themselves.
- Commit and publish skills must not stage, comment on, or release unrelated
  work.
- Release skills do not infer version policy, publish packages, or dispatch
  repository-specific workflows.
- Issue skills create or link traceability records; they do not close issues by
  default or turn transient implementation plans into repository docs.

## Package Standard

Each skill in this package should follow the project skill author operating
standard:

- `Overview`
- `When to Use`
- `The Operating Loop`
- `Decision Points`
- `Common Rationalizations`
- `Red Flags`
- `Verification`
- `Output Format`
- `Guardrails`

Each Codex-facing skill also carries `agents/openai.yaml` metadata whose
version matches the `SKILL.md` frontmatter.
