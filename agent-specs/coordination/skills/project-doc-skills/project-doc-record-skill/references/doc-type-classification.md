# Document Type Classification

Use this reference when classifying one concrete piece of content into the
right formal document type.

## Quick Mapping

- proposed change or design => `rfc`
- durable decision and rationale => `adr`
- current real implementation design => `architecture`
- stable contract or schema => `spec`
- human-facing how-to => `guide`
- operational procedure => `runbook`
- failure analysis => `postmortem`
- project-level rule => `policy`

## Tie-Break Rules

- If the document says what should be built, prefer `rfc`.
- If it says why a key decision was made, prefer `adr`.
- If it says how the system works now, prefer `architecture`.
- If other code or teams depend on it as a contract, prefer `spec`.

If two types seem valid, choose the document’s primary job and keep any
secondary concern brief.
