import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TNumberFieldProps } from '../types'
const REGEX_FLOAT = /^\d+(\.\d+)?([eE][-+]?\d+)?$/

export const NumberField = (props: TNumberFieldProps) => {
  const {
    namePath,
    displayLabel,
    uiAttribute,
    readOnly,
    leftAdornments,
    rightAdornments,
    attribute,
  } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')
  return (
    <Controller
      name={namePath}
      rules={{
        required: attribute.optional ? false : 'Required',
        pattern: {
          value: REGEX_FLOAT,
          message: 'Only numbers allowed',
        },
      }}
      defaultValue={attribute.default || null}
      render={({
        field: { ref, onChange, ...props },
        fieldState: { invalid, error, isDirty },
      }) => {
        return (
          <Widget
            {...props}
            config={{ format: 'number' }}
            leftAdornments={leftAdornments}
            rightAdornments={rightAdornments}
            readOnly={readOnly}
            style={{ textAlignLast: 'right' }}
            onChange={(event: unknown) =>
              onChange(event ? Number(event) : null)
            }
            value={props.value ?? ''}
            id={namePath}
            label={displayLabel}
            inputRef={ref}
            helperText={error?.message || error?.type}
            variant={invalid ? 'error' : undefined}
            isDirty={props.value !== null ? isDirty : false}
          />
        )
      }}
    />
  )
}
