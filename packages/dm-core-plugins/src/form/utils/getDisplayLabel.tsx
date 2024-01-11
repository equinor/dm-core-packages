import { TAttribute } from '@development-framework/dm-core'
import lodash from 'lodash'

export const getDisplayLabel = (
  attribute: TAttribute,
  hideOptionalLabel: boolean | undefined
) => {
  const { name, label } = attribute
  const displayLabel =
    label === undefined || label === '' ? lodash.startCase(name) : label

  return !hideOptionalLabel && attribute.optional
    ? displayLabel + ' (Optional)'
    : displayLabel
}
