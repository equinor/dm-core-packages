import { TViewConfig } from '../../types'
import { DmssAPI, TAttribute, TBlueprint } from '../../index'

export const getTarget = (idReference: string, viewConfig: TViewConfig) => {
  //skal idreference inneholde path til attributes?
  // skal viewconfig.scope max ha 1 attribute (dvs ingen dot)?
  // console.log('id', idReference)
  // console.log('scope', viewConfig.scope)
  if (viewConfig?.scope && viewConfig.scope !== 'self') {
    console.log('got target w scope ', `${idReference}.${viewConfig.scope}`)
    return `${idReference}.${viewConfig.scope}`
  }

  console.log('got target', idReference)
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

  // We need to remove any scope that contains list index
  scope[0] = scope[0].split('[')[0]

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
  scope.splice(0, 1)
  return getScopeTypeAndDimensions(attribute, dmssApi, scope)
}
