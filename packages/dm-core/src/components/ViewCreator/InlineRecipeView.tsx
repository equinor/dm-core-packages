import { TInlineRecipeViewConfig } from '../../types'
import { ErrorBoundary, Loading, UiPluginContext, IUIPlugin } from '../../index'
import React, { useContext } from 'react'

type TInlineRecipeViewProps = IUIPlugin & {
  viewConfig: TInlineRecipeViewConfig
}

export const InlineRecipeView = (props: TInlineRecipeViewProps) => {
  const { idReference, type, viewConfig, onOpen } = props
  const { getUiPlugin } = useContext(UiPluginContext)

  const UiPlugin = getUiPlugin(viewConfig.recipe.plugin)
  return (
    // @ts-ignore
    <ErrorBoundary message={`Plugin "${viewConfig.recipe.plugin}" crashed...`}>
      <UiPlugin
        idReference={idReference}
        type={type}
        config={viewConfig.recipe.config || {}}
        onOpen={onOpen}
      />
    </ErrorBoundary>
  )
}
