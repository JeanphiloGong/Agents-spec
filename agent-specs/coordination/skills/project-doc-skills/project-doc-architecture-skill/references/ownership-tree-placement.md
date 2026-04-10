# Ownership Tree Placement

Use this reference when designing where docs should live across the repository.

## Core Rule

Documentation should follow the ownership tree of the codebase:
- system
- module
- submodule
- component

Each document should live at the lowest node that fully owns the thing it
describes.

## Node Definition

Only real code-owned seams count as ownership nodes.

Docs-only grouping folders such as `docs/rfcs`, `docs/guides`, or topic
buckets like `docs/generation` are containers by default, not nodes.

## Root Docs

Keep root `docs/` for:
- system purpose and overview
- cross-module architecture
- shared contracts and governance
- top-level indexes and reading maps

## Node-Local Docs

Use node-local `*/docs/` for:
- local current-state
- local proposals
- local guides and runbooks
- detailed implementation plans

Use the node root `README.md` for:
- local purpose and scope
- node-level summary
- navigation into child docs

## Anti-Pattern

Do not keep all durable docs in root `docs/` when the knowledge clearly belongs
to one owned subtree.
Do not promote docs-only grouping folders into ownership nodes just because
they already exist in the docs tree.
