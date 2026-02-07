---
name: project-flowchart-template-skill
description: v0.1.1 - Generate reusable Mermaid flowchart templates for any project from code evidence, so operators only tune business logic details.
---

# Project Flowchart Template Skill

## Trigger and Scope

Use this skill when the user wants quick, editable flowchart templates for a
codebase and prefers to fine-tune logic manually.

In scope:
- Project-agnostic flowchart template generation.
- Router/service/repository style call-chain mapping (or equivalent layers).
- Evidence-backed flow mapping from real files.

Out of scope:
- Implementing new product features.
- Editing runtime data or deployment infra.
- Fabricating unknown calls/flows.

## Mission and Audience

- Mission: produce a ready-to-edit Mermaid template pack for any project.
- Audience: engineers, maintainers, and operators onboarding existing systems.

## Workflow

1. Discover project structure.
   - Identify entrypoints and layer boundaries (for example: API -> service -> data).
2. Build workflow inventory.
   - List high-value chains (default: 4 chains).
3. Trace each chain with evidence.
   - Map function/module edges only when backed by source files.
4. Normalize node IDs.
   - Enforce the required node ID naming convention before rendering final templates.
5. Generate Mermaid templates.
   - Create/update files under target flow directory.
6. Add tune markers.
   - Mark uncertain or optional nodes as `TODO(verify)`.
7. Validate templates.
   - Run syntax/completeness checks and naming validation.
8. Run acceptance review.
   - Use `references/acceptance-criteria.md` and record pass/fail evidence.
9. Return strict output.

## Required Inputs

- Project root path (default: current workspace).
- Preferred output path (default: `docs/flows/`).
- Target workflows (default: system, request, pipeline, data).
- Diagram style (default: Mermaid `flowchart TD`).
- Acceptance owner.

## Defaults

- Template count: 4
  - `system-overview.mmd`
  - `request-flow.mmd`
  - `processing-pipeline.mmd`
  - `data-flow.mmd`
- Labeling rule: use real file/function names where known.
- Node ID rule: use the required naming convention for all node IDs.
- Unknown mapping rule: keep placeholder + `TODO(verify)`.
- Keep SKILL.md concise; details go to `references/` and `assets/`.

## Node ID Naming Convention (Required)

Formula:
- `<type>_<action>_<object>[_<context>][_n]`

Fixed dictionaries:
- `type`: `entry|gate|route|usecase|service|repo|store|branch|event|result`
- `action`: `receive|verify|parse|map|list|get|create|update|delete|upsert|assemble|emit|return`
- `object`: business noun in singular form, lower-case.

Hard rules:
- Use lower-case `snake_case` only (`a-z`, `0-9`, `_`).
- Do not use non-semantic IDs such as `Q1`, `B1`, `C1`.
- Use numeric suffix (`_2`, `_3`) only when a real naming collision exists.
- Branch nodes must use `branch_*`.
- Result nodes must use `result_*`.

Examples:
- `entry_receive_order_create_request`
- `gate_verify_user_permission`
- `service_assemble_order_payload`
- `repo_upsert_order`
- `store_mysql_orders`
- `branch_inventory_is_sufficient`
- `result_return_http_200_order_created`

## Output Format (Strict)

```
## Flow Pack Summary
## Files Created or Updated
## Evidence Map
## Validation
## Naming Validation
## Manual Tune Points
## Unknowns
```

## Guardrails

- Do not invent endpoints, classes, functions, or data stores.
- Do not expose secrets/tokens from any env file.
- Do not mutate runtime data directories.
- If evidence is missing, explicitly mark unknowns.
- Keep diagrams maintainable: stable node IDs, clear branch labels.
- Reject outputs with non-semantic node IDs (for example `Q1`, `B1`, `C1`).

## Verification Hooks

- Template completeness:
  - `python scripts/validate_mermaid_templates.py <flow-template-dir>`
- Reinforcement audit validation:
  - `python scripts/validate_reinforcement_audit.py references/reinforcement-audit.jsonl`
- Optional render check:
  - `npx mmdc -i <input.mmd> -o <output.svg>`

## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record pass/fail evidence.
- Capture gaps with scope impact and ownership.
- Define a next-iteration checklist targeting the highest-impact gap first.
- Explicitly name the highest-risk gap and one concrete verification step.

## Reinforcement Plan (Required)

### Goals
- Reduce repeated flow mapping errors.
- Increase first-pass usability of generated templates.
- Promote stable high-signal patterns into defaults.

### Operating Rules
- Reinforcement uses a four-step loop: Plan -> Change -> Verify -> Reflect.
- Changes stay localized, reversible, and auditable.
- Every round produces plan/change/verify/reflect artifacts.

### Reinforcement Mode Gate
- Default: off.
- Enable only with explicit signal: `reinforcement=on`.

### Audit Baseline
Each round must produce:
- One Git commit containing only that round's changes.
- One JSON object line in `references/reinforcement-audit.jsonl`.
- Validation pass from `scripts/validate_reinforcement_audit.py`.

### Four-Step Reinforcement Cycle
1) Plan
- Define objective, acceptance criteria, scope in/out, evidence inputs, exit condition.
2) Change
- Target one failure mode, apply minimal edits, define rollback.
3) Verify
- Run checks, collect evidence, make decision (promote/hold/rollback).
4) Reflect
- Record measurable improvements, tradeoffs, next highest-impact action.

## Step Gate (Required)

When reinforcement mode is enabled, after each step ask: `continue?`
Do not proceed until explicit confirmation: `continue`.

## File Map

- `assets/templates/`: reusable Mermaid templates.
- `references/acceptance-criteria.md`: acceptance checklist.
- `references/flowchart-checklist.md`: quick quality checklist.
- `references/reinforcement-audit.jsonl`: reinforcement audit log.
- `scripts/validate_mermaid_templates.py`: completeness validator.
- `scripts/validate_reinforcement_audit.py`: audit JSONL validator.
