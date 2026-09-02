import type { IUIPlugin } from '@development-framework/dm-core'

export type TGraphPluginConfig = {
  valueAttribute: string
  labelAttribute?: string
  title?: string
  color?: string
}

export type TGraphPluginProps = IUIPlugin & { config?: TGraphPluginConfig }

export const defaultConfig: Required<
  Pick<TGraphPluginConfig, 'labelAttribute' | 'color'>
> = {
  labelAttribute: 'name',
  color: '#007079',
}
