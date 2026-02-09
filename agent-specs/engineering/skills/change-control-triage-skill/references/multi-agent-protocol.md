# Multi-Agent Protocol (Fast One-Wave)

Main pattern:
- one main agent owns final output
- reviewer agents provide scoped checks for current wave only

## Mode Resolution

- default: `agent_mode=multi`
- `agent_mode=multi`: main agent + reviewers
- `agent_mode=single`: explicit fallback for trivial waves only
- `agent_mode=auto`: compatibility alias; treat as multi unless trivial criteria all pass

Trivial fallback criteria (all must pass):
- changed files <= 5
- single-layer change in current wave
- no blocking gate triggered
- no unresolved Human-Owned decision items

## Reviewer Scopes

- security/auth
- data/migration
- contract/api
- infra/runtime
- testing/rollback

Assign only scopes touched by current wave.

## Reviewer Output (Minimal)

Each reviewer returns:
- `scope`
- `findings` (critical|high|medium|low)
- `suggested_fix`
- `verification`

## Main Agent Merge Rule

- merge reviewer findings into current-wave gates
- unresolved `critical` => `Decision=BLOCK`
- keep final output in the same one-wave template
