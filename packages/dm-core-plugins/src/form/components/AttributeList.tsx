import { Stack, TAttribute, TBlueprint } from '@development-framework/dm-core'
import React from 'react'
import { AttributeField } from '../fields/AttributeField'
import { TConfig } from '../types'

export const AttributeList = (props: {
  namePath: string
  config: TConfig | undefined
  blueprint: TBlueprint | undefined
}) => {
  const { namePath, config, blueprint } = props

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
    return (
      <AttributeField
        key={`${prefix}${attribute.name}`}
        namePath={`${prefix}${attribute.name}`}
        attribute={attribute}
        uiAttribute={uiAttribute}
      />
    )
  })

  return <Stack spacing={1}>{attributeFields}</Stack>
}
