---
name: issue-gate-skill
description: v0.1.22 - Check, draft, create, and link GitHub or GitLab issues for tracked work. Use when turning approved workflow-plan tasks into mapped issue-backed acceptance work items, confirming canonical issue traceability before implementation or commit preparation, targeting canonical repos, or producing commit Refs output.
---

# Issue Gate Skill

## Overview

Keep meaningful tracked work connected to the canonical issue that explains
purpose, scope, acceptance, and commit traceability. This skill checks whether
the right GitHub or GitLab issue already exists, drafts a master-grade issue
when it is missing, maps approved workflow-plan tasks into issue-backed
acceptance units, and emits the deterministic `Refs` bridge used by
`git-commit-skill`.

Default behavior is auto-first and dry-run-then-confirm. Infer repository,
platform, change type, template, and issue layering from local evidence when
safe; ask the human only when the canonical target, title prefix, issue layer,
or create action would otherwise be guessed.

## When to Use

- A repository expects meaningful work to be traceable to an issue.
- The agent needs to confirm whether the canonical issue already exists.
- A missing issue needs a draft or create plan before implementation.
- Approved `workflow-plan` tasks need issue-backed acceptance mapping.
- Commit preparation needs a verified `Refs` line.
- Work should target the upstream or canonical issue repo instead of a fork.

**When NOT to use:** auto-closing issues, PR creation, merge workflows, release
notes, code review, project planning, release management, repository doc
archiving, or transient implementation-plan storage. Use the corresponding
delivery, review, release, or documentation skill for those workflows.

Preferred timing:

- early pass: before implementation starts for meaningful tracked work
- final pass: before commit preparation as the last traceability check

In scope:
- canonical issue existence checks
- issue draft generation and confirmed creation
- plan-task handoff review and issue grouping
- issue creation after dry-run and human confirmation
- issue link output for commit `Refs`

## Core Principles

- Ensure every meaningful change is traceable to an issue.
- Prefer issue creation close to planning and scope definition, not as a default
  post-implementation repair step.
- Use task-level traceability by default: one issue may cover multiple related
  commits for the same tracked work.
- Treat issues as the execution and acceptance record for planned work; reserve
  docs for stable knowledge, accepted decisions, current state, contracts,
  guides, operations notes, or long-lived direction.
- Keep the business purpose in the issue even when a linked commit only
  advances, investigates, or partially implements the work.
- Keep commit flow human-controlled with automation guardrails.
- Provide a deterministic bridge from issue lifecycle to commit metadata.

## Bundled Resources

- `references/issue-templates.md`
  Use when resolving template families, drafting issue bodies, validating
  required fields, or choosing the standard create payload for `gh` or `glab`.
- `references/issue-cli-reference.md`
  Use when checking CLI command syntax, remote and upstream detection,
  repository targeting, and automation notes for GitHub CLI or GitLab CLI.
- `references/required-gitlab-flow-example.md`
  Use when you need an end-to-end example of the required GitLab flow or a
  concrete example of the output contract.

## Concrete Trigger Examples

Use this skill for requests such as:

- "先检查这个任务在上游仓库里有没有 issue，没有就帮我起一个"
- "commit 前帮我确认 issue，并给我一行 `Refs`"
- "这个改动是给 upstream 的，不要在 fork 里重复建 issue"
- "根据当前分支和改动范围，自动帮我起一个 issue 草稿"
- "把 workflow-plan 里的可验收 task 转成 issue 草稿"

## Input Policy (Auto-First)

Default behavior is auto-inference. Ask the human only when inference
confidence is low, conflicting, or blocked by repository policy.

### Auto-Inferred First

- `repo_root`: from current git root.
- `change_type`: infer from branch name, change intent, and file scope.
- `repo_target`: infer from origin/upstream remotes, explicit repo hints, and
  whether the work is meant for canonical shared history.
- `platform_hint`: detect from remote and CLI availability (`gh` or `glab`).
- `gate_mode`: read repository policy first, then fall back to the default.

### Required Only When Auto Fails

