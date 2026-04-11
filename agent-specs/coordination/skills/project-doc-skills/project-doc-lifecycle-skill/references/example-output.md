# Example Output

```text
## Lifecycle Goal
- Repair one parser documentation slice so it reads as a coherent project-book
  chapter rather than a scattered proposal trail.

## Operating Scope
- `graph/query/parser`

## Current System State
- implementation exists
- current truth is split across an old RFC and parser-local notes
- there is no obvious current entry page for parser readers

## Canonical vs Historical Map
- canonical current truth: missing explicit parser current-state page
- historical but still useful: parent query RFC
- discovery only: parent module overview

## Reading Order
- current: module overview -> old RFC -> parser notes
- target: module overview -> parser current-state -> parser plan or history as
  needed

## Broken Navigation Paths
- readers land in the parent RFC before they see parser current truth
- parser-local notes have no stable route back to the module overview

## Missing Entry / Overview / Bridge Docs
- missing parser current-state page
- missing parser-related reading cue from the parent RFC

## Current Placement Problems
- parent RFC contains parser-local file change detail
- no dedicated parser child plan or current-state doc
- parent summary is no longer easy to scan

## Target Tree Shape
- parent RFC becomes summary and history
- parser child plan becomes separate local doc
- parser current-state doc becomes the canonical authority page

## Promotion / Supersede / Archive Decisions
- promote parser current-state: yes
- keep parent RFC as historical summary: yes
- archive anything: no

## Parent / Child / Neighbor Repairs
- parent RFC keeps one summary section and stable links
- create `graph/query/parser/docs/parser-batch-normalization-plan.md`
- create or update parser current-state at the parser node
- add neighbor links between parser current-state and parser plan

## Status Transitions
- parent RFC remains historical proposal context
- child current-state doc becomes active when implementation settles

## Lineage Repairs
- parent RFC links to parser child plan
- parser child plan links back to parent RFC and parser current-state
- parser current-state links back to both when created

## Record-Skill Handoffs
- create child parser plan doc
- create or update parser current-state doc
- update parent RFC summary section
- update nearest local index or overview link

## Book Readiness
- not ready yet because parser scope lacks a canonical entry page

## Export Manifest Plan
- include module overview
- include parser current-state
- include parser plan
- include parent RFC only as historical appendix

## Maintenance Actions
1. create or update parser current-state doc
2. create child parser plan doc
3. replace parent detail with summary and stable links
4. update local index or overview cue

## Open Questions
- whether parser current-state should live at `query` or `parser` node
```
