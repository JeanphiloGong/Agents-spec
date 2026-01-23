---
name: project-skill-author
description: Create a project-specific Codex skill package (SKILL.md plus optional references/assets) with master-grade structure and defaults; use when building reusable skill folders, onboarding skills, or general project skills (not API-only).
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

## Skill Philosophy (Master-Level)

- Skills are reusable decision systems, not one-off prompts.
- Optimize for stable outputs under changing context.
- Prefer clear constraints over elaborate instructions.
- Minimize cognitive load and context size.
- Always separate workflow from reference material.
- Guard against hallucinated APIs or fake capabilities.
- Treat defaults as policy: safe, conservative, and explicit.
- Derive domain-specific workflows from expert practice, not generic templates.
- Make the workflow justify itself with evidence and tradeoffs.
- Ensure outputs are actionable without follow-up prompting.
- Avoid shallow coverage; favor depth in the chosen domain.
- Prefer decision artifacts that can be audited later.
- Maintain a clear separation between “guidance” and “evidence.”
- Iteration is mandatory: every skill must include an acceptance loop and a next-step plan.
- Treat improvement as continuous: each delivery must include an upgrade path.

## Master Workflow (Decision-Grade)

1. Clarify mission and audience.
   - Project purpose, primary users, and core outcomes.
2. Add a reinforcement mechanism (second-highest priority).
   - Require a recurring self-check loop and concrete checkpoints before completion.
3. Identify domain scope.
   - Independently infer domains that materially affect usage.
   - If needed, search your internal knowledge for master-level practices in those domains.
   - Map each domain to a high-signal workflow and explicitly note why it fits.
4. Define the skill name and placement.
   - Use lowercase hyphen name under 64 chars; default to `skills/<skill-name>`.
5. Design the package structure.
   - Keep SKILL.md lean; move detailed references into `references/`.
   - Add `assets/` only when reusable templates are required.
   - If you mandate a validation script, add it in `scripts/` or reference an existing one.
6. Draft SKILL.md with explicit triggers and workflow.
   - Use clear frontmatter and imperative steps.
7. Provide defaults and guardrails.
   - Include sane defaults to reduce user input and prevent misuse.
8. Validate and scope.
   - Ensure no secrets, no fabricated facts, references are one level deep.
9. Verify domain fitness.
   - Confirm the workflow reflects expert practice in that domain.
10. Produce a fit-for-purpose template.
   - Provide a short, standard, and strict output format.
11. Add verification hooks.
   - Define how correctness and safety are validated for the skill.
12. Add audit artifacts.
   - Specify what evidence is stored and where.
13. Add iteration loop.
   - Require acceptance review, feedback capture, and a next-iteration plan.
14. Add reinforcement plan.
   - Define how the skill learns from repeated use and failures.
## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record pass/fail evidence.
- Capture gaps with scope impact and ownership (who resolves and by when).
- Define a next-iteration checklist that targets the highest-impact gap first.
- Explicitly name the highest-risk gap and the concrete verification step to close it.

## Reinforcement Plan (Required)

Goals

Reduce recurring failures by turning them into explicit, testable guardrails.

Improve success rate by promoting consistently high-performing workflows into defaults.

Maintain quality by retiring/demoting patterns that repeatedly fail validation.

Operating Rules

Reinforcement runs in a repeatable four-step loop.

Changes must be localized, reversible, and auditable (small diffs, clear rationale).

Every loop produces artifacts: a plan note, a change log, a verification record, and a reflection entry.

Audit baseline

Each reinforcement round must produce:
- A Git commit that contains only that round's changes.
- An audit record in `references/reinforcement-audit.jsonl`.
- Validate the record with `scripts/validate_reinforcement_audit.py`.
  - If you require this script, you must create it or explicitly reference an existing script.

Four-step Reinforcement Cycle
1) Plan (Objective + Scope)

Objective

State the user outcome in one sentence (e.g., “Reduce tool-call errors in PDF workflows.”).

Define measurable acceptance criteria:

e.g., “Pass rate ≥ 95% on last 50 runs,” “0 critical policy violations,” “avg. retries ≤ 1.”

Scope

List what is in-scope (files, modules, prompts, edge cases).

List explicit out-of-scope boundaries to prevent cross-cutting changes:

e.g., “No changes to unrelated tools,” “No behavior change outside PDF flow,” “No new dependencies.”

Inputs

Include the evidence you’re responding to:

Failure examples (IDs/links), frequency, severity, and failure taxonomy label.

Exit Condition

Define when you stop planning and move to change (e.g., “Top 1–2 failure modes identified + proposed guardrails drafted.”)

2) Change (Apply Edits)

Edit Principles

Prefer clarity over cleverness.

Keep changes small and isolated (one failure mode per change set when possible).

Make edits auditable:

Add a short “Why” comment or changelog entry.

Use consistent naming for guardrails and workflows (e.g., GR-###, WF-###).

Outputs

Patch/diff summary:

What changed

Where changed

Which failure mode it targets

Expected behavior shift (before/after)

Rollback

Define how to revert (feature flag, revert commit, config toggle).

3) Verify (Checks + Evidence)

Verification Steps (must be reproducible)

