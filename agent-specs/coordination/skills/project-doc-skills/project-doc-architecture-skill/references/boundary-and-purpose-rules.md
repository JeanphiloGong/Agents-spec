# Boundary And Purpose Rules

Use this reference when deciding what parents should summarize, what children
should keep, and where durable purpose or temporary goals should live.

## Project Purpose

Place project purpose at the system node:

- root `README.md`
- system overview or overview subtree under `docs/`

Do not make `docs/README.md` the only home of project identity by default. It
should route readers through the docs system rather than replace the repo
landing page.

## Module Or Submodule Purpose

Place module or submodule purpose at the owning node:

- `<module>/README.md`
- `<module>/<submodule>/README.md`
- or a node-local purpose page when the root README is not the right home

Do not place node purpose inside a docs-only grouping folder by default.

## Phase Goals Versus Delivery Goals

Place phase or milestone goals at the system level:

- roadmap
- planning docs
- tracked issues

Place detailed implementation goals at the owning node:

- module plan docs
- submodule plan docs
- component-local delivery pages

Do not mix durable purpose with temporary execution checklists in the same
document by default.

## Parent Pages Should

- define boundary and scope
- summarize the child surface
- link to child docs
- act as indexes when needed

## Parent Pages Should Not

- hold child file change lists
- hold child verification slices
- hold child execution order
- become the only home of child local risks

## Child Pages Should

- retain detailed plans
- retain local implementation detail
- retain local verification and risks
- retain the most specific current-state explanation for the child node

## Default Rule

Parents own boundaries and navigation. Children own local detail.
