---
name: issue-gate-skill
description: v0.1.15 - Check, create, and link GitHub or GitLab issues for tracked work before implementation and before commit preparation; use when a repo requires issue-backed traceability, canonical upstream issue confirmation, fork-vs-upstream issue targeting, or commit Refs output.
---

# Issue Gate Skill

## Trigger and Scope

Use this skill when a repository expects meaningful work to be traceable to an
issue and the agent needs to:

- confirm whether the canonical issue already exists
- draft and create the issue when missing
- emit a deterministic commit `Refs` bridge before commit preparation

Preferred timing:

- early pass: before implementation starts for meaningful tracked work
- final pass: before commit preparation as the last traceability check

In scope:
- issue existence check
- issue draft generation
- issue creation after dry-run and human confirmation
- issue link output for commit `Refs`

Out of scope:
- auto-closing issues
- PR creation or merge workflows
- release notes generation
- replacing code review, project planning, or release management

## Core Purpose

- Ensure every meaningful change is traceable to an issue.
- Prefer issue creation close to planning and scope definition, not as a default
  post-implementation repair step.
- Use task-level traceability by default: one issue may cover multiple related
  commits for the same tracked work.
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
- `audience_profile=cross_functional`
- `issue_level=parent_requirement`
- `quality_bar=master_grade`
- `implementation_detail_mode=defer-unless-explicitly-requested`

## Traceability Granularity

- Each meaningful tracked commit should point to an issue-backed purpose when
  repository policy requires issue tracking.
- The default unit of intent is the task or requirement, not the individual
  commit.
- One issue may cover multiple related commits when they belong to the same
  task, fix, or delivery slice.
- Do not create a new issue per commit unless repository-specific policy
  explicitly requires that behavior.

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
- Default to a reference bridge such as `ISSUE: #123` or equivalent `Refs`
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

## Framing Guardrails

- `parent_requirement`: explain why the work matters, what outcome is expected,
  what is in or out of scope, and how success is judged.
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
- Validate issue quality as well as field presence: clear problem statement,
  explicit target outcome, bounded scope, testable acceptance, and
  audience-appropriate detail.
- If template-required fields are missing:
  - `gate_mode=required` => `BLOCK`
  - `gate_mode=recommended` => `PASS_WITH_WARNING`
- Validation output must include:
  - `template_family`
  - `issue_level`
  - `missing_required_fields`
  - `missing_recommended_fields`
  - `overspecification_warnings`
- For backend-, AI-, workflow-, or integration-heavy feature work, missing
  `技术约束` or `验证方式` should emit an explicit warning.
- For investigation work, missing a concrete `预期产出` or
  `退出条件 / 范围边界` must be treated as a required-field failure.
- If a `parent_requirement` draft contains speculative classes, files, routes,
  tables, workers, or unapproved architecture splits, emit an
  `overspecification_warning` and rewrite before presentation.

## Workflow

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
   - ensure the draft explains why now, what outcome is expected, what is in or
     out of scope, how success is judged, and whether any material dependency
     or risk must be named
   - strip unapproved implementation details from parent issues unless the
     operator explicitly wants an implementation-facing task
   - ensure the draft still covers required fields for the selected template
     family
7. Emit dry-run plan:
   - exact check/create/link command plan
   - expected artifacts (`issue_id`, `issue_url`, `refs_line`)
   - drafted issue preview (`title` and `body`)
8. Wait for human confirmation.
9. Execute selected actions:
   - `check` issue
   - `create` only when missing
   - `link` by generating the commit `Refs` line
10. Emit gate result:
   - `required` + failure => `BLOCK`
   - `recommended` + failure => `PASS_WITH_WARNING`

## Output Contract

```text
## Gate Result
- gate_mode:
- result: PASS | PASS_WITH_WARNING | BLOCK
- reason:

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

## Draft Decision
- audience_profile:
- issue_level: parent_requirement | delivery_task | implementation_task
- quality_pass: yes | no

## Commit Bridge
- refs_line: ISSUE: #<id>
- next_for_commit_skill:

## Execution Trace
- dry_run_plan:
- draft_preview:
- executed_commands:
- timestamp:
```

## Failure and Recovery

- If CLI is missing:
  - `required` => `BLOCK` with manual fallback steps
  - `recommended` => `PASS_WITH_WARNING`
- If repo target cannot be resolved deterministically:
  - `required` => `BLOCK` with `repo_override` or canonical repo confirmation
  - `recommended` => `PASS_WITH_WARNING`
- If the selected CLI lacks auth for the resolved target repo host:
  - surface the failing auth check and the exact command needed to recover
- If create fails:
  - surface the first failing command and a retry suggestion
- Never hide partial failure; always return explicit state

Read `references/required-gitlab-flow-example.md` when you need a concrete
happy-path example of the full required flow.

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
- Do not treat issue linkage as issue resolution by default.
- Default to master-grade standard drafts.
- Do not turn a parent requirement issue into a design doc or implementation
  plan.
- Do not name speculative classes, files, routes, tables, workers, or
  architecture splits in leadership- or cross-functional-facing issues.
- If the operator says a draft is too long, too technical, or too shallow,
  rewrite it to better fit the requested audience and quality bar before asking
  for confirmation.