One of:
- `existing_issue_id`, or
- `issue_title` and `issue_body`

## Optional Inputs

- `labels`: comma-separated labels
- `assignee`: issue assignee
- `milestone`: milestone name
- `repo_override`: explicit `<owner>/<repo>` or `<group>/<repo>` issue target
- `audience_profile`: `leadership|cross_functional|engineering_only`
- `issue_level`: `parent_requirement|delivery_task|implementation_task`
- `plan_task_handoff`: approved workflow-plan task list with acceptance and
  verification details
- `task_issue_policy`: `per_deliverable_task|grouped_by_phase|reuse_parent_only`

## Fixed Defaults

- `gate_mode=required`
- `platform_hint=auto`
- `execution_mode=dry-run-then-confirm`
- `action_scope=check-create-link`
- `input_mode=auto-infer-first`
- `auto_draft=on`
- `confirm_before_create=on`
- `timing_policy=prefer-pre-implementation-confirmation`
- `verification_gate=pre-commit-final-check`
- `traceability_granularity=one-issue-to-many-commits-allowed`
- `issue_repo_policy=canonical-repo-preferred`
- `closure_policy=reference-by-default`
- `layering_policy=parent-product-child-engineering`
- `child_issue_detection=on`
- `create_policy=parent-first-child-second-confirmed`
- `audience_profile=cross_functional`
- `issue_level=parent_requirement`
- `quality_bar=master_grade`
- `implementation_detail_mode=defer-unless-explicitly-requested`
- `plan_handoff_mode=issue-ready-tasks-only`
- `task_issue_policy=group-by-independent-delivery-slice`
- `plan_task_mapping_required=on`
- `issue_title_prefix_policy=required_for_new_warning_for_existing`

## Traceability Granularity

- Each meaningful tracked commit should point to an issue-backed purpose when
  repository policy requires issue tracking.
- The default unit of intent is the task or requirement, not the individual
  commit.
- One issue may cover multiple related commits when they belong to the same
  task, fix, or delivery slice.
- Do not create a new issue per commit unless repository-specific policy
  explicitly requires that behavior.

## Plan Task Handoff

- When an approved `workflow-plan` task list is supplied, treat it as issue
  source material, not as a repository documentation artifact.
- Validate that each issue-ready task has a clear outcome, acceptance criteria,
  verification method, and dependency notes before drafting issues from it.
- Do not mechanically create one issue per plan task. Create or group issues by
  independently reviewable, assignable, and verifiable delivery slices.
- Always emit a `Plan Task Issue Mapping` when plan tasks are supplied. Do not
  collapse multiple plan tasks into one parent issue without mapping every task
  to `child_issue`, `grouped_child_issue`, or `parent_only`.
- If a plan task is not mapped to a child or grouped child issue, state the
  concrete reason it is not independently issue-worthy.
- Prefer a product-facing parent issue for the overall requirement and linked
  `delivery_task` or `implementation_task` issues for execution-ready slices
  only when those child issues add useful traceability.
- Keep temporary sequencing, file-by-file work plans, and task churn in the
  planning artifact, issue body/comments, or PR/MR discussion. Do not route
  that transient material into project docs by default.

### Plan Task Mapping Decisions

- `child_issue`: use when one plan task is independently reviewable,
  assignable, and verifiable.
- `grouped_child_issue`: use when several plan tasks form one coherent delivery
  slice and share the same acceptance surface.
- `parent_only`: use only when the task is too small, preparatory, mechanical,
  or inseparable from the parent requirement to justify a separate issue.
- For multi-task plans, default to considering child issues first. A single
  parent-only issue is acceptable only when the mapping explains why each task
  should not become or join a child issue.

## Canonical Issue Location and Lifecycle

- When work is intended to land in an upstream or shared repository, prefer
  creating or reusing the issue in that canonical repository rather than in a
  personal fork.
- Commits may be authored in a fork or worktree before code is synchronized
  upstream; they should still reference the canonical task issue when that is
  the true source of purpose.
