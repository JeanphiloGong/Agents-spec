# AGENTS API

Base URL: `/api`

## Conventions
- Content-Type: `application/json`
- Time format: RFC3339
- Errors: `{ "error": "message" }`
- Pagination: `page` (1-based), `size`

## Health

`GET /api/health`

Response
```json
{
  "status": "ok"
}
```

## Search Docs

`GET /api/docs`

Query params
- `q`: keyword (title/content/tags)
- `dept`: department filter
- `role`: role filter
- `type`: doc type filter (`spec|template|tutorial`)
- `tags`: comma-separated tags
- `sort`: `updated` (default) or `name`
- `page`: page number (default 1)
- `size`: page size (default 20)
- `limit`: max results cap (optional)

Notes
- When `q` is provided, `excerpt` returns a snippet with `<mark>` tag for the first match.

Response
```json
{
  "total": 120,
  "items": [
    {
      "id": "<sha1>",
      "title": "Go Backend Developer",
      "path": "agent-specs/engineering/backend/AGENTS.md",
      "dept": "engineering",
      "role": "backend",
      "type": "spec",
      "tags": ["engineering", "backend"],
      "updated_at": "2026-01-16T09:00:00+08:00",
      "excerpt": "...<mark>backend</mark>..."
    }
  ]
}
```

## Doc Detail

`GET /api/docs/{id}`

Response
```json
{
  "doc": {
    "id": "<sha1>",
    "title": "Go Backend Developer",
    "path": "agent-specs/engineering/backend/AGENTS.md",
    "dept": "engineering",
    "role": "backend",
    "type": "spec",
    "tags": ["engineering", "backend"],
    "updated_at": "2026-01-16T09:00:00+08:00",
    "excerpt": "...",
    "content": "# AGENTS.md ..."
  },
  "toc": [
    { "level": 1, "text": "AGENTS" },
    { "level": 2, "text": "Overview" }
  ]
}
```

## Download Doc

`GET /api/docs/{id}/download`

Response
- `Content-Disposition: attachment; filename=AGENTS.md`
- File content (raw markdown)

## Suggestions

`GET /api/suggestions?q=`

Response
```json
{
  "titles": ["Go Backend Developer", "Backend SRE"],
  "tags": ["backend", "engineering"]
}
```

## Related Docs

`GET /api/related?id=`

Response
```json
{
  "items": [
    {
      "id": "<sha1>",
      "title": "Backend SRE",
      "path": "agent-specs/infra/sre/AGENTS.md",
      "dept": "infra",
      "role": "sre",
      "type": "spec",
      "tags": ["infra", "sre"],
      "updated_at": "2026-01-12T09:00:00+08:00",
      "excerpt": "..."
    }
  ]
}
```

## Tags

`GET /api/tags`

Response
```json
{
  "tags": {
    "backend": 12,
    "engineering": 34
  }
}
```

## Stats

`GET /api/stats`

Response
```json
{
  "total": 120,
  "recent": [
    {
      "id": "<sha1>",
      "title": "Go Backend Developer",
      "path": "agent-specs/engineering/backend/AGENTS.md",
      "dept": "engineering",
      "role": "backend",
      "type": "spec",
      "tags": ["engineering", "backend"],
      "updated_at": "2026-01-16T09:00:00+08:00",
      "excerpt": "..."
    }
  ]
}
```
