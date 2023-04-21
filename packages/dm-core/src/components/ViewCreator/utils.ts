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
): TGenericObject | undefined =>
  path.split('.').reduce((acc, key) => {
    // TODO: Rewrite this to dig down in blueprints to find type of lists
    // TODO: there is no guarantee that the first element of the list has the generic type for the whole list
    if (Array.isArray(acc[key])) {
      return key in acc[key][0] ? acc[key][0] : acc[key][0]
    }
    return key in acc ? acc[key] : acc
  }, initial)

export const getType = (
  document: TGenericObject,
  viewConfig: TViewConfig
): string | undefined => {
  if (viewConfig?.scope) {
    const target = resolvePath(document, viewConfig.scope)
    if (target === undefined) {
      throw new Error(
        `Could not find the view target, check that the attribute '${viewConfig?.scope}' exists in the target document`
      )
    }
    return target.type
  }
  if (Array.isArray(document)) return document[0]?.type
  return document.type
}
