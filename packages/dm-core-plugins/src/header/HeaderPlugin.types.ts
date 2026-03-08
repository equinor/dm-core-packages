import type { IUIPlugin } from '@development-framework/dm-core'

export type UIRecipeItem = {
  label?: string
  recipeName: string
}

export type THeaderPluginConfig = {
  uiRecipesList: UIRecipeItem[]
  hideUserInfo: boolean
  hideAbout: boolean
  adminRole?: string
}

export const defaultHeaderPluginConfig: THeaderPluginConfig = {
  uiRecipesList: [],
  hideUserInfo: false,
  hideAbout: false,
  adminRole: 'dmss-admin',
}

export type TRecipeConfigAndPlugin = {
  config?: Record<string, any>
  component: (props: IUIPlugin) => React.ReactElement
  name: string
}
