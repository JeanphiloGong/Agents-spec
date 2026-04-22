# Rebalancing And Lineage Rules

Use this reference when a maintained documentation slice no longer fits its
current parent-child structure or local reading shape.

## Common Problems

- parent docs absorbing child detail
- implemented proposals still acting as the only current knowledge
- local source of truth missing at the owning node
- stale summaries after child docs were created
- reading order breaking across parent, child, or sibling docs

## Split A Parent When

- the parent now contains multiple child plans
- file change detail from children makes the parent hard to scan
- the parent should remain a boundary or index page
- local ownership boundaries are no longer clear

## After A Split

- parent keeps summary, boundary, and stable links
- parent README, when present, keeps purpose and main-flow cues instead of
  turning into a replacement docs landing page
- child docs keep detail, local risks, and local verification

## Promotion And Summary Repair

When a child page becomes the clearer local source of truth:

- parent keeps a short summary of what changed
- parent links to the child or current-state page
- child keeps local current-state or proposal detail
- child keeps implementation boundaries
- child keeps verification and local risks when still relevant

Promotion should not move all child knowledge upward. It should make the local
source of truth easier to find.

## Minimum Lineage Repairs

- parent docs link to active child docs
- child docs link back to the parent summary or origin proposal
- implemented proposals link forward to current-state
- superseded docs link to replacements

## Extract A Node-Local Topic Family When

- one local subject has accumulated multiple live alternatives
- one local subject mixes proposal, decision, implementation-plan, and
  current-state pages
- the family is still stranded in root `docs/rfcs` or `docs/plans`

## Default Rule

Rebalance the family so parent pages summarize, child pages keep local detail,
and readers can move across the slice without guessing what is current.
