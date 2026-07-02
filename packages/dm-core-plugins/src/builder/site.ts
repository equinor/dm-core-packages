import { createEmptyModel, deserialize, serialize } from './model'
import type { TBuilderModel } from './types'

/** DMSS type discriminators for the multi-page site wrapper. */
export const SITE_TYPE = 'PLUGINS:dm-core-plugins/builder/Site'
export const PAGE_TYPE = 'PLUGINS:dm-core-plugins/builder/Page'
export const NAVBAR_TYPE = 'PLUGINS:dm-core-plugins/builder/Navbar'
export const NAVBAR_ITEM_TYPE = 'PLUGINS:dm-core-plugins/builder/NavbarItem'

/**
 * Version of the serialized site format. Bump this whenever the stored shape
 * changes in a way that needs migrating, and add a matching case to
 * `migrateSite` so older saved sites keep loading.
 */
export const SITE_SCHEMA_VERSION = 1

/**
 * Where a navbar link points. `page` links navigate within the site (SPA-style)
 * to one of its pages; `url` links open an external address.
 */
export type TNavbarItemTarget =
  | { kind: 'page'; pageId: string }
  | { kind: 'url'; href: string }

/** A single clickable link shown in the top navbar. */
export type TNavbarItem = {
  id: string
  label: string
  target: TNavbarItemTarget
}

/**
 * The site's customizable top navigation bar, shared across every page (like a
 * real website header). Rendered in both edit and preview so the canvas stays
 * WYSIWYG. `enabled` is false by default so existing sites are unchanged until
 * the author opts in via the "Add navbar" affordance.
 */
export type TNavbar = {
  enabled: boolean
  brand: string
  background: string
  color: string
  brandColor: string
  /** Horizontal placement of the link group within the bar. */
  align: 'left' | 'center' | 'right'
  items: TNavbarItem[]
}

/**
 * A single navigable page in the site. `id` is a stable handle used by the nav
 * sidebar to switch/route; `title` doubles as the nav label; `layout` is the
 * page's grid model (the same shape the runtime grid plugin consumes).
 *
 * `children` are sub-pages reachable from this page's nav menu, nestable to any
 * depth so the sidebar can render an infinitely deep menu tree.
 */
export type TBuilderPage = {
  id: string
  title: string
  layout: TBuilderModel
  children: TBuilderPage[]
}

/**
 * A website built in the builder: an ordered tree of pages reachable from the
 * nav sidebar, plus a customizable top navbar shared by every page. There is
 * always at least one top-level page.
 */
export type TBuilderSite = {
  navbar: TNavbar
  pages: TBuilderPage[]
}

/** Where a page sits in the tree: its siblings, index, and parent (null=root). */
export type TPageContext = {
  page: TBuilderPage
  parentId: string | null
  siblings: TBuilderPage[]
  index: number
}

let pageCounter = 0

/** Generate a reasonably unique, stable page id. */
export const createPageId = (): string => {
  pageCounter += 1
  return `page-${Date.now().toString(36)}-${pageCounter}`
}

let navItemCounter = 0

/** Generate a reasonably unique, stable navbar item id. */
export const createNavItemId = (): string => {
  navItemCounter += 1
  return `nav-${Date.now().toString(36)}-${navItemCounter}`
}

/** Create a page with the given title and (optionally) an existing layout. */
export const createPage = (
  title: string,
  layout: TBuilderModel = createEmptyModel()
): TBuilderPage => ({ id: createPageId(), title, layout, children: [] })

/** A sensible, disabled-by-default navbar (opt-in via the builder UI). */
export const createDefaultNavbar = (): TNavbar => ({
  enabled: false,
  brand: 'My Site',
  background: '#ffffff',
  color: '#3d3d3d',
  brandColor: '#007079',
  align: 'right',
  items: [],
})

/** Create a site seeded with a single empty "Home" page and a default navbar. */
export const createEmptySite = (): TBuilderSite => ({
  navbar: createDefaultNavbar(),
  pages: [createPage('Home')],
})

/** True when a stored value is the serialized multi-page site wrapper. */
export const isSerializedSite = (raw: unknown): boolean =>
  !!raw &&
  typeof raw === 'object' &&
  Array.isArray((raw as { pages?: unknown }).pages)

const serializePage = (page: TBuilderPage): Record<string, unknown> => ({
  type: PAGE_TYPE,
  id: page.id,
  title: page.title,
  layout: serialize(page.layout),
  children: page.children.map(serializePage),
})

