---
name: project-skill-author
description: v0.1.4 - Create a project-specific Codex skill package with native Codex structure, metadata, validation, and master-grade governance; use when building reusable skill folders, onboarding skills, coordination skills, or general project skills that should ship as native Codex skills (not API-only).
---

# Project Skill Author

## Trigger and Scope (Required)

Use this skill when you must design a reusable, project-level skill package
for external or cross-team users. This is not for single prompts or one-off
task guides.

In scope: project-wide skills, onboarding skills, coordination skills, or
multi-domain guidance with auditable workflows.
Out of scope: pure API integration skills, internal-only prompts, or
single-use task scripts.

Unless the user explicitly asks for another runtime, treat Codex as the target
runtime and produce a Codex-compatible skill package by default.

## Skill Philosophy (Master-Level)

- Skills are reusable decision systems, not one-off prompts.
- Optimize for stable outputs under changing context.
- Prefer clear constraints over elaborate instructions.
- Minimize cognitive load and context size.
- Always separate workflow from reference material.
- Guard against hallucinated APIs or fake capabilities.
- Treat defaults as policy: safe, conservative, and explicit.
- Treat `name` and `description` as trigger-critical metadata, not decoration.
- Derive domain-specific workflows from expert practice, not generic templates.
- Make the workflow justify itself with evidence and tradeoffs.
- Ensure outputs are actionable without follow-up prompting.
- Avoid shallow coverage; favor depth in the chosen domain.
- When a skill represents a long-lived actor, encode its operating identity with
  an AGENTS-style role charter rather than leaving behavior implicit.
- Prefer decision artifacts that can be audited later.
- Maintain a clear separation between “guidance” and “evidence.”
- Keep first delivery lightweight; avoid turning a skill authoring flow into a
  full governance system unless the operator explicitly asks for that level.

## Codex Compatibility Layer (Default Target)

By default, this skill should produce packages that a native Codex runtime can
discover and consume without further adaptation.

Codex-compatible output means:

- `SKILL.md` is the canonical instruction file and includes only `name` and
  `description` in YAML frontmatter.
- `description` carries both what the skill does and when to use it; do not
  bury primary trigger conditions only in the body.
- The package follows progressive disclosure:
  `SKILL.md` for workflow, `references/` for on-demand detail, `scripts/` for
  deterministic logic, and `assets/` for output resources.
- Include `agents/openai.yaml` by default for Codex-facing metadata unless the
  user explicitly requests a minimal package without UI metadata.
- Prefer official Codex scaffold and validation tools when available, but do
  not block delivery if manual-compatible creation is required.

## Codex Native Skill Anatomy

Default to the same structural model that native Codex skills use:

```text
<skill-name>/
  SKILL.md
  agents/
    openai.yaml
  scripts/
  references/
  assets/
```

Anatomy rules:

- `SKILL.md` is required and remains the canonical instruction file.
- `SKILL.md` frontmatter should contain only `name` and `description`.
- `agents/openai.yaml` is recommended by default for Codex-facing skills and
  should be treated as the UI-facing metadata adapter.
- `scripts/`, `references/`, and `assets/` are optional and should exist only
  when they materially improve repeated execution, accuracy, or output reuse.
- Do not create parallel documentation trees that compete with `SKILL.md`.

## Progressive Disclosure Rule

Use the native Codex loading model as the default design discipline:

1. `name` + `description`: always-on trigger metadata.
2. `SKILL.md` body: core workflow and policy, kept lean.
3. `references/`, `scripts/`, and `assets/`: loaded or used only as needed.

Implications:

- Keep primary workflow and guardrails in `SKILL.md`.
- Push long schemas, playbooks, and domain detail into `references/`.
- Put deterministic operations into `scripts/` instead of rewriting them in prose.
- Put templates and reusable output resources into `assets/`.
- Keep references one level deep from `SKILL.md`.

## Codex Native Creation Flow

Map the official Codex-native creation flow into this skill's stronger
governance model:

1. Understand the skill with concrete usage examples.
2. Plan which reusable resources belong in `scripts/`, `references/`, and `assets/`.
3. Initialize the skill with official Codex scaffolding when available.
4. Edit the skill by implementing reusable resources first, then the final
   `SKILL.md`.
