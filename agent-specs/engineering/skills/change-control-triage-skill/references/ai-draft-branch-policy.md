# AI Draft Branch Policy (Optional)

This policy is designed to keep `main` fully “owned” by the human while still harvesting AI speed.

## Default stance

- Treat AI as a **proposal generator**.
- Do not merge AI proposal branches into `main`.
- Re-implement core logic on a human-owned branch so you keep naming, structure, and responsibility.

## Recommended branch lifecycle

1) Create proposal branch (optional)
- From `main`:
  - `git checkout main && git pull` (or your equivalent)
  - `git checkout -b ai/draft/<topic>-<yyyymmdd>`
- Use it to generate one or more “candidate implementations”.
- Purpose: expose edge cases, alternative approaches, and missing constraints.

2) Create human implementation branch (required for RED work)
- From `main` again:
  - `git checkout main`
  - `git checkout -b work/<topic>`
- Implement with explicit invariants and tests.

3) Merge policy
- Only `work/<topic>` is merged to `main`.
- `ai/draft/*` is never merged.

4) Cleanup (optional)
- Delete `ai/draft/*` branches after harvesting learnings.

## When this policy is not worth it

- Pure GREEN work: comments, formatting, small boilerplate, trivial UI text.

## Tradeoff

- Pro: reduces black-box risk; forces ownership of core logic.
- Con: lower short-term throughput; less “automatic” traceability of AI usage.
