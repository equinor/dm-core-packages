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

## Status: Phase 5 (publish & docs)

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
- **Undo/redo** (toolbar + `Ctrl/Cmd+Z`, `Shift+Z`, `Y`) over an immutable
  history; consecutive related edits (a drag-resize, typing in one field)
  collapse into a single undo step.
- **Keyboard editing**: `Ctrl/Cmd+C/V` copy & paste, `Ctrl/Cmd+D` duplicate,
  `Delete`/`Backspace` remove, `Escape` deselect (inert while typing in a field).
- **Outline panel** beneath the palette: select any widget in the current grid
  and drill into sections.
- **Toast feedback**: overlap-rejected moves/resizes and edit actions surface a
  friendly message instead of failing silently.
- **Dirty-state & autosave**: a toolbar status (All changes saved / Saving… /
  Unsaved changes) reflects unsaved work; edits autosave through `onChange` (when
  provided) after a short debounce, and the browser warns before leaving with
  unsaved changes.
- Pure, immutable editor model with unit tests (`model.ts`, `gridMetrics.ts`,
  `templates.ts`, `history.ts`).
- **Recursive (de)serialization**: Section grids are serialized with the same
  DMSS `type` discriminators as the root, so nested layouts render at runtime
  and round-trip cleanly through `serialize`/`deserialize`.

## Try it in the example app

A demo page is wired into the example DemoDataSource. After `./reset-app.sh`
and `yarn start:example`, open:

```
/view/?documentId=dmss://DemoDataSource/$builderPageExample
```

It mounts the builder with a seeded layout (a page form + a nested Section) via
`config.initialConfig`. The blueprint/recipe/entity live under
`example/app/data/DemoDataSource/{plugins,recipes}/builder/example/`.

## Architecture

| File | Responsibility |
| --- | --- |
| `types.ts` | Editor model, plugin config, block and inspector-field types. |
| `widgets/` | **The widget registry** — one file per palette widget (metadata + icon + optional component loader), collected in `widgets/index.ts`. Adding a widget happens here and nowhere else. See [`ADDING_WIDGETS.md`](./ADDING_WIDGETS.md). |
| `blocks.ts` | Thin re-export of `BLOCKS` / `getBlock` from the widget registry. |
| `icons.ts` | Editor-chrome icons, merged with each widget's own icon from the registry. |
| `model.ts` | Pure transforms (add/remove/move/resize/duplicate/insert/setters), nesting helpers and serialize. |
| `gridMetrics.ts` | Converts drag/resize pixel deltas into grid-cell deltas. |
| `history.ts` | Immutable undo/redo stack + `useHistory` hook (with coalescing). |
| `toast.ts` | `useToast` single-slot transient feedback state. |
| `BuilderPlugin.tsx` | Plugin entry: state, history, `DndContext`, toolbar, mode switch, shortcuts, autosave. |
| `templates.ts` | Starter page presets that build ready-to-edit models. |
| `components/WidgetPalette.tsx` | Draggable palette cards grouped by category. |
| `components/Outline.tsx` | List of widgets in the active grid for select/drill-in. |
| `components/Canvas.tsx` | Grid canvas: drag-to-move, resize, select, drill-in, device frame. |
| `components/Inspector.tsx` | Property panel for the selected widget. |
| `components/TemplatesMenu.tsx` | Toolbar menu listing the starter templates. |
| `components/Toast.tsx` | Renders the current toast (EDS `Snackbar`). |
| `tests/` | All builder unit tests (model, grid metrics, history, templates, site, markdown/math helpers, widget registry). |

## Adding your own widgets

The palette is fully extensible. Adding a widget (a date picker, a rating, a
countdown…) is a **one-file, one-line** change — you don't touch the builder's
internals. See the step-by-step **[Adding a widget guide](./ADDING_WIDGETS.md)**,
which walks through a complete date-picker example. A working reference lives at
[`widgets/datePicker.widget.tsx`](./widgets/datePicker.widget.tsx).

## Content model

- **Content widgets** (Text, Image, Table) render self-contained content: Text
  and Table store inline markdown, Image stores an uploaded file address. Image
  upload and Table CSV/Excel upload are handled in the inspector; binding a
  `viewConfig.scope` to a document still works as an alternative.
- **Data widgets** (Form) bind to an existing DMSS entity via `viewConfig.scope`.
- **Layout** (Section) is a container (a nested grid).

## Known limitations

- Widgets are keyed by array index for React keys and dnd ids. This is safe for
  the current append/delete/duplicate/paste operations; a stable per-widget id
  should be introduced before adding free reordering (tracked for Phase 5).
- Grid gaps are assumed to be `px` values when snapping drag/resize deltas.
- Inspector config fields are silent no-ops for widgets that use a recipe
  reference (string) rather than an inline recipe.

## Roadmap

- Phase 1 — move/resize widgets on the canvas; load existing pages. ✅
- Phase 2 — inspector that edits each widget via typed controls (no JSON). ✅
- Phase 3 — sections/nesting, responsive breakpoints, templates. ✅
- Phase 4 — undo/redo, copy/paste, outline, toasts, autosave & dirty guard. ✅
- Phase 5 — publish flow, example-app entry and demo blueprints. ✅
