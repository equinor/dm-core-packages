import { BLOCKS, getBlock } from '../model/blocks'
import {
  addWidget,
  areasOverlap,
  clampArea,
  clampPath,
  createEmptyModel,
  deserialize,
  duplicateWidget,
  ensureModel,
  findFreeArea,
  GRID_AREA_TYPE,
  GRID_CONFIG_TYPE,
  GRID_ITEM_TYPE,
  GRID_SIZE_TYPE,
  getSubModel,
  getWidgetConfigValue,
  getWidgetStyleValue,
  INLINE_RECIPE_VIEW_CONFIG_TYPE,
  insertWidgetItem,
  isContainerItem,
  moveWidget,
  REFERENCE_VIEW_CONFIG_TYPE,
  removeWidget,
  rescaleGrid,
  resizeWidget,
  serialize,
  setSubModel,
  setWidgetArea,
  setWidgetConfigValue,
  setWidgetLabel,
  setWidgetScope,
  setWidgetStyleValue,
  setWidgetTitle,
  translateArea,
  wouldOverlap,
} from '../model/model'

import type { TBlock } from '../types'

const textBlock = getBlock('text') ?? BLOCKS[0]
const imageBlock = getBlock('image') ?? BLOCKS[1]
const sectionBlock = getBlock('section') ?? BLOCKS[0]
// A minimal block that ships no defaultConfig, so its inline recipe starts
// without a `config` object — used to test the config setters from scratch.
const configlessBlock: TBlock = {
  id: 'test-configless',
  label: 'Configless',
  icon: 'text_field',
  category: 'content',
  description: 'Test-only block with no default config.',
  contentModel: 'content',
  defaultSize: { columns: 4, rows: 2 },
  recipe: '@development-framework/dm-core-plugins/markdown',
}
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