const serializeNavItem = (item: TNavbarItem): Record<string, unknown> => ({
  type: NAVBAR_ITEM_TYPE,
  id: item.id,
  label: item.label,
  targetKind: item.target.kind,
  ...(item.target.kind === 'page'
    ? { pageId: item.target.pageId }
    : { href: item.target.href }),
})

const serializeNavbar = (navbar: TNavbar): Record<string, unknown> => ({
  type: NAVBAR_TYPE,
  enabled: navbar.enabled,
  brand: navbar.brand,
  background: navbar.background,
  color: navbar.color,
  brandColor: navbar.brandColor,
  align: navbar.align,
  items: navbar.items.map(serializeNavItem),
})

/** Serialize a site to canonical DMSS JSON (adds `type` discriminators). */
export const serializeSite = (site: TBuilderSite): Record<string, unknown> => ({
  type: SITE_TYPE,
  schemaVersion: SITE_SCHEMA_VERSION,
  navbar: serializeNavbar(site.navbar),
  pages: site.pages.map(serializePage),
})

const deserializeNavItem = (raw: Record<string, unknown>): TNavbarItem => {
  const target: TNavbarItemTarget =
    raw.targetKind === 'url'
      ? { kind: 'url', href: typeof raw.href === 'string' ? raw.href : '' }
      : {
          kind: 'page',
          pageId: typeof raw.pageId === 'string' ? raw.pageId : '',
        }
  return {
    id: typeof raw.id === 'string' ? raw.id : createNavItemId(),
    label: typeof raw.label === 'string' ? raw.label : 'Link',
    target,
  }
}

/**
 * Rebuild a navbar from stored JSON, falling back to the default for any
 * missing field so sites authored before the navbar existed still load.
 */
const deserializeNavbar = (raw: unknown): TNavbar => {
  const base = createDefaultNavbar()
  if (!raw || typeof raw !== 'object') return base
  const obj = raw as Record<string, unknown>
  return {
    enabled: typeof obj.enabled === 'boolean' ? obj.enabled : base.enabled,
    brand: typeof obj.brand === 'string' ? obj.brand : base.brand,
    background:
      typeof obj.background === 'string' ? obj.background : base.background,
    color: typeof obj.color === 'string' ? obj.color : base.color,
    brandColor:
      typeof obj.brandColor === 'string' ? obj.brandColor : base.brandColor,
    align:
      obj.align === 'left' || obj.align === 'center' || obj.align === 'right'
        ? obj.align
        : base.align,
    items: Array.isArray(obj.items)
      ? obj.items
          .filter((item): item is Record<string, unknown> => !!item)
          .map(deserializeNavItem)
      : [],
  }
}

const deserializePage = (raw: Record<string, unknown>): TBuilderPage => ({
  id: typeof raw.id === 'string' ? raw.id : createPageId(),
  title: typeof raw.title === 'string' ? raw.title : 'Page',
  layout: deserialize(raw.layout),
  children: Array.isArray(raw.children)
    ? raw.children
        .filter((child): child is Record<string, unknown> => !!child)
        .map(deserializePage)
    : [],
})

/**
 * Read the stored `schemaVersion`, defaulting to 1 for sites saved before the
 * field existed (or legacy single-grid layouts).
 */
