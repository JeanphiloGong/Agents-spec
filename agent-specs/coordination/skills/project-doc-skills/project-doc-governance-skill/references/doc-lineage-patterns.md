# Doc Lineage Patterns

Use this reference when defining how related documents should point to each
other.

## Why Lineage Matters

Without lineage, readers cannot tell:
- which proposal led to current behavior
- which decision justified the current design
- where to find the stable boundary
- where to find operating or developer instructions

## Minimum Lineage Expectations

Core docs should support moving:
- from current-state back to source proposal or decision
- from proposal forward to implemented current-state
- from proposal or architecture to contract docs when stability exists
- from current-state to guide or runbook when usage or operation matters

## Representation Options

- front matter fields such as `related_docs`, `supersedes`, `superseded_by`
- an explicit body section such as `Doc Lineage`
- both, when one alone would be too weak

## Recommended Body Block

```text
## Doc Lineage
- Proposed by:
- Decided by:
- Current state in:
- Contract defined in:
- Related guide:
- Operated with:
```

## Failure Modes

- Only using a generic `related_docs` list with no relationship meaning
- Upstream and downstream documents point only one way
- Current-state pages have no link back to their source proposal or decision
