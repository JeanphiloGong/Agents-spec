# Companion Update Rules

Use this reference after selecting the primary artifact.

## Single-Doc Only Is Allowed When

- the change is local
- it does not alter system understanding
- it does not create a durable decision
- it does not create a stable boundary
- it does not change recurring developer or operational workflows

## Companion Updates Are Required When

At least one of these is true:
- module or service boundaries changed
- a core flow changed
- implemented behavior changed current system understanding
- a durable design decision was made
- a stable contract or schema changed
- developer workflow changed
- operator recovery or troubleshooting changed
- discoverability would suffer without index or entry page updates

## Companion Update Targets

- `architecture/current-state`
- `adr`
- `contract/spec`
- `guide`
- `runbook`
- root or section indexes
