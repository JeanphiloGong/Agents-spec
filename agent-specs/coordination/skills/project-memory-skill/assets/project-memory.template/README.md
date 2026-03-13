# Project Memory Template

Bootstrap this template at:

`~/.agents/memories/projects/<project-slug>/`

This layout keeps AI discussion memory outside the repository so it does not
split across branches or worktrees by default.

## Layout

```text
<project-slug>/
  index.md
  open-questions.md
  sessions/
  decisions/
  evolution/
    system-direction.md
    roadmap.md
  topics/
  timeline/
  templates/
    session-record.md
    decision-record.md
    topic-index.md
    month-index.md
```

## Naming Rules

- Session records: `YYYY-MM-DD--<topic>--<slug>.md`
- Decision records: `YYYY-MM-DD--decision--<slug>.md`
- Stable docs: `index.md`, `open-questions.md`, `evolution/system-direction.md`,
  `evolution/roadmap.md`
- Topics use lowercase ASCII tokens such as `architecture`, `product`, `infra`
- Slugs use lowercase ASCII words separated by `-`

## Operating Rules

- Write only on explicit operator request.
- Prefer append-only records.
- Mark old conclusions as `superseded` instead of deleting them.
- Promote accepted conclusions into the repository only when explicitly asked.
- Keep secrets, tokens, credentials, and PII out of memory files.

## Suggested Commands

- `record this discussion`
- `capture as decision`
- `update system direction`
- `log open question`
- `promote this into repo docs`
