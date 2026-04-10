# Example Output

```text
## Lifecycle Goal
- Rebalance an implemented parser RFC that has grown too much child detail.

## Source Node
- `graph/query`

## Current Lifecycle State
- implemented but not promoted cleanly

## Current Placement Problems
- parent RFC contains parser-local file change detail
- no dedicated parser child plan or current-state doc
- parent summary is no longer easy to scan

## Target Tree Shape
- parent RFC becomes summary and history
- parser child plan becomes separate local doc
- parser current-state doc is added after implementation stabilizes

## Promotion Decisions
- current-state/manual: yes
- adr: no
- contract/spec: no
- guide: no
- runbook: no

## Split Decisions
- split parser-local implementation detail into a child doc under
  `graph/query/parser/docs/`

## Parent Summary Changes
- keep one summary section
- add stable link to the parser child doc

## Child Doc Creates/Updates
- create `graph/query/parser/docs/parser-batch-normalization-plan.md`
- later create or update parser current-state doc

## Status Transitions
- parent RFC remains historical proposal context
- child current-state doc becomes active when implementation settles

## Lineage Repairs
- parent RFC links to parser child plan
- parser child plan links back to parent RFC
- parser current-state links back to both when created

## Record-Skill Handoffs
- create child parser plan doc
- update parent RFC summary section
- update nearest local index

## Execution Order
1. create child parser plan doc
2. replace parent detail with summary and link
3. update local index
4. add current-state doc when implementation stabilizes

## Open Questions
- whether parser current-state should live at `query` or `parser` node
```
