import React from 'react'

import { TAttributeFieldProps } from '../types'
import { isArray, isPrimitive } from '../utils'
import ArrayField from './ArrayField'
import { BinaryField } from './BinaryField'
import { BooleanField } from './BooleanField'
import { NumberField } from './NumberField'
import { ObjectField } from './ObjectField'
import { StringField } from './StringField'

const getFieldType = (attribute: any) => {
  const { attributeType, dimensions } = attribute

  if (attributeType == 'binary') {
    return 'binary'
  }

  if (!isArray(dimensions) && isPrimitive(attributeType)) {
    return attributeType
  }

  if (isArray(dimensions)) {
    return 'array'
  } else {
    return 'object'
  }
}

const getDisplayLabel = (attribute: any): string => {
  const { name, label, optional } = attribute

  const displayLabel = label === undefined || label === '' ? name : label

  return optional ? `${displayLabel} (optional)` : displayLabel
}

export const AttributeField = (props: TAttributeFieldProps) => {
  const { namePath, attribute, uiAttribute } = props

  const fieldType = getFieldType(attribute)

  const displayLabel = getDisplayLabel(attribute)

  switch (fieldType) {
    case 'binary':
      return (
        <BinaryField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional}
          uiAttribute={uiAttribute}
        />
      )

    case 'object':
      // Get the ui recipe name that should be used for nested
      return (
        <ObjectField
          namePath={namePath}
          displayLabel={displayLabel}
          contained={attribute.contained}
          type={attribute.attributeType}
          optional={attribute.optional}
          uiRecipeName={
            uiAttribute &&
            'uiRecipe' in uiAttribute &&
            typeof uiAttribute.uiRecipe == 'string'
              ? uiAttribute.uiRecipe
              : undefined
          }
          uiAttribute={uiAttribute}
        />
      )

    case 'array':
      return (
        <ArrayField
          namePath={namePath}
          displayLabel={displayLabel}
          type={attribute.attributeType}
          uiAttribute={uiAttribute}
        />
      )
    case 'string':
      return (
        <StringField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional}
          uiAttribute={uiAttribute}
        />
      )
    case 'boolean':
      return (
        <BooleanField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          uiAttribute={uiAttribute}
        />
      )
    case 'integer':
    case 'number':
      return (
        <NumberField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional}
          uiAttribute={uiAttribute}
        />
      )
    default:
      return <>UnknownField</>
  }
}
