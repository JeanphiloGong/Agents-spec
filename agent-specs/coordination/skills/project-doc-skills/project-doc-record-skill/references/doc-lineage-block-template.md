# Doc Lineage Block Template

Use this when the relationship between documents would be hard to infer from
front matter alone.

## Preferred Placement

- Put long lineage near the end of the document, after the main content.
- For normal cases, prefer a lighter footer such as `## Related Docs`.
- Use `## Doc Lineage` only when lifecycle or cross-document relationships are
  complex enough that a short footer would be ambiguous.

## Lightweight Footer

```text
## Related Docs
- RFC:
- ADR:
- Current State Index:
- Guide:
```

## Full Template

```text
## Doc Lineage
- Proposed by:
- Decided by:
- Current state in:
- Contract defined in:
- Related guide:
- Operated with:
```

## Usage Notes

- Omit lines that truly do not apply.
- Prefer explicit labels over a raw list of links.
- Use the full block especially for RFC promotion, architecture pages with many
  upstream or downstream references, and ADRs.
