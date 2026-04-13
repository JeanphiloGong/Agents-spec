# Entrypoint And Overview Rules

Use this reference when deciding where readers should start and which pages
should orient them before they descend into local detail.

## Entrypoint

An entrypoint answers:
- where should a reader start
- what is this repo or node for
- where should this reader go next

Typical entrypoints:
- root `README.md` as the repository landing page
- `docs/README.md` as the documentation landing page
- module or submodule `README.md`

## Repository Landing vs Docs Landing

Use root `README.md` to:
- state what the repository is
- give light runtime or developer orientation
- point readers to `docs/README.md`

Use `docs/README.md` to:
- own the docs index
- own the recommended reading map
- route readers into overview, authority, and local detail pages

## Overview

An overview answers:
- what are the major parts
- how do they relate
- where is the deeper source of truth

Overview pages should summarize and route. They should not absorb detailed
implementation truth that belongs to authority or detail pages.

## Rule

Entrypoints route readers into the system. Overview pages explain the map.
Neither should become the only home of deep local detail.
Do not turn root `README.md` into the full docs homepage when `docs/README.md`
exists.
