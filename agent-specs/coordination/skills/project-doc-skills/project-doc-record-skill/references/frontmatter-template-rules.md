# Front Matter Template Rules

Use this reference when generating or adapting front matter for a formal
project document.

## Reuse First

- If the repo already has front matter conventions, follow them.
- If the repo has no clear convention, use a minimal default:

```yaml
---
title: Example Title
type: rfc
status: draft
---
```

- Add `owner` and `updated_at` when they materially improve retrieval or
  maintenance.
- Add heavier metadata only when the repository already sustains it across many
  documents.

## Default Status Choice

- proposal not yet approved => `draft`
- approved proposal => `accepted`
- current architecture/spec/runbook => `active`
- replaced document => `superseded`

## Minimal Rule

Do not add metadata fields unless they improve retrieval, ownership, or
lifecycle control.

Prefer to keep reader-facing clutter out of the header. If a relationship can
live clearly in a footer section or index page, do not force it into front
matter.
