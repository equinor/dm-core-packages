import { areasOverlap } from '../model/model'
import { getTemplate, TEMPLATES } from '../model/templates'

describe('builder templates', () => {
  it('defines unique templates that build valid models', () => {
    const ids = new Set<string>()

    expect(TEMPLATES.length).toBeGreaterThan(0)
    for (const template of TEMPLATES) {
      expect(ids.has(template.id)).toBe(false)
      ids.add(template.id)
      expect(template.label).toBeTruthy()

      const model = template.build()
      expect(model.size.columns).toBeGreaterThan(0)
      expect(model.size.rows).toBeGreaterThan(0)
      expect(Array.isArray(model.items)).toBe(true)
    }
  })

  it('looks up templates by id', () => {
    expect(getTemplate('landing')).toBeDefined()
    expect(getTemplate('does-not-exist')).toBeUndefined()
  })

  it('builds blank and dashboard templates with expected top-level layouts', () => {
    const blank = getTemplate('blank')?.build()
    const dashboard = getTemplate('dashboard')?.build()

    expect(blank?.items).toHaveLength(0)
    expect(dashboard?.items.length).toBeGreaterThan(0)

    const items = dashboard?.items ?? []
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        expect(areasOverlap(items[i].gridArea, items[j].gridArea)).toBe(false)
      }
    }
  })

  it('builds a fresh model each time', () => {
    const template = getTemplate('article')
    const first = template?.build()
    const second = template?.build()

    expect(first).toEqual(second)
    expect(first).not.toBe(second)
  })
})