- Fork-local issues are a fallback for fork-only work, private-only work, or
  cases where canonical issue creation is unavailable or inappropriate.
- Linking a commit to an issue does not mean that the commit resolves the
  issue.
- Default to a reference bridge such as ISSUE: #123 or equivalent `Refs`
  semantics.
- Only use issue-closing semantics when the change truly resolves the issue and
  the operator explicitly intends closure.
- An issue may remain open, blocked, deferred, or partially implemented after
  one or more linked commits.

## Repository Target Resolution

- Resolve the issue target repository before searching or creating.
- An explicit `repo_override` wins over inferred targets.
- If the current repository is a fork and an `upstream` remote exists, prefer
  the upstream repository when the change is intended for upstream or other
  shared history.
- If the work is fork-only, private-only, or upstream issue creation is
  unavailable or inappropriate, the current repository may be the canonical
  issue target.
- Reuse an existing canonical issue before creating a fork-local duplicate.
- The dry-run output must state the resolved `target_repo` and whether the
  search scope is the current repo, upstream repo, or an explicit override.

## Comment And Split Hygiene

- Prefer short issue comments for incremental clarification, status notes,
  links, and narrow follow-up decisions.
- Do not let one issue accumulate long comment threads that read like a rolling
  design doc, meeting log, or implementation spec.
- If a clarification materially changes scope, introduces a distinct execution
  track, or needs a long structured explanation, prefer opening a new linked
  issue instead of adding another long comment.
- If the content is still the same requirement and only needs a concise
  correction or addendum, prefer a short comment or fold the summary back into
  the issue body.
- Use linked child or follow-up issues when the discussion becomes
  independently actionable for frontend, backend, integration, rollout, or
  investigation work.

## Issue Reference Formatting Rule

- When an issue reference should stay clickable in rendered markdown, render it
  as plain text like #123, owner/repo#123, or a full issue URL in normal prose.
- Do not wrap issue references such as #123 or owner/repo#123 in backticks when
  the goal is clickable linkage.
- Apply the same rule to parent/child issue linkage fields, follow-up issue
  mentions, and issue references inside comments or issue bodies.
- If you need to show a literal commit bridge line like ISSUE: #123, keep that
  output as plain text rather than inline-code issue syntax.

## Issue Title Prefix Rule

- New issue drafts must render titles as `<prefix>: <short title>`.
- Resolve `prefix` from `change_type`, not from the broader
  `template_family`, before dry-run preview and before any create command.
- Prefix mapping:
  - `feat|integration|workflow|api` => `feat`
  - `fix|bugfix|incident` => `bugfix`
  - `hotfix` => `hotfix`
  - `docs` => `docs`
  - `refactor` => `refactor`
  - `test` => `test`
  - `tooling` => `tooling`
  - `config` => `config`
  - `chore` => `chore`
  - `spike|research|proposal|investigation` => `proposal`
- Repository-specific title conventions may override this mapping only when
  the repository policy or template is explicit. State the override in the
  dry-run output.
- If `change_type` cannot be inferred confidently, ask the human to confirm the
  prefix before creating an issue.
- Do not block reuse of an existing issue solely because its title lacks a
  recognized prefix. Reuse it and emit a `title_prefix_warning` instead.

## Platform Selection

1. If `platform_hint` is `gh` or `glab`, use that platform.
2. If `platform_hint=auto`:
   - inspect the resolved target repository host from `origin`, `upstream`, or
     `repo_override`
   - GitHub host => prefer `gh`
   - GitLab or self-managed GitLab host => prefer `glab`
   - if host is ambiguous, prefer the CLI with proven auth for the resolved
     target repo
   - if both CLIs look usable but imply different platforms, stop and ask the
     human to confirm instead of guessing
   - if no suitable CLI is available, gate failure

Read `references/issue-cli-reference.md` when you need the exact command
surface, remote-detection commands, or automation caveats.

## Inference Rules

1. `repo_root`
   - `git rev-parse --show-toplevel` succeeds => use result.
   - failure => ask the human for `repo_root`.
