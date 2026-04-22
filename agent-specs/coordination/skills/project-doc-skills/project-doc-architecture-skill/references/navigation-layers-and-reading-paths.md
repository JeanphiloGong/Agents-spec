# Navigation Layers And Reading Paths

Use this reference when deciding where readers should start, which pages
should orient them, and which pages should own the current truth.

## Entrypoints

An entrypoint answers:

- where a reader should start
- what this repo or node is for
- where this reader should go next

Typical entrypoints:

- root `README.md` as the repository landing page
- `docs/README.md` as the documentation landing page
- module or submodule `README.md`

## Repository Landing Versus Docs Landing

Use root `README.md` to:

- state what the repository is
- give light runtime or developer orientation
- point readers to `docs/README.md`

Use `docs/README.md` to:

- own the docs index
- own the recommended reading map
- route readers into overview, authority, and local detail pages

Do not turn root `README.md` into the full docs homepage when `docs/README.md`
exists.

## Overview Pages

Overview pages answer:

- what the major parts are
- how they relate
- where the deeper source of truth lives

Overview pages should summarize and route. They should not absorb detailed
implementation truth that belongs to authority or detail pages.

## Discovery Versus Authority

Discovery pages help readers find the next correct page.

Common discovery layers:

- repository landing page
- documentation landing page
- overview pages
- indexes

Authority pages are where the repository expects readers to rely on the
current truth for a given boundary.

Common authority layers:

- current-state pages
- stable contracts or specs
- node-local technical summaries

Discovery pages point. Authority pages own.

## Reading Paths By Intent

Most healthy documentation systems expose a route similar to:

- entrypoint
- overview
- authority page
- local detail

Common intent-based routes:

- new contributor: root README -> docs/README -> system overview -> module
  overview -> local current-state
- implementer: module entrypoint -> local current-state -> detailed plan ->
  verification notes
- reviewer: overview -> authority page -> related detail or historical context

## Bootstrap A Missing System Overview

When the system node lacks a usable overview page, inspect:

- top-level packages or services
- major ownership seams
- routing or API entrypoints
- background jobs or workers
- shared storage or external dependency surfaces
- existing docs that already describe subsystems

Then derive:

- system purpose and boundary
- major modules
- core flows
- major external interfaces
- links to module or submodule docs when they already exist

## Default Rule

A documentation tree is not enough by itself. Readers need a visible start
page, a readable map, and a clear route toward the page that owns the current
truth.
