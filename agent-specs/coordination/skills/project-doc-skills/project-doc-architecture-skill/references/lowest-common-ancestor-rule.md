# Lowest Common Ancestor Rule

Use this reference when deciding the correct placement node for a document.

## Rule

Place the document at the lowest common ancestor of the code objects,
responsibilities, or behaviors it describes.

## Examples

- system-wide architecture => root `docs/`
- one module's current-state => `<module>/docs/`
- one submodule plan => `<module>/<submodule>/docs/`
- one component detail => component-local `docs/` if durable docs are justified
- a change shared by two sibling submodules => their parent module's `docs/`
- a coverage note spanning `tests/unit/services` and `tests/unit/routers` =>
  `tests/unit/`

## Goal

Use the lowest location that keeps the document fully owned and discoverable
without scattering one knowledge surface across unrelated branches.