2. `change_type`
   - infer from branch prefix (`feat/`, `fix/`, `hotfix/`, etc.)
   - fall back from change intent text
   - if low confidence => ask the human to confirm
3. `repo_target`
   - if `repo_override` exists => use it
   - else if an `upstream` remote exists and the work is intended for shared or
     upstream history => use upstream
   - else use the current repository remote
   - if canonical target cannot be inferred confidently => ask the human to
     confirm before create
4. `platform_hint`
   - infer from the resolved target repo host and installed CLI
   - if the matching CLI is installed but not authenticated for that host =>
     stop and surface the auth gap
   - if both CLIs are installed but imply different hosts or platforms => ask
     the human to choose
5. `gate_mode`
   - read repository policy if present
   - fall back to `required`

## Auto Draft Rules

- If no `existing_issue_id`, auto-generate `issue_title` and `issue_body`.
- For new issue drafts, derive and apply the required title prefix before
  previewing or creating the issue.
- Draft source priority:
  1. current task prompt or context
  2. branch and commit intent
  3. changed-file scope and inferred module
- Before drafting, resolve three framing decisions:
  - `audience_profile`: default `cross_functional`; use `engineering_only`
    only when the operator clearly wants implementation-facing detail
  - `issue_level`: default `parent_requirement`; upgrade to `delivery_task` or
    `implementation_task` only when scope is execution-ready or the operator
    explicitly wants technical breakdown
  - `quality_bar`: default `master_grade`; optimize for decision quality,
    traceability, and execution clarity before optimizing for length
- Default auto-drafts must be decision-ready first: enough context to justify
  the work, enough scope to bound it, and enough acceptance detail to test it.
  Brevity is secondary unless the operator explicitly asks for compression.
- Draft must respect template-required fields by the resolved
  `template_family` and `issue_level`.
- Draft title must respect the Issue Title Prefix Rule. If an inferred or
  user-supplied new issue title lacks a valid prefix, rewrite it before
  dry-run output and state the rewrite. If the prefix cannot be resolved
  confidently, block creation and ask for confirmation.
- If any required field cannot be inferred:
  - insert an explicit TODO placeholder
  - keep `confirm_before_create=on` and require human confirmation
- If the generated draft reads like a design doc, implementation plan, or
  speculative architecture proposal, rewrite it before presentation.

## Master-Grade Issue Standard

A master-grade issue is not defined by length. It is defined by decision
quality. The draft should be:

- clear on `why now`, not just `what to build`
- scoped so readers know what is in and out
- audience-correct: leadership and cross-functional issues explain problem,
  outcome, scope, and success; engineering-only issues may add deeper
  execution detail
- traceable to adjacent work, risks, or dependencies when they materially
  affect planning
- testable through acceptance criteria that another person could use to judge
  completion
- solution-aware but not solution-locked unless implementation detail is
  already approved and necessary

## Issue Layering Rule

- Default parent issues to product-, outcome-, and scope-oriented framing.
- A `parent_requirement` should be readable by PM, product, and cross-functional
  stakeholders without requiring knowledge of the internal codebase.
- Parent issues should focus on:
  - background or problem
  - target outcome
  - scope boundary
  - external contract or user impact
  - acceptance criteria
  - risks or dependencies
- Parent issues should not default to:
  - code snippets
  - file paths
  - class, function, or method names
  - internal module splits
  - planner, repo, service, Cypher, schema, table, or similar
    implementation-facing nouns
- The only technical detail that may remain in a parent issue by default is
  external contract information that stakeholders need to reason about, such as
  a user-facing API contract, compatibility note, or externally visible input /
  output behavior.
- If the draft needs detailed implementation paths, migration sequencing,
  architecture comparisons, or component-by-component responsibilities, keep
  the parent issue lean and split those details into a linked engineering child
  issue, `delivery_task`, or `implementation_task`.

## Child Issue Decision Rule

