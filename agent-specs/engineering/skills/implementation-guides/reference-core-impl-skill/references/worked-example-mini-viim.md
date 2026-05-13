# Worked Example: Mini Viim

## Goal

Produce a tiny editor-like sample that teaches the core Vi/Vim-style interaction model without terminal/UI noise.

## Include In The Reference Sample

- editor state: buffer, cursor, mode
- at least `normal` and `insert` modes
- command dispatch by key input
- cursor movement with bounds checks
- insertion into the buffer
- one mode transition failure/boundary case

## Defer To Production

- full TUI rendering
- file IO and persistence
- window splits, registers, macros, undo tree
- plugin model
- config loading and keymap layering

## Good Reference Shape

- `EditorState`
- `handle_key(state, key)`
- `move_cursor(...)`
- `insert_text(...)`
- tiny scripted key sequence test

## Why This Is Minimal-Complete

- The core is modal state and command interpretation, not terminal plumbing.
- A human who can rebuild this sample understands mode transitions and edit semantics.
- Production rendering and IO can be layered back after the mental model is solid.

## First Mapping Back To Main

- map `handle_key` to the real input dispatch boundary
- map `EditorState` to the production editor session model
- reintroduce rendering and file adapters only after modal semantics are stable

