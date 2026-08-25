# HTML Report Deck Workflow

Use this package to turn evidence-backed analysis, comparison, diagnosis, or
implementation guidance into a professional, self-reading HTML presentation.
The default artifact is a fixed 1600 x 900 deck whose action titles carry the
argument and whose slides expose the supporting evidence.

## Skills

| Skill | Use when | Output |
| --- | --- | --- |
| [`html-report-plan`](html-report-plan/SKILL.md) | Define the reader decision, logic spine, claims, evidence, and action-title sequence. | v0.2 report-deck plan |
| [`html-report-build`](html-report-build/SKILL.md) | Turn an approved v0.2 plan into one offline, browser-playable HTML deck. | Self-contained `.html` deck |
| [`html-report-review`](html-report-review/SKILL.md) | Accept or reject the deck through logic, evidence, render, behavior, and safety gates. | `pass`, `fail`, or `blocked` review |

## Sequence

1. `$html-report-plan`
2. `$html-report-build`
3. `$html-report-review`

Use only the requested phase when a valid upstream artifact already exists.
This v0.2 workflow does not produce the previous long-document report format
and does not add a compatibility output path.
