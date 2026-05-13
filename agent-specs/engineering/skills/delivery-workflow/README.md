# Delivery Workflow Skills

This package contains skills for the final delivery path around tracked work:
issue traceability, commit preparation, pull request or merge request handling,
review publication, and release tagging.

## Skills

| Skill | Use when |
| --- | --- |
| [`issue-gate-skill`](issue-gate-skill/SKILL.md) | Work needs a GitHub or GitLab issue check, issue creation, or `Refs` traceability before implementation or commit. |
| [`git-commit-skill`](git-commit-skill/SKILL.md) | Changes are ready to stage and commit with a structured `Why / What / Impact / Tests / Refs` message. |
| [`split-pr-publish-skill`](split-pr-publish-skill/SKILL.md) | One branch contains independent changes that should be split into separate branches and PRs or MRs. |
| [`pr-mr-review-publish-skill`](pr-mr-review-publish-skill/SKILL.md) | A GitHub PR or GitLab MR needs review findings normalized and optionally published. |
| [`tag-release-skill`](tag-release-skill/SKILL.md) | A straightforward tag or hosted release needs preparation, execution, and verification. |

## Typical Flow

```text
$issue-gate-skill
$git-commit-skill
$split-pr-publish-skill
$pr-mr-review-publish-skill
$tag-release-skill
```

Use only the steps that match the current delivery stage. For a normal local
change, `issue-gate-skill` plus `git-commit-skill` is usually enough.
