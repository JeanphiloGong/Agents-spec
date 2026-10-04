---
name: ai-reference-workspace-skill
description: v0.1.0 - Build one runnable AI code reference in an isolated disposable workspace while keeping production repositories outside the writable and visible filesystem boundary. Use when the human wants a spec-only implementation example, a repository-aware snapshot experiment, or an alternative solution to inspect without allowing automatic production edits, merges, or copy-back.
---

# AI Reference Workspace

## Overview

Create one disposable workspace where a child Codex process may build and test
a reference implementation without touching the production repository. The
result is evidence for human reasoning, not a production patch, merge target,
or source of truth.

Default to `spec-only`: give the reference agent only the task contract,
interfaces, and data model selected by the human. Use `snapshot` only when the
task genuinely depends on repository conventions or integration context. A
snapshot contains the selected committed revision, never local uncommitted
changes.

The runner uses two isolation layers:

- Bubblewrap exposes the disposable workspace but does not mount the production
  repository.
- Nested Codex runs with `--sandbox workspace-write` and no additional writable
  directory.
- A read-only shell wrapper removes model credentials and proxy variables
  before any Agent-generated command or project test starts.

The workflow ends after the human receives the workspace path, local diff,
checks, assumptions, and known gaps. It never lands code automatically.

## When to Use

- The human wants code to study, compare, or reimplement manually.
- Core modeling or an algorithm needs a runnable `spec-only` reference.
- A bug fix, CRUD path, adapter, or repository-specific alternative needs a
  realistic but disposable `snapshot` experiment.
- The human does not want the current Agent session to modify production code.
- An AI implementation should be treated as reference material before any
  human-owned landing decision.

**When NOT to use:** direct production implementation, unattended merge or PR
creation, copying an AI patch into `main`, work that requires uncommitted source
state, or a tutorial whose main output is explanatory prose. Use
`reference-core-workflow` when the result should become a durable nano learning
asset. Use `human-led-main-landing-skill` only after the human explicitly asks
to translate accepted lessons into production work.

## Modes

| Mode | Agent Context | Use For | Default |
| --- | --- | --- | --- |
| `spec-only` | `REFERENCE_TASK.md` containing the selected requirements, interfaces, models, invariants, and acceptance checks | Core logic, state machines, algorithms, architecture experiments | Yes |
| `snapshot` | A `git archive` export of one explicit commit plus `REFERENCE_TASK.md` | Repository-aware examples, integration-shaped experiments, existing project patterns | Explicit opt-in |

`spec-only` means the production repository is not copied or mounted into the
child process. `snapshot` exposes a committed copy inside the disposable
workspace, while the original repository remains outside the child filesystem.

## Required Inputs

- One reference question or behavior to explore.
- A task contract based on `assets/reference-task-template.md`.
- Mode: default `spec-only`; explicit `snapshot` when repository context is
  necessary.
- An external workspace path that does not live inside a production repository.
- For `snapshot`: source repository and base commit or ref.

Do not place secrets, credentials, production data, PII, `.env` contents, or
private keys in the task contract.

## The Operating Loop

### 1. Define The Reference Question

- State one behavior or design question.
- Record the expected observable result and checks.
- Name decisions the reference agent may explore and decisions it must not
  make.
- Verify: the task is small enough to inspect as one reference artifact.

### 2. Choose The Least-Context Mode

- Choose `spec-only` when interfaces, models, invariants, and acceptance checks
  are sufficient.
- Choose `snapshot` only when existing imports, framework conventions, or
  integration boundaries materially determine the example.
- Verify: `snapshot` was explicitly selected rather than used for convenience.

### 3. Prepare The Task Contract Outside Production

- Copy `assets/reference-task-template.md` to a temporary or state directory
  outside the production repository and fill only the relevant sections.
- In `spec-only`, include the smallest necessary interface and data-model
  definitions directly in the contract. Do not include production paths.
- In `snapshot`, refer only to files that will exist in the committed snapshot.
- Verify: the contract contains no secrets, PII, environment files, or hidden
  request to modify production.

### 4. Create The Disposable Workspace

Resolve this skill's directory and run its creation script by absolute path.

For the default mode:

```bash
bash <skill-dir>/scripts/create_reference_workspace.sh \
  spec-only <external-workspace-path> <task-file>
```

For explicit repository context:

```bash
bash <skill-dir>/scripts/create_reference_workspace.sh \
  snapshot <external-workspace-path> <task-file> <source-repo> <base-ref>
```

The script refuses an existing destination and refuses a snapshot workspace
inside the current or source repository. It initializes an independent local
Git baseline with no remote so the human can inspect the generated diff.

Verify:

- `spec-only` contains no exported source files.
- `snapshot` contains committed content from exactly `base-ref`.
- uncommitted and untracked source files are absent from `snapshot`.
- source Git state is unchanged after creation.

### 5. Run The Reference Agent

```bash
bash <skill-dir>/scripts/run_reference_agent.sh <external-workspace-path>
```

The runner requires `bwrap`, `git`, and an authenticated Codex CLI. It clears
the child environment, mounts only system runtime paths, the Codex installation
and authentication needed by the CLI, and the disposable workspace. Codex can
authenticate, but its shell commands receive only a non-sensitive environment
whitelist, pass through the credential-stripping shell wrapper, and have
network access disabled. The runner then starts Codex with:

```text
--ephemeral --ignore-user-config --sandbox workspace-write -C /workspace
```

