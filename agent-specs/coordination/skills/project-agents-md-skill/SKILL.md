---
name: project-agents-md-skill
description: v0.1.0 - Create or update a project-level AGENTS.md with explicit scope boundaries, approval rules, and execution constraints; use when starting a repository or redefining its AI operating contract.
---

# Project AGENTS.md Skill

## Trigger and Scope

Use this skill when you must create, replace, or materially revise the
project-local `AGENTS.md` that governs AI execution for one repository.

In scope:
- inspecting existing repository instructions before drafting
- defining project mission, scope boundaries, approval rules, and quality bar
- selecting only the domain philosophies that materially affect this repo
- encoding measurable execution rules, verification expectations, and risks
- surfacing missing inputs and unresolved governance gaps instead of guessing

Out of scope:
- writing one-off task prompts or feature specs
- inventing infrastructure, owners, or policies without project evidence
- changing code or deployment configuration unless explicitly requested
- creating organization-wide standards for unrelated repositories

## Workflow

1. Inspect the current repository contract.
   - Read the existing `AGENTS.md`, nearby governance docs, and any clear
     repository rules before proposing replacements.
   - Preserve coherent local rules instead of rewriting them for style.
2. Define the governance problem.
   - Identify why the file is needed or changing: missing boundaries, unclear
     approvals, unsafe defaults, inconsistent verification, or domain drift.
3. Capture the operating boundary.
   - Require the project purpose, owner, default focus area, and the
     directories or workflows that need stricter control.
4. Define scope and permission rules.
   - Separate default-safe work from approval-gated work.
   - Name forbidden actions and high-risk areas explicitly.
5. Select only material domain philosophies.
   - Choose domains that change failure cost, evidence, or tradeoffs for this
     project.
   - Use `references/domain-philosophy-library.md` as a prompt library, not as
     copy-paste filler.
6. Define the execution contract.
   - Specify update style, testing or verification expectations, handling of
     unknowns, and how to report incomplete checks.
7. Draft the file in the standard project format.
   - Keep rules short, measurable, and explainable in one sentence.
   - Prefer explicit defaults over vague guidance.
8. Record risks and open questions.
   - Surface missing allowed directories, unclear test strategy, or approval
     gaps instead of guessing.
9. Validate the result.
   - Run the checks in `references/acceptance-criteria.md`.
   - Ensure the final file is project-specific, auditable, and
     non-contradictory.

## Required Inputs

- project name and one-sentence purpose
- owner or approval authority
- default focus area and high-risk directories
- approval expectations for code, config, and deployment changes
- testing or verification expectations if code changes may be allowed

## Defaults

- operating mode: single-agent unless explicitly enabled
- default focus: docs and specs until broader edit scope is approved
- proof before done: state what was verified, or say `not run` with the reason
- change discipline: minimize cross-cutting changes and preserve stable
  contracts
- forbidden content: secrets, tokens, credentials, and PII
- language: English unless the repository clearly uses another default

## Bundled Resources

- `references/acceptance-criteria.md`
- `references/domain-philosophy-library.md`

## Output Format

```text
# AGENTS.md (Project Rules: <project-name>)
## Overview
## Core Principles
## Domain Philosophies (Master-Level)
## Product & Project Standards
## 12 Golden Rules (Why / How / Check)
## Scope Boundaries
## Permission Model
## Execution Rules
## Quality Bar
## Decision & Accountability
## Risks & Open Questions
```

## Guardrails

- Do not invent project owners, infrastructure, or approval rules.
- Do not widen edit scope without explicit approval.
- Do not include domains that do not materially change project risk or
  behavior.
- Do not bury approval gates inside prose; keep them explicit.
- Do not make `AGENTS.md` the source of truth for product scope that belongs
  in specs, issues, or other project docs.
- Do not mark the work complete without naming verification status.

## Verification Hooks

- Verify existing repository instructions were inspected before proposing
  replacements.
- Verify every high-risk directory or action has an explicit approval rule.
- Verify each selected domain philosophy maps to a real project risk or
  constraint.
- Verify the 12 golden rules are operational and measurable, not slogans.
- Verify testing expectations and `not run` behavior are explicit.
- Verify risks and open questions capture missing scope boundaries instead of
  guessing.
