# Body Structure By Role

Use this reference when deciding the section layout for the document body.

Choose the body structure from lifecycle role first. Do not reuse one generic
formal-doc outline for every artifact.

## Proposal (`rfc`)

Prefer sections such as:
- Summary
- Context
- Goals
- Non-Goals
- Proposed Change
- Rollout or Migration
- Risks
- Open Questions

## Decision (`adr`)

Prefer sections such as:
- Decision
- Context
- Alternatives Considered
- Consequences
- Related Docs

## Current-State (`architecture`)

For system or module overview pages, prefer direct content sections such as:
- System Boundary or Scope
- Major Modules or Responsibilities
- Core Flows
- External Interfaces
- Operational Surfaces
- Related Docs (footer)

For one subsystem page, prefer:
- Responsibilities
- Dependencies
- Data or Control Flow
- Constraints
- Related Docs (footer)

## Contract (`spec`)

Prefer sections such as:
- Scope
- Contract
- Semantics
- Compatibility Notes
- Examples
- Change Control

## Development Guide (`guide`)

Prefer sections such as:
- Goal
- Prerequisites
- Steps
- Verification
- Troubleshooting
- Related Docs (footer)

## Operation (`runbook`)

Prefer sections such as:
- Trigger or Symptoms
- Preconditions
- Recovery Steps
- Verification
- Rollback
- Escalation
- Related Docs (footer)

## Anti-Patterns

- Do not start current-state or overview docs with self-referential prose such
  as "This document explains..." or "It answers..." unless the repository
  already uses that convention.
- Do not add `Purpose` by default just because the document is formal.
- Do not put long navigation or lineage scaffolding before the real content
  when a footer section would keep the page easier to read.
- Do not use proposal-oriented sections such as `Goals`, `Non-Goals`, or `Open
  Questions` in current-state docs unless the page is explicitly mixing current
  state with active design work.
