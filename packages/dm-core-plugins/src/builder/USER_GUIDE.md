# Build & publish a website — user guide

A friendly, step-by-step guide to building a page or a multi-page site with the
drag-and-drop **Website builder** — no code, no JSON.

> **Who this is for:** anyone using the builder in the app. You do not need to be
> a developer. If you *are* a developer and want to add a new kind of widget, see
> the [Adding a widget guide](./ADDING_WIDGETS.md) instead.

> 📸 *Screenshots referenced below (e.g. `[screenshot: the editor]`) are
> placeholders — capture them from your running app and drop them in.*

---

## 1. Open the builder

Open the entity that holds your site in the app. It opens in the **Website
builder** with the editing toolbar across the top.

`[screenshot: the editor with the toolbar, palette, canvas and properties panel]`

If you only see the finished page with **no** toolbar or palette, you're looking
at the **read-only viewer** — either the page was set to view-only, or your role
isn't allowed to edit it. See [§13 Who can see it](#13-publishing--who-can-see-it).

---

## 2. The screen at a glance

| Area | Where | What it does |
| --- | --- | --- |
| **Toolbar** | top | Templates, Undo/Redo, Save, device width, grid density, **Advanced: JSON**, **Edit** / **Preview**. |
| **Pages** | far left | Your list of pages (and sub-pages). Add, rename, delete, reorder. |
| **Widgets** | left | The palette of blocks you drag onto the page. |
| **Canvas** | middle | The page itself — a grid you arrange widgets on. |
| **Outline** | left, below Widgets | A list of the widgets on the current page; click to select or drill into a Section. |
| **Properties** | right | Settings for the currently selected widget. |

---

## 3. Add your first widget

Two ways — whichever you prefer:

- **Drag** a card from **Widgets** onto the canvas, or
- **Click** a card to drop it onto the page.

`[screenshot: dragging a Heading card onto the canvas]`

