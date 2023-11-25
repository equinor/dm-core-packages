import React from 'react'

import { TextField } from '@equinor/eds-core-react'

import { TWidget } from '../types'
import { DateTime } from 'luxon'

const TextWidget = (props: TWidget) => {
  const { label, onChange, leftAdornments, rightAdornments, isDirty } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    let formattedValue
    if (props.config?.format === 'datetime') {
      formattedValue = new Date(value).toISOString()
    } else {
      formattedValue = value === '' ? null : value
    }
    onChange?.(formattedValue)
  }

  const fieldType = (format?: string): string => {
    if (format && format === 'datetime') return 'datetime-local'
    else if (format) return format
    return 'string'
  }
  return (
    <TextField
      id={props.id}
      readOnly={props.readOnly}
      defaultValue={
        fieldType(props.config?.format) === 'datetime-local'
          ? DateTime.fromISO(props.value).toFormat("yyyy-MM-dd'T'T")
          : props.value
      }
      //@ts-ignore
      leftAdornments={leftAdornments}
      rightAdornments={rightAdornments}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onChange={onChangeHandler}
      label={label}
      type={fieldType(props.config?.format)}
      data-testid={`form-text-widget-${label}`}
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

export default TextWidget
