import type { TUiRecipe, TViewConfig } from '@development-framework/dm-core'
import type { TGridArea, TGridItem, TGridSize } from '../grid/types'
import type { TBlock, TBuilderModel } from './types'

/** DMSS type discriminators used by the runtime `grid` plugin entity format. */
export const GRID_CONFIG_TYPE = 'PLUGINS:dm-core-plugins/grid/GridPluginConfig'
export const GRID_ITEM_TYPE = 'PLUGINS:dm-core-plugins/grid/GridItem'
export const GRID_AREA_TYPE = 'PLUGINS:dm-core-plugins/grid/GridArea'
export const GRID_SIZE_TYPE = 'PLUGINS:dm-core-plugins/grid/GridSize'
export const GRID_BORDER_TYPE = 'PLUGINS:dm-core-plugins/grid/GridBorder'
export const GRID_ITEM_STYLE_TYPE = 'PLUGINS:dm-core-plugins/grid/GridItemStyle'
export const REFERENCE_VIEW_CONFIG_TYPE = 'CORE:ReferenceViewConfig'
export const INLINE_RECIPE_VIEW_CONFIG_TYPE = 'CORE:InlineRecipeViewConfig'

const DEFAULT_SIZE: TGridSize = {
  columns: 24,
  rows: 16,
  rowGap: '8px',
  columnGap: '8px',
}

/** Create an empty builder model with a sensible default grid. */
export const createEmptyModel = (
  size: Partial<TGridSize> = {}
): TBuilderModel => ({
  size: { ...DEFAULT_SIZE, ...size },
  items: [],
  itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '5px' },
  showItemBorders: false,
})

/** True when two grid areas overlap (inclusive bounds). */
export const areasOverlap = (a: TGridArea, b: TGridArea): boolean =>
  a.columnStart <= b.columnEnd &&
  b.columnStart <= a.columnEnd &&
  a.rowStart <= b.rowEnd &&
  b.rowStart <= a.rowEnd

/** Clamp a grid area so it stays within the grid bounds. */
export const clampArea = (area: TGridArea, size: TGridSize): TGridArea => {
  const width = Math.min(
    Math.max(0, area.columnEnd - area.columnStart),
    size.columns - 1
  )
  const height = Math.min(
    Math.max(0, area.rowEnd - area.rowStart),
    size.rows - 1
  )
  const columnStart = Math.min(
    Math.max(1, area.columnStart),
    size.columns - width
  )
  const rowStart = Math.min(Math.max(1, area.rowStart), size.rows - height)
  return {
    columnStart,
    columnEnd: columnStart + width,
    rowStart,
    rowEnd: rowStart + height,
  }
}

/** Minimum and maximum grid density (cells per axis) when zooming. */
export const MIN_GRID_CELLS = 4
export const MAX_GRID_CELLS = 240

/**
 * Rescale a grid's density (number of columns and rows) by `factor`, keeping
 * the physical grid size constant. Widget areas are scaled proportionally so
 * they stay in roughly the same visual place; a higher density yields a finer
 * snap stride for micro adjustments. Nested section grids keep their own
 * density and are not touched. Returns the model unchanged when the density
 * would not actually change (e.g. clamped at a bound).
 */
export const rescaleGrid = (
  model: TBuilderModel,
  factor: number
): TBuilderModel => {
  if (!(factor > 0) || factor === 1) return model
  const clampCells = (value: number): number =>
    Math.min(Math.max(MIN_GRID_CELLS, Math.round(value)), MAX_GRID_CELLS)
  const columns = clampCells(model.size.columns * factor)
  const rows = clampCells(model.size.rows * factor)
  if (columns === model.size.columns && rows === model.size.rows) return model

  const fx = columns / model.size.columns
  const fy = rows / model.size.rows
  const size: TGridSize = { ...model.size, columns, rows }
  const items = model.items.map((item) => {
    const { gridArea } = item
    const width = Math.max(
      1,
      Math.round((gridArea.columnEnd - gridArea.columnStart + 1) * fx)
    )
    const height = Math.max(
      1,
      Math.round((gridArea.rowEnd - gridArea.rowStart + 1) * fy)
    )
    const columnStart = Math.round((gridArea.columnStart - 1) * fx) + 1
    const rowStart = Math.round((gridArea.rowStart - 1) * fy) + 1
    const scaled: TGridArea = {
      columnStart,
      columnEnd: columnStart + width - 1,
      rowStart,
      rowEnd: rowStart + height - 1,
    }
    return { ...item, gridArea: clampArea(scaled, size) }
  })
  return { ...model, size, items }
}

