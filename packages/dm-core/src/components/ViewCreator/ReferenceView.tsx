import { TReferenceViewConfig } from '../../types'
import { IUIPlugin, useRecipe } from '../../index'
import React from 'react'

type TReferenceView = {
  absoluteDottedId: string
  type: string
  viewConfig: TReferenceViewConfig
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => JSX.Element
}

export const ReferenceView = (props: TReferenceView) => {
  const { absoluteDottedId, type, viewConfig, getUiPlugin } = props
  const { recipe, isLoading: isRecipeLoading, error } = useRecipe(
    type,
    viewConfig.recipe
  )
  if (isRecipeLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (recipe === undefined) return <>Recipe is undefined</>
  const UiPlugin = getUiPlugin(recipe.plugin)
  // TODO: Add override configuration functionality
  return (
    <UiPlugin
      type={type}
      idReference={absoluteDottedId}
      config={recipe?.config || {}}
    />
  )
}
