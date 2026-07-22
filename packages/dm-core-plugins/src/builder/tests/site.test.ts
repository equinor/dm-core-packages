import { BLOCKS, getBlock } from '../model/blocks'
import { addWidget, createEmptyModel, serialize } from '../model/model'
import {
  addNavItem,
  addPage,
  createDefaultNavbar,
  createEmptySite,
  createPage,
  deserializeSite,
  findPage,
  findPageContext,
  findPageIndex,
  findPagePath,
  isSerializedSite,
  moveNavItem,
  movePage,
  NAVBAR_ITEM_TYPE,
  NAVBAR_TYPE,
  PAGE_TYPE,
  removeNavItem,
  removePage,
  renamePage,
  resolvePluginAliases,
  SITE_TYPE,
  SITE_TYPE_ADDRESS,
  serializeSite,
  setPageLayout,
  stampWidgetConfigTypes,
  type TBuilderSite,
  updateNavbar,
  updateNavItem,
  WIDGET_CONFIG_TYPE,
} from '../model/site'

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
      title: 'My Site',
      published: true,
      navbar: createDefaultNavbar(),
      pages: [
        createPage('Home', addWidget(createEmptyModel(), textBlock)),
        createPage('About'),
      ],
    }
    const serialized = serializeSite(site)

    expect(serialized.type).toBe(SITE_TYPE)
    expect(serialized.title).toBe('My Site')
    expect(serialized.published).toBe(true)
    const pages = serialized.pages as Array<Record<string, unknown>>
    expect(pages).toHaveLength(2)
    expect(pages[0].type).toBe(PAGE_TYPE)
    expect(pages[0].title).toBe('Home')

    const restored = deserializeSite(serialized)
    expect(restored.pages.map((page) => page.title)).toEqual(['Home', 'About'])
    expect(restored.pages[0].layout.items).toHaveLength(1)
    expect(restored.title).toBe('My Site')
    expect(restored.published).toBe(true)
  })

  it('reads site metadata with slug fallback and draft default', () => {
    // Title falls back to the document `name` (slug) when unset; a site without
    // an explicit `published` flag is treated as an unpublished draft.
    const fallback = deserializeSite({
      type: SITE_TYPE,
      name: 'My_Company',
      pages: [{ type: PAGE_TYPE, id: 'p1', title: 'Home' }],
    })
    expect(fallback.title).toBe('My_Company')
    expect(fallback.published).toBe(false)
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

  it('never throws and always yields at least one page on corrupt input', () => {
    const corrupt: unknown[] = [
      42,
      'a string layout',
      true,
      [],
      { pages: 'not-an-array' },
      { pages: [null, 1, 'x', {}] },
      { pages: [{ id: 5, title: {}, layout: 'oops', children: 'nope' }] },
      { pages: [{ layout: { items: 42, size: 7 } }] },
      { navbar: 'broken', pages: [{ title: 'Home' }] },
      { pages: [{ children: [{ children: [{ title: 3 }] }] }] },
    ]
    for (const input of corrupt) {
      expect(() => deserializeSite(input)).not.toThrow()
      const site = deserializeSite(input)
      expect(site.pages.length).toBeGreaterThanOrEqual(1)
      expect(site.navbar).toBeDefined()
    }
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

  describe('navbar', () => {
    it('creates a disabled default navbar on a new site', () => {
      const site = createEmptySite()
      expect(site.navbar.enabled).toBe(false)
      expect(site.navbar.items).toEqual([])
      expect(site.navbar.align).toBe('right')
    })

    it('updates navbar fields immutably', () => {
      const site = createEmptySite()
      const updated = updateNavbar(site, { enabled: true, brand: 'Acme' })

      expect(updated.navbar.enabled).toBe(true)
      expect(updated.navbar.brand).toBe('Acme')
      expect(site.navbar.enabled).toBe(false)
      expect(site.navbar.brand).toBe('My Site')
    })

    it('adds a nav item defaulting to the first page', () => {
      const site = createEmptySite()
      const homeId = site.pages[0].id
      const { site: next, id } = addNavItem(site)

      expect(next.navbar.items).toHaveLength(1)
      expect(next.navbar.items[0].id).toBe(id)
      expect(next.navbar.items[0].label).toBe('Home')
      expect(next.navbar.items[0].target).toEqual({
        kind: 'page',
        pageId: homeId,
      })
      expect(site.navbar.items).toHaveLength(0)
    })

    it('adds a nav item with an explicit URL target', () => {
      const site = createEmptySite()
      const { site: next, id } = addNavItem(site, {
        kind: 'url',
        href: 'https://example.com',
      })

      expect(next.navbar.items[0].id).toBe(id)
      expect(next.navbar.items[0].target).toEqual({
        kind: 'url',
        href: 'https://example.com',
      })
    })

    it('updates and removes nav items immutably and ignores unknown ids', () => {
      const { site: withItem, id } = addNavItem(createEmptySite())
      const renamed = updateNavItem(withItem, id, { label: 'Docs' })

      expect(renamed.navbar.items[0].label).toBe('Docs')
      expect(withItem.navbar.items[0].label).toBe('Home')
      expect(updateNavItem(withItem, 'missing', { label: 'X' })).toBe(withItem)

      const removed = removeNavItem(renamed, id)
      expect(removed.navbar.items).toHaveLength(0)
      expect(removeNavItem(renamed, 'missing')).toBe(renamed)
    })

    it('reorders nav items and clamps out-of-range targets', () => {
      let site = createEmptySite()
      site = addNavItem(site, { kind: 'url', href: 'a' }).site
      site = addNavItem(site, { kind: 'url', href: 'b' }).site
      site = addNavItem(site, { kind: 'url', href: 'c' }).site
      const hrefs = site.navbar.items.map(
        (item) => (item.target as { href: string }).href
      )

      const moved = moveNavItem(site, 0, 2)
      expect(
        moved.navbar.items.map((item) => (item.target as { href: string }).href)
      ).toEqual([hrefs[1], hrefs[2], hrefs[0]])
      expect(moveNavItem(site, 1, 1)).toBe(site)
      expect(moveNavItem(site, 5, 0)).toBe(site)
    })

    it('round-trips the navbar through serialize and deserialize', () => {
      let site = updateNavbar(createEmptySite(), {
        enabled: true,
        brand: 'Acme',
        align: 'center',
        background: '#000000',
      })
      site = addNavItem(site).site
      site = addNavItem(site, { kind: 'url', href: 'https://x.dev' }).site

      const serialized = serializeSite(site)
      const navbar = serialized.navbar as Record<string, unknown>
      expect(navbar.type).toBe(NAVBAR_TYPE)
      const items = navbar.items as Array<Record<string, unknown>>
      expect(items[0].type).toBe(NAVBAR_ITEM_TYPE)

      const restored = deserializeSite(serialized)
      expect(restored.navbar.enabled).toBe(true)
      expect(restored.navbar.brand).toBe('Acme')
      expect(restored.navbar.align).toBe('center')
      expect(restored.navbar.items).toHaveLength(2)
      expect(restored.navbar.items[1].target).toEqual({
        kind: 'url',
        href: 'https://x.dev',
      })
    })

    it('defaults the navbar when missing from stored JSON (backward compat)', () => {
      const legacy = {
        type: 'PLUGINS:dm-core-plugins/builder/Site',
        pages: [
          { id: 'x', title: 'Home', layout: serialize(createEmptyModel()) },
        ],
      }
      const site = deserializeSite(legacy)
      expect(site.navbar).toEqual(createDefaultNavbar())
    })
  })

  describe('plugin alias resolution', () => {
    it('exposes the Site type as a fully-qualified dmss address', () => {
      expect(SITE_TYPE).toBe('PLUGINS:dm-core-plugins/builder/Site')
      expect(SITE_TYPE_ADDRESS).toBe(
        'dmss://system/Plugins/dm-core-plugins/builder/Site'
      )
    })

    it('rewrites every PLUGINS: alias to its dmss address, deeply', () => {
      const serialized = serializeSite(createEmptySite())
      const resolved = resolvePluginAliases(serialized)
      const asText = JSON.stringify(resolved)
      expect(asText).not.toContain('PLUGINS:')
      expect(resolved.type).toBe(SITE_TYPE_ADDRESS)
      // Nested page/navbar discriminators are rewritten too.
      expect(asText).toContain('dmss://system/Plugins/dm-core-plugins/builder/')
    })

    it('still deserializes a site whose types are fully-qualified addresses', () => {
      const resolved = resolvePluginAliases(serializeSite(createEmptySite()))
      expect(isSerializedSite(resolved)).toBe(true)
      const site = deserializeSite(resolved)
      expect(site.pages).toHaveLength(1)
      expect(site.pages[0].title).toBe('Home')
    })
  })

  describe('widget config type stamping', () => {
    it('stamps a resolvable type onto every typeless config, in place', () => {
      const doc = {
        recipe: { config: { text: 'Hi', level: 1 } },
        nested: [{ recipe: { config: { label: 'Go' } } }],
      }
      stampWidgetConfigTypes(doc)
      expect(doc.recipe.config).toMatchObject({
        text: 'Hi',
        level: 1,
        type: WIDGET_CONFIG_TYPE,
      })
      expect(doc.nested[0].recipe.config).toMatchObject({
        label: 'Go',
        type: WIDGET_CONFIG_TYPE,
      })
    })

    it('leaves configs that already declare a type untouched (idempotent)', () => {
      const doc = { config: { text: 'Hi', type: 'dmss://custom/Type' } }
      stampWidgetConfigTypes(doc)
      expect(doc.config.type).toBe('dmss://custom/Type')
    })

    it('does not recurse into config values (e.g. a chart rows array)', () => {
      const doc: { config: Record<string, unknown> } = {
        config: {
          chartType: 'line',
          rows: [
            ['Month', 'Sales'],
            ['Jan', '12'],
          ],
        },
      }
      stampWidgetConfigTypes(doc)
      expect(doc.config.type).toBe(WIDGET_CONFIG_TYPE)
      // Values inside config keep their shape and gain no stray `type`.
      expect(doc.config.rows).toEqual([
        ['Month', 'Sales'],
        ['Jan', '12'],
      ])
    })

    it('resolvePluginAliases stamps widget configs while expanding aliases', () => {
      const serialized = {
        type: SITE_TYPE,
        pages: [
          { layout: { items: [{ recipe: { config: { text: 'Hi' } } }] } },
        ],
      }
      const resolved = resolvePluginAliases(serialized) as {
        type: string
        pages: {
          layout: { items: { recipe: { config: Record<string, unknown> } }[] }
        }[]
      }
      expect(resolved.type).toBe(SITE_TYPE_ADDRESS)
      expect(resolved.pages[0].layout.items[0].recipe.config.type).toBe(
        WIDGET_CONFIG_TYPE
      )
    })
  })
})
