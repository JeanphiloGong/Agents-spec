# Front Matter Template Rules

Use this reference when generating or adapting front matter for a formal
project document.

## Reuse First

- If the repo already has front matter conventions, follow them.
- If the repo has no clear convention, use a light default:

```yaml
---
id: RFC-2026-001
title: Example Title
type: rfc
level: module
domain: backend
status: draft
owner: backend-team
created_at: 2026-04-07
updated_at: 2026-04-07
related_issues: []
---
```

## Default Status Choice

- proposal not yet approved => `draft`
- approved proposal => `accepted`
- current architecture/spec/runbook => `active`
- replaced document => `superseded`

## Minimal Rule

Do not add metadata fields unless they improve retrieval, ownership, or
lifecycle control.
