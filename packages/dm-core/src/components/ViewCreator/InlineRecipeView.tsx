import React from 'react'
import { ErrorBoundary, IUIPlugin, useUiPlugins } from '../../index'
import { TInlineRecipeViewConfig } from '../../types'

type TInlineRecipeViewProps = IUIPlugin & {
  viewConfig: TInlineRecipeViewConfig
}

export const InlineRecipeView = (props: TInlineRecipeViewProps) => {
  const { idReference, type, viewConfig, onOpen, onSubmit, onChange } = props
  const { getUiPlugin } = useUiPlugins()

  const UiPlugin = getUiPlugin(viewConfig.recipe.plugin)
  return (
    // @ts-ignore
    <ErrorBoundary message={`Plugin "${viewConfig.recipe.plugin}" crashed...`}>
      <UiPlugin
        idReference={idReference}
        type={type}
        config={viewConfig.recipe.config || {}}
        onOpen={onOpen}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </ErrorBoundary>
  )
}
