import React from 'react'

import { TWidget } from '../types'
import { Datepicker } from '@development-framework/dm-core'

const DateTimeWidget = (props: TWidget) => {
  const { label, onChange, isDirty, id, value, readOnly, helperText } = props

  return (
    <Datepicker
      id={id}
      variant='datetime'
      value={value}
      onChange={onChange}
      data-testid={`form-datetime-widget-${label}`}
      readonly={readOnly}
      label={label}
      helperText={helperText}
      isDirty={isDirty}
      useMinutes={false}
    />
  )
}

export default DateTimeWidget
