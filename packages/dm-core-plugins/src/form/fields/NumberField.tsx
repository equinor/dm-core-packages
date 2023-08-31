import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TNumberFieldProps } from '../types'

const REGEX_INTEGER = /^\d+([eE][-+]?\d+)?$/
const REGEX_FLOAT = /^\d+(\.\d+)?([eE][-+]?\d+)?$/

const parse = (value: unknown, isInteger: boolean): number | string | null => {
  if (value == null) return null
  const valueAsString = String(value)
  const valid = isInteger
    ? REGEX_INTEGER.test(valueAsString)
    : REGEX_FLOAT.test(valueAsString)
  return valid ? Number(valueAsString) : valueAsString
}

export const NumberField = (props: TNumberFieldProps) => {
  const {
    namePath,
    displayLabel,
    defaultValue,
    optional,
    uiAttribute,
    isInteger,
  } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')

  return (
    <Controller
      name={namePath}
      rules={{
        required: !optional,
        pattern: {
          value: isInteger ? REGEX_INTEGER : REGEX_FLOAT,
          message: isInteger ? 'Only integers allowed' : 'Only numbers allowed',
        },
      }}
      defaultValue={defaultValue || null}
      render={({
        field: { ref, onChange, ...props },
        fieldState: { invalid, error },
      }) => {
        return (
          <Widget
            {...props}
            onChange={(v) => onChange(parse(v, isInteger))}
            value={props.value ?? ''}
            id={namePath}
            label={displayLabel}
            inputRef={ref}
            helperText={error?.message}
            variant={invalid ? 'error' : undefined}
          />
        )
      }}
    />
  )
}
