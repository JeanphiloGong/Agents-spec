# Ownership Tree And Placement

Use this reference when deciding which code-owned seam owns a document, where
it should live, and what kinds of pages each node level should carry.

## What Counts As A Node

Only real code-owned seams count as ownership nodes:

- system
- module
- submodule
- component
- test-suite

Docs-only grouping folders such as `docs/rfcs`, `docs/guides`, or topic
buckets like `docs/generation` are containers by default, not nodes.

## Place By Lowest Common Ancestor

Place the document at the lowest common ancestor of the code objects,
responsibilities, or behaviors it describes.

Examples:

- system-wide architecture: root `docs/`
- one module's current-state: `<module>/docs/`
- one submodule plan: `<module>/<submodule>/docs/`
- one component detail: component-local `docs/` when durable docs are justified
- a change shared by two sibling submodules: their parent module's `docs/`
- a coverage note spanning `tests/unit/services` and `tests/unit/routers`:
  `tests/unit/`

Use the lowest location that keeps the document fully owned and discoverable
without scattering one knowledge surface across unrelated branches.

## Node Responsibilities

### System

- project purpose
- system overview
- cross-module architecture
- shared contracts
- governance
- top-level indexes

### Module

- module purpose via the module root `README.md`
- module boundaries
- module current-state
- module-local proposals
- module guides or runbooks

### Submodule

- submodule purpose or scope via the submodule root `README.md` when that node
  needs its own entry page
- local architecture and current-state
- local implementation plans
- local verification notes

### Component

- detailed change plans
- local constraints and risks
- tightly scoped operating notes

Use component-local docs only when the component has durable standalone
knowledge.

### Test Suite

- test-scope purpose via the tests-node `README.md` when that node needs an
  entry page
- coverage overviews
- fixture, harness, or golden-data notes
- verification boundaries and known gaps
- test-local current-state when the tests asset itself evolves independently

## Root Versus Node-Local Placement

Keep root `docs/` for:

- system purpose and overview
- cross-module architecture
- shared contracts and governance
- top-level indexes and reading maps

Use node-local `*/docs/` for:

- local current-state
- local proposals
- local guides and runbooks
- detailed implementation plans
- test-suite-local coverage, fixture, harness, and verification docs when the
  tests tree is the primary owner

Use the node root `README.md` for:

- local purpose and scope
- node-level summary
- navigation into child docs

## Topic-Family Containers

Use a node-local topic-family container such as `<node>/docs/<topic>/` when:

- one local subject has 2 or more live alternative proposals
- one local subject mixes proposal, decision, implementation-plan, and
  current-state docs
- the local reading path is clearer as one small family than as many loose
  siblings in a root type bucket

Treat the topic-family folder as a container for navigation, not as a new
ownership node.

## Default Rule

Documentation should follow the ownership tree of the codebase rather than the
shape of the docs buckets.

## Anti-Patterns

Do not keep all durable docs in root `docs/` when the knowledge clearly
belongs to one owned subtree.
Do not keep one node's multi-option or mixed-intent family in root `docs/rfcs`
or `docs/plans` once a node-local topic-family container is warranted.
Do not promote docs-only grouping folders into ownership nodes just because
they already exist in the docs tree.
Do not attach test coverage or fixture docs to a runtime module when the tests
subtree is the clearer primary owner.