const readSchemaVersion = (raw: unknown): number => {
  if (raw && typeof raw === 'object') {
    const value = (raw as { schemaVersion?: unknown }).schemaVersion
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  return 1
}

/** Upgrades a stored payload from one schema version to the next. */
type TSiteMigration = (raw: Record<string, unknown>) => Record<string, unknown>

/**
 * Ordered migrations keyed by the version they upgrade *from*. Empty today
 * (every supported version loads directly); when the stored shape changes, bump
 * `SITE_SCHEMA_VERSION` and add an entry here, e.g. `1: migrateV1toV2`.
 */
const SITE_MIGRATIONS: Record<number, TSiteMigration> = {}

/**
 * Migrate a stored site payload up to the current `SITE_SCHEMA_VERSION` by
 * applying each registered migration in turn, so older saved sites keep loading
 * after the format evolves.
 */
const migrateSite = (raw: Record<string, unknown>): Record<string, unknown> => {
  let current = raw
  let version = readSchemaVersion(current)
  while (version < SITE_SCHEMA_VERSION && SITE_MIGRATIONS[version]) {
    current = SITE_MIGRATIONS[version](current)
    version = readSchemaVersion(current)
  }
  return current
}

/**
 * Rebuild a site from stored JSON. Accepts either the multi-page wrapper or a
 * legacy single-grid layout (which is wrapped into a one-page "Home" site), so
 * pages authored before multi-page support still load. Legacy pages without a
 * `children` array deserialize as leaf pages; a missing navbar defaults to the
 * disabled default so older sites are unchanged. Older `schemaVersion`s are
 * migrated forward via `migrateSite` before deserializing.
 */
export const deserializeSite = (raw: unknown): TBuilderSite => {
  if (isSerializedSite(raw)) {
    const migrated = migrateSite(raw as Record<string, unknown>)
    const source = migrated as { pages: unknown[]; navbar?: unknown }
    const navbar = deserializeNavbar(source.navbar)
    const pages = source.pages
      .filter((page): page is Record<string, unknown> => !!page)
      .map(deserializePage)
    return pages.length > 0 ? { navbar, pages } : createEmptySite()
  }
  // Legacy or seed: a single grid layout becomes the site's only page.
  return {
    navbar: createDefaultNavbar(),
    pages: [createPage('Home', deserialize(raw))],
  }
}

/** Index of the top-level page with `id`, or -1 when absent. */
export const findPageIndex = (site: TBuilderSite, id: string): number =>
  site.pages.findIndex((page) => page.id === id)

/** Locate a page anywhere in the tree along with its sibling context. */
export const findPageContext = (
  site: TBuilderSite,
  id: string
): TPageContext | null => {
  const walk = (
    siblings: TBuilderPage[],
    parentId: string | null
  ): TPageContext | null => {
    for (let index = 0; index < siblings.length; index += 1) {
      const page = siblings[index]
      if (page.id === id) return { page, parentId, siblings, index }
      const nested = walk(page.children, page.id)
      if (nested) return nested
    }
    return null
  }
  return walk(site.pages, null)
}

/** Find a page anywhere in the tree, or null when absent. */
export const findPage = (site: TBuilderSite, id: string): TBuilderPage | null =>
  findPageContext(site, id)?.page ?? null

/** The chain of pages from the root down to (and including) `id`, or []. */
export const findPagePath = (
  site: TBuilderSite,
  id: string
): TBuilderPage[] => {
  const walk = (
    siblings: TBuilderPage[],
    trail: TBuilderPage[]
  ): TBuilderPage[] | null => {
    for (const page of siblings) {
      const next = [...trail, page]
      if (page.id === id) return next
      const nested = walk(page.children, next)
      if (nested) return nested
    }
    return null
  }
  return walk(site.pages, []) ?? []
}

/**
 * Apply `updater` to the page with `id` wherever it sits in the tree, returning
 * a new page list (or the same reference when nothing changed). Sharing this
 * walker keeps every mutation immutable and structurally minimal.
 */
const updatePageInList = (
  pages: TBuilderPage[],
  id: string,
  updater: (page: TBuilderPage) => TBuilderPage
): TBuilderPage[] => {
  let changed = false
  const next = pages.map((page) => {
    if (page.id === id) {
      const updated = updater(page)
      if (updated !== page) changed = true
      return updated
    }
    const children = updatePageInList(page.children, id, updater)
    if (children !== page.children) {
      changed = true
      return { ...page, children }
    }
    return page
  })
  return changed ? next : pages
}

const uniqueChildTitle = (siblings: TBuilderPage[], title?: string): string => {
  if (title) return title
  const used = new Set(siblings.map((page) => page.title))
  let n = siblings.length + 1
  while (used.has(`Page ${n}`)) n += 1
  return `Page ${n}`
}

/**
 * Append a new empty page and return the updated site plus the new page id.
 * With `parentId` the page is added as a sub-page of that parent; otherwise it
 * becomes a new top-level page.
 */
export const addPage = (
  site: TBuilderSite,
  parentId: string | null = null,
  title?: string
): { site: TBuilderSite; id: string } => {
  if (!parentId) {
    const page = createPage(uniqueChildTitle(site.pages, title))
    return { site: { ...site, pages: [...site.pages, page] }, id: page.id }
  }
  let newId = ''
  const pages = updatePageInList(site.pages, parentId, (parent) => {
    const page = createPage(uniqueChildTitle(parent.children, title))
    newId = page.id
    return { ...parent, children: [...parent.children, page] }
  })
  if (!newId) return { site, id: '' }
  return { site: { ...site, pages }, id: newId }
}

/** Immutably rename a page anywhere in the tree; no-op for an unknown id. */
export const renamePage = (
  site: TBuilderSite,
  id: string,
  title: string
): TBuilderSite => {
  const pages = updatePageInList(site.pages, id, (page) => ({ ...page, title }))
  return pages === site.pages ? site : { ...site, pages }
}

const removeFromList = (pages: TBuilderPage[], id: string): TBuilderPage[] => {
  let changed = false
  const next: TBuilderPage[] = []
  for (const page of pages) {
    if (page.id === id) {
      changed = true
      continue
    }
    const children = removeFromList(page.children, id)
    if (children !== page.children) {
      changed = true
      next.push({ ...page, children })
    } else {
      next.push(page)
    }
  }
  return changed ? next : pages
}

/**
 * Immutably remove a page (and its entire sub-tree). The last remaining
 * top-level page is never removed (a site always keeps at least one page), so
 * the call is a no-op in that case. Sub-pages are always removable.
 */
export const removePage = (site: TBuilderSite, id: string): TBuilderSite => {
  const isRoot = site.pages.some((page) => page.id === id)
  if (isRoot && site.pages.length <= 1) return site
  const pages = removeFromList(site.pages, id)
  return pages === site.pages ? site : { ...site, pages }
}

/** Replace a page's grid layout immutably; no-op for an unknown id. */
export const setPageLayout = (
  site: TBuilderSite,
  id: string,
  layout: TBuilderModel
): TBuilderSite => {
  const pages = updatePageInList(site.pages, id, (page) =>
    page.layout === layout ? page : { ...page, layout }
  )
  return pages === site.pages ? site : { ...site, pages }
}

const reorder = <T>(list: T[], from: number, to: number): T[] => {
  const count = list.length
  if (from < 0 || from >= count) return list
  const target = Math.min(Math.max(0, to), count - 1)
  if (target === from) return list
  const next = [...list]
  const [moved] = next.splice(from, 1)
  next.splice(target, 0, moved)
  return next
}

/**
 * Move a page within its sibling list from index `from` to `to` (both clamped).
 * `parentId` selects the sibling list (null = top-level). Used by the sidebar to
 * reorder nav items at a single level.
 */
export const movePage = (
  site: TBuilderSite,
  parentId: string | null,
  from: number,
  to: number
): TBuilderSite => {
  if (!parentId) {
    const pages = reorder(site.pages, from, to)
    return pages === site.pages ? site : { ...site, pages }
  }
  const pages = updatePageInList(site.pages, parentId, (parent) => {
    const children = reorder(parent.children, from, to)
    return children === parent.children ? parent : { ...parent, children }
  })
  return pages === site.pages ? site : { ...site, pages }
}

// ---- Navbar -------------------------------------------------------------

/** Immutably merge `patch` into the site's navbar. */
export const updateNavbar = (
  site: TBuilderSite,
  patch: Partial<TNavbar>
): TBuilderSite => ({ ...site, navbar: { ...site.navbar, ...patch } })

/**
 * Append a navbar link and return the updated site plus the new item id. The
 * link defaults to the first page when one exists, otherwise an empty URL, so a
 * freshly added item is immediately editable and valid.
 */
export const addNavItem = (
  site: TBuilderSite,
  target?: TNavbarItemTarget
): { site: TBuilderSite; id: string } => {
  const firstPage = site.pages[0]
  const resolved: TNavbarItemTarget =
    target ??
    (firstPage
      ? { kind: 'page', pageId: firstPage.id }
      : { kind: 'url', href: '' })
  const label =
    resolved.kind === 'page'
      ? (findPage(site, resolved.pageId)?.title ?? 'Link')
      : 'Link'
  const item: TNavbarItem = { id: createNavItemId(), label, target: resolved }
  return {
    site: {
      ...site,
      navbar: { ...site.navbar, items: [...site.navbar.items, item] },
    },
    id: item.id,
  }
}

/** Immutably merge `patch` into the navbar item with `id`; no-op if unknown. */
export const updateNavItem = (
  site: TBuilderSite,
  id: string,
  patch: Partial<TNavbarItem>
): TBuilderSite => {
  let changed = false
  const items = site.navbar.items.map((item) => {
    if (item.id !== id) return item
    changed = true
    return { ...item, ...patch }
  })
  return changed ? { ...site, navbar: { ...site.navbar, items } } : site
}

/** Immutably remove the navbar item with `id`; no-op if unknown. */
export const removeNavItem = (site: TBuilderSite, id: string): TBuilderSite => {
  const items = site.navbar.items.filter((item) => item.id !== id)
  return items.length === site.navbar.items.length
    ? site
    : { ...site, navbar: { ...site.navbar, items } }
}

/** Move a navbar item from index `from` to `to` (both clamped). */
export const moveNavItem = (
  site: TBuilderSite,
  from: number,
  to: number
): TBuilderSite => {
  const items = reorder(site.navbar.items, from, to)
  return items === site.navbar.items
    ? site
    : { ...site, navbar: { ...site.navbar, items } }
}