Unit checks (logic-level)

Integration checks (tooling-level)

Regression checks (previously passing cases)

Negative tests (ensure boundaries are respected)

Evidence (recorded)

Test run IDs/log excerpts/screenshots as applicable

Metrics snapshot:

pass/fail counts

top remaining failure categories

any new failure introduced

Decision Rule

Promote / hold / rollback based on acceptance criteria:

Promote if criteria met

Hold if partial (define what’s missing)

Rollback if any critical regressions or policy/validation failures

4) Reflect (Improvements + Next Adjustments)

What improved

Which failure modes dropped, by how much (numbers, not vibes).

What guardrail/workflow proved effective.

Risks & Tradeoffs

Any new complexity, false positives, coverage gaps.

Next highest-impact refinement

One prioritized next action:

e.g., “Add targeted test set for X edge case,” “Split WF into two variants,” “Demote pattern Y.”

Outcome

Update the reinforcement backlog with the reflection outcome.

## Step Gate (Required)

After each of the four steps (Plan, Change, Verify, Reflect), the system must prompt: “continue?”

The system must not proceed to the next step until it receives explicit confirmation: continue.

While awaiting confirmation, the system must not apply further edits, run additional checks, or advance the loop.

If the operator replies with anything other than continue, the system must:

keep the loop at the current step, and

re-prompt “continue?” without advancing.

Confirmation token: `continue`.

## Design Layers (Use As Needed)

1. **Trigger Layer**: name + description; clear "when to use" signals.
2. **Workflow Layer**: concise steps, minimal ambiguity.
3. **Reference Layer**: detailed docs in `references/`.
4. **Asset Layer**: templates, examples, or boilerplate in `assets/`.
5. **Script Layer**: deterministic or repeated logic in `scripts/`.
6. **Acceptance Layer**: validation criteria in `references/acceptance-criteria.md`.

## Required Inputs (Minimal)

- Project name and one-sentence purpose
- Target users (role and context)
- Primary outcomes or workflows
- Delivery environment or distribution target (where the skill will live)
- Acceptance owner (who signs off on the skill)

## Defaults (Use Unless User Specifies)

- Domain scope: Engineering + Product by default; add Security/Data/AI when relevant.
- Skill placement: `skills/<skill-name>` unless a project path is specified.
- Output tone: concise, action-oriented, no fluff.
- References: add only when details are needed repeatedly.
- Acceptance: require owner approval for high-risk or public-facing skills.

## Failure Modes to Avoid

- Overfitting the skill to a single project.
- Mixing workflow and reference content.
- Overly verbose SKILL.md that bloats context.
- Missing guardrails that allow unsafe edits.
- Unclear triggers that cause accidental activation.
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

## Audit Artifacts (Use When Risk Is High)

- Decision log entries (what, why, when).
- Verification notes or test vectors.
- Risk register updates and mitigation status.

## Minimal Closed-Loop Structure (Required)

- Input: feedback signal.
- Process: review and filter.
- Output: change + evidence.
- Re-input: acceptance/metrics.

## Minimal Metrics Set

- First delivery usability rate:
  - Formula: usable deliverables / total deliverables in first iteration.
  - Source: machine-readable acceptance logs.
- Number of clarification rounds:
  - Formula: count of back-and-forth cycles before acceptance.
  - Source: structured review events (status transitions).
- Acceptance pass rate:
  - Formula: accepted items / total reviewed items.
  - Source: acceptance checklist records in JSON/YAML.
- Thresholds:
  - Set by owner at project start, reviewed per iteration or on high-risk trigger.
  - Update when scope or risk profile changes.
  - Trigger automatic review when thresholds are breached.

## Responsibility and Cadence

- Initiate acceptance: automated checks + owner confirmation only when gating fails.
- Record risks: automatic risk log updates from failed checks.
- Execute cadence: per iteration or on automated threshold triggers.
- Final approve/reject: owner only for high-risk or failed automation.

## Shortest Change Path

- Entry gate: feedback must include machine-verifiable evidence (logs/tests/metrics).
- Feedback → change queue → evaluation (impact/risk/cost) → merge criteria → acceptance.

## Minimal Closed-Loop Example (3–5 Lines)

1. Feedback: onboarding fails, detected by quickstart completion metric < threshold.
2. Review: automated log shows missing checklist step.
3. Change: add checklist + run scripted onboarding test.
4. If test fails, auto-log gap and re-enter change queue.

## Automation Requirements

- Feedback ingestion: logs, tests, or metrics must be machine-readable.
- Verification: prefer scripted tests or replayable scenarios.
- Alerts: threshold breaches trigger automatic review.
- Audit trail: auto-write evidence and decisions to a log file.
- Rollback: define automated rollback if critical checks fail.
- Reinforcement: incorporate failure patterns into the next workflow revision.

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

- `references/acceptance-criteria.md`: acceptance standards and reviewer challenge checklist.
- `references/reinforcement-audit.jsonl`: per-round audit records (one JSON object per line).
- `scripts/validate_reinforcement_audit.py`: JSONL structure validator for audit records.

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
3. Require acceptance criteria for each change.
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
4. Require a11y acceptance criteria for key flows.
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
