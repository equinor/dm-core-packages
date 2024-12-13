import type { TStorageRecipe } from '@development-framework/dm-core'
import {
  ArrayField,
  BinaryField,
  BooleanField,
  NumberField,
  ObjectField,
  StringField,
} from '.'
import type { TField } from '../types'
import { getFieldType } from '../utils'

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

type AttributeFieldSelectorProps = {
  storageRecipe?: TStorageRecipe
} & TField

export const AttributeFieldSelector = (props: AttributeFieldSelectorProps) => {
  const { namePath, attribute, uiAttribute, storageRecipe } = props
  const fieldType = getFieldType(attribute)
  const Field = getField(fieldType)
  const isStorageUncontained =
    fieldType === 'object' &&
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
