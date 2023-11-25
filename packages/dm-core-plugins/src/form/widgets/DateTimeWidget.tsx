import React from 'react'

import { TextField } from '@equinor/eds-core-react'

import { TWidget } from '../types'
import { DateTime } from 'luxon'

const DateTimeWidget = (props: TWidget) => {
  const { label, onChange, leftAdornments, rightAdornments, isDirty } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(new Date(event.target.value).toISOString())
  }

  return (
    <TextField
      id={props.id}
      readOnly={props.readOnly}
      defaultValue={DateTime.fromISO(props.value).toFormat("yyyy-MM-dd'T'T")}
      //@ts-ignore
      leftAdornments={leftAdornments}
      rightAdornments={rightAdornments}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onChange={onChangeHandler}
      label={label}
      type="datetime-local"
      data-testid={`form-datetime-widget-${label}`}
      style={
        isDirty && props.variant !== 'error'
          ? {
              // @ts-ignore
              '--eds-input-background': '#85babf5e',
            }
          : {}
      }
    />
  )
}

export default DateTimeWidget
