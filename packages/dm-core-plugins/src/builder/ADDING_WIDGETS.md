# Adding a widget to the UI builder

This guide shows how to add a new widget (a "block" in the palette) to the
drag-and-drop website builder — for example a **date picker**, a **rating**, a
**countdown**, or anything else.

You do **not** need to touch the builder's internals. Every widget lives in its
own small file, and you register it by adding **one line** to a list. That's it.

> **TL;DR** — Create one file in `builder/widgets/`, add one import line to
> `builder/widgets/index.ts`. Done. Skip to [The 3-minute version](#the-3-minute-version).

---

## How the builder is organised

Everything about one widget lives in a single file:

```
packages/dm-core-plugins/src/builder/widgets/
├── index.ts              ← the ONE list of all widgets (you add a line here)
├── types.ts              ← the shape of a widget definition
├── heading.widget.ts     ← one file per widget …
├── button.widget.ts
├── table.widget.ts
├── chart.widget.ts
├── metric.widget.ts
├── datePicker.widget.tsx ← 👀 a complete worked example — copy this
└── …
```

Each `*.widget.ts` file exports a **widget definition** with three things:

| Part    | What it is                                                                 |
| ------- | -------------------------------------------------------------------------- |
| `block` | How the widget looks & behaves in the palette and the properties panel.    |
| `icon`  | The little icon on the palette card.                                       |
| `load`  | *(optional)* The component that draws the widget on the finished page.     |

When you add your file to the list in `index.ts`, the builder automatically:

- shows a **draggable card** in the palette,
- shows your **settings fields** in the properties panel on the right,
- **renders** your widget in Preview and on the published page.

No other files to edit. (Behind the scenes `blocks.ts`, `icons.ts` and the
plugin registry all read from this one list.)

---

## Two kinds of widgets

**1. Self-contained widget (has its own `load`).**
It draws itself from its settings — no database needed. Headings, buttons,
tables, charts, metrics and the date-picker example all work this way. Choose
this for almost everything.

**2. Reuse-an-existing-plugin widget (no `load`).**
It's just a palette card that points at a plugin that already exists (like the
`form` or `job` plugin). Use this only when you're wrapping an existing plugin.
See [`form.widget.ts`](./widgets/form.widget.ts) for the tiny version.

The rest of this guide covers kind #1, which is what you'll want almost always.

---

## The 3-minute version

Say you want a **Date picker**. Here's the whole thing.

### Step 1 — Create `builder/widgets/datePicker.widget.tsx`

```tsx
import type { IUIPlugin } from '@development-framework/dm-core'
import { calendar } from '@equinor/eds-icons'
import { useState } from 'react'
import type { TWidgetDefinition } from './types'

// What settings this widget stores.
interface DatePickerConfig {
  label?: string
  value?: string // starting date, YYYY-MM-DD
  helperText?: string
}

// The component drawn on the finished page.
const DatePickerWidget = (
  props: Omit<IUIPlugin, 'config'> & { config: DatePickerConfig }
): React.ReactElement => {
  const { label = 'Pick a date', value = '', helperText } = props.config
  const [date, setDate] = useState(value)

  return (
    <div className='dm-plugin-padding' style={{ width: '100%' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {label}
        <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      {helperText ? <small>{helperText}</small> : null}
    </div>
  )
}

// The palette entry.
export const datePickerWidget: TWidgetDefinition = {
  icon: calendar,
  load: () => Promise.resolve({ default: DatePickerWidget }),
  block: {
    id: 'date-picker',
    label: 'Date picker',
    icon: 'calendar',
    category: 'data',
    description: 'Let visitors pick a date.',
    contentModel: 'content',
    defaultSize: { columns: 4, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-date-picker',
    defaultConfig: { label: 'Pick a date' },
    hideTitle: true,
    fields: [
      { label: 'Label', type: 'text', target: { kind: 'config', key: 'label' } },
      { label: 'Default date', type: 'text', target: { kind: 'config', key: 'value' } },
      { label: 'Helper text', type: 'text', target: { kind: 'config', key: 'helperText' } },
    ],
  },
}
```

> A full, commented version of this exact file already lives at
> [`widgets/datePicker.widget.tsx`](./widgets/datePicker.widget.tsx) — open it
> and copy it.

### Step 2 — Register it (the one line)

Open [`builder/widgets/index.ts`](./widgets/index.ts) and add two lines:

```ts
import { datePickerWidget } from './datePicker.widget' // ← 1) import it

export const WIDGET_DEFINITIONS: TWidgetDefinition[] = [
  // …all the existing widgets…
  datePickerWidget, // ← 2) add it to the list
]
```

### Step 3 — See it

Start the example app, open the builder, and your **Date picker** card is in the
palette under **Data**. Drag it onto the page. That's it. 🎉

---

## Filling in the `block` — every option explained

```ts
block: {
  id: 'date-picker',            // unique short id (kebab-case)
  label: 'Date picker',         // name shown on the palette card
  icon: 'calendar',             // MUST match the `icon:` above (see Icons below)
  category: 'data',             // which palette group: layout | content | media | data
  description: 'Let visitors pick a date.', // tooltip + edit-mode placeholder
  contentModel: 'content',      // 'content' = draws itself; 'data' = binds to an entity
  defaultSize: { columns: 4, rows: 1 }, // size (in grid cells) when first dropped
  recipe: '@development-framework/dm-core-plugins/static-date-picker', // unique id, see below
  defaultConfig: { label: 'Pick a date' }, // starting settings so it looks right immediately
  hideTitle: true,              // true for self-drawing widgets (no auto title bar)
  fields: [ /* settings shown in the properties panel — see next section */ ],
},
```

