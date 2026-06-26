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
  INLINE_RECIPE_VIEW_CONFIG_TYPE,
  moveWidget,
  removeWidget,
  resizeWidget,
  serialize,
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
