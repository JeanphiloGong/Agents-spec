# Engineering Skills

This directory contains reusable engineering skills grouped by workflow family.
Each skill keeps its own `SKILL.md` as the executable instruction entrypoint;
the package README files explain when to use each group.

## Packages

| Package | Purpose |
| --- | --- |
| [`development-skill-pack`](development-skill-pack/README.md) | General development lifecycle skills imported as a curated local pack. |
| [`implementation-guides`](implementation-guides/README.md) | Skills for learning, reference implementations, and human-led landing from drafts. |
| [`delivery-workflow`](delivery-workflow/README.md) | Skills for issue traceability, commits, PR/MR publishing, reviews, and releases. |
| [`engineering-communication`](engineering-communication/README.md) | Skills for engineering diagrams, HTML reports, and business-readable work summaries. |

## Usage

Invoke a skill by its `name` from the target `SKILL.md`. For example:

```text
$git-commit-skill
$single-doc-checkpoint-commit-skill
$reference-core-build
$code-review-and-quality
```

When exposing these skills to a tool that auto-discovers skills, point the tool
at the specific skill directories or create the appropriate project-local skill
links. Keep package directories as organizational containers rather than skill
entrypoints.
