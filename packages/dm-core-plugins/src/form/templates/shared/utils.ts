import { TFormConfig, TUiAttributeObject } from '../../types'

export const getExpandViewConfig = (uiAttribute?: TUiAttributeObject) => {
  return (
    uiAttribute?.expandViewConfig ?? {
      type: 'ReferenceViewConfig',
      recipe: uiAttribute?.uiRecipe,
    }
  )
}

export const getOpenViewConfig = (
  uiAttribute?: TUiAttributeObject,
  /** namePath requried for model contained, but should not be set for model Uncontained **/
  namePath?: string
) => {
  return (
    uiAttribute?.openViewConfig ?? {
      type: 'ReferenceViewConfig',
      recipe: uiAttribute?.uiRecipe,
      scope: namePath,
    }
  )
}

export const getCanOpenOrExpand = (
  objectIsNotEmpty: boolean,
  config: TFormConfig,
  uiAttribute?: TUiAttributeObject,
  onOpen?: CallableFunction
) => {
  const canOpen =
    objectIsNotEmpty &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  const canExpand =
    objectIsNotEmpty &&
    (!canOpen ||
      (uiAttribute?.functionality?.expand ?? config.functionality.expand))

  return { canExpand, canOpen }
}
