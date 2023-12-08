import { TAttribute } from '@development-framework/dm-core'
import { Chip } from '@equinor/eds-core-react'
import lodash from 'lodash'
import React from 'react'

export const getDisplayLabel = (attribute: TAttribute) => {
  const { name, label, optional } = attribute
  const displayLabel =
    label === undefined || label === '' ? lodash.startCase(name) : label
  return (
    <div className='flex items-center'>
      <p>{displayLabel}</p>
      {optional && (
        <p className='text-gray ms-2 font-normal text-xs'>Optional</p>
      )}
    </div>
  )
}

export const getDisplayLabelString = (attribute: TAttribute): string => {
  const { name, label, optional } = attribute
  const displayLabel =
    label === undefined || label === '' ? lodash.startCase(name) : label

  return optional ? displayLabel + ' (Optional)' : displayLabel
}
