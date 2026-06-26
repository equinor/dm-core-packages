import { BLOCKS, getBlock } from './blocks'
import {
  addWidget,
  areasOverlap,
  clampArea,
  createEmptyModel,
  deserialize,
  duplicateWidget,
  findFreeArea,
  GRID_AREA_TYPE,
  GRID_CONFIG_TYPE,
  GRID_ITEM_TYPE,
  GRID_SIZE_TYPE,
  getWidgetConfigValue,
  INLINE_RECIPE_VIEW_CONFIG_TYPE,
  moveWidget,
  REFERENCE_VIEW_CONFIG_TYPE,
  removeWidget,
  resizeWidget,
  serialize,
  setWidgetArea,
  setWidgetConfigValue,
  setWidgetLabel,
  setWidgetScope,
  setWidgetTitle,
  translateArea,
  wouldOverlap,
} from './model'

const textBlock = getBlock('text') ?? BLOCKS[0]
const imageBlock = getBlock('image') ?? BLOCKS[1]
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

describe('builder model', () => {
  it('creates an empty 12x8 model with expected defaults', () => {
    expect(createEmptyModel()).toEqual({
      size: {
        columns: 12,
        rows: 8,
        rowGap: '16px',
        columnGap: '16px',
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
        rowStart: 5,
        rowEnd: 8,
        columnStart: 8,
        columnEnd: 12,
      },
      viewConfig: {
        type: INLINE_RECIPE_VIEW_CONFIG_TYPE,
        scope: '',
        label: textBlock.label,
        recipe: {
          name: textBlock.id,
          type: 'CORE:UiRecipe',
          plugin: textBlock.recipe,
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
      rowStart: 2,
      rowEnd: 8,
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
      rowStart: 3,
      rowEnd: 8,
      columnStart: 7,
      columnEnd: 12,
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
      rowEnd: 8,
      columnStart: 1,
      columnEnd: 12,
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
    ).toEqual({ rowStart: 1, rowEnd: 3, columnStart: 9, columnEnd: 12 })
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
      rowEnd: 8,
      columnStart: 1,
      columnEnd: 12,
    })
    expect(findFreeArea(model, { columns: 1, rows: 1 })).toBeNull()
  })

  it('grows the grid and avoids overlap when adding to a full grid', () => {
    const full = addWidget(createEmptyModel(), textBlock, {
      rowStart: 1,
      rowEnd: 8,
      columnStart: 1,
      columnEnd: 12,
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
    const model = addWidget(createEmptyModel(), textBlock)
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
      rowStart: 8,
      rowEnd: 8,
      columnStart: 12,
      columnEnd: 12,
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

  it('seeds a valid table config so the widget can render in preview', () => {
    const model = addWidget(createEmptyModel(), tableBlock)

    // The runtime table plugin reads config.variant; a missing variant throws.
    expect(getWidgetConfigValue(model.items[0], 'variant')).toEqual([
      {
        name: 'view',
        density: 'compact',
        functionality: { add: true, delete: true },
      },
    ])
  })

  it('does not share seeded config between two widgets of the same block', () => {
    const first = addWidget(createEmptyModel(), imageBlock)
    const both = addWidget(first, imageBlock)
    const updated = setWidgetConfigValue(both, 1, 'caption', 'Second')

    expect(getWidgetConfigValue(updated.items[0], 'caption')).toBeUndefined()
    expect(getWidgetConfigValue(updated.items[1], 'caption')).toBe('Second')
  })
})
