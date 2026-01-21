---
name: git-commit-skill
description: Create standard, high-quality git commit messages and commit plans; use when asked to suggest commit wording, split commits, or enforce commit message conventions.
---

# Git Commit Skill

## Core Goals

1. Intent clarity
2. Traceability
3. Consistency and readability
4. Safety (avoid history damage)
5. Collaboration efficiency

## Workflow

1. Clarify scope and repository policy.
   - Default to this skill's template and do not ask about other conventions unless the user explicitly mentions one.
   - Ignore unrelated changes by default; do not add them unless explicitly requested.
2. Review change intent.
   - Summarize what changed and why, not how.
3. Propose commit splits.
   - Separate logically independent changes.
4. Draft commit messages.
   - Use Conventional Commits unless another standard is specified.
5. Add validation notes.
   - Include relevant tests or verification steps if provided.

## Commit Message Standard

```
<type>(optional-scope): <subject>

<body>

<footer>
```

Common types:
- feat: new feature
- fix: bug fix
- bugfix: bug fix
- hotfix: urgent fix
- docs: documentation
- refactor: refactor without behavior change
- test: add or update tests
- chore: tooling or maintenance

All commits must use the master template below with full Why/What/Impact/Tests/Refs sections.

Examples (full format):
```
feat(search): add query filters

Why:
- Users need to narrow results by date and status.

What:
- Add filter params to query builder.
- Extend search handler to accept new filters.

Impact:
- More precise results; no breaking changes.

Tests:
- unit: search_filter_spec

Refs:
- ISSUE-1423
```
```
fix(auth): handle expired refresh tokens

Why:
- Sessions were failing silently after token expiry.

What:
- Add explicit refresh error handling in auth middleware.
- Surface a clear user-facing error message.

Impact:
- Fewer auth drop-offs; no API changes.

Tests:
- unit: auth_refresh_spec

Refs:
- AUTH-221
```
```
docs: update onboarding steps

Why:
- New environment variables were added and not documented.

What:
- Add setup prerequisites and env var table.
- Clarify local dev workflow.

Impact:
- Faster onboarding; no runtime impact.

Tests:
- not run (documentation-only change)

Refs:
- DOCS-45
```
```
feat(search): add query filters

Why:
- Users need to narrow results by date and status.

How:
- Add filter params to query builder.

Tests:
- unit: search_filter_spec
```
```
fix(payments): handle timeout retries

Why:
- External gateway timed out in peak hours.

Notes:
- Retry is capped at 2 attempts.

Refs:
- ISSUE-1423
```

## Master Commit Template

```
<type>(optional-scope): <subject>

Why:
- <user or system problem being solved>

What:
- <key change 1>
- <key change 2>

Impact:
- <behavior impact, compatibility, or migration notes>

Tests:
- <tests run, or "not run" with reason>

Refs:
- <issue/ticket/PR>
```

## Mandatory Format Rule

- Every commit must use the full template with Why/What/Impact/Tests/Refs.
- Single-line commit messages are not allowed.
- Prefer file-based commits (e.g., `git commit -F <file>`) to avoid newline escaping/garbling.

## Golden Rules (Top 10)

1. Keep commits small and focused on a single change.
2. Use one consistent format (default: Conventional Commits).
3. Keep subject under 50 characters and describe intent.
4. Add a body when rationale or migration steps matter.
5. Avoid noisy commits (unrelated formatting or temp files).
6. Link to issues or task IDs when available.
7. Avoid rewriting public history or force pushes.
8. Include verification or test notes when relevant.
9. Never commit secrets, tokens, or PII.
10. Keep main/master in releasable state.

## Change Scope Rule

- Base commit messages only on the AI's own changes.
- If unrelated or user-made changes are present, ask once before including them, then proceed.

## Output Format

```
## Suggested Commit Messages
## Split Recommendations
## Validation Steps
## Risks & Notes
```

## Guardrails

- Do not run git commands or modify history unless explicitly authorized.
- Do not include secrets or sensitive data in commit messages.
- If a repo has its own convention, follow it first.
