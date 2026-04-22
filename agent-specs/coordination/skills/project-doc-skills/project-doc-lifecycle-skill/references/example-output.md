# Example Output

Use this only as operator planning output. Do not copy these labels directly
into reader-facing repository documents.

```text
planning note
- lifecycle_goal:
  - Repair one parser documentation slice so it reads as a coherent
    project-book chapter rather than a scattered proposal trail.
- operating_scope:
  - `graph/query/parser`
- topic_tree_assessment:
  - broad parent topic: `query`
  - narrower local subtopic: `parser/batch-normalization`
  - current problem: historical RFC and current parser-local material are
    mixed in one broad plan trail
- current_system_state:
  - implementation exists
  - current truth is split across an old RFC and parser-local notes
  - there is no obvious current entry page for parser readers
- canonical_vs_historical_map:
  - canonical current truth: missing explicit parser current-state page
  - historical but still useful: parent query RFC
  - discovery only: parent module overview
- reading_order:
  - current: module overview -> old RFC -> parser notes
  - target: module overview -> parser current-state -> parser plan or history
    as needed
- broken_navigation_paths:
  - readers land in the parent RFC before they see parser current truth
  - parser-local notes have no stable route back to the module overview
  - parser entry README, if rewritten, currently leads with local docs
    pointers instead of parser purpose and flow
- missing_entry_overview_bridge_docs:
  - missing parser current-state page
  - missing parser-related reading cue from the parent RFC
- current_placement_problems:
  - parent RFC contains parser-local file change detail
  - no dedicated parser child plan or current-state doc
  - parent summary is no longer easy to scan
- target_tree_shape:
  - parent query RFC becomes summary and history
  - parser subtopic family gets its own local plan doc
  - parser current-state doc becomes the canonical authority page
- promotion_supersede_archive_decisions:
  - promote parser current-state: yes
  - keep parent RFC as historical summary: yes
  - archive anything: no
- parent_child_neighbor_repairs:
  - parent RFC keeps one summary section and stable links
  - parser README keeps parser purpose, boundary, and main-flow summary
  - parser README moves docs pointers into a short related-docs section
    instead of opening with them
  - create `graph/query/parser/docs/parser/batch-normalization-plan.md`
  - create or update parser current-state at the parser node
  - add neighbor links between parser current-state and parser plan
- status_transitions:
  - parent RFC remains historical proposal context
  - child current-state doc becomes active when implementation settles
- lineage_repairs:
  - parent RFC links to parser child plan
  - parser child plan links back to parent RFC and parser current-state
  - parser current-state links back to both when created
- record_skill_handoffs:
  - create child parser plan doc
  - create or update parser current-state doc
  - update parent RFC summary section
  - update nearest local index or overview link
- book_readiness:
  - not ready yet because parser scope lacks a canonical entry page
- export_manifest_plan:
  - include module overview
  - include parser current-state
  - include parser plan
  - include parent RFC only as historical appendix
- maintenance_actions:
  1. create or update parser current-state doc
  2. create child parser plan doc
  3. replace parent detail with summary and stable links
  4. update local index or overview cue
- open_questions:
  - whether parser current-state should live at `query` or `parser` node
```