5. Validate the package structure and metadata.
6. Iterate with realistic usage and forward-test complex skills when the cost
   is justified.

## Master Workflow (Decision-Grade)

1. Clarify mission and audience.
   - Project purpose, primary users, and core outcomes.
   - Capture at least 2 concrete usage examples or trigger prompts when
     possible; use them to shape both the package contents and frontmatter.
   - If the skill is role-like, define the role charter boundary using an
     AGENTS-style structure:
     overview, mission, owns/does-not-own, permission model, execution rules,
     escalation, and done signal.
   - Also define role-specific golden rules using the AGENTS `Why / How / Check`
     pattern; default to 12 rules unless the role is genuinely too small.
2. Identify domain scope.
   - Independently infer domains that materially affect usage.
   - If needed, search your internal knowledge for master-level practices in those domains.
   - Map each domain to a high-signal workflow and explicitly note why it fits.
3. Define the skill name and placement.
   - Use lowercase hyphen name under 64 chars; default to `skills/<skill-name>`.
4. Define runtime compatibility.
   - Default to Codex unless the user explicitly names another runtime.
   - State whether the package must be Codex-native only or cross-runtime.
5. Add versioning to the header description.
   - Prefix `description` with a semantic version (e.g., `v0.1.0 - ...`).
   - If no version exists yet, start at `v0.1.0`.
   - Bump the patch version by +1 per completed commit that updates the skill (one commit = one version bump).
6. Design the package structure.
   - Keep SKILL.md lean; move detailed references into `references/`.
   - For Codex targets, default package layout is:
     `SKILL.md`, `agents/openai.yaml`, and optional `references/`, `scripts/`, `assets/`.
   - Only create `scripts/`, `references/`, and `assets/` when repeated use,
     determinism, or output reuse justifies them.
   - When the skill is role-like, include a concise AGENTS-style role charter
     in `SKILL.md` and add `references/role-charter-template.md` when reusable
     scaffolding is helpful.
   - Role-like skills should also include a role-level `Golden Rules (Why / How / Check)`
     section in `SKILL.md` or the role charter reference.
   - Add `assets/` only when reusable templates are required.
   - If you mandate a validation script, add it in `scripts/` or reference an existing one.
7. Draft SKILL.md with explicit triggers and workflow.
   - Use clear frontmatter and imperative steps.
   - Keep trigger-critical "what/when to use" language in `description`, not only in body sections.
   - Role-like skills must make the operating charter explicit instead of
     scattering it across workflow prose.
8. Add Codex metadata and toolchain hooks.
   - For Codex targets, generate or update `agents/openai.yaml`.
   - Define `interface.display_name`, `interface.short_description`, and
     `interface.default_prompt` from the actual skill intent rather than placeholders.
   - Add icons, brand color, dependencies, or policy flags only when the user
     provides the necessary assets or requirements.
   - If official tools are available, prefer `init_skill.py`,
     `generate_openai_yaml.py`, and `quick_validate.py`.
   - If official tools are not available, create the same package structure manually and
     note the fallback.
9. Provide defaults and guardrails.
   - Include sane defaults to reduce user input and prevent misuse.
10. Validate and scope.
   - Ensure no secrets, no fabricated facts, references are one level deep.
   - Validate naming, frontmatter, Codex metadata freshness, and package layout.
11. Verify domain fitness.
   - Confirm the workflow reflects expert practice in that domain.
12. Produce a fit-for-purpose template.
   - Provide a short, standard, and strict output format.
13. Add verification hooks.
   - Define how correctness and safety are validated for the skill.
   - Forward-test complex or high-reuse skills on realistic tasks when the
     validation cost is justified.

## Design Layers (Use As Needed)

1. **Trigger Layer**: name + description; clear "when to use" signals.
2. **Workflow Layer**: concise steps, minimal ambiguity.
3. **Codex Adapter Layer**: `agents/openai.yaml` and other runtime-facing metadata.
4. **Reference Layer**: detailed docs in `references/`.
5. **Asset Layer**: templates, examples, or boilerplate in `assets/`.
6. **Script Layer**: deterministic or repeated logic in `scripts/`.

