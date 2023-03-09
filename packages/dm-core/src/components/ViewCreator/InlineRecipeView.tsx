import { TInlineRecipeViewConfig } from '../../types'
import { IUIPlugin } from '../../index'
import React from 'react'

type TInlineRecipeView = {
  absoluteDottedId: string
  type: string
  viewConfig: TInlineRecipeViewConfig
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => JSX.Element
}

export const InlineRecipeView = (props: TInlineRecipeView) => {
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
