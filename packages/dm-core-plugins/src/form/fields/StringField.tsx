import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TStringFieldProps } from '../types'

export const StringField = (props: TStringFieldProps) => {
  const {
    namePath,
    displayLabel,
    defaultValue,
    optional,
    uiAttribute,
    readOnly,
  } = props
  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')

  return (
    <Controller
      name={namePath}
      rules={{
        required: optional ? false : 'Required',
      }}
      defaultValue={defaultValue ?? ''}
      render={({
        field: { ref, value, ...props },
        fieldState: { invalid, error },
      }) => {
        return (
          <Widget
            readOnly={readOnly}
            {...props}
            value={value ?? ''}
            id={namePath}
            label={displayLabel}
            inputRef={ref}
            helperText={error?.message || error?.type}
            variant={invalid ? 'error' : undefined}
            config={{
              format:
                uiAttribute && 'format' in uiAttribute
                  ? uiAttribute.format
                  : 'string',
            }}
          />
        )
      }}
    />
  )
}