- Default `child_issue_needed=no`.
- Set `child_issue_needed=yes` when the parent issue would otherwise need:
  - implementation paths or migration sequencing
  - architecture comparisons or option tradeoff analysis
  - module-by-module responsibilities
  - engineering-only validation or rollout steps
  - internal nouns such as planner, repo, service, Cypher, schema, table,
    worker, class, file, or function to preserve actionable meaning
- If the engineering detail is execution-ready but still one level above code,
  use `child_issue_type=delivery_task`.
- If the engineering detail requires implementation-facing structure such as
  internal contracts, dataflow, module breakdown, migration steps, or approved
  design details, use `child_issue_type=implementation_task`.
- If parent-issue overspecification can be fixed by rewriting without losing
  necessary execution detail, keep `child_issue_needed=no`.
- If rewriting would hide necessary engineering work, keep the parent issue
  product-facing and auto-draft a linked child issue.
- When `child_issue_needed=yes`, the dry-run output must include both parent and
  child drafts before any create action.

## Framing Guardrails

- `parent_requirement`: explain why the work matters, what outcome is expected,
  what is in or out of scope, how success is judged, and what external contract
  or user impact matters.
- `parent_requirement`: do not include code blocks, file paths, function names,
  class names, internal dataflow, or module-by-module implementation plans
  unless that information is itself part of an approved external contract.
- `delivery_task`: may mention affected modules or contracts, but should still
  optimize for shared understanding over internal implementation detail.
- `implementation_task`: technical detail is allowed only when the operator
  explicitly asks for an engineering-facing issue or when a design has already
  been approved.
- For leadership, PM, frontend, or mixed-audience issues, prefer
  business/problem language over internal architecture nouns.
- Do not lock parent issues to speculative classes, files, routes, tables,
  workers, or module splits unless those details are already approved and
  necessary for disambiguation.
- When tightening a draft, remove repetition before removing decision-critical
  context; never trade away problem clarity, scope clarity, or acceptance
  clarity just to save lines.

## Issue Template Resolution

Resolve `template_family` from `change_type` and intent:

- `bugfix|hotfix|incident` => Bug / Incident Template
- `feat|integration|workflow|api` => Feature / Change Template
- `chore|docs|refactor|test|tooling|config` => Task / Maintenance Template
- `spike|research|proposal|investigation` => Investigation / Spike Template

If `change_type` is ambiguous:

- use Bug / Incident when the primary goal is to restore expected behavior
- use Feature / Change when the primary goal is to add or change capability or
  contract
- use Task / Maintenance when the work is mainly docs, cleanup, tests,
  tooling, or internal maintenance
- use Investigation / Spike when the main output is knowledge, decision
  support, or a proposal rather than shipped behavior

Read `references/issue-templates.md` when you need:

- the full template bodies
- template-specific required and recommended fields
- template validation notes
- standard create payload shapes for `gh` or `glab`

## Template Validation Rule

- Resolve `template_family` and `issue_level` first.
- Validate semantic required fields against the selected template family, not a
  single fixed heading set.
- Validate new issue titles against the Issue Title Prefix Rule.
- Validate issue quality as well as field presence: clear problem statement,
  explicit target outcome, bounded scope, testable acceptance, and
  audience-appropriate detail.
- If template-required fields are missing:
  - `gate_mode=required` => `BLOCK`
  - `gate_mode=recommended` => `PASS_WITH_WARNING`
- If a create-ready draft is missing a valid title prefix or has a conflicting
  title prefix:
  - rewrite the title before dry-run output when the correct prefix is clear
  - `gate_mode=required` => `BLOCK` when the correct prefix is not clear
  - `gate_mode=recommended` => `PASS_WITH_WARNING` when the correct prefix is
    not clear
- Validation output must include:
  - `template_family`
  - `issue_level`
  - `title_prefix`
  - `title_prefix_source`
  - `title_prefix_warnings`
  - `child_issue_needed`
  - `child_issue_type`
  - `missing_required_fields`
  - `missing_recommended_fields`
  - `overspecification_warnings`
