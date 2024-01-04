import { TStorageRecipe } from '@development-framework/dm-core'
import { TField } from '../types'
import { isArray, isPrimitive } from '../utils'
import ArrayField from './ArrayField'
import { BinaryField } from './BinaryField'
import { BooleanField } from './BooleanField'
import { NumberField } from './NumberField'
import { ObjectField } from './ObjectField'
import { StringField } from './StringField'

const getFieldType = (attribute: any) => {
  const { attributeType, dimensions } = attribute

  if (attributeType === 'binary') {
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

export const AttributeField = (
  props: TField & { storageRecipe?: TStorageRecipe }
) => {
  const { namePath, attribute, uiAttribute, storageRecipe } = props
  const fieldType = getFieldType(attribute)
  const Field = getField(fieldType)
  if (fieldType === 'object') {
    const isStorageUncontained =
      storageRecipe?.attributes[attribute.name] !== undefined
    return (
      <Field
        namePath={namePath}
        uiAttribute={uiAttribute}
        attribute={attribute}
        isStorageUncontained={isStorageUncontained}
      />
    )
  }
  return (
    <Field
      namePath={namePath}
      uiAttribute={uiAttribute}
      attribute={attribute}
    />
  )
}
