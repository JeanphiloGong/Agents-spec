# Prompt Architecture Workflow

This package designs and reviews high-stakes LLM prompts by modeling the task
before writing rules.

Use it when prompt quality depends on schema, decision flow, boundary cases, and
few-shot examples rather than wording polish alone.

## Skills

| Phase | Skill | Purpose |
| --- | --- | --- |
| Author | [`prompt-architecture-author`](prompt-architecture-author/SKILL.md) | Build a prompt from task model, input schema, decision process, hard rules, few-shots, and output schema. |
| Review | [`prompt-architecture-review`](prompt-architecture-review/SKILL.md) | Review a prompt for missing task model, weak schema, rule piles, missing few-shots, and unusable output contracts. |

## Standard

Good prompts for classification, extraction, routing, matching, attribution,
review, or tool-use tasks should not start as policy dumps. They should first
answer:

- what task the model is performing
- what task it is not performing
- what inputs it receives
- what decision path it should follow
- what constraints are genuinely hard
- what examples define boundary behavior
- what output contract the caller can parse

Generation and acceptance are separate. Use `prompt-architecture-author` to
draft or refactor the prompt, then use `prompt-architecture-review` before
shipping it into a system.
