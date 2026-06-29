import type { TViewConfig } from '@development-framework/dm-core'

export type TGridSize = {
  columns: number
  rows: number
  rowGap: string
  columnGap: string
  rowSizes?: string[]
  columnSizes?: string[]
  gridWidth?: number
  gridHeight?: number
}

export type TGridArea = {
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
}

export type TGridItemStyle = {
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: string
  bold?: boolean
  color?: string
  padding?: string
}

export type TGridItem = {
  type: string
  gridArea: TGridArea
  viewConfig: TViewConfig
  title?: string
  style?: TGridItemStyle
  titleStyle?: TGridItemStyle
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
