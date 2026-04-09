# Front Matter Template Rules

Use this reference when generating or adapting front matter for a formal
project document.

## Reuse First

- If the repo already has front matter conventions, follow them.
- If the repo has no clear convention and no active metadata consumer, prefer
  no front matter at all.

```md
# Example Title
```

- If metadata is needed but no heavier convention exists, use a minimal
  fallback:

```yaml
---
type: rfc
status: draft
updated_at: 2026-04-09
---
```

- Treat `no front matter` as the global default when the docs are primarily for
  humans and AI readers and no toolchain consumes metadata.
- Add `owner` when maintenance ownership truly matters in day-to-day use.
- Add `id` only when the repository actually uses stable document identifiers.
- Add `created_at` only when first-created time has real governance value.
- Add `title` only when the repository or renderer actually consumes it beyond
  the H1 line.
- Add `level` and `domain` only when path and placement do not already make the
  scope clear.
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

Do not add front matter unless a human workflow or machine workflow actually
uses it.

Prefer to keep reader-facing clutter out of the header. If a relationship can
live clearly in a footer section or index page, do not force it into front
matter.
