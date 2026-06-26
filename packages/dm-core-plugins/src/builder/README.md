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

## Status: Phase 3 (sections, templates, device widths)

Implemented:

- Plugin registered as `@development-framework/dm-core-plugins/builder`.
- Widget palette (Section, Text, Image, Table, Form) with draggable cards
  (`@dnd-kit`).
- CSS-grid canvas: drag a block from the palette (or click it) to add a widget;
  select, delete and **duplicate** widgets; drop-target highlight and empty state.
- **Drag widgets by their header to reposition** them (pixel deltas snapped to
  grid cells) and **resize via a corner handle**. Moves and resizes are clamped
  to the grid and rejected when they would overlap another widget.
- **Property inspector** (right sidebar) for the selected widget — edit through
  typed form controls instead of JSON:
  - General: title and label.
  - Layout: column/row position and width/height (clamped, overlap-guarded).
  - Data binding: the `scope` attribute path the widget renders.
  - Settings: block-specific fields from the manifest (e.g. image caption/size),
    targeting config keys the runtime plugin actually consumes.
- Blocks carry a `defaultConfig` so a dropped widget renders in preview without
  manual setup.
- Edit / Preview toggle. Preview round-trips the model through
  `serialize`/`deserialize` and renders it with the runtime `grid` plugin.
  Existing pages can be loaded for editing via `config.initialConfig`.
- Read-only "Advanced: JSON" inspector.
- **Section nesting**: a Section widget is a nested grid. Drill into it (its
  "Open" button or a double-click) to edit its children on the same canvas; a
  breadcrumb shows the path and navigates back out.
- **Starter templates**: apply a preset layout (Blank, Landing, Dashboard,
  Article) from the toolbar to seed the page.
- **Device-width preview**: switch the canvas/preview width between desktop,
  tablet and mobile frames.
- Pure, immutable editor model with unit tests (`model.ts`, `gridMetrics.ts`,
  `templates.ts`).

## Architecture

| File | Responsibility |
| --- | --- |
| `types.ts` | Editor model, plugin config, block and inspector-field types. |
| `blocks.ts` | The widget catalogue + inspector fields shown in the palette. |
| `model.ts` | Pure transforms (add/remove/move/resize/duplicate/setters) + serialize. |
| `gridMetrics.ts` | Converts drag/resize pixel deltas into grid-cell deltas. |
| `BuilderPlugin.tsx` | Plugin entry: state, `DndContext`, toolbar, mode switch. |
| `templates.ts` | Starter page presets that build ready-to-edit models. |
| `components/WidgetPalette.tsx` | Draggable palette cards grouped by category. |
| `components/Canvas.tsx` | Grid canvas: drag-to-move, resize, select, drill-in, device frame. |
| `components/Inspector.tsx` | Property panel for the selected widget. |
| `components/TemplatesMenu.tsx` | Toolbar menu listing the starter templates. |

## Content model

- **Content widgets** (Text, Image) render document-backed content bound via
  `viewConfig.scope` (e.g. a markdown blob or a media file).
- **Data widgets** (Table, Form) bind to an existing DMSS entity via
  `viewConfig.scope`.
- **Layout** (Section) is a container (a nested grid).

## Known limitations

- Widgets are keyed by array index for React keys and dnd ids. This is safe for
  the current append/delete/duplicate operations; a stable per-widget id should
  be introduced before adding reorder support (tracked for Phase 4).
- Grid gaps are assumed to be `px` values when snapping drag/resize deltas.
- Inspector config fields are silent no-ops for widgets that use a recipe
  reference (string) rather than an inline recipe.
- `serialize()` adds DMSS type discriminators to the **root** grid only; the
  nested grids inside Section widgets are kept as raw builder models. Making
  serialization fully recursive (with a symmetric recursive `deserialize` to
  preserve the round-trip) is deferred to Phase 5 (persistence).

## Roadmap

- Phase 1 — move/resize widgets on the canvas; load existing pages. ✅
- Phase 2 — inspector that edits each widget via typed controls (no JSON). ✅
- Phase 3 — sections/nesting, responsive breakpoints, templates. ✅
- Phase 4 — undo/redo, autosave, alignment guides, guardrails.
- Phase 5 — publish flow, example-app entry and demo blueprints.
