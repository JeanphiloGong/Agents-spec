# PR/MR Review Publish Skill Acceptance Criteria

## Universal Acceptance Criteria

- The output resolves a review target or states explicitly that the target is still unknown.
- The artifact uses one consistent decision vocabulary: `approve`, `comment`, or `block`.
- Findings are listed before the merge recommendation.
- Each blocking finding includes a concrete reason or evidence note.
- The review body is reusable as a PR/MR summary comment without manual restructuring.
- The publish step, when requested, uses the correct command family for the selected platform.
- The output states whether publication happened, not just whether it was planned.

## Publish Safety Criteria

- `approve` is never used when blocking findings remain.
- `block` is never published as `approve` because of platform mismatch.
- GitHub publish flows use `gh pr review` or `gh pr comment`.
- GitLab publish flows use `glab mr note`, `glab mr approve`, and optional `glab mr revoke`.
- If the target or repo is ambiguous, the result remains `draft-only`.

## Reviewer Challenge Checklist

- Is the target PR/MR unambiguous?
- Would a maintainer understand the blocking issue from this comment alone?
- Did any opinionated style feedback get mislabeled as blocking?
- Is the verdict still correct if the CI state is unknown?
- If the platform is GitLab, does the output avoid pretending that `request changes` exists as a native CLI action?

## Highest-Risk Failure Modes

- Publishing to the wrong target because repo or number resolution was ambiguous.
- Approving despite a real blocking finding.
- Using GitHub-specific review semantics on GitLab.
- Returning a nice summary without actionable findings.
