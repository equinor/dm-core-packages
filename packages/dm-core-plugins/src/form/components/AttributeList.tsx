import { Stack, TAttribute, TBlueprint } from '@development-framework/dm-core'
import React from 'react'
import { AttributeField } from '../fields/AttributeField'
import { TConfig } from '../types'
import { useRegistryContext } from '../context/RegistryContext'

export const AttributeList = (props: {
  namePath: string
  config: TConfig | undefined
  blueprint: TBlueprint | undefined
}) => {
  const { namePath, config, blueprint } = props
  const { idReference } = useRegistryContext()

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
  console.log('attr list np', namePath)
  const attributeFields = filteredAttributes.map((attribute) => {
    const uiAttribute = config?.attributes.find(
      (uiAttribute) => uiAttribute.name === attribute.name
    )
    // console.log('display attribute, ', attribute)

    const address = `${idReference}.${prefix}${attribute.name}`
    console.log('addr', address)
    return (
      <div data-testid={address} key={address}>
        <AttributeField
          address={address}
          attribute={attribute}
          uiAttribute={uiAttribute}
        />
      </div>
    )
  })

  return <Stack spacing={1}>{attributeFields}</Stack>
}
