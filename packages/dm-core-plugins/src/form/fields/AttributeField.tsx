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

const ATTRIBUTE_FIELD_MAPPING: Record<string, any> = {
  binary: BinaryField,
  object: ObjectField,
  array: ArrayField,
  string: StringField,
  boolean: BooleanField,
  integer: NumberField,
  number: NumberField,
}

const getField = (fieldType: string) => ATTRIBUTE_FIELD_MAPPING[fieldType]

export const AttributeField = (props: TAttributeFieldProps) => {
  const { namePath, attribute, uiAttribute, leftAdornments, rightAdornments } =
    props
  const fieldType = getFieldType(attribute)
  const displayLabel = getDisplayLabel(attribute)
  const Field = getField(fieldType)
  return (
    <Field
      namePath={namePath}
      displayLabel={displayLabel}
      uiAttribute={uiAttribute}
      leftAdornments={leftAdornments}
      rightAdornments={rightAdornments}
      attribute={attribute}
    />
  )
}
