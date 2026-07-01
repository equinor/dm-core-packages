import { ICONS } from '../icons'
import {
  BLOCKS,
  builderStaticPlugins,
  getBlock,
  WIDGET_DEFINITIONS,
} from '../widgets'

/**
 * Guardrails for the widget registry. These fail with a clear message when a
 * newly added widget is misconfigured, so you don't have to hunt through the
 * running app to find the mistake. See builder/ADDING_WIDGETS.md.
 */
describe('widget registry', () => {
  it('gives every widget a unique block id', () => {
    const ids = WIDGET_DEFINITIONS.map((definition) => definition.block.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every widget a unique recipe', () => {
    const recipes = WIDGET_DEFINITIONS.map(
      (definition) => definition.block.recipe
    )
    expect(new Set(recipes).size).toBe(recipes.length)
  })

  it('exposes each definition through BLOCKS and getBlock', () => {
    expect(BLOCKS).toHaveLength(WIDGET_DEFINITIONS.length)
    for (const definition of WIDGET_DEFINITIONS) {
      expect(getBlock(definition.block.id)).toBe(definition.block)
    }
  })

  it('resolves every block icon to icon data', () => {
    for (const definition of WIDGET_DEFINITIONS) {
      expect(ICONS[definition.block.icon]).toBeDefined()
    }
  })

  it('registers a runtime component for every static widget (and only those)', () => {
    const staticWidgets = WIDGET_DEFINITIONS.filter(
      (definition) => definition.load
    )
    expect(Object.keys(builderStaticPlugins)).toHaveLength(staticWidgets.length)
    for (const definition of staticWidgets) {
      expect(builderStaticPlugins[definition.block.recipe]).toBeDefined()
    }
  })
})
