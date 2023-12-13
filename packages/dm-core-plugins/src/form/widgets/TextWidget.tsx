import React from 'react'
import { TextField } from '@equinor/eds-core-react'
import { TWidget } from '../types'
import ReadOnlyField from '../components/ReadOnlyField'

const TextWidget = (props: TWidget) => {
  const { label, onChange, isDirty, value } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value === '' ? null : event.target.value)
  }

  if (props.readOnly) return <ReadOnlyField label={label} value={value} />

  return (
    <TextField
      id={props.id}
      label={label}
      defaultValue={props.readOnly && props.value === '' ? '-' : props.value}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onChange={onChangeHandler}
      type='string'
      data-testid={`form-text-widget-${props.id}`}
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
