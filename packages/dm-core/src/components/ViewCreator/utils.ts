import { TViewConfig } from '../../types'
import { DmssAPI, TAttribute, TBlueprint } from '../../index'

export const getTarget = (idReference: string, viewConfig: TViewConfig) => {
  if (viewConfig?.scope && viewConfig.scope !== 'self')
    return `${idReference}.${viewConfig.scope}`
  return idReference
}

export async function getScopeTypeAndDimensions(
  blueprintAttribute: TAttribute,
  dmssApi: DmssAPI,
  scope: string[]
): Promise<[string, string]> {
  if (!scope?.length || scope[0] === 'self') {
    if (!blueprintAttribute.attributeType)
      throw new Error(
        `Got invalid "attributeType" for blueprint attribute "${JSON.stringify(
          blueprintAttribute
        )}"`
      )
    return Promise.resolve([
      blueprintAttribute.attributeType,
      blueprintAttribute.dimensions ?? '',
    ])
  }

  const blueprint: TBlueprint = await dmssApi
    .blueprintGet({ typeRef: blueprintAttribute.attributeType })
    .then((response: any) => response.data.blueprint)

  const attribute = blueprint.attributes.find((a) => a.name === scope[0])
  if (!attribute) {
    throw new Error(
      `Unable to find attribute '${scope[0]}' in blueprint '${blueprintAttribute.attributeType}'`
    )
  }
  if (scope.length === 1) {
    if (!blueprintAttribute.attributeType)
      throw new Error(
        `Got invalid "attributeType" for blueprint attribute "${JSON.stringify(
          blueprintAttribute
        )}"`
      )
    return [attribute.attributeType, attribute.dimensions]
  }
  if (attribute.dimensions == '*') {
    scope.splice(0, 2)
  } else {
    scope.splice(0, 1)
  }
  return getScopeTypeAndDimensions(attribute, dmssApi, scope)
}
