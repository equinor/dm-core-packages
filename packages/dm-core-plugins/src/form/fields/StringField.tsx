import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TStringFieldProps } from '../types'

const formatDate = (date: string) => {
  return new Date(date).toLocaleString(navigator.language)
}

export const StringField = (props: TStringFieldProps) => {
  const { namePath, displayLabel, defaultValue, optional, uiAttribute } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')

  return (
    <Controller
      name={namePath}
      rules={{
        required: !optional,
      }}
      defaultValue={defaultValue ?? ''}
      render={({
        field: { ref, value, ...props },
        fieldState: { invalid, error },
      }) => {
        // Support date-time format, and make it default to readonly
        let readOnly = false
        if (
          uiAttribute &&
          'format' in uiAttribute &&
          uiAttribute.format === 'date-time'
        ) {
          value = formatDate(value)
          readOnly = true
        }
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
          />
        )
      }}
    />
  )
}
