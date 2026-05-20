---
name: reference-core-scan
description: v0.1.0 - Scan a project, module, or AI draft to inventory core logic chains before choosing one to extract. Use when the human needs to identify candidate learning chains, compare invariants and learning value, and select the next chain for reference-core-plan.
---

# Reference Core Scan

## Overview

Scan a project, module, subsystem, or AI draft to identify the core logic
chains worth extracting into reference-core learning modules. This skill
produces an inventory and priority recommendation, not a detailed build plan.

Use this skill when the human does not yet know which chain to extract. The
output should make the important flows visible enough to choose the next
`reference-core-plan` target.

## When to Use

- A repository, module, or AI draft is too broad to pick one learning chain
  directly.
- The human asks what core logic chains exist in a project or subsystem.
- Several flows look important and need comparison before planning one module.
- The next useful step is prioritizing a chain, not writing code or a module
  plan.

**When NOT to use:** planning a selected chain in detail, building a learning
module, reviewing a built module, mapping a module back to production, broad
architecture review, or production implementation.

## The Scan Loop

1. Set Scan Scope
   - Name repository, subsystem, files, branches, or AI draft paths inspected.
   - Mark included and excluded paths.
   - Verify: the scope is narrow enough that missed chains can be explained.
2. Find Entrypoints and Flows
   - Identify commands, handlers, use cases, jobs, schedulers, state machines,
     parsers, pipelines, or event consumers that start meaningful behavior.
   - Verify: each candidate starts from a concrete entrypoint or observable
     trigger.
3. Extract Candidate Chains
   - Summarize each chain as `entry input -> state/data -> decisions ->
     transitions -> output`.
   - Name the likely invariant, boundary case, and production noise around it.
   - Verify: each candidate could plausibly become a runnable learning module.
4. Score Learning Value
   - Score importance, complexity, invariant clarity, noise level, and
     extraction feasibility.
   - Use `high`, `medium`, or `low` for each score, plus a one-line reason
     when the score drives priority.
   - Prefer chains whose mastery would unblock human-owned implementation,
     review, or landing decisions.
   - Verify: the highest-priority chain has a concrete reason, not just the
     largest file count.
5. Recommend Next Extraction
   - Choose one first chain and explain why it should be planned next.
   - Provide starting inputs for `reference-core-plan`.
   - Verify: the handoff includes enough evidence to plan without rescanning.

## Decision Points

- If the scan scope is too broad, narrow to one subsystem or top-level
  workflow before inventorying.
- If code evidence is unavailable, produce a hypothesis inventory and mark
  every chain as `inferred`.
- If a chain is mostly framework or plumbing, deprioritize it unless the
  framework boundary is the learning target.
- If two chains share the same invariant, prefer the smaller one that exposes
  the invariant most directly.
- If the human already selected a chain, skip scan and use
  `reference-core-plan`.

## Output Format

```markdown
# Reference Core Scan: <Scope>

## Scope
- repository_or_module:
- inspected_paths:
- excluded_paths:
- evidence_quality: direct | partial | inferred

## Candidate Core Chains
| Priority | Chain | Entrypoint | Chain Trace | Likely Invariant | Boundary Case | Production Noise | Learning Value | Extraction Fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ... | ... | ... | ... | ... | ... | high | good |

## Scoring Notes
- importance:
- complexity:
- invariant_clarity:
- noise_level:
- extraction_feasibility:

## Recommended First Extraction
- chain:
- why_first:
- plan_inputs:
  - feature:
  - chain_mastery_goal:
  - chain_trace:
  - likely_invariant:
  - suggested_paths:
  - initial_boundary_check:
- next_skill: reference-core-plan

## Deferred Candidates
- ...

## Risks / Unknowns
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The biggest module must be the core chain." | Size often reflects plumbing. Pick chains by invariant, learning value, and extraction fit. |
| "We can scan and plan in one answer." | Scan chooses the chain; plan designs one selected module. Mixing them hides tradeoffs. |
| "Every important file needs a learning module." | The inventory should prioritize; many flows are glue or support code. |

## Red Flags

- Candidate chains are file names instead of entry-to-output flows.
- No invariant or boundary case is named for candidates.
- Priority is based only on file size or recency.
- The recommendation lacks handoff inputs for `reference-core-plan`.
- The scan tries to design module internals for every candidate.

## Verification

- [ ] Scope and excluded paths are explicit.
- [ ] Candidate chains have concrete entrypoints or observable triggers.
- [ ] Each candidate includes a chain trace, likely invariant, and boundary
      case.
- [ ] Priority reflects learning value and extraction fit.
- [ ] One recommended first extraction is named.
- [ ] Handoff inputs are sufficient for `reference-core-plan`.

## Guardrails

- Do not write code or module plans during scan.
- Do not treat framework plumbing as a core chain by default.
- Do not invent production behavior without marking it `inferred`.
- Do not scan the entire repository when the user asked about one subsystem.
