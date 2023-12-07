import React from 'react'

import { TWidget } from '../types'
import { Datepicker } from '@development-framework/dm-core'

interface DatePickerConfig {
  variant: 'datetime' | 'date'
  label?: string
  useMinutes?: boolean
}

const DateTimeWidget = (props: TWidget) => {
  const { label, config, onChange, isDirty, id, value, readOnly, helperText } =
    props

  const conf = config as DatePickerConfig
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
      useMinutes={conf.useMinutes}
    />
  )
}

export default DateTimeWidget
