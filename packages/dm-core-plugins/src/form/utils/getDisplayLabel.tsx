import { TAttribute } from '@development-framework/dm-core'
import lodash from 'lodash'

export const getDisplayLabel = (attribute: TAttribute) => {
  const { name, label } = attribute
  const displayLabel =
    label === undefined || label === '' ? lodash.startCase(name) : label
  return displayLabel
}

export const getDisplayLabelWithOptional = (attribute: TAttribute): string => {
  const displayLabel = getDisplayLabel(attribute)
  return attribute.optional ? displayLabel + ' (Optional)' : displayLabel
}
