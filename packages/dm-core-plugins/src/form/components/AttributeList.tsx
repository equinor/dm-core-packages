import {
  Stack,
  TAttribute,
  TBlueprint,
  TStorageRecipe,
} from '@development-framework/dm-core'
import React from 'react'
import { AttributeField } from '../fields/AttributeField'
import { TConfig } from '../types'

export const AttributeList = (props: {
  namePath: string
  config: TConfig | undefined
  blueprint: TBlueprint | undefined
  storageRecipes?: TStorageRecipe[]
}) => {
  const { namePath, config, blueprint, storageRecipes } = props

  const prefix = namePath === '' ? `` : `${namePath}.`

  const attributes = blueprint?.attributes ?? []
  const filteredAttributes =
    config && config.fields.length
      ? config.fields
          .map((name: string) =>
            attributes.find((attribute) => attribute.name == name)
          )
          .filter((attribute): attribute is TAttribute => !!attribute)
      : attributes

  const attributeFields = filteredAttributes.map((attribute) => {
    const uiAttribute = config?.attributes.find(
      (uiAttribute) => uiAttribute.name === attribute.name
    )
    let storageRecipeForAttribute: TStorageRecipe | undefined = undefined
    if (storageRecipes) {
      storageRecipeForAttribute = storageRecipes.find((storageRecipe) => {
        return storageRecipe.name === attribute.name
      })
    }

    return (
      <div
        data-testid={`${prefix}${attribute.name}`}
        key={`${prefix}${attribute.name}`}
      >
        <AttributeField
          storageRecipe={storageRecipeForAttribute}
          namePath={`${prefix}${attribute.name}`}
          attribute={attribute}
          uiAttribute={uiAttribute}
        />
      </div>
    )
  })

  return <Stack spacing={1}>{attributeFields}</Stack>
}
