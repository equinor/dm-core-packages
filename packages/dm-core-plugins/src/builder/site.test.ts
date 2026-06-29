import { BLOCKS, getBlock } from './blocks'
import { addWidget, createEmptyModel, serialize } from './model'
import {
  addPage,
  createEmptySite,
  createPage,
  deserializeSite,
  findPage,
  findPageContext,
  findPageIndex,
  findPagePath,
  isSerializedSite,
  movePage,
  PAGE_TYPE,
  removePage,
  renamePage,
  SITE_TYPE,
  serializeSite,
  setPageLayout,
  type TBuilderSite,
} from './site'

const textBlock = getBlock('text') ?? BLOCKS[0]
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

describe('builder site', () => {
  it('creates an empty site with a single Home page', () => {
    const site = createEmptySite()
    expect(site.pages).toHaveLength(1)
    expect(site.pages[0].title).toBe('Home')
    expect(site.pages[0].layout.items).toEqual([])
    expect(site.pages[0].id).toEqual(expect.any(String))
  })

  it('round-trips through serialize and deserialize with type discriminators', () => {
    const site: TBuilderSite = {
      pages: [
        createPage('Home', addWidget(createEmptyModel(), textBlock)),
        createPage('About'),
      ],
    }
    const serialized = serializeSite(site)

    expect(serialized.type).toBe(SITE_TYPE)
    const pages = serialized.pages as Array<Record<string, unknown>>
    expect(pages).toHaveLength(2)
    expect(pages[0].type).toBe(PAGE_TYPE)
    expect(pages[0].title).toBe('Home')

    const restored = deserializeSite(serialized)
    expect(restored.pages.map((page) => page.title)).toEqual(['Home', 'About'])
    expect(restored.pages[0].layout.items).toHaveLength(1)
  })

  it('wraps a legacy single-grid layout into a one-page Home site', () => {
    const grid = serialize(addWidget(createEmptyModel(), textBlock))
    expect(isSerializedSite(grid)).toBe(false)

    const site = deserializeSite(grid)
    expect(site.pages).toHaveLength(1)
    expect(site.pages[0].title).toBe('Home')
    expect(site.pages[0].layout.items).toHaveLength(1)
  })

  it('falls back to an empty site for empty or invalid input', () => {
    expect(deserializeSite(undefined).pages).toHaveLength(1)
    expect(deserializeSite(null).pages).toHaveLength(1)
    expect(deserializeSite({ pages: [] }).pages).toHaveLength(1)
  })

  it('adds a page with a unique default title without mutating the original', () => {
    const site = createEmptySite()
    const original = clone(site)
    const { site: next, id } = addPage(site)

    expect(site).toEqual(original)
    expect(next.pages).toHaveLength(2)
    expect(findPageIndex(next, id)).toBe(1)
    expect(next.pages[1].title).toBe('Page 2')
  })

  it('renames a page immutably and ignores unknown ids', () => {
    const site = createEmptySite()
    const id = site.pages[0].id
    const renamed = renamePage(site, id, 'Landing')

    expect(renamed.pages[0].title).toBe('Landing')
    expect(site.pages[0].title).toBe('Home')
    expect(renamePage(site, 'missing', 'X')).toBe(site)
  })

  it('removes a page but never the last one', () => {
    const { site: two } = addPage(createEmptySite())
    const firstId = two.pages[0].id
    const reduced = removePage(two, firstId)

    expect(reduced.pages).toHaveLength(1)
    expect(reduced.pages[0].id).toBe(two.pages[1].id)
    expect(removePage(reduced, reduced.pages[0].id)).toBe(reduced)
  })

  it('replaces a page layout immutably and no-ops for identical layouts', () => {
    const site = createEmptySite()
    const id = site.pages[0].id
    const layout = addWidget(createEmptyModel(), textBlock)
    const updated = setPageLayout(site, id, layout)

    expect(updated.pages[0].layout).toBe(layout)
    expect(site.pages[0].layout.items).toEqual([])
    expect(setPageLayout(updated, id, layout)).toBe(updated)
    expect(setPageLayout(site, 'missing', layout)).toBe(site)
  })

  it('reorders pages and clamps out-of-range targets', () => {
    let site = createEmptySite()
    site = addPage(site).site
    site = addPage(site).site
    const titles = site.pages.map((page) => page.title)

    const moved = movePage(site, null, 0, 2)
    expect(moved.pages.map((page) => page.title)).toEqual([
      titles[1],
      titles[2],
      titles[0],
    ])
    expect(movePage(site, null, 0, 99).pages[2].title).toBe(titles[0])
    expect(movePage(site, null, 1, 1)).toBe(site)
    expect(movePage(site, null, 5, 0)).toBe(site)
  })

  it('adds, finds, and serializes nested sub-pages to any depth', () => {
    const base = createEmptySite()
    const homeId = base.pages[0].id
    const { site: withChild, id: childId } = addPage(base, homeId)
    const { site: withGrandchild, id: grandchildId } = addPage(
      withChild,
      childId
    )

    expect(withChild.pages[0].children).toHaveLength(1)
    expect(withChild.pages[0].children[0].title).toBe('Page 1')

    const context = findPageContext(withGrandchild, grandchildId)
    expect(context?.parentId).toBe(childId)
    expect(findPage(withGrandchild, grandchildId)?.id).toBe(grandchildId)
    expect(findPagePath(withGrandchild, grandchildId).map((p) => p.id)).toEqual(
      [homeId, childId, grandchildId]
    )

    const restored = deserializeSite(serializeSite(withGrandchild))
    expect(restored.pages[0].children[0].children[0].id).toBe(grandchildId)
  })

  it('renames and removes nested pages without touching siblings', () => {
    const base = createEmptySite()
    const homeId = base.pages[0].id
    const { site: a, id: childAId } = addPage(base, homeId)
    const { site: site2, id: childBId } = addPage(a, homeId)

    const renamed = renamePage(site2, childBId, 'Contact')
    expect(renamed.pages[0].children.map((p) => p.title)).toEqual([
      'Page 1',
      'Contact',
    ])

    const removed = removePage(renamed, childAId)
    expect(removed.pages[0].children).toHaveLength(1)
    expect(removed.pages[0].children[0].id).toBe(childBId)
  })

  it('reorders sub-pages within their parent', () => {
    const base = createEmptySite()
    const homeId = base.pages[0].id
    const { site: a } = addPage(base, homeId)
    const { site: site2 } = addPage(a, homeId)
    const childTitles = site2.pages[0].children.map((p) => p.title)

    const moved = movePage(site2, homeId, 0, 1)
    expect(moved.pages[0].children.map((p) => p.title)).toEqual([
      childTitles[1],
      childTitles[0],
    ])
  })

  it('keeps children as an empty array for legacy pages without children', () => {
    const legacy = {
      type: 'PLUGINS:dm-core-plugins/builder/Site',
      pages: [
        { id: 'x', title: 'Home', layout: serialize(createEmptyModel()) },
      ],
    }
    const site = deserializeSite(legacy)
    expect(site.pages[0].children).toEqual([])
  })
})
