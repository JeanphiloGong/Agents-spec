# AGENTS API

Base URL: `/api`

## Conventions
- Content-Type: `application/json`
- Time format: RFC3339
- Request ID: `X-Request-Id` response header (echoed if provided; generated if absent)
- Trace ID: optional `X-Trace-Id` request header (echoed when provided)
- Errors: `{ "error": { "code": "invalid_request", "message": "..." }, "request_id": "..." }`
- Pagination: `page` (1-based), `size`
- Limits: `q` length <= 200, `tags` <= 20, `size` <= 200, `limit` <= `index.max_results` (when configured)

## Error Codes
- `invalid_request`: invalid or missing query/path parameters
- `not_found`: document or file not found
- `forbidden`: rejected access (for example, invalid download path)
- `internal_error`: unexpected server error

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
- `q`: keyword (title/content/tags), max length 200
- `dept`: department filter
- `role`: role filter
- `type`: doc type filter (`spec|template|tutorial`)
- `tags`: comma-separated tags, max 20
- `sort`: `updated` (default) or `name`
- `page`: page number (default 1)
- `size`: page size (default 20, max 200)
- `limit`: max results cap (optional, bounded by `index.max_results` if set)

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
- `Content-Disposition: attachment; filename="<basename>"`
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

Notes
- `q` max length 200
- Results limited to 20 titles and 20 tags

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

Notes
- Results limited to 10 items

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

Notes
- `recent` is limited to 10 items
