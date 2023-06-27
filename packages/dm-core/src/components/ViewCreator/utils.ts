import { TViewConfig } from '../../types'

export const getTarget = (idReference: string, viewConfig: TViewConfig) => {
  if (viewConfig?.scope && viewConfig.scope !== 'self')
    return `${idReference}.${viewConfig.scope}`
  return idReference
}