A few rules of thumb:

- **`id`** and **`recipe`** must be **unique** across all widgets. A test will
  fail loudly if they aren't (see [Troubleshooting](#troubleshooting)).
- **`recipe`** is the internal address of your component. For self-contained
  widgets, use the pattern
  `@development-framework/dm-core-plugins/static-<your-name>`.
- **`category`** picks the palette section. Pick the closest of: `layout`,
  `content`, `media`, `data`.
- **`hideTitle: true`** for widgets that draw their own content (almost all of
  them). Leave it off for data-bound widgets that want a title bar.

---

## The `fields` — building the properties panel

Every entry in `fields` becomes one control in the right-hand properties panel.
Whatever the user types is saved into the widget's config and passed to your
component as `props.config`.

```ts
{
  label: 'Label',                          // shown next to the control
  type: 'text',                            // which control to render (table below)
  target: { kind: 'config', key: 'label' }, // where to store the value
  placeholder: '2026-07-01',               // optional greyed-out hint
  help: 'Caption shown above the picker.', // optional helper line
  options: [ … ],                          // only for type: 'select'
}
```

### Available field `type`s

| `type`          | Control shown            | Good for                                    |
| --------------- | ------------------------ | ------------------------------------------- |
| `text`          | single-line text box     | labels, URLs, colors, short values          |
| `textarea`      | multi-line text box      | paragraphs, lists of numbers                |
| `number`        | number input             | sizes, counts, decimals                     |
| `boolean`       | on/off switch            | toggles like "Open in new tab"              |
| `select`        | dropdown (needs `options`) | a fixed set of choices                    |
| `image-upload`  | file picker for images   | image widgets                               |
| `table-source`  | "write a table or import a file" editor | tables & chart data          |

A `select` field needs `options`:

```ts
{
  label: 'Alignment',
  type: 'select',
  target: { kind: 'config', key: 'align' },
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
}
```

### Where a field stores its value — `target`

| `target`                            | Saves to…                          | Read in your component as… |
| ----------------------------------- | ---------------------------------- | -------------------------- |
| `{ kind: 'config', key: 'xyz' }`    | your widget's settings (`config.xyz`) | `props.config.xyz`      |
| `{ kind: 'label' }`                 | the widget's display label         | (framework-handled)        |
| `{ kind: 'scope' }`                 | the data binding (a DMSS entity)   | (framework-handled)        |

For self-contained widgets you'll almost always use `{ kind: 'config', key: … }`.

---

## Writing the component

Your component receives its settings on `props.config`. Always give every
setting a default so a freshly dropped widget looks right:

```tsx
const { label = 'Pick a date', value = '' } = props.config
```

Tips:

- Add the `dm-plugin-padding` class to your outer element for consistent spacing.
- Use `style={{ width: '100%' }}` so the widget fills its grid cell.
- If content might overflow a small cell, add `overflow: 'hidden'`.
- Keep it **dependency-free** where you can (plain HTML/SVG), the same way the
  built-in Chart and Metric widgets do. That keeps the app small and fast.

---

## Icons

Each widget imports its own icon from `@equinor/eds-icons` and sets it in two
places that must match:

```ts
import { calendar } from '@equinor/eds-icons'
// …
icon: calendar,          // the actual icon data
block: { icon: 'calendar' /* the same name as a string */ }
```

To find a valid icon name, browse the [EDS icons gallery](https://eds.equinor.com/0eb62b4a1/p/9028cb-icons/b/393a97),
or list them locally:

```bash
node -e "console.log(Object.keys(require('@equinor/eds-icons')).join('\n'))" | grep calendar
```

You do **not** need to edit `icons.ts` — widget icons are picked up
automatically.

---

## Verifying your widget

From the repo root:

```bash
# Type-check
yarn workspace @development-framework/dm-core-plugins exec tsc --noEmit

# Run the builder tests (includes the registry guardrails)
yarn workspace @development-framework/dm-core-plugins exec jest src/builder

# Format & lint your new file
npx biome check --write packages/dm-core-plugins/src/builder/widgets/
```

Then try it live in the example app (see the builder [README](./README.md)).

---

## Troubleshooting

The registry test (`widgets/registry.test.ts`) checks common mistakes for you.
If a test fails, here's what it means:

| Message                                             | Fix                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| *gives every widget a unique block id*              | Two widgets share an `id`. Rename one.                              |
| *gives every widget a unique recipe*                | Two widgets share a `recipe`. Rename one.                           |
| *resolves every block icon to icon data*            | `block.icon` (string) doesn't match the imported `icon`. Make them the same. |
| *registers a runtime component for every static widget* | You gave a `load` but no matching component, or vice-versa.     |

Other common issues:

- **My card doesn't appear.** Did you add it to the array in `index.ts`?
- **It shows a grey placeholder in the canvas.** That's normal — the real
  widget only renders in **Preview** and on the published page. Edit mode shows
  a placeholder with the widget's `description`.
- **My settings don't do anything.** Check the `target` `key` matches the
  property you read in the component (`props.config.<key>`).

---

## Cheat sheet

1. Copy `datePicker.widget.tsx` → `myThing.widget.tsx`.
2. Change the component, the `id`, `recipe`, `label`, `icon`, and `fields`.
3. Import it and add it to the list in `index.ts`.
4. `tsc`, `jest`, `biome` → done.
