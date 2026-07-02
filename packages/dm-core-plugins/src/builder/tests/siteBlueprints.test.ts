import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { BLOCKS, getBlock } from '../blocks'
import { addWidget, createEmptyModel } from '../model'
import {
  addNavItem,
  addPage,
  createDefaultNavbar,
  createPage,
  deserializeSite,
  NAVBAR_ITEM_TYPE,
  NAVBAR_TYPE,
  PAGE_TYPE,
  SITE_SCHEMA_VERSION,
  SITE_TYPE,
  serializeSite,
  type TBuilderSite,
} from '../site'

type TBlueprintAttribute = {
  name: string
  attributeType: string
  optional?: boolean
  dimensions?: string
}

type TBlueprint = {
  name: string
  attributes: TBlueprintAttribute[]
}

const BLUEPRINT_DIR = join(__dirname, '..', '..', '..', 'blueprints', 'builder')

const loadBlueprint = (name: string): TBlueprint =>
  JSON.parse(
    readFileSync(join(BLUEPRINT_DIR, `${name}.json`), 'utf-8')
  ) as TBlueprint

const blueprints: Record<string, TBlueprint> = {
  [SITE_TYPE]: loadBlueprint('Site'),
  [PAGE_TYPE]: loadBlueprint('Page'),
  [NAVBAR_TYPE]: loadBlueprint('Navbar'),
  [NAVBAR_ITEM_TYPE]: loadBlueprint('NavbarItem'),
}

/**
 * Structurally validate a serialized node against its builder blueprint:
 * required attributes present, no unknown keys, correct `type` discriminator,
 * recursing through the builder-owned children (but not the opaque grid layout,
 * which the grid plugin's own blueprints cover).
 */
const validateNode = (node: unknown, expectedType: string, path: string) => {
  expect(typeof node).toBe('object')
  expect(node).not.toBeNull()
  const obj = node as Record<string, unknown>

  expect(obj.type).toBe(expectedType)

  const blueprint = blueprints[expectedType]
  expect(blueprint).toBeDefined()

  const names = new Set(blueprint.attributes.map((attr) => attr.name))

  for (const attr of blueprint.attributes) {
    if (!attr.optional) {
      expect(obj[attr.name]).toBeDefined()
    }
  }

  for (const key of Object.keys(obj)) {
    if (!names.has(key)) {
      throw new Error(
        `${path}: unexpected key "${key}" not in ${blueprint.name}`
      )
    }
  }

  if (expectedType === SITE_TYPE) {
    if (obj.navbar !== undefined) {
      validateNode(obj.navbar, NAVBAR_TYPE, `${path}.navbar`)
    }
    for (const [i, page] of (obj.pages as unknown[]).entries()) {
      validateNode(page, PAGE_TYPE, `${path}.pages[${i}]`)
    }
  }

  if (expectedType === PAGE_TYPE && Array.isArray(obj.children)) {
    for (const [i, child] of obj.children.entries()) {
      validateNode(child, PAGE_TYPE, `${path}.children[${i}]`)
    }
  }

  if (expectedType === NAVBAR_TYPE && Array.isArray(obj.items)) {
    for (const [i, item] of obj.items.entries()) {
      validateNode(item, NAVBAR_ITEM_TYPE, `${path}.items[${i}]`)
    }
  }
}

/** Build a representative site exercising nesting, both nav target kinds, etc. */
const buildRichSite = (): TBuilderSite => {
  const textBlock = getBlock('text') ?? BLOCKS[0]
  let site: TBuilderSite = {
    navbar: { ...createDefaultNavbar(), enabled: true },
    pages: [
      createPage('Home', addWidget(createEmptyModel(), textBlock)),
      createPage('About'),
    ],
  }
  // A nested sub-page under Home.
  site = addPage(site, site.pages[0].id, 'Team').site
  // One page-target nav item and one url-target nav item.
  site = addNavItem(site, { kind: 'page', pageId: site.pages[0].id }).site
  site = addNavItem(site, { kind: 'url', href: 'https://example.com' }).site
  return site
}

describe('builder site — blueprint conformance', () => {
  it('serializes a site that conforms to the Site/Page/Navbar/NavbarItem blueprints', () => {
    const serialized = serializeSite(buildRichSite())
    validateNode(serialized, SITE_TYPE, 'site')
  })

  it('emits the current schemaVersion', () => {
    const serialized = serializeSite(buildRichSite())
    expect(serialized.schemaVersion).toBe(SITE_SCHEMA_VERSION)
  })

  it('round-trips a rich site without losing pages, nesting or nav targets', () => {
    const original = buildRichSite()
    const restored = deserializeSite(serializeSite(original))

    expect(restored.pages.map((page) => page.title)).toEqual(['Home', 'About'])
    expect(restored.pages[0].children.map((child) => child.title)).toEqual([
      'Team',
    ])
    expect(restored.navbar.enabled).toBe(true)
    expect(restored.navbar.items.map((item) => item.target.kind)).toEqual([
      'page',
      'url',
    ])
  })

  it('defaults a missing schemaVersion to 1 and still loads', () => {
    const serialized = serializeSite(buildRichSite())
    // Simulate a site saved before schemaVersion existed.
    const { schemaVersion: _omitted, ...legacy } = serialized as Record<
      string,
      unknown
    >
    const restored = deserializeSite(legacy)
    expect(restored.pages).toHaveLength(2)
  })
})