export const findFreeArea = (
  model: TBuilderModel,
  footprint: { columns: number; rows: number }
): TGridArea | null => {
  const { columns, rows } = model.size
  const width = Math.min(footprint.columns, columns) - 1
  const height = Math.min(footprint.rows, rows) - 1
  for (let rowStart = 1; rowStart + height <= rows; rowStart++) {
    for (let columnStart = 1; columnStart + width <= columns; columnStart++) {
      const candidate: TGridArea = {
        rowStart,
        rowEnd: rowStart + height,
        columnStart,
        columnEnd: columnStart + width,
      }
      if (!model.items.some((item) => areasOverlap(item.gridArea, candidate))) {
        return candidate
      }
    }
  }
  return null
}

const defaultViewConfig = (block: TBlock): TViewConfig => ({
  type: INLINE_RECIPE_VIEW_CONFIG_TYPE,
  scope: '',
  label: block.label,
  recipe: {
    name: block.id,
    type: 'CORE:UiRecipe',
    plugin: block.recipe,
    ...(block.defaultConfig
      ? { config: JSON.parse(JSON.stringify(block.defaultConfig)) }
      : {}),
  },
})

const cloneViewConfig = (viewConfig: TViewConfig): TViewConfig =>
  JSON.parse(JSON.stringify(viewConfig))

/**
 * Allocate a non-overlapping area for a widget of the given footprint.
 *
 * Uses the first free cell when one exists; otherwise grows the grid by extra
 * rows and places the widget at the bottom, so widgets never overlap or get
 * lost off-canvas. Returns the (possibly grown) grid size alongside the area.
 */
const allocateArea = (
  model: TBuilderModel,
  footprint: { columns: number; rows: number }
): { size: TGridSize; area: TGridArea } => {
  const free = findFreeArea(model, footprint)
  if (free) return { size: model.size, area: free }

  const width = Math.min(footprint.columns, model.size.columns) - 1
  const height = footprint.rows - 1
  const rowStart = model.size.rows + 1
  return {
    size: { ...model.size, rows: model.size.rows + footprint.rows },
    area: {
      rowStart,
      rowEnd: rowStart + height,
      columnStart: 1,
      columnEnd: 1 + width,
    },
  }
}

/**
 * Add a widget for a block, returning a new model.
 *
 * When no explicit `area` is given the widget is placed in the first free cell;
 * if the grid is full the grid grows by extra rows so widgets never overlap or
 * get lost off-canvas.
 */
export const addWidget = (
  model: TBuilderModel,
  block: TBlock,
  area?: TGridArea,
  viewConfig?: TViewConfig
): TBuilderModel => {
  const makeItem = (gridArea: TGridArea): TGridItem => ({
    type: GRID_ITEM_TYPE,
    gridArea,
    viewConfig: viewConfig ?? defaultViewConfig(block),
    title: block.label,
  })

  if (area) {
    return {
      ...model,
      items: [...model.items, makeItem(clampArea(area, model.size))],
    }
  }

  const { size, area: placed } = allocateArea(model, block.defaultSize)
  return { ...model, size, items: [...model.items, makeItem(placed)] }
}

/** Remove the widget at `index`, returning a new model. */
export const removeWidget = (
  model: TBuilderModel,
  index: number
): TBuilderModel => ({
  ...model,
  items: model.items.filter((_, i) => i !== index),
})

/** Move the widget at `index` to a new (clamped) area, returning a new model. */
export const moveWidget = (
  model: TBuilderModel,
  index: number,
  area: TGridArea
): TBuilderModel => ({
  ...model,
  items: model.items.map((item, i) =>
    i === index ? { ...item, gridArea: clampArea(area, model.size) } : item
  ),
})

/** Translate an area by a number of columns/rows, preserving its span. */
export const translateArea = (
  area: TGridArea,
  deltaColumns: number,
  deltaRows: number
): TGridArea => ({
  columnStart: area.columnStart + deltaColumns,
  columnEnd: area.columnEnd + deltaColumns,
  rowStart: area.rowStart + deltaRows,
  rowEnd: area.rowEnd + deltaRows,
})

