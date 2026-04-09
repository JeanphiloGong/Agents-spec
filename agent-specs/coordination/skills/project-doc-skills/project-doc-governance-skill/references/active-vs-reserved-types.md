# Active vs Reserved Types

Use this reference when deciding which doc types should be used regularly and
which should stay available but dormant.

## Definitions

- `active type`: a doc type the repo expects to write and maintain regularly
- `reserved type`: a doc type the repo supports only when a specific threshold
  is met

## Default Active Types

- `rfc`
- `architecture`
- `guide`
- `policy`

These are the most broadly useful for repositories that need proposal,
current-state, developer guidance, and governance layers.

## Default Reserved Types

- `adr`
- `spec`
- `runbook`
- `postmortem`

These stay available but should not be activated just to make the taxonomy look
complete.

## Activation Rules

Activate a reserved type only when its role is recurring and distinct:

- `adr`
  - durable decisions are repeatedly referenced later
- `spec`
  - a stable boundary has downstream consumers
- `runbook`
  - operator recovery or incident handling is a real workflow
- `postmortem`
  - incident analysis is a repeated operational need

## Failure Modes

- More active types than actual usage justifies
- Empty directories pretending to be a mature docs system
- Using `spec` or `adr` as prestige labels instead of clear roles
