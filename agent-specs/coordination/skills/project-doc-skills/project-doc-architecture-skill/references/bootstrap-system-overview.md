# Bootstrap System Overview

Use this reference when the repository lacks a usable top-level overview and
the skill must derive one from inspection.

## Inspect First

Scan:
- top-level packages or services
- routing or API entrypoints
- background jobs or workers
- major storage or external dependency surfaces
- existing docs that already describe subsystems

## Extract

Derive:
- system boundary
- major modules or services
- core data or control flows
- obvious external interfaces
- operational surfaces worth mentioning

## Output Shape

A good overview bootstrap usually proposes:
- one overview landing page
- one module map page
- one core flows page
- links to deeper current-state pages

## Unknowns

If inspection is incomplete, mark the unknown explicitly. Do not invent a
clean architecture that the repository does not actually show.