## Compatible Package Layout (Codex Default)

Use this layout unless the user explicitly asks for a different runtime shape:

```text
<skill-name>/
  SKILL.md
  agents/
    openai.yaml
  references/
  scripts/
  assets/
```

Rules:

- `SKILL.md` is required.
- `agents/openai.yaml` is the default Codex metadata adapter.
- `references/`, `scripts/`, and `assets/` are optional; create only what the
  workflow justifies.
- Do not add auxiliary docs like `README.md`, `CHANGELOG.md`, or installation
  notes unless the user explicitly asks for them.

## Codex Triggering Rules

- The frontmatter `name` and `description` are the primary trigger surface.
- Put both capability and usage contexts in `description`.
- Do not rely on a body section like "When to Use This Skill" as the only
  trigger source.
- Keep naming short, stable, and aligned with the folder name.
- Keep `SKILL.md` lean and push domain detail into `references/` when possible.

## Codex Toolchain Integration

When official Codex scaffolding is available, prefer it because it reduces
metadata drift and packaging mistakes.

- For new skills, prefer `scripts/init_skill.py`.
- For Codex metadata, prefer `scripts/generate_openai_yaml.py`.
- For structural validation, prefer `scripts/quick_validate.py`.
- If the official scripts are unavailable, reproduce the same package shape
  manually and call out the fallback in the output.

## Codex Metadata Rules

For Codex-facing skills, treat `agents/openai.yaml` as a first-class contract,
not an afterthought.

- Generate `interface.display_name` as a clear, human-facing skill title.
- Generate `interface.short_description` as a short UI blurb suitable for quick
  scanning; keep it concise and specific.
- Generate `interface.default_prompt` as a short example prompt that explicitly
  mentions the skill by `$skill-name`.
- Add `icon_small`, `icon_large`, and `brand_color` only when the assets or
  brand requirements are actually available.
- Add `dependencies.tools` only for real tool dependencies; do not invent MCP
  bindings for discoverability theater.
- Keep `policy.allow_implicit_invocation` at the runtime default unless the
  user explicitly wants explicit-only invocation.
- When writing `openai.yaml` manually, quote string values and keep keys
  unquoted.

## What Not to Include

By default, do not create auxiliary files that native Codex skills do not need.

Do not add:

- `README.md`
- `CHANGELOG.md`
- `INSTALLATION_GUIDE.md`
- `QUICK_REFERENCE.md`
- process retrospectives or author-side notes

Only create extra documentation files when the user explicitly asks for them or
the runtime contract requires them.

## Required Inputs (Minimal)

- Project name and one-sentence purpose
- Target users (role and context)
- Primary outcomes or workflows
- Delivery environment or distribution target (where the skill will live)
- Target runtime or agent platform if it is not Codex

## Defaults (Use Unless User Specifies)

- Domain scope: Engineering + Product by default; add Security/Data/AI when relevant.
- Runtime target: Codex.
- Skill placement: `skills/<skill-name>` unless a project path is specified.
- Package layout: `SKILL.md` plus `agents/openai.yaml` by default; add
  `references/`, `scripts/`, and `assets/` only when justified by repeated use,
  determinism, or output reuse.
- Output tone: concise, action-oriented, no fluff.
- References: add only when details are needed repeatedly.
- Resource selection: start from concrete usage examples and only add resource
  folders that clearly reduce repeated reasoning or manual rewriting.
- Trigger policy: put "what the skill does" and "when to use it" in
  frontmatter `description`, not only in the body.
- Codex metadata: generate `agents/openai.yaml` by default for Codex-facing skills.
- Codex metadata fields: populate `display_name`, `short_description`, and
  `default_prompt`; add other interface fields only when the inputs exist.
- Initialization mode: use official Codex scaffold tools when available;
  otherwise create a manual-compatible package.
- Validation mode: use official Codex validation tools when available;
  otherwise run a structural checklist covering frontmatter, naming, package
  layout, and metadata freshness.
