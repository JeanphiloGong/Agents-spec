# Multi-Agent Protocol (Fast)

Main pattern:
- one main agent owns final plan
- reviewer agents provide scoped checks

## Mode Resolution

- `agent_mode=single`: main agent only
- `agent_mode=multi`: main agent + reviewers
- `agent_mode=auto`: switch to multi when any trigger is true

Auto triggers:
- changed files >= 15
- cross-layer change (domain + infra/frontend/data)
- any blocking gate triggered (`Security|Data|Contract|Reliability`)

## Reviewer Scopes

- security/auth
- data/migration
- contract/api
- infra/runtime
- testing/rollback

Assign only scopes touched by the diff.

## Reviewer Output (Minimal)

Each reviewer returns:
- `scope`
- `findings` (critical|high|medium|low)
- `suggested_fix`
- `verification`

## Main Agent Merge Rule

- merge reviewer findings into phase gates
- unresolved `critical` => `Decision=BLOCK`
- keep final output in the same fast template