- For `parent_requirement`, if the body contains code snippets, file paths,
  class names, function names, implementation-phase jargon, or architecture
  comparisons that are not required to explain an external contract, emit an
  `overspecification_warning` and rewrite or split before presentation.
- If a parent issue still needs engineering detail after rewrite, require
  `child_issue_needed=yes` and draft a linked child issue instead of keeping
  that detail in the parent body.
- For backend-, AI-, workflow-, or integration-heavy feature work, missing
  `技术约束` or `验证方式` should emit an explicit warning.
- For investigation work, missing a concrete `预期产出` or
  `退出条件 / 范围边界` must be treated as a required-field failure.
- If a `parent_requirement` draft contains speculative classes, files, routes,
  tables, workers, or unapproved architecture splits, emit an
  `overspecification_warning` and rewrite before presentation.

## The Operating Loop

1. Determine operating point:
   - recommended default for `feat|bugfix|hotfix|non-trivial refactor`: run
     once before implementation to confirm or create the issue
   - mandatory final pass: run again before commit preparation to verify
     traceability and emit `refs_line`
   - small `docs|chore|test` work and approved spikes may skip the early pass
     only when repository policy allows it
2. Validate required inputs and gate mode.
3. Auto-infer:
   - `repo_root`
   - `change_type`
   - `template_family`
   - `repo_target`
   - `platform_hint`
   - `gate_mode`
   - `audience_profile`
   - `issue_level`
4. Resolve target repo and platform:
   - determine `target_repo` from `repo_override`, `origin`, `upstream`, and
     canonical-intent rules
   - choose the CLI that matches the resolved repo host and verify auth and
     availability
5. Resolve issue target:
   - prefer the canonical repository issue when the work is intended for
     upstream or shared history
   - prefer reusing the existing task issue when the current commit belongs to
     an already tracked task
   - verify `existing_issue_id`, or search the resolved target repo and prepare
     a new draft from context only when no matching issue exists
6. Draft or verify issue content:
   - ensure new issue titles use the required `<prefix>: <short title>` format
   - ensure the draft explains why now, what outcome is expected, what is in or
     out of scope, how success is judged, and whether any material dependency
     or risk must be named
   - strip unapproved implementation details from parent issues unless the
     operator explicitly wants an implementation-facing task
   - if detailed engineering reasoning is needed, keep the parent issue
     product-facing and draft a linked child issue for execution details
   - ensure the draft still covers required fields for the selected template
     family
7. Derive layering decision:
   - determine `child_issue_needed`
   - if needed, choose `child_issue_type` as `delivery_task` or
     `implementation_task`
   - draft the child issue with the engineering child issue template
   - keep the parent issue free of implementation-heavy detail
   - if `plan_task_handoff` exists, derive and emit `Plan Task Issue Mapping`
     before finalizing `child_issue_needed`
   - if the mapping contains any `child_issue` or `grouped_child_issue`, set
     `child_issue_needed=yes` and draft the mapped child issue set unless the
     operator explicitly requests parent-only tracking
8. Emit dry-run plan:
   - exact check/create/link command plan
   - expected artifacts (`issue_id`, `issue_url`, `refs_line`)
   - parent draft preview (`title` and `body`)
   - plan task issue mapping when `plan_task_handoff` exists
   - child draft preview when `child_issue_needed=yes`
   - parent/child creation order and link plan
9. Wait for human confirmation.
10. Execute selected actions:
   - `check` issue
   - `create parent` only when missing
   - `create child` only when needed and confirmed
   - add parent/child cross-reference when both are created
   - `link` by generating the commit `Refs` line
11. Emit gate result:
   - `required` + failure => `BLOCK`
   - `recommended` + failure => `PASS_WITH_WARNING`

## Decision Points

- If meaningful tracked work lacks a canonical issue and repository policy
  requires issue tracking, draft or create the issue before implementation or
  block commit preparation.
- If the current repo is a fork but the work is intended for upstream or shared
  history, target the canonical upstream repository unless fork-local tracking
  is explicitly correct.
