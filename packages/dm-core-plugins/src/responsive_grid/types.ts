import { TViewConfig } from '@development-framework/dm-core'

export type TColSize = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

export type TCol = {
  viewConfig: TViewConfig
  size: TColSize
  title?: string
}

export type TRow = {
  columns: TCol[]
  gutterWidth: number
}

export type TGridPluginConfig = {
  rows: TRow[]
}

export type TItemBorder = {
  size: string
  style: string
  color: string
  radius: string
}