describe('builder model', () => {
  it('creates an empty 24x16 model with expected defaults', () => {
    expect(createEmptyModel()).toEqual({
      size: {
        columns: 24,
        rows: 16,
        rowGap: '8px',
        columnGap: '8px',
      },
      items: [],
      itemBorder: {
        size: '1px',
        style: 'solid',
        color: '#bbb',
        radius: '5px',
      },
      showItemBorders: false,
    })
  })

  it('adds a widget without mutating the original model', () => {
    const model = createEmptyModel()
    const original = clone(model)
    const result = addWidget(model, textBlock, {
      rowStart: 7,
      rowEnd: 10,
      columnStart: 11,
      columnEnd: 15,
    })

    expect(model).toEqual(original)
    expect(result).not.toBe(model)
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual({
      type: GRID_ITEM_TYPE,
      title: textBlock.label,
      gridArea: {
        rowStart: 7,
        rowEnd: 10,
        columnStart: 11,
        columnEnd: 15,
      },
      viewConfig: {
        type: INLINE_RECIPE_VIEW_CONFIG_TYPE,
        scope: '',
        label: textBlock.label,
        recipe: {
          name: textBlock.id,
          type: 'CORE:UiRecipe',
          plugin: textBlock.recipe,
          config: { content: 'Write your text here.' },
        },
      },
    })
  })

  it('places a second widget in a different non-overlapping area', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    const result = addWidget(model, textBlock)

    expect(result.items).toHaveLength(2)
    expect(result.items[1].gridArea).not.toEqual(result.items[0].gridArea)
    expect(
      areasOverlap(result.items[0].gridArea, result.items[1].gridArea)
    ).toBe(false)
  })

  it('removes the correct widget without mutating the original model', () => {
    const model = addWidget(
      addWidget(createEmptyModel(), textBlock),
      imageBlock
    )
    const original = clone(model)
    const result = removeWidget(model, 0)

    expect(model).toEqual(original)
    expect(result).not.toBe(model)
    expect(result.items).toEqual([model.items[1]])
  })

  it('moves a widget and clamps out-of-bounds areas inside the grid', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    const original = clone(model)
    const result = moveWidget(model, 0, {
      rowStart: 6,
      rowEnd: 12,
      columnStart: -2,
      columnEnd: 4,
    })

    expect(model).toEqual(original)
    expect(result.items[0].gridArea).toEqual({
      rowStart: 6,
      rowEnd: 12,
      columnStart: 1,
      columnEnd: 7,
    })
  })

  it('translates an area by positive and negative deltas while preserving its span', () => {
    const area = { rowStart: 3, rowEnd: 6, columnStart: 4, columnEnd: 8 }
    const result = translateArea(area, -2, 5)

    expect(result).toEqual({
      rowStart: 8,
      rowEnd: 11,
      columnStart: 2,
      columnEnd: 6,
    })
    expect(result.columnEnd - result.columnStart).toBe(
      area.columnEnd - area.columnStart
    )
    expect(result.rowEnd - result.rowStart).toBe(area.rowEnd - area.rowStart)
  })

  it('resizes a widget without mutating the input model or other items', () => {
    const model = addWidget(
      addWidget(createEmptyModel(), textBlock, {
        rowStart: 2,
        rowEnd: 3,
        columnStart: 2,
        columnEnd: 3,
      }),
      imageBlock,
      { rowStart: 5, rowEnd: 6, columnStart: 5, columnEnd: 6 }
    )
    const original = clone(model)

    const grown = resizeWidget(model, 0, {
      rowStart: 2,
      rowEnd: 5,
      columnStart: 2,
      columnEnd: 7,
    })
    const shrunk = resizeWidget(model, 0, {
      rowStart: 2,
      rowEnd: 2,
      columnStart: 2,
      columnEnd: 2,
    })

    expect(model).toEqual(original)
    expect(grown).not.toBe(model)
    expect(grown.items[0].gridArea).toEqual({
      rowStart: 2,
      rowEnd: 5,
      columnStart: 2,
      columnEnd: 7,
    })
    expect(grown.items[1]).toEqual(model.items[1])
    expect(shrunk.items[0].gridArea).toEqual({
      rowStart: 2,
      rowEnd: 2,
      columnStart: 2,
      columnEnd: 2,
    })
  })

  it('normalizes resize areas to at least 1x1 and clamps them to grid bounds', () => {
    const model = addWidget(createEmptyModel(), textBlock)

    const normalized = resizeWidget(model, 0, {
      rowStart: 4,
      rowEnd: 1,
      columnStart: 5,
      columnEnd: 1,
    })
    const clamped = resizeWidget(model, 0, {
      rowStart: 7,
      rowEnd: 12,
      columnStart: 10,
      columnEnd: 15,
    })

    expect(normalized.items[0].gridArea).toEqual({
      rowStart: 4,
      rowEnd: 4,
      columnStart: 5,
      columnEnd: 5,
    })
    expect(clamped.items[0].gridArea).toEqual({
      rowStart: 7,
      rowEnd: 12,
      columnStart: 10,
      columnEnd: 15,
    })
  })

  it('duplicates a widget into free space with an isolated view config copy', () => {
    const model = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 2,
      columnStart: 1,
      columnEnd: 2,
    })
    const original = clone(model)
    const result = duplicateWidget(model, 0)

    expect(model).toEqual(original)
    expect(result).not.toBe(model)
    expect(result.items).toHaveLength(2)
    expect(
      areasOverlap(result.items[0].gridArea, result.items[1].gridArea)
    ).toBe(false)

    result.items[1].viewConfig.label = 'Changed copy'
    expect(result.items[0].viewConfig.label).toBe(textBlock.label)
  })

  it('returns an equal model when duplicating an out-of-range widget index', () => {
    const model = addWidget(createEmptyModel(), textBlock)

    expect(duplicateWidget(model, 99)).toEqual(model)
  })

  it('grows the grid and avoids overlap when duplicating into a full grid', () => {
    const full = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 16,
      columnStart: 1,
      columnEnd: 24,
    })
    const result = duplicateWidget(full, 0)

    expect(result.size.rows).toBeGreaterThan(full.size.rows)
    expect(result.items).toHaveLength(2)
    expect(
      areasOverlap(result.items[0].gridArea, result.items[1].gridArea)
    ).toBe(false)
  })

  it('detects overlap against other widgets while ignoring the excluded index', () => {
    const model = addWidget(
      addWidget(createEmptyModel(), textBlock, {
        rowStart: 1,
        rowEnd: 2,
        columnStart: 1,
        columnEnd: 2,
      }),
      imageBlock,
      { rowStart: 4, rowEnd: 5, columnStart: 4, columnEnd: 5 }
    )

    expect(
      wouldOverlap(model, 0, {
        rowStart: 4,
        rowEnd: 4,
        columnStart: 4,
        columnEnd: 4,
      })
    ).toBe(true)
    expect(wouldOverlap(model, 0, model.items[0].gridArea)).toBe(false)
    expect(
      wouldOverlap(model, 0, {
        rowStart: 7,
        rowEnd: 8,
        columnStart: 10,
        columnEnd: 12,
      })
    ).toBe(false)
  })

  it('detects overlapping, adjacent, and disjoint areas', () => {
    expect(
      areasOverlap(
        { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
        { rowStart: 2, rowEnd: 4, columnStart: 2, columnEnd: 4 }
      )
    ).toBe(true)
    expect(
      areasOverlap(
        { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        { rowStart: 1, rowEnd: 2, columnStart: 3, columnEnd: 4 }
      )
    ).toBe(false)
    expect(
      areasOverlap(
        { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        { rowStart: 4, rowEnd: 5, columnStart: 4, columnEnd: 5 }
      )
    ).toBe(false)
  })

  it('keeps in-bounds areas unchanged when clamping', () => {
    expect(
      clampArea(
        { rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 },
        createEmptyModel().size
      )
    ).toEqual({ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 })
  })

  it('pulls out-of-bounds areas inside the grid while preserving width and height', () => {
    expect(
      clampArea(
        { rowStart: 0, rowEnd: 2, columnStart: 11, columnEnd: 14 },
        createEmptyModel().size
      )
    ).toEqual({ rowStart: 1, rowEnd: 3, columnStart: 11, columnEnd: 14 })
  })

  it('clamps an area larger than the grid to fit inside it', () => {
    const size = createEmptyModel().size
    const clamped = clampArea(
      { rowStart: 1, rowEnd: 20, columnStart: 1, columnEnd: 30 },
      size
    )
    expect(clamped).toEqual({
      rowStart: 1,
      rowEnd: size.rows,
      columnStart: 1,
      columnEnd: size.columns,
    })
  })

  it('returns null from findFreeArea when the grid is full', () => {
    const model = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 16,
      columnStart: 1,
      columnEnd: 24,
    })
    expect(findFreeArea(model, { columns: 1, rows: 1 })).toBeNull()
  })

  it('grows the grid and avoids overlap when adding to a full grid', () => {
    const full = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 16,
      columnStart: 1,
      columnEnd: 24,
    })
    const result = addWidget(full, imageBlock)

    expect(result.size.rows).toBeGreaterThan(full.size.rows)
    expect(result.items).toHaveLength(2)
    expect(
      areasOverlap(result.items[0].gridArea, result.items[1].gridArea)
    ).toBe(false)
  })

  it('round-trips through serialize and deserialize with type discriminators', () => {
    const model = addWidget(
      addWidget(createEmptyModel(), textBlock),
      imageBlock
    )
    const serialized = serialize(model)

    expect(serialized).toMatchObject({
      type: GRID_CONFIG_TYPE,
      size: { type: GRID_SIZE_TYPE },
      items: [
        { type: GRID_ITEM_TYPE, gridArea: { type: GRID_AREA_TYPE } },
        { type: GRID_ITEM_TYPE, gridArea: { type: GRID_AREA_TYPE } },
      ],
    })
    expect(deserialize(serialized)).toEqual(model)
  })

  it('deserializes partial or empty input into a valid empty model', () => {
    expect(deserialize(undefined)).toEqual(createEmptyModel())
    expect(deserialize({})).toEqual(createEmptyModel())
  })
})