- If an existing issue matches the task purpose, reuse it even when its title
  lacks the preferred prefix; emit `title_prefix_warning` instead of creating a
  duplicate.
- If no issue exists, resolve `change_type` and apply the required
  `<prefix>: <short title>` rule before dry-run preview or creation.
- If an approved `workflow-plan` task list is supplied, emit `Plan Task Issue
  Mapping` before deciding parent-only versus child issues.
- If plan tasks are independently reviewable, assignable, and verifiable,
  prefer child or grouped child issues; if they are preparatory or inseparable,
  map them to `parent_only` with a concrete rationale.
- If a parent issue needs implementation paths, migration sequencing, internal
  module detail, or engineering-only validation to stay actionable, keep the
  parent product-facing and draft linked child issue details.
- If target repository, platform, CLI auth, title prefix, or required template
  fields cannot be resolved safely, return `BLOCK` for required gates or
  `PASS_WITH_WARNING` for recommended gates.
- If the operation is only a final commit bridge check, verify the issue and
  emit `refs_line`; do not modify the commit message directly.

## Failure and Recovery

- If CLI is missing:
  - `required` => `BLOCK` with manual fallback steps
  - `recommended` => `PASS_WITH_WARNING`
- If repo target cannot be resolved deterministically:
  - `required` => `BLOCK` with `repo_override` or canonical repo confirmation
  - `recommended` => `PASS_WITH_WARNING`
- If child-issue layering is clearly needed but the parent/child split cannot
  be described coherently:
  - `required` => `BLOCK`
  - `recommended` => `PASS_WITH_WARNING`
- If the selected CLI lacks auth for the resolved target repo host:
  - surface the failing auth check and the exact command needed to recover
- If create fails:
  - surface the first failing command and a retry suggestion
- Never hide partial failure; always return explicit state

Read `references/required-gitlab-flow-example.md` when you need a concrete
happy-path example of the full required flow.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The commit is small, so it can skip issue tracking." | Repository policy decides the gate. Meaningful tracked work still needs a canonical issue or an explicit allowed fallback. |
| "The fork is where I am committing, so the issue belongs in the fork." | Commits may happen in a fork, but issue purpose usually belongs in the canonical upstream repo for shared work. |
| "One issue per commit is safer." | The default traceability unit is the task or delivery slice; one issue may cover many related commits. |
| "A parent issue can hold all the engineering detail." | Parent requirements should stay outcome- and acceptance-oriented; execution detail belongs in child issues when needed. |
| "Workflow-plan tasks map directly to issues." | Plan tasks are source material. Group or split by independently reviewable, assignable, and verifiable delivery slices. |
| "An existing issue without a prefix is invalid." | Reuse matching existing issues and emit a title-prefix warning; prefix enforcement applies to new drafts. |
| "The issue link means this commit resolves the issue." | Default linkage is a reference bridge, not closure semantics. |

## Red Flags

- A new issue title lacks `<prefix>: <short title>` and no repository override
  is documented.
- `Plan Task Issue Mapping` is missing when `workflow-plan` tasks were
  supplied.
- A multi-task plan is parent-only without concrete per-task rationale.
- A fork-local issue is created while an upstream canonical issue target is
  available and intended.
- Parent issue drafts include code snippets, file paths, speculative classes,
  internal dataflow, or module-by-module implementation plans without an
  approved external-contract reason.
- `refs_line` is invented without verifying or creating the referenced issue.
- Issue references that should be clickable are wrapped in backticks.
- A commit bridge uses closing semantics when the work only partially advances
  the issue.
- CLI availability is treated as platform proof without matching the resolved
  repository host.

## Verification

- [ ] `repo_root`, `change_type`, `template_family`, `repo_target`,
      `platform_hint`, and `gate_mode` are inferred or explicitly supplied.
- [ ] Target repo resolution states current repo, upstream repo, or explicit
      override.
- [ ] Platform and CLI readiness match the resolved target repo host.
- [ ] Existing canonical issues are searched or verified before creating a
      duplicate.
- [ ] New issue drafts apply the Issue Title Prefix Rule or block for prefix
      confirmation.
