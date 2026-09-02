# SaveCoordinator

`useSaveCoordinator.tsx` (in `packages/dm-core/src/hooks/`) lets independent,
unrelated plugins in the same rendered tree cooperate on two things they
otherwise have no way to share:

1. **Saving** - one "Save" action can persist itself *and* any nested plugin
   that has chosen to defer its own saving to it.
2. **Reactivity** - when one plugin's data changes, any other plugin looking
   at a related address can refresh automatically, without a manual reload.

It exists because plugins (`Form`, `Table`, `Graph`, ...) are otherwise
completely isolated: each fetches its own data, saves independently, and has
no way to know about siblings or descendants. See the two related files:

- `packages/dm-core/src/hooks/useSaveCoordinator.tsx` - the store, context and hooks
- `packages/dm-core/src/components/SaveCoordinatorAnchor.tsx` - a ready-made
  "claim the save button for this subtree" UI component

## Core concept: one shared store per rendered tree

`EntityView` (the component every nested plugin passes through via
`ViewCreator` -> `EntityView` -> plugin) calls `useSaveCoordinatorValue()`,
which reuses an ancestor's store if one already exists in context, or lazily
creates a new one. The result: however deep a plugin tree gets, everything
under one top-level `EntityView` shares exactly **one** `ISaveCoordinatorStore`.

Plugins rendered without any `EntityView` ancestor (pure standalone use) see
no store at all - every hook in this file safely no-ops in that case, so
standalone behavior is completely unaffected by this feature.

The store itself is a plain `Map` + a pub/sub listener `Set` - **not** React
state. Registering a plugin, or a plugin's dirty-state flipping (which can
happen on every keystroke), never re-renders the whole tree. Only components
that actually call `useSyncExternalStore` against it (via
`usePluginSaveRegistration` or `SaveCoordinatorAnchor`) re-render, and only
when the specific derived value they asked for actually changes.

## Registering a plugin: `usePluginSaveRegistration`

Any plugin that owns real, persistable data calls this once:

```tsx
const { isCoordinated, anyDirty, hasAnchorAbove, saveAll, notifyChanged } =
  usePluginSaveRegistration({
    id: `table:${idReference}`,
    idReference,
    isDirty: dirtyState,
    save: () => save(items),
    refetch: () => reloadData({}),
  })
```

| Field | Meaning |
|---|---|
| `id` | Unique per plugin *instance* (usually `"<pluginName>:<idReference>"`). |
| `idReference` | The address this plugin's data lives at - used to decide which other plugins are "related" for reactivity. |
| `isDirty` | Whether this plugin currently has unsaved local changes. |
| `save` | Called by an ancestor's `saveAll()` (or your own submit) to actually persist. |
| `refetch` | Called when a *related* plugin reports a change - re-fetch your own data. |

And what you get back:

