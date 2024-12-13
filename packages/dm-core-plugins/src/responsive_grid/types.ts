import type { TViewConfig } from '@development-framework/dm-core'

export type TBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type TBreakpoints = Record<TBreakpoint, number>

export const breakpoints: TBreakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
  xxl: 1920,
}

export type TCol = {
  viewConfig: TViewConfig
  size: TBreakpoints
  title?: string
}

export type TGridPluginConfig = {
  views: TCol[]
  spacing?: TBreakpoints
}

export const defaultConfig: TGridPluginConfig = {
  views: [],
}