describe('builder model — property setters', () => {
  it('sets widget titles immutably and ignores out-of-range indexes', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    const original = clone(model)
    const result = setWidgetTitle(model, 0, 'Hero copy')
    const outOfRange = setWidgetTitle(model, 99, 'Ignored')

    expect(model).toEqual(original)
    expect(result).not.toBe(model)
    expect(result.items[0].title).toBe('Hero copy')
    expect(outOfRange).toEqual(original)
  })

  it('sets widget scope and label immutably without changing siblings', () => {
    const model = addWidget(
      addWidget(createEmptyModel(), textBlock),
      imageBlock
    )
    const original = clone(model)
    const scoped = setWidgetScope(model, 0, 'person')
    const labeled = setWidgetLabel(scoped, 0, 'Person details')

    expect(model).toEqual(original)
    expect(scoped.items[0].viewConfig.scope).toBe('person')
    expect(labeled.items[0].viewConfig.label).toBe('Person details')
    expect(scoped.items[1]).toEqual(model.items[1])
    expect(labeled.items[1]).toEqual(model.items[1])
  })

  it('sets inline recipe config values immutably and preserves existing keys', () => {
    const model = addWidget(createEmptyModel(), configlessBlock)
    const original = clone(model)
    const originalRecipe = model.items[0].viewConfig.recipe

    const withPlaceholder = setWidgetConfigValue(
      model,
      0,
      'placeholder',
      'Enter text'
    )
    const withRows = setWidgetConfigValue(withPlaceholder, 0, 'rows', 3)

    expect(model).toEqual(original)
    expect(getWidgetConfigValue(withPlaceholder.items[0], 'placeholder')).toBe(
      'Enter text'
    )
    expect(getWidgetConfigValue(withRows.items[0], 'placeholder')).toBe(
      'Enter text'
    )
    expect(getWidgetConfigValue(withRows.items[0], 'rows')).toBe(3)
    expect(getWidgetConfigValue(model.items[0], 'placeholder')).toBeUndefined()
    if (originalRecipe && typeof originalRecipe !== 'string') {
      expect(originalRecipe.config).toBeUndefined()
      expect(withPlaceholder.items[0].viewConfig.recipe).not.toBe(
        originalRecipe
      )
    }
  })

  it('sets and clears per-widget style values immutably', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    const original = clone(model)

    const aligned = setWidgetStyleValue(model, 0, 'textAlign', 'center')
    const sized = setWidgetStyleValue(aligned, 0, 'fontSize', '28px')
    const titled = setWidgetStyleValue(sized, 0, 'bold', true, 'title')
    const cleared = setWidgetStyleValue(titled, 0, 'textAlign', '')

    expect(model).toEqual(original)
    expect(getWidgetStyleValue(aligned.items[0], 'textAlign')).toBe('center')
    expect(getWidgetStyleValue(sized.items[0], 'fontSize')).toBe('28px')
    expect(getWidgetStyleValue(titled.items[0], 'bold', 'title')).toBe(true)
    expect(getWidgetStyleValue(titled.items[0], 'bold', 'body')).toBeUndefined()
    expect(getWidgetStyleValue(cleared.items[0], 'textAlign')).toBeUndefined()
    expect(getWidgetStyleValue(model.items[0], 'textAlign')).toBeUndefined()
  })

  it('round-trips per-widget style through serialize and deserialize', () => {
    const model = setWidgetStyleValue(
      addWidget(createEmptyModel(), textBlock),
      0,
      'textAlign',
      'center'
    )
    const styled = setWidgetStyleValue(model, 0, 'bold', true)
    const titled = setWidgetStyleValue(styled, 0, 'fontSize', '40px', 'title')
    expect(deserialize(serialize(titled))).toEqual(titled)
  })

  it('does not set config values on string recipe widgets', () => {
    const model = addWidget(
      createEmptyModel(),
      textBlock,
      { rowStart: 1, rowEnd: 1, columnStart: 1, columnEnd: 1 },
      {
        type: REFERENCE_VIEW_CONFIG_TYPE,
        scope: '',
        recipe: 'SomeRecipe',
      }
    )
    const original = clone(model)
    const result = setWidgetConfigValue(model, 0, 'placeholder', 'Ignored')

    expect(result).toEqual(original)
    expect(result.items[0].viewConfig).toBe(model.items[0].viewConfig)
    expect(getWidgetConfigValue(result.items[0], 'placeholder')).toBeUndefined()
  })

  it('sets widget areas through resize normalization and clamping immutably', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    const original = clone(model)
    const result = setWidgetArea(model, 0, {
      rowStart: 20,
      rowEnd: 1,
      columnStart: 15,
      columnEnd: 1,
    })

    expect(model).toEqual(original)
    expect(result.items[0].gridArea).toEqual({
      rowStart: 16,
      rowEnd: 16,
      columnStart: 15,
      columnEnd: 15,
    })
  })

  it('returns undefined for missing config keys and string recipe widgets', () => {
    const defaultModel = addWidget(createEmptyModel(), textBlock)
    const referenceModel = addWidget(
      createEmptyModel(),
      textBlock,
      { rowStart: 1, rowEnd: 1, columnStart: 1, columnEnd: 1 },
      {
        type: REFERENCE_VIEW_CONFIG_TYPE,
        scope: '',
        recipe: 'SomeRecipe',
      }
    )

    expect(
      getWidgetConfigValue(defaultModel.items[0], 'missing')
    ).toBeUndefined()
    expect(
      getWidgetConfigValue(referenceModel.items[0], 'missing')
    ).toBeUndefined()
  })
})

