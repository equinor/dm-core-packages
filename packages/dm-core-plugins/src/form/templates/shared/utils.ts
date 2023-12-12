import { TUiAttributeObject } from '../../types'

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
  namePath?: string
) => {
  return (
    uiAttribute?.openViewConfig ?? {
      type: 'ReferenceViewConfig',
      scope: namePath,
      recipe: uiAttribute?.uiRecipe,
    }
  )
}

export const getCanOpenOrExpand = (
  objectIsNotEmpty: boolean,
  config: any,
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