/**
 * Resize the widget at `index` to a new area, clamping to the grid bounds and
 * enforcing a minimum footprint of 1x1 cell. Returns a new model.
 */
export const resizeWidget = (
  model: TBuilderModel,
  index: number,
  area: TGridArea
): TBuilderModel => {
  const normalized: TGridArea = {
    columnStart: area.columnStart,
    columnEnd: Math.max(area.columnStart, area.columnEnd),
    rowStart: area.rowStart,
    rowEnd: Math.max(area.rowStart, area.rowEnd),
  }
  return {
    ...model,
    items: model.items.map((item, i) =>
      i === index
        ? { ...item, gridArea: clampArea(normalized, model.size) }
        : item
    ),
  }
}

/**
 * True when `area` overlaps any item other than the one at `excludeIndex`.
 * Used to keep manual moves/resizes from stacking widgets on top of each other.
 */
export const wouldOverlap = (
  model: TBuilderModel,
  excludeIndex: number,
  area: TGridArea
): boolean =>
  model.items.some(
    (item, i) => i !== excludeIndex && areasOverlap(item.gridArea, area)
  )

/**
 * Append a copy of `source` to the model, placing it in the first free area
 * that fits it; if the grid is full it grows so the copy never overlaps another
 * widget. The view config is deep-cloned so the copy is fully independent.
 */
export const insertWidgetItem = (
  model: TBuilderModel,
  source: TGridItem
): TBuilderModel => {
  const { gridArea } = source
  const footprint = {
    columns: gridArea.columnEnd - gridArea.columnStart + 1,
    rows: gridArea.rowEnd - gridArea.rowStart + 1,
  }
  const { size, area: placed } = allocateArea(model, footprint)
  const copy: TGridItem = {
    type: GRID_ITEM_TYPE,
    gridArea: placed,
    viewConfig: cloneViewConfig(source.viewConfig),
    ...(source.title ? { title: source.title } : {}),
  }
  return { ...model, size, items: [...model.items, copy] }
}

/**
 * Duplicate the widget at `index`. The copy is placed in the first free area
 * that fits it; if the grid is full it grows so the copy never overlaps another
 * widget. Returns a new model (unchanged when `index` is out of range).
 */
export const duplicateWidget = (
  model: TBuilderModel,
  index: number
): TBuilderModel => {
  const source = model.items[index]
  if (!source) return model
  return insertWidgetItem(model, source)
}

/** Apply `updater` to the item at `index`, returning a new model. No-op when
 * the index is out of range. */
const updateItem = (
  model: TBuilderModel,
  index: number,
  updater: (item: TGridItem) => TGridItem
): TBuilderModel => {
  if (!model.items[index]) return model
  return {
    ...model,
    items: model.items.map((item, i) => (i === index ? updater(item) : item)),
  }
}

const updateViewConfig = (
  model: TBuilderModel,
  index: number,
  updater: (viewConfig: TViewConfig) => TViewConfig
): TBuilderModel =>
  updateItem(model, index, (item) => ({
    ...item,
    viewConfig: updater(item.viewConfig),
  }))

/** Set the title shown above the widget. Returns a new model. */
export const setWidgetTitle = (
  model: TBuilderModel,
  index: number,
  title: string
): TBuilderModel => updateItem(model, index, (item) => ({ ...item, title }))

/**
 * Set the widget's grid area from absolute coordinates (e.g. inspector layout
 * fields), normalizing and clamping to the grid bounds. Returns a new model.
 */
export const setWidgetArea = (
  model: TBuilderModel,
  index: number,
  area: TGridArea
): TBuilderModel => resizeWidget(model, index, area)

/** Set the widget's data binding (`viewConfig.scope`). Returns a new model. */
export const setWidgetScope = (
  model: TBuilderModel,
  index: number,
  scope: string
): TBuilderModel =>
  updateViewConfig(model, index, (viewConfig) => ({ ...viewConfig, scope }))

/** Set the widget's display label (`viewConfig.label`). Returns a new model. */
export const setWidgetLabel = (
  model: TBuilderModel,
  index: number,
  label: string
): TBuilderModel =>
  updateViewConfig(model, index, (viewConfig) => ({ ...viewConfig, label }))