Do not replace this with `danger-full-access`, `--add-dir`, a direct Agent run
in the production repository, or an unsandboxed fallback.

### 6. Inspect The Artifact

Read, do not automatically apply:

- `REFERENCE_REPORT.md`
- `git -C <workspace> status --short`
- `git -C <workspace> diff --stat`
- `git -C <workspace> diff`
- the reported test or run commands

Ask the human to judge the model, invariant, failure paths, complexity, and
which ideas are worth reimplementing. Passing tests inside the reference
workspace do not prove production integration.

### 7. Verify The Boundary And Stop

- Confirm the runner reported the same source state before and after a
  `snapshot` run.
- Confirm the production repository has no new branch, commit, remote, staged
  file, or working-tree modification from this workflow.
- Report the retained workspace path and a cleanup command, but do not delete
  the workspace automatically.
- Stop. Do not merge, cherry-pick, apply a patch, or copy files back.

## Decision Points

- If repository context is merely convenient, remain in `spec-only`.
- If the task cannot be expressed without broad source access, shrink the
  question or ask the human to approve `snapshot`.
- If the required behavior exists only in uncommitted changes, stop. Ask the
  human to commit a safe checkpoint or provide a spec-only contract; never copy
  dirty files automatically.
- If the snapshot contains submodule pointers, Git LFS pointers, or missing
  generated artifacts required by the task, report the gap and stop instead of
  broadening mounts.
- If `bwrap`, Codex authentication, or required local runtimes are unavailable,
  report the blocker. Do not weaken isolation.
- If the reference requires downloads or external services, stop and ask for a
  separately approved fixture or dependency-preparation step; do not enable
  network access inside Agent-generated commands.
- If the human later wants production work, start a separate
  `human-led-main-landing-skill` invocation. The reference workspace remains
  evidence, not a merge source.

## Fixed Defaults

- `mode=spec-only`
- `artifact_role=reference-only`
- `workspace_location=outside-production-repository`
- `source_revision=committed-ref-only`
- `child_session=ephemeral`
- `child_sandbox=workspace-write`
- `child_command_network=off`
- `automatic_landing=forbidden`
- `automatic_cleanup=off`
- `agent_mode=single`

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "A worktree is isolated enough." | A worktree separates normal Git changes but still shares repository metadata and does not hide the original filesystem path. |
| "The Agent only needs temporary write access to one source file." | Any production write violates the reference-only contract; reproduce the needed context in the disposable workspace. |
| "Copying the final file back is harmless." | Copy-back silently turns a reference artifact into production code without a human-owned derivation and landing step. |
| "The working tree changes are important, so include them in the snapshot." | Uncommitted state is precisely where ownership and provenance are weakest; commit it deliberately or use a spec-only contract. |
| "Tests passed in the snapshot, so the implementation is production-ready." | The snapshot omits live integration state and remains a disposable experiment. |
| "If Bubblewrap fails, run Codex directly." | Silent isolation downgrade defeats the purpose of the skill. Stop and report the missing prerequisite. |

## Red Flags

- The workspace path is inside the production repository.
- The task contract contains secrets, production data, or broad source dumps.
- `snapshot` was selected without an explicit repository-context reason.
- The child command uses `danger-full-access`, `--add-dir`, or no sandbox.
- The reference repository has a remote.
- The workflow creates a production branch, patch application, cherry-pick, or
  copy-back command.
- The report describes the artifact as ready to merge.
- Production Git state differs after the reference run.

## Verification

Before completing one reference run, confirm:

- [ ] The mode is explicit and `spec-only` was considered first.
- [ ] The task contract has one behavior, constraints, and executable checks.
- [ ] The disposable workspace is outside production repositories.
- [ ] The independent reference Git repository has no remote.
- [ ] `snapshot` contains only the selected committed revision.
- [ ] The child process ran inside Bubblewrap and Codex `workspace-write`.
- [ ] `REFERENCE_REPORT.md` exists and names checks, assumptions, failure paths,
      and known gaps.
- [ ] The human received the workspace diff and run instructions.
- [ ] Production Git state is unchanged.
- [ ] No merge, copy-back, commit to production, or automatic cleanup occurred.

Package verification:

```bash
bash <skill-dir>/scripts/test_ai_reference_workspace.sh
bash -n <skill-dir>/scripts/create_reference_workspace.sh
bash -n <skill-dir>/scripts/run_reference_agent.sh
bash -n <skill-dir>/scripts/reference_shell.sh
```

## Output Format

```text
## Reference Workspace
- mode:
- path:
- base_commit: <snapshot only>
- artifact_role: reference-only

## Reference Result
- approach:
- changed_files:
- checks:
- assumptions:
- failure_paths:
- known_gaps:

## Isolation Evidence
- source_state_unchanged:
- credentials_visible_to_agent_tools: no
- production_writes: none
- reference_remote: none
- automatic_landing: none

## Human Review
- inspect_first:
- decisions_to_make:
- cleanup_command:
```

## Guardrails

- Never write to, stage, commit, branch, merge, or configure the production
  repository during this workflow.
- Never expose local uncommitted changes through `snapshot`.
- Never put secrets, tokens, PII, `.env` contents, or production data in the
  workspace.
- Never remove the credential-stripping shell wrapper or pass authentication
  variables into Agent-generated commands.
- Never downgrade isolation silently.
- Never treat the AI output as authoritative or production-ready.
- Never invoke a landing workflow without a new explicit human request.
- Remove only an incomplete workspace created by the setup script itself;
  retain completed reference workspaces until the human requests cleanup.
