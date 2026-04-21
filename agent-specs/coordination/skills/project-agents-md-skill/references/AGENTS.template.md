<!--
Copy this file into a target repository as AGENTS.md, then replace all
<placeholders> with project-specific values.
-->

# AGENTS.md (Project Rules: <project-name>)

## Overview
- Project: <project-name>.
- Goal: <one-sentence project purpose>.
- Mode: single-agent by default.

## Core Principles
1. Rules over improvisation.
2. Only change what you can explain and verify.
3. Prefer clarity and traceability over speed.
4. Minimize cross-cutting changes.
5. Document decisions and risks, not raw diffs.

## Domain Philosophies (Master-Level)
<!-- Repeat this block only for domains that materially affect the project. -->
### <Domain Name>
- Goal: <what good looks like>.
- Constraints: <hard limits or safety boundaries>.
- Evidence: <what proves correctness or quality>.
- Failure Cost: <what breaks if this is handled poorly>.
- Tradeoffs: <how this project chooses between competing goals>.
- Non-negotiables: <rules that cannot be violated>.

## Product & Project Standards
- Define measurable success metrics for each milestone.
- Maintain a single source of truth for scope and priority.
- Require acceptance criteria for all significant changes.
- Track risks with clear owners and mitigation plans.

## 12 Golden Rules (Why / How / Check)
1. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
2. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
3. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
4. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
5. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
6. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
7. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
8. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
9. <Rule title>.
   - Why: <why this rule exists>.
   - How: <how to follow it>.
   - Check: <how to verify it was followed>.
10. <Rule title>.
    - Why: <why this rule exists>.
    - How: <how to follow it>.
    - Check: <how to verify it was followed>.
11. <Rule title>.
    - Why: <why this rule exists>.
    - How: <how to follow it>.
    - Check: <how to verify it was followed>.
12. <Rule title>.
    - Why: <why this rule exists>.
    - How: <how to follow it>.
    - Check: <how to verify it was followed>.

## Scope Boundaries
- Default focus: <safe default scope, for example docs and specs>.
- High-risk areas: <paths, workflows, or systems requiring stricter control>.
- Changes outside the default focus require explicit approval and scope definition.

## Permission Model
- Safe without approval:
  - <docs-only edits>
  - <small local clarifications>
- Requires approval:
  - <code changes>
  - <config or deployment changes>
  - <cross-cutting refactors>
- Must never do:
  - <commit secrets, tokens, or PII>
  - <destructive operations without explicit approval>

## Execution Rules
- Think before coding.
  - State assumptions explicitly.
  - If multiple interpretations exist, surface them instead of choosing
    silently.
  - If a simpler approach exists, say so.
  - If something is unclear, stop, name the confusion, and ask.

- Prefer direct implementation over compatibility layers.
  - Without explicit approval, do not add adapters, wrappers, shims, facades,
    bridges, or compatibility layers.
  - Prefer direct changes to the real implementation and direct updates to
    callers.
  - Do not preserve old interfaces "for safety" unless explicitly requested.
  - If a temporary compatibility layer is truly necessary, label it clearly,
    explain why it is needed, and remove it in the same task whenever
    possible.

- Keep the solution minimal.
  - No features beyond what was asked.
  - No abstractions for single-use code.
  - No configurability or flexibility that was not requested.
  - No error handling for impossible scenarios.
  - Do not leave temporary migration code, dual-path logic, fallback
    branches, or forwarding helpers after the task is complete.
  - If 200 lines can be 50, rewrite it.

- Make surgical changes.
  - Touch only what is needed for the task.
  - Do not "improve" adjacent code, comments, or formatting unless required.
  - Do not refactor working code without a task-driven reason.
  - Match existing style unless the task requires otherwise.
  - If you notice unrelated dead code, mention it; do not remove it unless
    asked.
  - Every changed line should trace directly to the user's request.

- Define success in verifiable terms.
  - Turn requests into concrete checks.
  - "Add validation" means write or update tests for invalid inputs, then make
    them pass.
  - "Fix the bug" means reproduce it with a test or equivalent check, then
    make it pass.
  - "Refactor X" means verify behavior before and after.
  - For multi-step tasks, state a brief plan:

  ```text
  1. [Step] -> verify: [check]
  2. [Step] -> verify: [check]
  3. [Step] -> verify: [check]
  ```

  - Strong success criteria support independent execution. Weak goals like
    "make it work" usually require clarification.

- Clean up your own change fully.
  - Before finishing, remove dead code, obsolete exports, unused helpers, and
    redundant branches introduced by your change.
  - Remove imports, variables, and functions that your change made unused.
  - Do not remove pre-existing dead code unless asked.

- When unsure, choose the simpler design.
  - Favor fewer layers and fewer moving parts.
  - If the solution feels overcomplicated, simplify it.

- Report the result clearly.
  - In the final report, state:
    - whether any new abstraction was added
    - whether it is temporary or permanent
    - what cleanup was performed

## Quality Bar
- Every change must be explainable in one sentence.
- State testing status explicitly; if not run, say why.
- No secrets, tokens, or PII in outputs.

## Decision & Accountability
- Owner: <person or team responsible for approval>.
- Single-agent execution unless explicitly enabled.
- Record major decisions and risks in documentation when relevant.

## Risks & Open Questions
- <missing scope boundary>.
- <missing approval rule>.
- <missing test strategy>.
