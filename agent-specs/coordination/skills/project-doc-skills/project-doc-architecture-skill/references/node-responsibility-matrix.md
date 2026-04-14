# Node Responsibility Matrix

Use this reference when assigning doc responsibilities by node level.

Each node in this matrix must correspond to a real code ownership seam, not
only to a docs folder or topic grouping.

## System

- project purpose
- system overview
- cross-module architecture
- shared contracts
- governance
- top-level indexes

## Module

- module purpose via the module root `README.md`
- module boundaries
- module current-state
- module-local proposals
- module guides or runbooks

## Submodule

- submodule purpose or scope via the submodule root `README.md` when that node
  needs its own entry page
- local architecture and current-state
- local implementation plans
- local verification notes

## Component

- only when the component has durable standalone knowledge
- detailed change plans
- local constraints and risks
- tightly scoped operating notes

## Test Suite

- test-scope purpose via the tests-node `README.md` when that node needs an
  entry page
- coverage overviews
- fixture, harness, or golden-data notes
- verification boundaries and known gaps
- test-local current-state when the tests asset itself evolves independently

## Rule

Parents own boundaries and navigation. Children own local detail.
