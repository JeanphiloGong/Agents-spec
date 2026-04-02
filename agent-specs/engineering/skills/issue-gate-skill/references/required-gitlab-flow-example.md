# Worked Example: Successful Required GitLab Flow

Use this example when:

- the repository is hosted on a self-managed GitLab instance
- `change_type=feat`
- `gate_mode=required`
- no matching open issue exists yet

This example is intentionally sanitized:

- use placeholder hosts such as `<gitlab-host>`
- use placeholder repositories such as `<group>/<repo>`
- do not include local filesystem paths, tokens, or user-specific identifiers

## 1. Auto-Inferred Inputs

The gate may infer:

- `repo_root`: current git root
- `change_type`: `feat` from branch naming such as `task/feat/<date>-<slug>`
- `platform_hint`: `glab`
- `gate_mode`: `required`

## 2. Dry-Run Plan

```bash
export GITLAB_HOST=<gitlab-host>
glab issue list -R <group>/<repo> --search "Cypher retriever" --per-page 20
glab issue create -R <group>/<repo> \
  --title "feat: 完成 Cypher retriever 首版实现" \
  --description "<auto-drafted feature template body>"
```

Expected dry-run outcome:

- no matching open issue is found
- a feature-template issue draft is ready for confirmation
- the future commit bridge will be `ISSUE: #<issue_number>`

## 3. Human Confirmation

Before create:

- show the drafted title and body
- wait for explicit human confirmation

## 4. Executed Result

Successful execution should look like:

```text
== CHECK EXISTING ==
No open issues match your search in <group>/<repo>

== CREATE ISSUE ==
<issue_url>
```

Where:

- `<issue_url>` is the created issue URL on `<gitlab-host>`
- `<issue_number>` is parsed from that created issue

## 5. Gate Output Bridge

Successful gate output should include:

```text
## Gate Result
- gate_mode: required
- result: PASS
- reason: existing open issue not found; new issue created successfully

## Platform
- selected: glab
- cli_ready: yes

## Issue Action
- action: create
- issue_id: <issue_number>
- issue_url: <issue_url>
- title_source: auto_draft

## Commit Bridge
- refs_line: ISSUE: #<issue_number>
- next_for_commit_skill: include this line under Refs
```

## 6. Why This Example Matters

This example demonstrates the intended happy path:

- infer first
- dry-run before create
- preserve human confirmation
- create only when missing
- emit a deterministic `Refs` bridge for commit tooling
