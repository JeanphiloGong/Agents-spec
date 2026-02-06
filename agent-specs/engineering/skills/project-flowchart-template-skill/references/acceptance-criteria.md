# Flowchart Template Acceptance Criteria

## Universal Acceptance Criteria

- Output includes all requested workflow templates.
- Every diagram has valid Mermaid header (`flowchart` or `sequenceDiagram`).
- Every chain includes success and failure/alternative branch.
- Every chain references real project evidence (files/functions).
- Unknowns are explicitly labeled as `TODO(verify)`.

## Template-Level Criteria

### System Overview
- Shows major layers and main entrypoints.
- Shows at least one cross-layer dependency.

### Request Flow
- Shows request entry, auth/guard check, core handler path, and response path.

### Processing Pipeline
- Shows staged processing nodes and at least one retry/cancel/failure branch.

### Data Flow
- Shows read/write boundaries and data stores.

## Evidence Requirement

For each diagram, provide:
- Source files used.
- Key functions or modules mapped.
- Uncertainty note (`none` if no uncertainty).

## Reviewer Challenge Checklist

- Which edge is least certain and why?
- Which branch is likely missing?
- Which node name is too generic to debug with?
- Can a new engineer locate code from this chart in under 5 minutes?