- Auxiliary docs: do not create README/changelog/install docs unless explicitly required.
- Role charter: required when the skill defines a reusable role, control-plane
  owner, reviewer, operator, or other long-lived actor.
- Role charter format: default to a compact AGENTS-style structure rather than
  a loose bullet list.
- Role golden rules: required for role-like skills; default to 12 concise rules
  in `Why / How / Check` form unless the role is too small to justify that many.
- Versioning: prefix `description` with `v<major>.<minor>.<patch> - ...`; start at `v0.1.0` if absent; bump patch once per completed commit that updates the skill.

## Failure Modes to Avoid

- Overfitting the skill to a single project.
- Mixing workflow and reference content.
- Overly verbose SKILL.md that bloats context.
- Missing guardrails that allow unsafe edits.
- Unclear triggers that cause accidental activation.
- Burying "when to use" only in the body instead of frontmatter `description`.
- Omitting or staling `agents/openai.yaml` for a Codex-targeted skill.
- Shipping a package layout that Codex cannot consume without manual adaptation.
- Adding `scripts/`, `references/`, or `assets/` without a repeated-use case.
- Stuffing long reference content back into `SKILL.md` instead of using progressive disclosure.
- Creating README/changelog/install files that native Codex skills do not need.
- Filling `openai.yaml` with guessed icons, dependencies, or branding.
- Relying on a single generic workflow for all domains.
- Using “best practices” language without concrete steps.
- Missing domain-specific risk controls or validation gates.
- Shipping a skill without verification or example usage.
- Omitting audit trails for high-risk workflows.

## Output Tiers (Pick One)

**Short**: skill name, placement, minimal workflow, guardrails.  
**Standard**: add required inputs, defaults, and output format.  
**Strict**: add validation rules and risk notes.

## Decision Rubric (Use to Choose a Workflow)

- **Risk**: higher risk requires stricter validation and guardrails.
- **Reuse**: higher reuse favors assets and references.
- **Fragility**: fragile operations favor scripts and low degrees of freedom.
- **Audience**: external users require clearer constraints and examples.
- **Regulatory**: regulated domains require explicit compliance hooks.
- **Learning Value**: prefer workflows that create measurable feedback loops.

## Validation Hooks (Required for Strict)

- Provide a minimal “how to verify” section.
- Include a negative test or failure case when risk is non-trivial.
- Require explicit “unknowns” where facts are missing.
- Require a lightweight evidence note (what was checked, by whom, when).
- For Codex-targeted skills, verify that `description` clearly covers both
  capability and usage context.
- For Codex-targeted skills, verify that `agents/openai.yaml` exists when UI
  metadata is expected and still matches `SKILL.md`.
- For Codex-targeted skills, verify that `interface.default_prompt` references
  the skill by `$skill-name`.
- When the skill is role-like, verify that the charter uses an AGENTS-style
  structure and makes mission, boundaries, permission model, execution rules,
  outputs, and escalation conditions explicit.
- When the skill is role-like, verify that the golden rules are role-specific,
  operational, and written in `Why / How / Check` form.

## Compatibility Validation Checklist

Use this checklist whenever the skill is expected to ship as a native Codex
skill package:

- `SKILL.md` frontmatter contains only `name` and `description`.
- The skill folder name matches `name`.
- `description` includes both the skill capability and concrete "when to use"
  signals.
- `SKILL.md` stays focused on workflow and does not absorb large reference
  sections that should live under `references/`.
- References are one level deep from `SKILL.md`.
- `agents/openai.yaml` exists for Codex-facing skills and matches the current
  skill scope.
- `agents/openai.yaml` includes valid `display_name`, `short_description`, and
  `default_prompt` fields for Codex-facing skills.
- `interface.default_prompt` explicitly names the skill as `$skill-name`.
- Optional metadata fields are included only when backed by real assets,
  dependencies, or product requirements.
- Any required `scripts/` or `assets/` exist only because the workflow justifies them.
- No auxiliary clutter files are introduced by default.
- If official validation tooling is available, `quick_validate.py` passes; if
  not, manual validation explicitly covers the same constraints.

## AGENTS-Style Role Charter Standard (Required For Role-Like Skills)

