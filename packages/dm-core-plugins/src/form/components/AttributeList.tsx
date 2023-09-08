import { Stack, TAttribute, TBlueprint } from '@development-framework/dm-core'
import React, { useState } from 'react'
import { AttributeField } from '../fields/AttributeField'
import { TConfig } from '../types'
import { Button } from '@equinor/eds-core-react'

export const AttributeList = (props: {
  namePath: string
  config: TConfig | undefined
  blueprint: TBlueprint | undefined
}) => {
  const { namePath, config, blueprint } = props

  const [readOnly, setReadOnly] = useState<boolean | undefined>(
    config?.readOnly
  )
  const toggleHandler = () => {
    setReadOnly(!readOnly)
  }

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
      <div
        data-testid={`${prefix}${attribute.name}`}
        key={`${prefix}${attribute.name}`}
      >
        <AttributeField
          namePath={`${prefix}${attribute.name}`}
          attribute={attribute}
          uiAttribute={uiAttribute}
          readOnly={readOnly}
        />
      </div>
    )
  })

  return (
    <Stack spacing={1}>
      {config?.editToggle && (
        <Button onClick={toggleHandler}>{readOnly ? 'Edit' : 'View'}</Button>
      )}
      {attributeFields}
    </Stack>
  )
}
