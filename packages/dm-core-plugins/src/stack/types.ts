import { TViewConfig } from '@development-framework/dm-core'

export type StackPluginConfig = {
  items: TViewConfig[]
  direction: 'horizontal' | 'vertical'
  horizontalPlacement: 'left' | 'center' | 'right' | 'spaceItems'
  verticalPlacement: 'top' | 'center' | 'bottom'
  spacing: number
  maxWidth: string
  wrap: boolean
  classNames: string[]
}

export const defaultConfig: StackPluginConfig = {
  items: [],
  direction: 'vertical',
  horizontalPlacement: 'left',
  verticalPlacement: 'top',
  spacing: 2,
  maxWidth: 'none',
  wrap: false,
  classNames: [],
}