/**
 * Set a value on the widget's inline recipe config
 * (`viewConfig.recipe.config[key]`). No-op when the widget uses a recipe
 * reference (string) rather than an inline recipe. Returns a new model.
 */
export const setWidgetConfigValue = (
  model: TBuilderModel,
  index: number,
  key: string,
  value: unknown
): TBuilderModel =>
  updateViewConfig(model, index, (viewConfig) => {
    const recipe = viewConfig.recipe
    if (!recipe || typeof recipe === 'string') return viewConfig
    const config = { ...(recipe.config ?? {}), [key]: value }
    return { ...viewConfig, recipe: { ...recipe, config } as TUiRecipe }
  })

/** Read a value from a widget's inline recipe config, or `undefined`. */
export const getWidgetConfigValue = (item: TGridItem, key: string): unknown => {
  const recipe = item.viewConfig.recipe
  if (!recipe || typeof recipe === 'string') return undefined
  return recipe.config?.[key]
}

/**
 * Set a per-widget style property used by the grid renderer for presentation
 * (text alignment, font size, color, etc). `target` selects whether to style
 * the widget body (`style`) or its title (`titleStyle`). An empty value removes
 * the key so it falls back to defaults. Returns a new model.
 */
export const setWidgetStyleValue = (
  model: TBuilderModel,
  index: number,
  key: keyof NonNullable<TGridItem['style']>,
  value: unknown,
  target: 'body' | 'title' = 'body'
): TBuilderModel =>
  updateItem(model, index, (item) => {
    const prop = target === 'title' ? 'titleStyle' : 'style'
    const style = { ...(item[prop] ?? {}) }
    if (value === '' || value === undefined || value === null) delete style[key]
    else (style as Record<string, unknown>)[key] = value
    return { ...item, [prop]: style }
  })

/** Read a per-widget style property, or `undefined`. */
export const getWidgetStyleValue = (
  item: TGridItem,
  key: keyof NonNullable<TGridItem['style']>,
  target: 'body' | 'title' = 'body'
): unknown => (target === 'title' ? item.titleStyle : item.style)?.[key]

/** Runtime plugin name of the layout grid (used to detect container widgets). */
export const GRID_PLUGIN_NAME = '@development-framework/dm-core-plugins/grid'

/** True when the item is a layout container — its inline recipe is a grid. */
export const isContainerItem = (item: TGridItem): boolean => {
  const recipe = item.viewConfig.recipe
  return (
    typeof recipe === 'object' &&
    recipe !== null &&
    recipe.plugin === GRID_PLUGIN_NAME
  )
}

/** Coerce an arbitrary nested recipe config into a valid builder (grid) model. */
export const ensureModel = (value: unknown): TBuilderModel => {
  const base = createEmptyModel({ columns: 6, rows: 4 })
  if (!value || typeof value !== 'object') return base
  const candidate = value as Partial<TBuilderModel>
  return {
    size: { ...base.size, ...(candidate.size ?? {}) },
    items: Array.isArray(candidate.items) ? candidate.items : [],
    itemBorder: { ...base.itemBorder, ...(candidate.itemBorder ?? {}) },
    showItemBorders: candidate.showItemBorders ?? base.showItemBorders,
  }
}

/**
 * Get the nested grid model at `path`, where each path index drills into a
 * container item's nested grid. An empty path returns the root model; an
 * invalid path stops at the deepest valid level.
 */
export const getSubModel = (
  model: TBuilderModel,
  path: number[]
): TBuilderModel => {
  let current = model
  for (const index of path) {
    const item = current.items[index]
    if (!item || !isContainerItem(item)) break
    const recipe = item.viewConfig.recipe as TUiRecipe
    current = ensureModel(recipe.config)
  }
  return current
}

/**
 * Truncate `path` to the deepest prefix that still resolves through genuine
 * container items in `model`. Used to keep navigation valid after the model
 * changes underneath it (e.g. an undo that removes the section being edited).
 */
export const clampPath = (model: TBuilderModel, path: number[]): number[] => {
  const valid: number[] = []
  let current = model
  for (const index of path) {
    const item = current.items[index]
    if (!item || !isContainerItem(item)) break
    valid.push(index)
    current = ensureModel((item.viewConfig.recipe as TUiRecipe).config)
  }
  return valid
}

/**
 * Immutably replace the nested grid model at `path`. An empty path replaces the
 * root model. No-op when the path does not resolve to a container item.
 */