- [ ] Template validation reports family, issue level, title prefix, missing
      fields, child issue decision, and overspecification warnings.
- [ ] `Plan Task Issue Mapping` is emitted whenever plan tasks are supplied.
- [ ] Parent and child issue drafts are shown in dry-run output before any
      create action.
- [ ] Commit bridge emits a verified `refs_line` and does not modify commit
      message content directly.
- [ ] Gate result is `PASS`, `PASS_WITH_WARNING`, or `BLOCK` with an explicit
      reason.

## Output Format

```text
## Gate Result
- gate_mode:
- result: PASS | PASS_WITH_WARNING | BLOCK
- reason:

## Layering Decision
- parent_issue_level: parent_requirement | delivery_task | implementation_task
- child_issue_needed: yes | no
- child_issue_type: delivery_task | implementation_task | n/a
- child_issue_reason:
- parent_rewrite_applied: yes | no

## Platform
- selected: gh | glab
- cli_ready:
- target_repo:
- search_scope: current_repo | upstream_repo | explicit_override

## Issue Action
- action: reuse | create | failed
- repo_target: canonical | fork | explicit_override
- issue_id:
- issue_url:
- title_source: user_input | auto_draft
- title_prefix:
- title_prefix_source: change_type | repo_policy | user_input | n/a
- title_prefix_warnings:

## Parent Issue Draft
- title:
- draft_preview:

## Child Issue Draft
- title:
- draft_preview:
- link_to_parent:

## Plan Task Issue Mapping
- task:
- decision: parent_only | child_issue | grouped_child_issue
- issue_level: parent_requirement | delivery_task | implementation_task | n/a
- grouping_key:
- acceptance_source:
- rationale:
- child_issue_title:

## Draft Decision
- audience_profile:
- issue_level: parent_requirement | delivery_task | implementation_task
- quality_pass: yes | no

## Execution Plan
- create_parent: yes | no
- create_child: yes | no
- create_policy: parent-first-child-second-confirmed
- link_method: body_reference | comment_reference

## Commit Bridge
- refs_line: ISSUE: #<id>
- next_for_commit_skill:

## Execution Trace
- dry_run_plan:
- executed_commands:
- timestamp:
```

## Guardrails

- Never print tokens or secrets.
- Never auto-close issues.
- Never skip dry-run confirmation by default.
- Keep automation reversible and auditable.
- Do not modify the commit message directly; only provide `refs_line`.
- Do not ask for inputs that can be inferred reliably.
- Do not treat retroactive issue creation after implementation as the standard
  path for meaningful tracked work.
- Do not force one new issue per commit when multiple commits belong to the
  same tracked task.
- Do not default to creating the task issue in a fork when the work is meant
  for the canonical upstream repository.
- Do not choose `gh` or `glab` purely because the binary exists; match the CLI
  to the resolved repository host.
- Do not search only the fork when an upstream or other canonical repository is
  the more likely source of truth.
- Do not silently create a child issue without showing the draft and creation
  plan in dry-run output first.
- Do not receive a `workflow-plan` task list and skip `Plan Task Issue Mapping`.
- Do not mark a multi-task plan `child_issue_needed=no` unless every task is
  explicitly mapped to `parent_only` with a concrete rationale.
- Do not leave required engineering detail stranded in the parent issue body if
  a child issue is the clearer execution layer.
- Do not wrap issue references in backticks when the output is meant to keep
  clickable issue links.
- Do not treat issue linkage as issue resolution by default.
- Default to master-grade standard drafts.
- Do not turn a parent requirement issue into a design doc or implementation
  plan.
- Do not default parent issues to code, file, class, function, planner, repo,
  service, Cypher, schema, or other internal implementation vocabulary.
- Do not name speculative classes, files, routes, tables, workers, or
  architecture splits in leadership- or cross-functional-facing issues.
- If the operator says a draft is too long, too technical, or too shallow,
  rewrite it to better fit the requested audience and quality bar before asking
  for confirmation.
