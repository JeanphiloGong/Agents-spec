# Promotion Rules

Use this reference when defining when one doc should remain standalone and when
it must cause updates elsewhere.

## Core Principle

RFC is a proposal layer, not the final resting place for implemented behavior.

## Default Promotion Rules

### Proposal -> Current State

If a proposal is implemented and changes how the system is understood, decide
which current-state or manual page must be created or updated.

### Proposal -> ADR

Extract an ADR only when the decision is durable, likely to be revisited, and
important enough that future readers will ask "why is it this way?"

### Proposal -> Contract

Promote to spec or contract only when the boundary is stable and relied on by
other modules, services, or external consumers.

### Proposal -> Guide

Promote to guide when developer or integrator workflows changed.

### Proposal -> Runbook

Promote to runbook when operator recovery, rollback, troubleshooting, or
intervention changed.

## Single-Doc Allowed

Single-doc-only is still allowed when all of these are true:
- the change is local
- it does not materially change system understanding
- it does not create a stable boundary
- it does not create a repeated development or operational workflow

## Failure Modes

- Every implemented change stays trapped in RFC
- Every accepted RFC spawns an ADR whether needed or not
- Contract docs appear for unstable implementation details
