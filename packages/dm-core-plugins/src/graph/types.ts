import type { IUIPlugin } from '@development-framework/dm-core'

export type TGraphPluginConfig = {
  // Attribute holding the numeric value each bar represents.
  valueAttribute: string
  // Attribute used as the bar's label, defaults to "name".
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
