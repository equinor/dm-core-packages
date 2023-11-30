import { TViewConfig } from '@development-framework/dm-core'

export type TGridSize = {
  columns: number
  rows: number
  rowGap: string
  columnGap: string
  rowSizes?: string[]
  columnSizes?: string[]
}

export type TGridArea = {
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
}

export type TGridItem = {
  type: string
  gridArea: TGridArea
  viewConfig: TViewConfig
  title?: string
}

export type TGridPluginConfig = {
  size: TGridSize
  items: TGridItem[]
  itemBorder: TItemBorder
  showItemBorders: boolean
}

export type TItemBorder = {
  size: string
  style: string
  color: string
  radius: string
}
