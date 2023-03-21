import { TInlineRecipeViewConfig } from '../../types'
import { ErrorBoundary, Loading, UiPluginContext } from '../../index'
import React, { useContext } from 'react'

type TInlineRecipeView = {
  absoluteDottedId: string
  type: string
  viewConfig: TInlineRecipeViewConfig
}

export const InlineRecipeView = (props: TInlineRecipeView) => {
  const { absoluteDottedId, type, viewConfig } = props
  const { loading, getUiPlugin } = useContext(UiPluginContext)

  if (loading) return <Loading />

  const UiPlugin = getUiPlugin(viewConfig.recipe.plugin)
  return (
    // @ts-ignore
    <ErrorBoundary message={`Plugin "${viewConfig.recipe.plugin}" crashed...`}>
      <UiPlugin
        idReference={absoluteDottedId}
        type={type}
        config={viewConfig.recipe.config || {}}
      />
    </ErrorBoundary>
  )
}
