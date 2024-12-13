import type { TAttribute } from '@development-framework/dm-core'
import lodash from 'lodash'
import type { TUiAttribute } from '../types'

export const getDisplayLabel = (
  attribute: TAttribute,
  hideOptionalLabel?: boolean | undefined,
  uiAttribute?: TUiAttribute
) => {
  const { name, label: attributeLabel } = attribute

  if (uiAttribute?.label) return uiAttribute?.label

  const displayLabel =
    attributeLabel === undefined || attributeLabel === ''
      ? lodash.startCase(name)
      : attributeLabel

  return !hideOptionalLabel && attribute.optional
    ? displayLabel + ' (Optional)'
    : displayLabel
}
