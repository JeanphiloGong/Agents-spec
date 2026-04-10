# Bootstrap System Overview

Use this reference when the system node lacks a usable overview page.

## Inspect First

Scan:
- top-level packages or services
- major ownership seams
- routing or API entrypoints
- background jobs or workers
- shared storage or external dependency surfaces
- existing docs that already describe subsystems

## Extract

Derive:
- system purpose and boundary
- major modules
- core flows
- major external interfaces
- links to module or submodule docs when they already exist

## Output Shape

A good system overview bootstrap usually proposes:
- one root overview landing page
- one module map page or section
- one core flows page or section
- links into node-local current-state or plan docs

## Unknowns

If inspection is incomplete, mark the unknown explicitly. Do not invent a
clean system shape that the repository does not actually show.
