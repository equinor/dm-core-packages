import { TViewConfig } from '../../types'
import { TGenericObject } from '../../index'

export const getTarget = (idReference: string, viewConfig: TViewConfig) => {
  if (viewConfig?.scope && viewConfig.scope !== 'self')
    return `${idReference}.${viewConfig.scope}`
  return idReference
}

// Source: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
const resolvePath = (
  initial: Record<string | number, any>,
  path: string
): TGenericObject =>
  path.split('.').reduce((acc, key) => {
    return key in acc ? acc[key] : acc
  }, initial)

export const getType = (document: TGenericObject, viewConfig: TViewConfig) => {
  if (viewConfig?.scope) {
    const target: TGenericObject = resolvePath(document, viewConfig.scope)
    return target.type
  }
  return document.type
}