describe('builder model — default config seeding', () => {
  const tableBlock = getBlock('table') ?? BLOCKS[3]

  it('seeds a block default config onto a new widget', () => {
    const model = addWidget(createEmptyModel(), imageBlock)

    expect(getWidgetConfigValue(model.items[0], 'fill')).toBe('width')
  })

  it('seeds table rows so the widget renders before any upload', () => {
    const model = addWidget(createEmptyModel(), tableBlock)

    // The Table widget renders structured rows; a seeded grid keeps preview valid.
    const rows = getWidgetConfigValue(model.items[0], 'rows')
    expect(Array.isArray(rows)).toBe(true)
    expect((rows as string[][])[0]).toEqual(['Column A', 'Column B'])
  })

  it('does not share seeded config between two widgets of the same block', () => {
    const first = addWidget(createEmptyModel(), imageBlock)
    const both = addWidget(first, imageBlock)
    const updated = setWidgetConfigValue(both, 1, 'caption', 'Second')

    expect(getWidgetConfigValue(updated.items[0], 'caption')).toBeUndefined()
    expect(getWidgetConfigValue(updated.items[1], 'caption')).toBe('Second')
  })
})

describe('builder model — insertWidgetItem', () => {
  it('appends a deep-cloned copy whose nested view config is independent', () => {
    const sourceModel = setWidgetConfigValue(
      addWidget(createEmptyModel(), textBlock, {
        rowStart: 1,
        rowEnd: 2,
        columnStart: 1,
        columnEnd: 2,
      }),
      0,
      'nested',
      { text: 'original' }
    )
    const source = sourceModel.items[0]
    const result = insertWidgetItem(createEmptyModel(), source)
    const inserted = result.items[0]
    const sourceRecipe = source.viewConfig.recipe as any
    const insertedRecipe = inserted.viewConfig.recipe as any

    expect(result.items).toHaveLength(1)
    expect(inserted).not.toBe(source)
    expect(inserted.viewConfig).not.toBe(source.viewConfig)
    expect(insertedRecipe).not.toBe(sourceRecipe)
    expect(insertedRecipe.config.nested).not.toBe(sourceRecipe.config.nested)

    sourceRecipe.config.nested.text = 'mutated source'
    expect(insertedRecipe.config.nested.text).toBe('original')

    insertedRecipe.config.nested.text = 'mutated copy'
    expect(sourceRecipe.config.nested.text).toBe('mutated source')
  })

  it('places the copy in free space without overlapping existing items', () => {
    const model = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 2,
      columnStart: 1,
      columnEnd: 2,
    })
    const result = insertWidgetItem(model, model.items[0])
    const inserted = result.items[result.items.length - 1]

    expect(result.items).toHaveLength(model.items.length + 1)
    for (const item of model.items) {
      expect(areasOverlap(item.gridArea, inserted.gridArea)).toBe(false)
    }
  })

  it('grows the grid when full so the copy never overlaps', () => {
    const full = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 16,
      columnStart: 1,
      columnEnd: 24,
    })
    const result = insertWidgetItem(full, full.items[0])

    expect(result.size.rows).toBeGreaterThan(full.size.rows)
    expect(result.items).toHaveLength(2)
    expect(
      areasOverlap(result.items[0].gridArea, result.items[1].gridArea)
    ).toBe(false)
  })

  it('returns a new model without mutating the original model or items array', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    const original = clone(model)
    const originalItems = model.items
    const result = insertWidgetItem(model, model.items[0])

    expect(model).toEqual(original)
    expect(model.items).toBe(originalItems)
    expect(model.items).toHaveLength(1)
    expect(result).not.toBe(model)
    expect(result.items).not.toBe(model.items)
    expect(result.items).toHaveLength(2)
  })
})

