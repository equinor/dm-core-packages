import { TAttribute } from '@development-framework/dm-core'

export const getDisplayLabel = (attribute: TAttribute): string => {
  const { name, label, optional } = attribute

  const displayLabel = label === undefined || label === '' ? name : label

  return optional ? `${displayLabel} (optional)` : displayLabel
}
