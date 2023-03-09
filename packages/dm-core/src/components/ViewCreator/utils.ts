import { TViewConfig } from '../../types'
import { TGenericObject } from '../../index'

export const getTarget = (idReference: string, viewConfig: TViewConfig) => {
  if (viewConfig?.scope) return `${idReference}.${viewConfig.scope}`
  return idReference
}

export const getType = (document: TGenericObject, viewConfig: TViewConfig) => {
  // TODO: Add support for dotted paths
  if (viewConfig?.scope) return document[viewConfig.scope]?.type
  return document.type
}
