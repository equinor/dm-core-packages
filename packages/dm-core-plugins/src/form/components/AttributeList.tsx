import type {
  TAttribute,
  TBlueprint,
  TStorageRecipe,
} from '@development-framework/dm-core'
import { Stack } from '../../common'
import { useRegistryContext } from '../context/RegistryContext'
import { AttributeFieldSelector } from '../fields/AttributeFieldSelector'

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
    Array.isArray(config.fields) && config.fields.length
      ? config.fields
          .map((field) =>
            attributes?.find((attribute) => attribute.name === field)
          )
          .filter((attribute): attribute is TAttribute => !!attribute)
      : attributes.filter((attr) => !hideByDefaultFields.includes(attr.name))

  return (
    <Stack spacing={0.75}>
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
          >
            <AttributeFieldSelector
              namePath={`${prefix}${attribute.name}`}
              attribute={attribute}
              uiAttribute={uiAttribute}
              storageRecipe={storageRecipe}
            />
          </div>
        )
      })}
    </Stack>
  )
}
