# Front Matter and Lifecycle

Use this reference when defining the metadata contract and lifecycle for
formal project documents.

## Default Front Matter

```yaml
---
id: RFC-2026-001
title: Example Title
type: rfc
level: module
domain: backend
system: example-system
module: example-module
status: draft
owner: backend-team
reviewers: [alice, bob]
created_at: 2026-04-07
updated_at: 2026-04-07
last_verified_at: 2026-04-07
review_by: 2026-07-07
version: v1
source_of_truth: true
related_issues: [#18]
related_docs: []
supersedes: []
superseded_by: []
tags: [example]
---
```

## Required Fields

- `id`
- `title`
- `type`
- `level`
- `domain`
- `status`
- `owner`
- `created_at`
- `updated_at`

## Strongly Recommended Fields

- `last_verified_at`
- `review_by`
- `version`
- `source_of_truth`
- `related_issues`

## Field Meanings

- `id`: stable identifier within the chosen project rule set
- `type`: document family such as `rfc` or `spec`
- `level`: system, domain, module, or component scope
- `domain`: frontend, backend, ai, data, shared, or another approved domain
- `status`: lifecycle state
- `owner`: accountable maintainer
- `last_verified_at`: latest date someone checked that the document still
  matches reality
- `review_by`: next planned verification checkpoint
- `source_of_truth`: whether this document is authoritative for its scope

## Lifecycle States

- `draft`: not yet ready for review
- `review`: under active review
- `accepted`: approved proposal or standard
- `implemented`: implemented according to the document, often used for RFCs
- `active`: current live architecture, spec, guide, or runbook
- `deprecated`: still present but not recommended for new use
- `superseded`: replaced by a newer document
- `archived`: retained for history only

## Recommended State Usage

### RFC
- `draft -> review -> accepted -> implemented`
- If replaced before implementation: `draft|review|accepted -> superseded`

### ADR
- Usually stays `active` after acceptance
- If replaced: `active -> superseded`

### Architecture / Spec / Guide / Runbook
- `active -> deprecated -> superseded -> archived`

## Replacement Rule

When a document is replaced:

1. Do not delete it by default.
2. Set `status: superseded`.
3. Fill `superseded_by`.
4. Update the replacing document’s `supersedes`.

## Review Cadence Rule

Set `review_by` based on change risk:

- fast-moving modules: 1 to 3 months
- normal engineering docs: 3 to 6 months
- slow-moving policy or ADR docs: 6 to 12 months

If no one can realistically honor the review date, reduce the number of formal
documents rather than pretending the cadence will be followed.