In **Edit** mode a widget shows a **grey placeholder** with its name — that's
normal. You see the real thing in **Preview** (see [§11](#11-preview-device-width--grid-density)).

---

## 4. Move & resize

- **Move:** drag a widget by its **header** to a new spot. It snaps to the grid.
- **Resize:** drag the **corner handle**.
- Overlapping isn't allowed — a move or resize that would cover another widget is
  rejected and you'll get a small message.

Select a widget by clicking it. A selected widget shows **Duplicate** and
**Delete** buttons, plus the resize handle.

---

## 5. Edit a widget's settings — the Properties panel

Select a widget and the **Properties** panel on the right shows its settings,
grouped into sections:

| Section | What you set |
| --- | --- |
| **General** | The widget's title and label. |
| **Layout** | Position (column/row) and size (width/height), in grid cells. Alignment where relevant. |
| **Data** | *(optional)* Bind the widget to a document field (a "scope") instead of typing content by hand. |
| **Settings** | The widget-specific options — e.g. a heading's text & level, an image's caption, a table's contents. |

`[screenshot: the Properties panel for a selected Heading]`

You type into normal form controls — never JSON. (There's a read-only
**Advanced: JSON** view in the toolbar if you're curious what's stored.)

---

## 6. The widget catalog

Everything currently in the palette, by category:

### Layout
| Widget | What it's for |
| --- | --- |
| **Section** | A container to group and arrange other widgets. Double-click (or **Open section**) to edit what's inside; a breadcrumb takes you back out. |

### Content
| Widget | What it's for |
| --- | --- |
| **Heading** | A page title or section heading (levels H1–H6, alignment, color). |
| **Text** | Markdown text — type it inline or bind it to a document. |
| **Button** | A call-to-action button that links somewhere. |
| **Divider** | A horizontal line to separate sections. |
| **Spacer** | Empty vertical space between widgets. |

### Media
| Widget | What it's for |
| --- | --- |
| **Image** | An image or media asset — upload from your computer or bind to a file. |
| **Embed** | Embed a YouTube/Vimeo video or any external page. |

### Data
| Widget | What it's for |
| --- | --- |
| **Table** | A table you fill in by hand or import from CSV/Excel. |
| **Chart** | A line or bar chart drawn from a small table of numbers. |
| **Metric** | A single big-number KPI computed from a list of values. |
| **Date picker** | Let visitors pick a date. |

> Missing something (a rating, a countdown, a map…)? A developer can add it in a
> single file — see [ADDING_WIDGETS.md](./ADDING_WIDGETS.md).

---

## 7. Build a multi-page site

Use the **Pages** sidebar on the far left:

- **Add page** — the button at the bottom adds a new top-level page.
- **Add sub-page** — the "+" on a page nests a page beneath it (for grouped
  navigation).
- **Rename** — the pencil, or double-click the page name, then type.
- **Delete** — the trash icon. (You can't delete the last remaining page.)
- **Reorder** — drag a page to move it among its siblings.

`[screenshot: the Pages sidebar with a nested sub-page]`

Each page has its **own canvas**. Click a page to switch to it. Undo/redo and
saving cover the whole site, all pages together.

---

## 8. The top navbar

Every site can have a customizable **top navbar**.

- Open **Navbar settings** (the gear) to adjust it.
- Add links that jump to a page or an external URL.
- **Rename link** / **Delete link** from each link's controls; drag to reorder.

`[screenshot: the navbar with its settings popover open]`

The navbar shows in both Edit and the read-only viewer, so visitors can navigate
your pages.

---

## 9. Start from a template

Don't start from a blank page unless you want to. In the toolbar, **Start from a
template** seeds the current page with a ready-made layout (Blank page, Landing
page, Dashboard, Article). Then just edit the widgets.

---

## 10. Undo, redo, copy & paste

- **Undo:** the toolbar button or `Ctrl/Cmd + Z`.
- **Redo:** the toolbar button or `Ctrl/Cmd + Shift + Z` (also `Ctrl/Cmd + Y`).
- **Copy / paste** a widget: `Ctrl/Cmd + C`, `Ctrl/Cmd + V`.
- **Duplicate:** `Ctrl/Cmd + D` (or the Duplicate button on a selected widget).
- **Delete:** `Delete` / `Backspace`.
- **Deselect:** `Escape`.

(Shortcuts pause while you're typing in a text field, so they never eat your
keystrokes.)

---

## 11. Preview, device width & grid density

- **Edit / Preview** (toolbar): **Preview** renders the real page exactly as
  visitors see it — no editing chrome. Switch back with **Edit**.
- **Device width:** the desktop / tablet / mobile buttons show how the page looks
  at each width.
- **Grid density:** the zoom-out / `24×16` / zoom-in controls make the grid finer
  or coarser for precise placement (or `Ctrl/Cmd + scroll` over the canvas).

---

## 12. Saving

Your work is saved back to the underlying document:

- The toolbar shows a **status** — *All changes saved* / *Saving…* / *Unsaved
  changes*.
- Edits **autosave** shortly after you make them.
- You can also press **Save** at any time.
- If you try to close the tab with unsaved changes, the browser warns you.

There's no separate "publish" button — **saving is publishing**. The saved page
is the page your viewers see.

---

## 13. Publishing / who can see it

The site you build is stored as a normal document; **viewers see it live**.

- To show a **finished, non-editable** site to end users, it's mounted in
  **read-only** mode: they get the navbar, page navigation and content, but no
  editing tools.
- Access can also be **gated by role** — editors get the builder, everyone else
  gets the read-only viewer of the *same* page.

Setting that up (recipes, roles, where it's stored) is an app-configuration task
covered in the developer README under
[**Embedding & hosting**](./README.md#embedding--hosting-internal).

---

## 14. Tips & troubleshooting

- **My widget is just a grey box.** That's Edit mode. Switch to **Preview** to
  see it for real.
- **I can't drop a widget where I want.** It would overlap another widget — move
  the other one, resize, or make the grid finer (density).
- **My text/table is empty.** Select it and fill in the **Settings** section of
  the Properties panel (type it in, or import a file for tables).
- **I can't edit — there's no toolbar.** You're in the read-only viewer; you may
  not have an editing role for this page.
- **I want to undo everything.** Hold `Ctrl/Cmd + Z`; history covers the whole
  session.

---

## For developers

Want a new kind of widget (a date picker, a rating, a map…)? It's a one-file
change — see **[ADDING_WIDGETS.md](./ADDING_WIDGETS.md)**. For how the builder is
embedded and hosted, see the **[README](./README.md)**.
