import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TNumberFieldProps } from '../types'
const REGEX_FLOAT = /^\d+(\.\d+)?([eE][-+]?\d+)?$/

export const NumberField = (props: TNumberFieldProps) => {
  const {
    namePath,
    displayLabel,
    defaultValue,
    optional,
    uiAttribute,
    readOnly,
    leftAdornments,
    rightAdornments,
  } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')
  return (
    <Controller
      name={namePath}
      rules={{
        required: optional ? false : 'Required',
        pattern: {
          value: REGEX_FLOAT,
          message: 'Only numbers allowed',
        },
      }}
      defaultValue={defaultValue || null}
      render={({
        field: { ref, onChange, ...props },
        fieldState: { invalid },
      }) => {
        return (
          <Widget
            {...props}
            config={{ format: 'number' }}
            leftAdornments={leftAdornments}
            rightAdornments={rightAdornments}
            readOnly={readOnly}
            style={{ textAlignLast: 'right' }}
            onChange={(event: unknown) => onChange(Number(event))}
            value={props.value ?? ''}
            id={namePath}
            label={displayLabel}
            inputRef={ref}
            variant={invalid ? 'error' : undefined}
          />
        )
      }}
    />
  )
}
