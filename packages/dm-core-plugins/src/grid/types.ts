import { TViewConfig, IUIPlugin } from '@development-framework/dm-core'

export type TGridSize = {
  columns: number
  rows: number
  rowGap?: number
  columnGap?: number
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
}

export type TGridPluginConfig = IUIPlugin & {
  config?: {
    size: TGridSize
    items: TGridItem[]
  }
}