export const setSubModel = (
  model: TBuilderModel,
  path: number[],
  sub: TBuilderModel
): TBuilderModel => {
  if (path.length === 0) return sub
  const [index, ...rest] = path
  const item = model.items[index]
  if (!item || !isContainerItem(item)) return model
  const recipe = item.viewConfig.recipe as TUiRecipe
  const child = setSubModel(ensureModel(recipe.config), rest, sub)
  return updateItem(model, index, (it) => ({
    ...it,
    viewConfig: {
      ...it.viewConfig,
      recipe: { ...recipe, config: child } as TUiRecipe,
    },
  }))
}

/**
 * Serialize a view config, recursing into Section containers so their nested
 * grids carry the same DMSS `type` discriminators as the root.
 */
const serializeViewConfig = (item: TGridItem): unknown => {
  if (!isContainerItem(item)) return item.viewConfig
  const recipe = item.viewConfig.recipe as TUiRecipe
  return {
    ...item.viewConfig,
    recipe: { ...recipe, config: serialize(ensureModel(recipe.config)) },
  }
}

/**
 * Serialize the in-memory model to the canonical DMSS entity JSON consumed by
 * the runtime `grid` plugin (adds the `type` discriminators). Section grids are
 * serialized recursively so nested layouts round-trip and render at runtime.
 */
export const serialize = (model: TBuilderModel): Record<string, unknown> => ({
  type: GRID_CONFIG_TYPE,
  size: { type: GRID_SIZE_TYPE, ...model.size },
  items: model.items.map((item) => ({
    type: GRID_ITEM_TYPE,
    gridArea: { type: GRID_AREA_TYPE, ...item.gridArea },
    viewConfig: serializeViewConfig(item),
    ...(item.title ? { title: item.title } : {}),
    ...(item.style && Object.keys(item.style).length
      ? { style: { type: GRID_ITEM_STYLE_TYPE, ...item.style } }
      : {}),
    ...(item.titleStyle && Object.keys(item.titleStyle).length
      ? { titleStyle: { type: GRID_ITEM_STYLE_TYPE, ...item.titleStyle } }
      : {}),
  })),
  itemBorder: { type: GRID_BORDER_TYPE, ...model.itemBorder },
  showItemBorders: model.showItemBorders,
})

/**
 * Rebuild a view config from stored JSON, recursing into Section containers so
 * their nested grids return to raw builder models the editor can mutate.
 */
const deserializeViewConfig = (viewConfig: any): TViewConfig => {
  const recipe = viewConfig?.recipe
  if (
    recipe &&
    typeof recipe === 'object' &&
    recipe.plugin === GRID_PLUGIN_NAME
  ) {
    return {
      ...viewConfig,
      recipe: { ...recipe, config: deserialize(recipe.config) },
    }
  }
  return viewConfig
}

/** Rebuild the in-memory model from a (possibly partial) stored grid config. */
export const deserialize = (entity: any): TBuilderModel => {
  const base = createEmptyModel()
  if (!entity || typeof entity !== 'object') return base
  const { type: _sizeType, ...size } = entity.size ?? {}
  return {
    size: { ...base.size, ...size },
    items: Array.isArray(entity.items)
      ? entity.items.map((item: any): TGridItem => {
          const { type: _areaType, ...gridArea } = item.gridArea ?? {}
          const stripStyle = (raw: any): TGridItem['style'] | undefined => {
            if (!raw) return undefined
            const { type: _styleType, ...rest } = raw
            return Object.keys(rest).length
              ? (rest as TGridItem['style'])
              : undefined
          }
          const style = stripStyle(item.style)
          const titleStyle = stripStyle(item.titleStyle)
          return {
            type: GRID_ITEM_TYPE,
            gridArea: gridArea as TGridArea,
            viewConfig: deserializeViewConfig(item.viewConfig),
            ...(item.title ? { title: item.title } : {}),
            ...(style ? { style } : {}),
            ...(titleStyle ? { titleStyle } : {}),
          }
        })
      : [],
    itemBorder: (() => {
      const { type: _borderType, ...border } = entity.itemBorder ?? {}
      return { ...base.itemBorder, ...border }
    })(),
    showItemBorders: entity.showItemBorders ?? base.showItemBorders,
  }
}
