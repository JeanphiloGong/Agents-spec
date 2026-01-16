---
name: project-skill-author
description: Create a project-specific Codex skill package (SKILL.md plus optional references/assets) so external developers or customers can use AI to integrate with the project's API or product. Use when asked to build a reusable skill folder, onboarding skill, or API-integration skill for a specific project.
---

# Project Skill Author

## Workflow

1. Clarify the project and audience.
   - Identify project name, target users, and primary user goals.
2. Collect required inputs.
   - API base URL, auth method, key endpoints, error format, rate limits, versioning policy.
   - Links or files for existing docs, examples, SDKs, or API specs.
3. Define the skill name and placement.
   - Propose a lowercase hyphen name under 64 chars.
   - Ask where to place the skill folder (default: `skills/<skill-name>`).
4. Design the skill structure.
   - Keep SKILL.md lean; move detailed API reference to `references/`.
   - Only include `scripts/` if deterministic tasks are repeated.
5. Draft SKILL.md with explicit triggers and usage.
   - Describe when to use the skill in the frontmatter description.
   - Use imperative instructions in the body.
6. Add references and assets as needed.
   - Include API reference, examples, or product constraints.
7. Validate the package.
   - Ensure no secrets, no fabricated facts, and references are one level deep.

## Required Inputs Checklist

- Project name and one-sentence purpose
- Target users (role and context)
- API base URL and auth method
- Key endpoints and examples
- Error format and common error cases
- Rate limits and usage constraints
- Versioning policy and environments
- Links to existing docs or specs

## SKILL.md Body Template (Use Imperatives)

```
# <Skill Title>

## Workflow
1. ...

## Required Inputs
- ...

## Output Format
...

## Guardrails
- ...
```

## Output Format (This Skill)

```
## Skill Name and Placement
## Required Inputs Missing
## Files Created
## Open Questions
```

## Guardrails

- Do not include API keys, tokens, or secrets.
- Do not invent endpoints or behaviors; mark unknowns as TODO.
- Do not provide bypass or evasion guidance for security controls.
- Keep the skill self-contained and minimal; avoid extra docs.
