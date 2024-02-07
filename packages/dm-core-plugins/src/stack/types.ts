import { TViewConfig } from '@development-framework/dm-core'

export type StackPluginConfig = {
  items: TViewConfig[]
  direction: 'horizontal' | 'vertical'
  verticalPlacement: 'left' | 'center' | 'right' | 'spaceItems'
  horizontalPlacement: 'top' | 'center' | 'bottom'
  spacing: number
  maxWidth: string
  wrap: boolean
  classNames: string[]
}

export const defaultConfig: StackPluginConfig = {
  items: [],
  direction: 'horizontal',
  verticalPlacement: 'left',
  horizontalPlacement: 'top',
  spacing: 2,
  maxWidth: '100%',
  wrap: false,
  classNames: [],
}
