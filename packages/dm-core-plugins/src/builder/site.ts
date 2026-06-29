import { createEmptyModel, deserialize, serialize } from './model'
import type { TBuilderModel } from './types'

/** DMSS type discriminators for the multi-page site wrapper. */
export const SITE_TYPE = 'PLUGINS:dm-core-plugins/builder/Site'
export const PAGE_TYPE = 'PLUGINS:dm-core-plugins/builder/Page'

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
 * nav sidebar. There is always at least one top-level page.
 */
export type TBuilderSite = {
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

/** Create a page with the given title and (optionally) an existing layout. */
export const createPage = (
  title: string,
  layout: TBuilderModel = createEmptyModel()
): TBuilderPage => ({ id: createPageId(), title, layout, children: [] })

/** Create a site seeded with a single empty "Home" page. */
export const createEmptySite = (): TBuilderSite => ({
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

/** Serialize a site to canonical DMSS JSON (adds `type` discriminators). */
export const serializeSite = (site: TBuilderSite): Record<string, unknown> => ({
  type: SITE_TYPE,
  pages: site.pages.map(serializePage),
})

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
 * Rebuild a site from stored JSON. Accepts either the multi-page wrapper or a
 * legacy single-grid layout (which is wrapped into a one-page "Home" site), so
 * pages authored before multi-page support still load. Legacy pages without a
 * `children` array deserialize as leaf pages.
 */
export const deserializeSite = (raw: unknown): TBuilderSite => {
  if (isSerializedSite(raw)) {
    const pages = (raw as { pages: unknown[] }).pages
      .filter((page): page is Record<string, unknown> => !!page)
      .map(deserializePage)
    return pages.length > 0 ? { pages } : createEmptySite()
  }
  // Legacy or seed: a single grid layout becomes the site's only page.
  return { pages: [createPage('Home', deserialize(raw))] }
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

const reorder = (
  pages: TBuilderPage[],
  from: number,
  to: number
): TBuilderPage[] => {
  const count = pages.length
  if (from < 0 || from >= count) return pages
  const target = Math.min(Math.max(0, to), count - 1)
  if (target === from) return pages
  const next = [...pages]
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