describe('builder model — nesting', () => {
  it('identifies section widgets as containers only when their recipe is an inline grid', () => {
    const sectionModel = addWidget(createEmptyModel(), sectionBlock)
    const textModel = addWidget(createEmptyModel(), textBlock)
    const referenceModel = addWidget(
      createEmptyModel(),
      textBlock,
      { rowStart: 1, rowEnd: 1, columnStart: 1, columnEnd: 1 },
      {
        type: REFERENCE_VIEW_CONFIG_TYPE,
        scope: '',
        recipe: 'X',
      }
    )

    expect(isContainerItem(sectionModel.items[0])).toBe(true)
    expect(isContainerItem(textModel.items[0])).toBe(false)
    expect(isContainerItem(referenceModel.items[0])).toBe(false)
    expect(getWidgetConfigValue(sectionModel.items[0], 'items')).toEqual([])
  })

  it('coerces arbitrary values into valid nested builder models', () => {
    const item = addWidget(createEmptyModel(), textBlock).items[0]
    const items = [item]

    expect(ensureModel(undefined)).toEqual({
      size: { columns: 6, rows: 4, rowGap: '8px', columnGap: '8px' },
      items: [],
      itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '5px' },
      showItemBorders: false,
    })
    expect(ensureModel({}).items).toEqual([])
    expect(ensureModel({ items }).items).toBe(items)
    expect(ensureModel({ size: { rows: 9 } }).size).toEqual({
      columns: 6,
      rows: 9,
      rowGap: '8px',
      columnGap: '8px',
    })
  })

  it('reads nested grid models by path without throwing for invalid indexes', () => {
    const model = addWidget(createEmptyModel(), sectionBlock)

    expect(getSubModel(model, [])).toBe(model)
    expect(getSubModel(model, [0])).toEqual({
      size: { columns: 12, rows: 8, rowGap: '8px', columnGap: '8px' },
      items: [],
      itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '5px' },
      showItemBorders: false,
    })
    expect(getSubModel(model, [0, 99])).toEqual(getSubModel(model, [0]))
  })

  it('sets nested grid models immutably and no-ops for invalid paths', () => {
    const model = addWidget(
      addWidget(createEmptyModel(), sectionBlock),
      textBlock
    )
    const original = clone(model)
    const sub = addWidget(getSubModel(model, [0]), imageBlock)

    expect(setSubModel(model, [], sub)).toBe(sub)

    const updated = setSubModel(model, [0], sub)
    expect(model).toEqual(original)
    expect(updated).not.toBe(model)
    expect(getSubModel(updated, [0])).toEqual(sub)
    expect(setSubModel(model, [1], sub)).toEqual(original)
    expect(setSubModel(model, [99], sub)).toEqual(original)
  })

  it('round-trips adding a widget inside a section while preserving the root section', () => {
    const sectionIndex = 0
    const model = addWidget(createEmptyModel(), sectionBlock)
    const child = addWidget(getSubModel(model, [sectionIndex]), textBlock)
    const updated = setSubModel(model, [sectionIndex], child)

    expect(getSubModel(updated, [sectionIndex]).items).toHaveLength(1)
    expect(updated.items[sectionIndex].title).toBe(sectionBlock.label)
    expect(updated.items).toHaveLength(1)
  })

  it('recursively serializes nested section grids with type discriminators', () => {
    const model = setSubModel(
      addWidget(createEmptyModel(), sectionBlock),
      [0],
      addWidget(
        getSubModel(addWidget(createEmptyModel(), sectionBlock), [0]),
        textBlock
      )
    )
    const nested = (serialize(model).items as any[])[0].viewConfig.recipe.config

    expect(nested.type).toBe(GRID_CONFIG_TYPE)
    expect(nested.size.type).toBe(GRID_SIZE_TYPE)
    expect(nested.items[0].type).toBe(GRID_ITEM_TYPE)
  })

  it('round-trips a nested section through serialize and deserialize', () => {
    const model = setSubModel(
      addWidget(createEmptyModel(), sectionBlock),
      [0],
      addWidget(
        getSubModel(addWidget(createEmptyModel(), sectionBlock), [0]),
        textBlock
      )
    )

    expect(deserialize(serialize(model))).toEqual(model)
  })
})