- `isCoordinated` - `false` if there's no ancestor store at all (standalone use). Everything else safely no-ops in that case.
- `anyDirty` - whether *anything* registered in this coordinator scope is currently dirty (useful for a global "unsaved changes" indicator).
- `hasAnchorAbove` - see [The anchor problem](#the-anchor-problem-who-shows-the-save-button) below.
- `saveAll(excludeSelf = true)` - calls `save()` on every dirty registered entry (via `Promise.allSettled`, in passes - see below). Excludes your own entry by default, so calling this from inside your *own* successful save can't re-trigger yourself.
- `notifyChanged()` - broadcast "my data at `idReference` changed" to every other registered entry whose address is related (exact match, or a nested attribute/array-item path) - each one's `refetch()` fires automatically.

**⚠️ The one real gotcha:** never pass a bare `useState` setter (like `useList`'s `reloadData`) directly as `refetch`. `entry.refetch?.()` is called with *no arguments* - `reloadData(undefined)` is a no-op if the state was already `undefined`, and React silently skips the re-render. Always wrap it: `refetch: () => reloadData({})` (a fresh object reference every time, guaranteed to trigger the effect).

## The anchor problem: who shows the save button?

If every plugin registers with the coordinator, and a Table happens to be
nested inside a Form, should the Table still show its *own* Save button? If
it always does, you get two competing save actions for what the user
perceives as one entity. But we can't decide this from **tree position**
alone - almost every plugin has *some* `EntityView` ancestor, so "do I have
an ancestor" tells you nothing useful.

Instead, a plugin only defers if an ancestor has **explicitly claimed**
responsibility for saving. That claim is a separate, tiny piece of state:

```tsx
const SaveAnchorContext = createContext(false)
export const useHasSaveAnchor = () => useContext(SaveAnchorContext)
export function SaveAnchorBoundary({ children }) {
  return <SaveAnchorContext.Provider value={true}>{children}</SaveAnchorContext.Provider>
}
```

`FormPlugin` wraps its own rendered output in `<SaveAnchorBoundary>` whenever
it owns its own submit lifecycle. Any `Table` (or anything else calling
`usePluginSaveRegistration`) nested underneath then sees `hasAnchorAbove: true`
and can hide its own Save/Undo controls and buffer its writes instead of
persisting them immediately - trusting the ancestor's `saveAll()` to flush
them later.

**A `FormPlugin` rendered as a contained sub-object is a special case worth
calling out explicitly**, since it doesn't just hide its UI - it must not
register a real coordinator entry at all. When `Form.tsx` renders with
`showSubmitButton=false` (contained attribute, driven via `onChange` rather
than `onSubmit`), it reuses its *ancestor's* `react-hook-form` instance
(`useFormContext()`) instead of creating its own - `handleSubmit()` there
submits the whole shared form, not just that attribute's slice. `FormPlugin`
detects this (`isNested = !!props.onChange`) and passes `isDirty: false,
save: undefined` to `usePluginSaveRegistration` in that case, so `saveAll()`
never calls a nested Form's `save()` and PUTs the whole shared payload to
that attribute's own (wrong) address. Saving stays entirely owned by the true
ancestor Form.

For containers that have **no save UI of their own** (Stack, Grid, ...),
there's a ready-made component that does both the claiming *and* renders a
generic button:

```tsx
import { SaveCoordinatorAnchor } from '@development-framework/dm-core'

<SaveCoordinatorAnchor label="Save all changes">
  {/* nested plugins here automatically see hasAnchorAbove: true */}
</SaveCoordinatorAnchor>
```

It renders its children unchanged (no button, no claim) if there's no
coordinator at all, or if an ancestor has *already* claimed the anchor - so
nesting two of these is always safe; only the outermost one actually does
anything.

## Why this is a React Context, not the pub/sub store (the "debug situation")

The first version of this idea (discussed before building it) was to claim
the anchor **imperatively**, inside a `useEffect`, the same way plugin
registration works. That has a real, subtle bug: React fires `useEffect`
callbacks **child-before-parent** on mount. If a `Table`'s own registration
effect and a `Form`'s anchor-claiming effect both run on the same initial
mount, the *Table's* effect fires first - it would check "has an anchor been
claimed yet?", see `false` (because the Form's effect hasn't run yet), and
decide to show its own Save button. Only afterwards would the Form's effect
run and actually claim the anchor. The Table would eventually correct itself
on the next re-render (if it's subscribed reactively), but there's a real,
observable **flash of the wrong UI** - the Table's own button would appear
briefly before flipping to the deferred state.

**The fix: don't use the imperative store/effect mechanism for this at all.**
`SaveAnchorBoundary` uses a plain React Context `Provider`. Context values are
available to descendants **synchronously, during the very first render** of
those descendants - there's no effect-ordering race, because nothing is
waiting for an effect to fire. A `Table` rendered underneath a
`SaveAnchorBoundary` sees `hasAnchorAbove: true` on its first render, full
stop, no flash.

This is also why the file uses *two different mechanisms* for what looks
like a similar problem:

- **Dirty-state / save / refetch registration** uses the external pub/sub
  store + `useSyncExternalStore`, specifically to *avoid* triggering
  re-renders on every keystroke (there can be many entries, and updates are
  frequent).
- **Anchor claiming** uses plain React Context, specifically *because* claims
  are rare, roughly static for a component's lifetime, and need to be visible
  to descendants on their very first render - a normal Context re-render is
  free lunch here, and it sidesteps the mount-ordering race entirely.

If you're extending this system and are tempted to make anchor-claiming
"smarter" (e.g. tracking multiple candidate anchors, or letting a later-
mounted plugin steal the claim from an earlier one), keep this ordering
constraint in mind - anything based on effects firing in a particular order
is fragile by construction for exactly this reason.

## Known limitations / open follow-ups

- **Subordinate-view case: the stranded-edit race is now fixed.** A `Table`
  or `List` row that expands into an inline `Form`/`Yaml` editor for the
  *same* entity (`scope: "self"`) correctly hides its own submit button and
  defers to the ancestor anchor. The deeper race - the row editor's `save()`
  resolving causes the *Table's/List's own* dirty flag to flip true as a side
  effect (via the existing `onSubmit` -> `handleItemUpdate` ->
  `updateItem(..., false)` plumbing) - is fixed two ways together:
  `saveAll()` loops, re-checking for newly-dirtied entries after each pass,
  until a pass finds nothing left to save (capped at 10 passes, logging a
  warning if that cap is hit); and, critically, `Table`/`List`'s
  `handleItemUpdate` calls `coordinatorStore.update(entryId, { isDirty: true
  })` **synchronously**, not just their own `setState`. That second part
  matters a lot more than it looks: `usePluginSaveRegistration`'s own effect
  that would otherwise push `isDirty` into the store only runs after React
  re-renders the component, and a state update triggered from a resolved
  promise (not a React event) is flushed on React's scheduler - which is
  *not* guaranteed to happen before `saveAll()`'s very next pass re-checks
  for dirty entries. Relying on that render round-trip alone caused the
  original bug: clicking "Save all changes" after editing a row's value via
  its nested editor would report success (the row editor's own save request
  really did complete), but the parent Table/List's own copy of the item
  never got flushed - requiring a second click once React had caught up.
  **If you're wiring a new plugin with the same "nested editor writes back to
  a parent's local state" pattern, call `coordinatorStore.update(id, {
  isDirty: true })` yourself right where that local state changes - don't
  rely on `isDirty` passed into `usePluginSaveRegistration` to reach the
  store in time.**
- **Two leaf-write plugins pointed at the same address can still race.**
  Nothing stops two different registered entries (e.g. a `Table` and a `List`
  both configured on the same attribute) from both being dirty at once and
  both writing during the same `saveAll()` pass (`Promise.allSettled` runs a
  pass's entries in parallel) - each building its payload from its own
  possibly-stale local copy. The multi-pass loop serializes *sequencing*
  across passes, but entries within the *same* pass still race with each
  other if they happen to overlap on the same address.
- **Cross-plugin refetch only helps plugins that are actually mounted.** A
  `Meta` plugin showing "last modified" for the same entity as a `Form` will
  correctly refresh via `notifyChanged`/`refetch` if both are visible at once
  (e.g. in a `Stack`/`Grid`), but not if `Meta` sits behind an inactive tab in
  `Tabs`/`Sidebar` - unmounted plugins have already unregistered and can't be
  notified.
- **Reactivity only covers changes made through coordinated plugins in the
  same tree.** A change from another browser tab, or a backend job, won't
  trigger a `refetch()` - that would require migrating `useList` onto
  react-query (it currently bypasses react-query's cache entirely), a larger,
  separate piece of work.
- **Job/JobControl and Publish are intentionally not wired.** Their "unsaved"
  state (job configuration, a copy/link action) isn't the same kind of thing
  as an unsaved document edit, so sweeping them into a `saveAll()` would be
  semantically wrong - they're deliberately invisible to the coordinator.

## Which plugins are wired, and how

- **Read-write leaves** (register `isDirty` + `save` + `refetch`, and hide
  their own save UI when `hasAnchorAbove` is true): `Table`, `Form`, `List`,
  `DataGrid`, `Blueprint`. `Form` only registers a *real* entry when it owns
  its own submit lifecycle (top-level, or `hasAnchorAbove`); when rendered as
  a contained sub-object sharing an ancestor's shared form instance (see
  above), it registers with `isDirty: false, save: undefined` instead,
  deliberately opting itself out of `saveAll()`. `Yaml` registers
  `isDirty`/`save`/`refetch` too, but
  - deliberately - does **not** hide its own Save/Cancel UI when
  `hasAnchorAbove` is true (its text lives in an uncontrolled contentEditable
  node with no other way to exit edit mode; suppressing the button risked
  stranding the user mid-edit). This is an intentional inconsistency, not an
  oversight.
- **Read-only leaves** (register `refetch` only, never contribute to
  `saveAll`): `Graph`, `Json`, `Markdown`, `Meta`, `BlueprintHierarchy`,
  `MediaViewer`. `File` is a special case - uploads persist immediately (no
  deferred/unsaved state), so it only registers `refetch` and calls
  `notifyChanged()` after a successful upload.
- **Anchor-providing containers** (wrap their rendered content in
  `SaveCoordinatorAnchor`, giving nested plugins a shared "Save all" button
  for free, with no UI at all when nothing inside is savable): `Stack`,
  `Grid`, `ResponsiveGrid`, `Tabs`, `Sidebar`, `SingleView`.
- **Transparent passthroughs** (no coordinator involvement of their own, but
  don't block it either - context flows straight through them to whatever
  they render): `RoleFilter`, `Header`, `Explorer`.
- **Deliberately unwired**: `JobCreate`, `JobControl`, `Publish` - see above.
