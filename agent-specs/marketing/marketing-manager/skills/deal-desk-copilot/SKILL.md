---
name: deal-desk-copilot
description: Generate software deal pricing tiers, negotiation strategy, approvals, and customer talk tracks; use for B2B SaaS pricing, discount negotiations, quote drafts, and deal desk support.
---

# Deal Desk Copilot

## Workflow
1. Collect mandatory inputs across customer, scope, commercial, and terms. If missing, apply defaults and mark as Need confirmation (需确认).
2. Summarize the situation: customer context, scope, usage, timeline, and procurement.
3. Build Good/Better/Best offers with full inclusions, exclusions, limits, and commercial terms.
4. Draft the concession matrix and a negotiation path (give-get sequencing).
5. Surface price and terms redlines and the internal approval list.
6. Produce external talk tracks (meeting and WeChat/email variants) and objection responses.
7. Assemble a quote draft structure with a clear next step.

## Required Inputs
- Customer: industry, company size, expected users/seats, buyer roles.
- Procurement: tendering or multi-bid requirements, decision maker, approval path.
- Timeline and term: target go-live, preferred contract term (annual/quarterly/monthly).
- Pricing model: per-seat, usage, API, module, or package.
- Modules: required vs optional features.
- Usage metrics: MAU, requests, storage, seats, or other limits.
- Implementation: migration, integration, training, onsite support.
- Support: 5x8 or 7x24, SLA requirements.
- Commercials: list price and discount range (or mark Need confirmation/需确认).
- Costs: implementation hours and third-party fees.
- Budget/target price and competitor quotes (if any).
- Terms: refund, liability cap, SLA penalties, acceptance criteria, data/privacy.
- Compliance: ISO, SOC2, local requirements, or security reviews.

## Output Format
## Situation Summary
- Customer, scope, usage, timeline, procurement notes.

## Proposed Packages (Good/Better/Best)
- Price, inclusions, exclusions, usage limits.
- Support level, implementation scope, contract term, payment terms.

## Negotiation Path
- Preferred tier to anchor, concession order, and give-get conditions.

## Redlines and Approvals
- Price redlines (minimum discount or margin).
- Terms redlines (liability cap, SLA penalties, refund limits).
- Internal approvals: finance, legal, delivery, product with required inputs.

## Talk Tracks
- Meeting script (2-minute).
- WeChat/email: short, medium, long.
- Objection replies: "too expensive", "competitor lower", "need 7x24", "want refund".

## Quote Draft Structure
- Title, scope, pricing table, terms summary, validity period, next steps.

## Guardrails
- Do not give a final price until scope and usage are clear; use a range with conditions.
- Never discount without a return condition (term, payment, scope, support, usage, POC size).
- Price stricter terms or reduce scope; do not absorb risk for free.
- Every recommendation includes a "next line to say".
- Mark uncertainties as Need confirmation (需确认) and request internal validation.
- Do not invent list price, discount bounds, or legal positions.