describe('builder model — rescaleGrid', () => {
  it('doubles density and scales widget areas while keeping the model immutable', () => {
    const model = addWidget(
      createEmptyModel({ columns: 12, rows: 8 }),
      textBlock,
      {
        rowStart: 1,
        rowEnd: 4,
        columnStart: 3,
        columnEnd: 6,
      }
    )
    const original = clone(model)
    const result = rescaleGrid(model, 2)

    expect(model).toEqual(original)
    expect(result.size.columns).toBe(24)
    expect(result.size.rows).toBe(16)
    expect(result.items[0].gridArea).toEqual({
      columnStart: 5,
      columnEnd: 12,
      rowStart: 1,
      rowEnd: 8,
    })
  })

  it('returns the same model for a factor of 1 or non-positive factors', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    expect(rescaleGrid(model, 1)).toBe(model)
    expect(rescaleGrid(model, 0)).toBe(model)
    expect(rescaleGrid(model, -2)).toBe(model)
  })

  it('clamps density to the maximum and never drops a widget below 1x1', () => {
    const model = addWidget(
      createEmptyModel({ columns: 200, rows: 200 }),
      textBlock,
      {
        rowStart: 1,
        rowEnd: 1,
        columnStart: 1,
        columnEnd: 1,
      }
    )
    const result = rescaleGrid(model, 4)

    expect(result.size.columns).toBeLessThanOrEqual(240)
    expect(result.size.rows).toBeLessThanOrEqual(240)
    const { gridArea } = result.items[0]
    expect(gridArea.columnEnd).toBeGreaterThanOrEqual(gridArea.columnStart)
    expect(gridArea.rowEnd).toBeGreaterThanOrEqual(gridArea.rowStart)
  })

  it('keeps every scaled widget inside the new grid bounds', () => {
    const model = addWidget(
      createEmptyModel({ columns: 12, rows: 8 }),
      textBlock,
      {
        rowStart: 7,
        rowEnd: 8,
        columnStart: 11,
        columnEnd: 12,
      }
    )
    const result = rescaleGrid(model, 0.5)

    expect(result.size.columns).toBe(6)
    expect(result.size.rows).toBe(4)
    const { gridArea } = result.items[0]
    expect(gridArea.columnEnd).toBeLessThanOrEqual(6)
    expect(gridArea.rowEnd).toBeLessThanOrEqual(4)
  })
})

describe('builder model — clampPath', () => {
  it('keeps a valid path that resolves through container items', () => {
    const model = addWidget(createEmptyModel(), sectionBlock)
    expect(clampPath(model, [])).toEqual([])
    expect(clampPath(model, [0])).toEqual([0])
  })

  it('truncates at a non-container item', () => {
    const model = addWidget(createEmptyModel(), textBlock)
    expect(clampPath(model, [0])).toEqual([])
  })

  it('truncates at a missing index', () => {
    const model = addWidget(createEmptyModel(), sectionBlock)
    expect(clampPath(model, [0, 5])).toEqual([0])
    expect(clampPath(model, [9])).toEqual([])
  })

  it('truncates a deep path when an ancestor section is removed', () => {
    const withSection = addWidget(createEmptyModel(), sectionBlock)
    const nested = addWidget(getSubModel(withSection, [0]), sectionBlock)
    const model = setSubModel(withSection, [0], nested)

    expect(clampPath(model, [0, 0])).toEqual([0, 0])
    // After removing the outer section the whole path is invalid.
    expect(clampPath(removeWidget(model, 0), [0, 0])).toEqual([])
  })
})
