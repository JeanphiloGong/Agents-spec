# Commit Message Standard

Use this reference when writing or reviewing the actual commit message.

## Table of Contents

- [Commit Message Standard](#commit-message-standard)
- [Subject Rules](#subject-rules)
- [Type Hints](#type-hints)
- [Common Types](#common-types)
- [Selection Rules](#selection-rules)
- [Full Examples](#full-examples)
- [Body Quality Bar](#body-quality-bar)
- [Format Rules](#format-rules)

## Commit Message Standard

Use this exact structure:

```text
<type>(optional-scope): <subject>

Why:
- ...

What:
- ...

Impact:
- ...

Tests:
- ...

Refs:
- ...
```

This structure is mandatory. Do not add extra sections.

## Subject Rules

Structured subject output is required.

- Use a concise, imperative, present-tense subject.
- Focus on what changed and where.
- Keep reasons and consequences out of the subject; put them in `Why` or
  `Impact`.

Subject template:

```text
<type>(optional-scope): <one-sentence subject>
```

Subject checklist:

- One sentence with an imperative verb plus object and scope.
- No cause or impact clauses such as `because`, `so that`, `以便`, `由于`, or
  `因此`.
- Prefer user-facing capability or document area over implementation detail.
- Keep under 50 characters when possible; trim adjectives first.
- Avoid vague verbs such as `update stuff` or `misc`.

## Type Hints

- `feat`: add / enable / introduce / support
- `bugfix`: fix / handle / prevent
- `hotfix`: restore / mitigate / stop
- `docs`: clarify / add / update
- `refactor`: refactor / simplify / reorganize
- `test`: add / expand / cover
- `chore`: update / bump / clean

## Common Types

- `feat`: new user-facing feature
- `bugfix`: non-urgent bug fix on normal release cadence
- `hotfix`: urgent production-impacting fix
- `docs`: documentation change
- `refactor`: code reorganization without behavior change
- `test`: test addition or update
- `chore`: tooling or maintenance work

## Selection Rules

- Use `bugfix` for defects that can ship in the next normal release.
- Use `hotfix` only for production-impacting issues that require expedited
  release handling.
- If uncertain, default to `bugfix` and explain urgency in `Impact`.

## Full Examples

```text
feat(search): add date range filters

Why:
- Users need to narrow results by date and status.

What:
- Add filter params to the query builder.
- Extend the search handler to accept the new filters.

Impact:
- More precise search results; no breaking changes.

Tests:
- unit: search_filter_spec

Refs:
- ISSUE-1423
```

```text
bugfix(auth): handle refresh token expiry

Why:
- Sessions were failing silently after refresh token expiry.

What:
- Add explicit refresh error handling in auth middleware.
- Surface a clear user-facing error message.

Impact:
- Fewer silent auth drop-offs; no API contract changes.

Tests:
- unit: auth_refresh_spec

Refs:
- AUTH-221
```

```text
docs(onboarding): clarify setup prerequisites

Why:
- New environment variables were added without matching onboarding guidance.

What:
- Add setup prerequisites and an environment variable table.
- Clarify the local development workflow.

Impact:
- Faster onboarding; no runtime behavior changes.

Tests:
- not run (docs-only change)

Refs:
- DOCS-45
```

## Body Quality Bar

### Why

- Explain why the change is necessary, not merely desired.
- Include the trigger signal, affected audience, and the cost of not acting
  when that context is material.
- Write diagnostically: facts first, conclusion second.

### What

- Describe the resulting change, not the implementation process.
- Every bullet should be verifiable in code, docs, or tests.
- Exclude low-level implementation trivia unless it is part of the delivered
  outcome.

### Impact

- Focus on user, interface, release, or operational impact.
- Explain who is affected, what behavior or contract changes, and any rollout,
  migration, or rollback implications.

### Tests

- State what actually ran.
- If tests did not run, use one of these forms:
  - `not run (manual run pending)`
  - `not run (docs-only change)`
  - `not run (config-only change)`
  - `not run (blocked: <reason>)`
- Do not use `not requested`.

### Refs

- Use `Refs` for decision and context traceability, not as an attachment dump.
- `n/a` is acceptable only when no external issue, spec, incident, or PR is
  relevant.
- High-risk changes should always trace back to an issue, spec, incident, or
  PR.
- If `issue-gate-skill` returned a `refs_line`, prefer it directly.

## Format Rules

- Follow the exact section order shown above.
- Do not add extra sections.
- Single-line commit messages are not allowed.
