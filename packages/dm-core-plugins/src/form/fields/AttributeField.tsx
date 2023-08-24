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
  const { namePath, attribute, uiAttribute, storageRecipe } = props
  const fieldType = getFieldType(attribute)

  const displayLabel = getDisplayLabel(attribute)

  switch (fieldType) {
    case 'binary':
      return (
        <BinaryField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional ?? false}
          uiAttribute={uiAttribute}
        />
      )

    case 'object':
      // Get the ui recipe name that should be used for nested
      return (
        <ObjectField
          namePath={namePath}
          displayLabel={displayLabel}
          contained={attribute.contained ?? true}
          storageContained={storageRecipe === undefined ? true : false} // TODO find out if storageContained should be put in here...
          type={attribute.attributeType}
          optional={attribute.optional ?? false}
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
          dimensions={attribute.dimensions}
        />
      )
    case 'string':
      return (
        <StringField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional ?? false}
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
          optional={attribute.optional ?? false}
          uiAttribute={uiAttribute}
        />
      )
    default:
      return <>UnknownField</>
  }
}
