# Purpose And Goal Placement

Use this reference when deciding where design purpose or work goals should
live.

## Project Purpose

Place project purpose at the system node:
- root `docs/README.md`
- system overview or overview subtree

## Module Purpose

Place module purpose at the module node:
- `<module>/README.md`
- or a module-local purpose page when the module root README is not the right
  home

Do not place module purpose inside a docs-only grouping folder by default.

## Phase Goals

Place phase or milestone goals at the system level:
- roadmap, planning docs, or tracked issues

## Detailed Delivery Goals

Place detailed implementation goals at the owning node:
- module, submodule, or component plan docs

## Rule

Do not mix durable purpose with temporary execution checklists in the same
document by default.
