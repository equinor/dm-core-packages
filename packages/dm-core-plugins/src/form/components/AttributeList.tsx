import {
  TAttribute,
  TBlueprint,
  TStorageRecipe,
} from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { AttributeField } from '../fields/AttributeField'

export const AttributeList = (props: {
  namePath: string
  blueprint: TBlueprint
  storageRecipes: TStorageRecipe[]
}) => {
  const { namePath, blueprint, storageRecipes } = props
  const { config } = useRegistryContext()
  const prefix = namePath === '' ? '' : `${namePath}.`
  const attributes: TAttribute[] | undefined = blueprint.attributes

  const hideByDefaultFields: string[] = ['type', '_meta_']
  const filteredAttributes =
    Array.isArray(config.fields) && config.fields.length > 0
      ? attributes.filter((attr) => config.fields.includes(attr.name))
      : attributes.filter((attr) => !hideByDefaultFields.includes(attr.name))

  return (
    <>
      {filteredAttributes?.map((attribute: TAttribute) => {
        const uiAttribute = config?.attributes.find(
          (uiAttribute) => uiAttribute.name === attribute.name
        )
        // TODO: Retrieve storage recipe based on attribute name
        const storageRecipe =
          storageRecipes.length > 0 ? storageRecipes[0] : undefined
        return (
          <div
            data-testid={`${prefix}${attribute.name}`}
            key={`${prefix}${attribute.name}`}
            className='pb-3'
          >
            <AttributeField
              namePath={`${prefix}${attribute.name}`}
              attribute={attribute}
              uiAttribute={uiAttribute}
              storageRecipe={storageRecipe}
            />
          </div>
        )
      })}
    </>
  )
}
