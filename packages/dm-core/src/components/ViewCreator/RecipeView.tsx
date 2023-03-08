import { TRecipeViewConfig } from '../../types'
import { IUIPlugin } from '@development-framework/dm-core'
import React from 'react'

type TRecipeView = {
  absoluteDottedId: string
  type: string
  viewConfig: TRecipeViewConfig
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => JSX.Element
}

export const RecipeView = (props: TRecipeView) => {
  const { absoluteDottedId, type, viewConfig, getUiPlugin } = props
  const UiPlugin = getUiPlugin(viewConfig.recipe.plugin)
  return (
    <UiPlugin
      idReference={absoluteDottedId}
      type={type}
      config={viewConfig.recipe.config || {}}
    />
  )
}
