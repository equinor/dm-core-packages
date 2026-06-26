import type { TViewConfig } from '@development-framework/dm-core'
import type { TGridArea, TGridItem, TGridSize } from '../grid/types'
import type { TBlock, TBuilderModel } from './types'

/** DMSS type discriminators used by the runtime `grid` plugin entity format. */
export const GRID_CONFIG_TYPE = 'PLUGINS:dm-core-plugins/grid/GridPluginConfig'
export const GRID_ITEM_TYPE = 'PLUGINS:dm-core-plugins/grid/GridItem'
export const GRID_AREA_TYPE = 'PLUGINS:dm-core-plugins/grid/GridArea'
export const GRID_SIZE_TYPE = 'PLUGINS:dm-core-plugins/grid/GridSize'
export const REFERENCE_VIEW_CONFIG_TYPE = 'CORE:ReferenceViewConfig'

const DEFAULT_SIZE: TGridSize = {
  columns: 12,
  rows: 8,
  rowGap: '16px',
  columnGap: '16px',
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
  const width = area.columnEnd - area.columnStart
  const height = area.rowEnd - area.rowStart
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

/**
 * Find the first free top-left cell that fits a widget of the given footprint,
 * scanning row by row. Falls back to the origin if nothing fits.
 */
export const findFreeArea = (
  model: TBuilderModel,
  footprint: { columns: number; rows: number }
): TGridArea => {
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
  return {
    rowStart: 1,
    rowEnd: 1 + height,
    columnStart: 1,
    columnEnd: 1 + width,
  }
}

const defaultViewConfig = (block: TBlock): TViewConfig => ({
  type: REFERENCE_VIEW_CONFIG_TYPE,
  scope: '',
  recipe: block.id,
  label: block.label,
})

/** Add a widget for a block at the given area, returning a new model. */
export const addWidget = (
  model: TBuilderModel,
  block: TBlock,
  area?: TGridArea,
  viewConfig?: TViewConfig
): TBuilderModel => {
  const gridArea = clampArea(
    area ?? findFreeArea(model, block.defaultSize),
    model.size
  )
  const item: TGridItem = {
    type: GRID_ITEM_TYPE,
    gridArea,
    viewConfig: viewConfig ?? defaultViewConfig(block),
    title: block.label,
  }
  return { ...model, items: [...model.items, item] }
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

/**
 * Serialize the in-memory model to the canonical DMSS entity JSON consumed by
 * the runtime `grid` plugin (adds the `type` discriminators).
 */
export const serialize = (model: TBuilderModel): Record<string, unknown> => ({
  type: GRID_CONFIG_TYPE,
  size: { type: GRID_SIZE_TYPE, ...model.size },
  items: model.items.map((item) => ({
    type: GRID_ITEM_TYPE,
    gridArea: { type: GRID_AREA_TYPE, ...item.gridArea },
    viewConfig: item.viewConfig,
    ...(item.title ? { title: item.title } : {}),
  })),
  itemBorder: model.itemBorder,
  showItemBorders: model.showItemBorders,
})

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
          return {
            type: GRID_ITEM_TYPE,
            gridArea: gridArea as TGridArea,
            viewConfig: item.viewConfig,
            ...(item.title ? { title: item.title } : {}),
          }
        })
      : [],
    itemBorder: { ...base.itemBorder, ...(entity.itemBorder ?? {}) },
    showItemBorders: entity.showItemBorders ?? base.showItemBorders,
  }
}