When a skill defines a long-lived actor rather than a one-shot helper, include
an AGENTS-style role charter as part of the skill package.

The charter should feel structurally similar to a strong project `AGENTS.md`:
boundary-first, measurable, and operational rather than persona-heavy.

Minimum sections:

- `Overview`: role name, purpose, and where it fits
- `Core Principles`: the role's steady operating rules
- `Mission & Non-Negotiables`: durable outcome and unacceptable failures
- `Ownership Boundaries`: what the role owns and what it does not own
- `Permission Model`: what the role may decide directly vs. what needs approval
- `Execution Rules`: how the role must operate turn to turn
- `Inputs` and `Outputs`: required context and emitted decisions/artifacts
- `Handoff & Escalation`: when the role must delegate, stop, or ask upward
- `Quality Bar`: what evidence or verification is required before saying done
- `Done Signal`: what counts as completion for one execution cycle
- `Risks & Open Questions`: known gaps and unresolved assumptions

Golden rules requirement:

- include a `Golden Rules (Why / How / Check)` section for role-like skills
- prefer 12 rules by default to match the AGENTS-style operating model
- if fewer than 12 are used, the author must justify why the role is too narrow
  for a full rule set
- rules must be role-specific, enforceable, and phrased as operational
  discipline rather than generic values

Placement rules:

- keep the concise charter in `SKILL.md` when the role is central to trigger
  and workflow
- move reusable expansions or starter templates into
  `references/role-charter-template.md`
- do not bury charter elements only inside examples or optional notes

## Domain-Specific Variants (Optional)

- API Integration: add request/response patterns and error formats.
- Data/Analytics: include schema references and quality checks.
- DevTools/CLI: include scripts and example invocations.
- Docs/Onboarding: include templates and style guide references.
- Collaboration: include coordination rules and role scaffolds.
- Compliance: include regulatory constraints and audit trails.
- Security: include threat model and incident response steps.

## Domain Reasoning Rule

- The agent must decide which domain applies by reasoning from the project and task context.
- Use master-level, field-proven workflows as the basis (e.g., expert practitioner patterns).
- Examples are educational only; do not force-fit templates if the context differs.

## References

- `references/role-charter-template.md`: starter template for AGENTS-style role charters inside reusable skills.

## Domain Workflow Library (Use as Reference Only)

### API Integration
1. Identify primary consumers and integration contexts.
2. Define canonical request/response and error contracts.
3. Add versioning and backward-compatibility strategy.
4. Provide example flows and failure handling.
5. Validate with test vectors and edge cases.

### Data/Analytics
1. Define schema, lineage, and ownership.
2. Establish data quality checks and thresholds.
3. Specify transformations with provenance.
4. Define access controls and retention.
5. Validate with sample pipelines and audits.

### AI/ML
1. Define task, evaluation metrics, and baselines.
2. Specify data collection and labeling rules.
3. Establish monitoring for drift and bias.
4. Define deployment guardrails and rollback.
5. Validate with offline/online evaluation results.

### Security
1. Threat model the assets and entry points.
2. Define least-privilege access and secrets handling.
3. Require audit logging and incident response steps.
4. Define remediation and patch cadence.
5. Validate with security reviews or scans.

### Docs/Onboarding
1. Define target reader and outcomes.
2. Provide quickstart, prerequisites, and examples.
3. Include troubleshooting and FAQs.
4. Define update cadence and ownership.
5. Validate with a first-time user path.

### Product/PM
1. Define target outcomes and success metrics.
2. Establish priority rules and scope boundaries.
3. Require verification criteria for each change.
4. Define risks and mitigation owners.
5. Validate with milestone review checkpoints.

### Platform/Infra
1. Define shared contracts and backward compatibility.
2. Establish ownership and escalation paths.
3. Define availability and incident SLAs.
4. Provide rollback and migration procedures.
5. Validate with runbooks and load tests.

### Compliance/Legal
1. Identify applicable regulations and policies.
2. Define data handling and retention limits.
3. Require audit logs and approvals.
4. Define breach/incident response steps.
5. Validate with compliance review gates.

