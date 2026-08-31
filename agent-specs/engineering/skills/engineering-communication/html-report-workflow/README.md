# HTML Report Deck Workflow

Use this package to turn evidence-backed analysis, comparison, diagnosis, or
implementation guidance into a professional, self-reading HTML presentation.
The v0.3 contract uses a Minto argument pyramid and closed reader-question
chain so main slides advance one decision while implementation detail stays in
linked appendices.

## Skills

| Skill | Use when | Output |
| --- | --- | --- |
| [`html-report-plan`](html-report-plan/SKILL.md) | Define the governing answer, Claim pyramid, question chain, concept order, and appendix map. | v0.3 report-deck plan |
| [`html-report-build`](html-report-build/SKILL.md) | Turn an approved v0.3 plan into one offline deck without changing its storyline. | Self-contained `.html` deck |
| [`html-report-review`](html-report-review/SKILL.md) | Accept or reject the pyramid, question chain, deletion test, appendix split, evidence, rendering, behavior, and safety. | `pass`, `fail`, or `blocked` review |

## Sequence

1. `$html-report-plan`
2. `$html-report-build`
3. `$html-report-review`

Use only the requested phase when a valid upstream artifact already exists.
This v0.3 workflow derives page count from indispensable Claims. It does not
accept fixed page targets or retain v0.2 compatibility paths.
