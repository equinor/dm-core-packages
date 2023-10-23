import { TAttribute, TBlueprint } from '@development-framework/dm-core'
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
            attributes.find((attribute: TAttribute) => attribute.name == name)
          )
          .filter((attribute): attribute is TAttribute => !!attribute)
      : attributes

  const attributeFields = filteredAttributes.map((attribute: TAttribute) => {
    const uiAttribute = config?.attributes.find(
      (uiAttribute) => uiAttribute.name === attribute.name
    )
    return (
      <div
        data-testid={`${prefix}${attribute.name}`}
        key={`${prefix}${attribute.name}`}
      >
        <AttributeField
          namePath={`${prefix}${attribute.name}`}
          attribute={attribute}
          uiAttribute={uiAttribute}
          readOnly={config?.readOnly}
        />
      </div>
    )
  })

  return <>{attributeFields}</>
}
