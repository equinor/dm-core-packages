import { ErrorBoundary, IUIPlugin, useApplication } from '../../index'
import { TInlineRecipeViewConfig } from '../../types'

type TInlineRecipeViewProps = IUIPlugin & {
  viewConfig: TInlineRecipeViewConfig
}

export const InlineRecipeView = (props: TInlineRecipeViewProps) => {
  const { idReference, type, viewConfig, onOpen, onSubmit, onChange } = props
  const { getUiPlugin } = useApplication()

  const UiPlugin = getUiPlugin(viewConfig.recipe.plugin)
  return (
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
