# Promote RFC Example Output

Use this example when the task is to promote an implemented RFC into the
repository's broader documentation system.

```text
## Recording Goal
- Promote RFC-002 after implementation.

## System Placement
- owning module/service: document_ingest service
- serves capability: document processing and graph-trigger entry
- affects core flow: ingest pipeline and graph entry flow
- lifecycle role: current-state + durable decision review

## Primary Artifact
- update architecture/current-state page for ingest pipeline

## Companion Updates
- current-state/manual: yes
- adr: maybe, if service-boundary decision is durable
- contract/spec: no
- guide: maybe, if local development or debugging changed
- runbook: no
- indexes: update architecture index and active RFC index

## Create or Update Decision
- update existing current-state page
- keep RFC as proposal record

## Front Matter Plan
- preserve existing architecture metadata pattern

## Doc Lineage Plan
- current-state page links back to RFC
- RFC links forward to current-state page
- ADR links both ways if extracted

## Index Update Plan
- add current-state page to architecture index

## Notes and Risks
- avoid duplicating proposal rationale inside the architecture page
```