### Quality/Testing
1. Identify critical paths and risk tiers.
2. Define minimum test coverage by tier.
3. Require regression and rollback checks.
4. Define test ownership and review flow.
5. Validate with reproducible test runs.

### Growth/Marketing
1. Define positioning and measurable funnel goals.
2. Establish attribution rules and guardrails.
3. Define experiment design and success criteria.
4. Require messaging review and brand constraints.
5. Validate with post-launch metrics review.

### Legal/Contracts
1. Define scope, parties, and responsibilities.
2. Identify redlines, risk thresholds, and approval gates.
3. Define audit trails and change control steps.
4. Require review cycles and sign-off artifacts.
5. Validate with compliance/legal review checkpoints.

### Customer Support/Operations
1. Define support tiers and escalation paths.
2. Establish SLA/SLO targets and triage rules.
3. Define knowledge base and incident logging.
4. Require feedback loops into product/engineering.
5. Validate with sampled ticket audits.

### Observability
1. Define logging/metrics/tracing standards.
2. Establish alert thresholds and ownership.
3. Define dashboards for key flows.
4. Require incident postmortem procedures.
5. Validate with alert drills or runbooks.

### Accessibility
1. Define baseline a11y standards and target levels.
2. Establish keyboard and screen-reader requirements.
3. Define verification tooling and manual checks.
4. Require a11y verification criteria for key flows.
5. Validate with audits or checklists.

### Localization/Internationalization
1. Define locale coverage and fallback rules.
2. Establish content ownership and translation flow.
3. Define formatting and pluralization standards.
4. Require language QA for critical flows.
5. Validate with locale-specific review checks.

### Payments/Risk/Fraud
1. Define fraud signals and risk thresholds.
2. Establish review and escalation workflows.
3. Define reconciliation and dispute handling.
4. Require monitoring for anomalies.
5. Validate with simulated risk scenarios.

### Procurement/Vendor Management
1. Define vendor requirements and evaluation criteria.
2. Establish due diligence and risk assessment steps.
3. Define contract review and approval gates.
4. Require ongoing performance and compliance reviews.
5. Validate with vendor scorecards and audits.

### Privacy Engineering
1. Define data minimization and consent requirements.
2. Establish anonymization and access control patterns.
3. Define retention schedules and deletion workflows.
4. Require privacy impact assessments.
5. Validate with audits and data access reviews.

### Incident Response
1. Define severity levels and escalation paths.
2. Establish communication and stakeholder protocols.
3. Define containment, recovery, and remediation steps.
4. Require postmortem and corrective actions.
5. Validate with tabletop or incident drills.

### Architecture/Systems Design
1. Define target qualities and constraints (latency, scale, cost).
2. Compare viable architectures with tradeoffs.
3. Define interfaces and data boundaries.
4. Require failure mode analysis and mitigations.
5. Validate with risk reviews and prototype tests.

### Data Governance
1. Define ownership, stewardship, and access tiers.
2. Establish data classification and policy mapping.
3. Define quality gates and lineage requirements.
4. Require approval for sensitive data usage.
5. Validate with governance audits and access reviews.

### Release/Change Management
1. Define release cadence and environment gates.
2. Establish change review and approval steps.
3. Require rollout and rollback procedures.
4. Define monitoring and post-release checks.
5. Validate with canary or staged deployments.

## SKILL.md Body Template (Use Imperatives)

```
# <Skill Title>

## Workflow
1. ...

## Required Inputs
- ...

## Bundled Resources
- ...

## Output Format
...

## Guardrails
- ...
```

## Output Format (This Skill)

```
## Skill Name and Placement
## Runtime Compatibility
## Package Layout
## Required Inputs Missing
## Files Created
## Metadata Plan
## Validation Plan
## Open Questions
```

## Guardrails

- Do not include API keys, tokens, or secrets.
- Do not invent endpoints or behaviors; mark unknowns as TODO.
- Do not provide bypass or evasion guidance for security controls.
- Keep the skill self-contained and minimal; avoid extra docs.
- Do not ship a Codex-targeted skill without trigger-quality frontmatter.
- Do not omit the Codex metadata adapter unless the user explicitly asks for a
  metadata-free package.
