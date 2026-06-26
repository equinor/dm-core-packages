# Website builder

A drag-and-drop, WordPress-style page builder for the Data Modeling framework.

It lets users assemble pages visually — dragging widgets onto a canvas — instead
of hand-authoring nested `UiRecipe` / `GridPluginConfig` JSON.

## Design principle: build format == runtime format

The builder's editor model is the **same shape the runtime [`grid`](../grid)
plugin already consumes** (`TGridPluginConfig`). Anything authored in the builder
serializes to the canonical grid entity JSON and renders with the existing grid
renderer — there is no separate runtime format to maintain.

A "widget" dropped on the canvas is a grid item whose `viewConfig` points at a
plugin/recipe (Text, Image, Table, Form, or a nested Section).

## Status: Phase 0 (proof of concept)

Implemented:

- Plugin registered as `@development-framework/dm-core-plugins/builder`.
- Widget palette (Section, Text, Image, Table, Form) with draggable cards
  (`@dnd-kit`).
- CSS-grid canvas: drag a block from the palette (or click it) to add a widget;
  select and delete widgets; drop-target highlight and empty state.
- Edit / Preview toggle. Preview round-trips the model through
  `serialize`/`deserialize` and renders it with the runtime `grid` plugin.
- Read-only "Advanced: JSON" inspector.
- Pure, immutable editor model with unit tests (`model.ts` / `model.test.ts`).

## Architecture

| File | Responsibility |
| --- | --- |
| `types.ts` | Editor model, plugin config and block types. |
| `blocks.ts` | The widget catalogue shown in the palette. |
| `model.ts` | Pure transforms (add/remove/move) + serialize/deserialize. |
| `BuilderPlugin.tsx` | Plugin entry: state, `DndContext`, toolbar, mode switch. |
| `components/WidgetPalette.tsx` | Draggable palette cards grouped by category. |
| `components/Canvas.tsx` | Droppable grid canvas with selectable widgets. |

## Content model

- **Content widgets** (Text, Image) carry their own content inline.
- **Data widgets** (Table, Form) bind to an existing DMSS entity via
  `viewConfig.scope`.
- **Layout** (Section) is a container (a nested grid).

## Roadmap

- Phase 1 — move/resize widgets on the canvas; load existing pages for editing.
- Phase 2 — inspector that edits each widget via the `form` plugin (no JSON).
- Phase 3 — sections/nesting, responsive breakpoints, templates.
- Phase 4 — undo/redo, autosave, alignment guides, guardrails.
- Phase 5 — publish flow, example-app entry and demo blueprints.
