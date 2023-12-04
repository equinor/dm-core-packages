import { TViewConfig } from '../../types'

export const getTarget = (idReference: string, viewConfig: TViewConfig) => {
  if (viewConfig?.scope && viewConfig.scope !== 'self')
    if (viewConfig.scope.slice(0, 5) === 'self.') {
      return `${idReference}.${viewConfig.scope.slice(5, -1)}`
    } else if (viewConfig.scope.slice(0, 1) === '^') {
      throw new Error(
        `'^' operator is not allowed in 'scope' (location: ${idReference})`
      )
    } else if (viewConfig.scope.slice(0, 1) === '.') {
      return `${idReference}${viewConfig.scope}`
    } else {
      return `${idReference}.${viewConfig.scope}`
    }
  return idReference
}
