---
name: frontend-ui-polish
description: Improve visual design and UI polish for frontend apps; use when asked to beautify, refresh, or modernize UI layouts, typography, spacing, color, or component aesthetics while respecting existing design systems and constraints.
---

# Frontend UI Polish (Master)

## Workflow

1. Clarify scope and constraints.
   - Identify pages/components, target devices, brand rules, and any existing design system.
   - Request assets (logo, palette, typography) if missing.
2. Audit the current UI.
   - List issues across hierarchy, spacing, typography, color, contrast, density, alignment, and states.
3. Define the visual system.
   - Propose type scale, spacing scale, color tokens, and component tokens.
4. Prioritize changes by impact and risk.
   - Start with accessibility and hierarchy before decorative changes.
5. Ask for permission before code changes.
   - If WRITE_CODE is not given, provide a plan and examples only.
6. Implement minimal, reversible edits when authorized.
   - Use existing structure, prefer tokens/CSS variables, avoid refactors.
7. Validate and report.
   - Check responsive behavior, contrast, focus states, and UI states.

## Master Polish Standards

### Typography
- Define a clear type scale (display, heading, body, caption) with a ratio of 1.125–1.25.
- Keep body text at 14–18px with line-height 1.4–1.7; headings at 1.1–1.3.
- Maintain line length at 45–75 characters for paragraphs.
- Use limited font weights (2–3) to improve clarity and reduce noise.

### Color
- Define primary, secondary, neutral, and feedback tokens with 3–5 steps each.
- Ensure contrast: text ≥ 4.5:1, large text ≥ 3:1, UI controls ≥ 3:1.
- Avoid pure black on pure white; use near-black (#111–#1a1a1a) for comfort.
- Keep state colors consistent across hover/active/focus/disabled.

### Spacing & Rhythm
- Use a consistent spacing scale (4/8/12/16/24/32/48) aligned to an 8px grid.
- Increase vertical rhythm: group spacing = 1x, section spacing = 3x.
- Standardize padding for common components (e.g., buttons 8–12px vertical, 16–20px horizontal).

### Layout & Hierarchy
- Establish clear primary action and visual hierarchy before adding decoration.
- Prefer left-aligned text blocks; limit centered text to short headings.
- Keep content widths readable (600–960px for long-form layouts).

### Components & States
- Standardize radius, border, shadow, and stroke weights across components.
- Define states for hover, active, focus, disabled, empty, loading, error.
- Ensure focus rings are visible and consistent.

### Motion
- Use motion only to explain changes or confirm actions.
- Use durations 120–200ms for micro-interactions, 200–400ms for transitions.
- Respect reduced-motion preferences.

### Content & Microcopy
- Use direct verbs for CTAs; keep labels short and consistent.
- Avoid long sentences in UI; prefer scannable phrases.

### Responsiveness
- Scale typography and spacing down for mobile; preserve hierarchy.
- Validate breakpoints at common widths (e.g., 360/768/1024/1280).

## Audit Rubric (Severity)

- P0: contrast fail, missing focus, broken layout on mobile, unreadable text.
- P1: unclear hierarchy, inconsistent spacing, mismatched component styles.
- P2: minor alignment issues, inconsistent icon sizes, excessive decoration.

## Output Format

```
## Scope & Constraints
## Audit Matrix (P0/P1/P2)
## Visual System (Tokens)
## Change List (Priority + Rationale)
## Validation Checklist
## Open Questions
```

## Guardrails

- Do not change product behavior; limit to visual presentation.
- Do not invent brand claims or assets; request them if absent.
- Preserve existing design systems; extend tokens instead of replacing them.
