import { TUiAttributeObject } from '../../types'

export const ExpandViewConfig = (uiAttribute?: TUiAttributeObject) => {
  return uiAttribute?.expandViewConfig
    ? uiAttribute?.expandViewConfig
    : {
        type: 'ReferenceViewConfig',
        recipe: uiAttribute?.uiRecipe,
      }
}

export const OpenViewConfig = (
  uiAttribute?: TUiAttributeObject,
  namePath?: string
) => {
  return uiAttribute?.openViewConfig
    ? uiAttribute?.openViewConfig
    : {
        type: 'ReferenceViewConfig',
        scope: namePath,
        recipe: uiAttribute?.uiRecipe,
      }
}

export const InferCanOpenOrExpand = (
  objectIsNotEmpty: boolean,
  config: any,
  uiAttribute?: TUiAttributeObject,
  onOpen?: CallableFunction
) => {
  const canOpenInTab =
    objectIsNotEmpty &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  const canExpand =
    objectIsNotEmpty &&
    (!canOpenInTab ||
      (uiAttribute?.functionality?.expand ?? config.functionality.expand))

  return { canExpand, canOpenInTab }
}
