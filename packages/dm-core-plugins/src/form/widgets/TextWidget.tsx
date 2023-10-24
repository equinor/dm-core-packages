import React from 'react'

import { Icon, TextField } from '@equinor/eds-core-react'

import { error_filled } from '@equinor/eds-icons'
import { TWidget } from '../types'
import { DateTime } from 'luxon'

Icon.add({ error_filled })

const TextWidget = (props: TWidget) => {
  const { label, onChange } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
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
      onClick={props.onClick}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onChange={onChangeHandler}
      label={label}
      type={fieldType(props.config?.format)}
      data-testid="form-textfield"
    />
  )
}

export default TextWidget
