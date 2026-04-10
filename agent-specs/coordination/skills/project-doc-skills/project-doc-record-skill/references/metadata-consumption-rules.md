# Metadata Consumption Rules

Use this reference when deciding whether the document needs front matter.

## Default

If no human workflow or machine workflow actually consumes metadata, prefer no
front matter.

## Minimal Fallback

If metadata is needed but no heavier convention exists, prefer:

```yaml
---
type: rfc
status: draft
updated_at: 2026-04-10
---
```

## Add Fields Only When Needed

- `title`: when a renderer or repo convention consumes it beyond the H1 line
- `owner`: when maintenance ownership is operationally meaningful
- `id`: when the repo uses stable document identifiers
- `created_at`: when first-created time matters to governance
- `level` and `domain`: when path alone does not make scope clear

## Rule

Do not add front matter just because the file is formal markdown.
