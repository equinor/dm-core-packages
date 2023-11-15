import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TBooleanFieldProps } from '../types'

export const BooleanField = (props: TBooleanFieldProps) => {
  const {
    namePath,
    displayLabel,
    defaultValue,
    uiAttribute,
    leftAdornments,
    rightAdornments,
    readOnly,
  } = props

  // We need to convert default values coming from the API since they are always strings
  const usedDefaultValue = defaultValue == 'True' ? true : false

  const Widget = getWidget(uiAttribute?.widget ?? 'CheckboxWidget')
  return (
    <Controller
      name={namePath}
      defaultValue={usedDefaultValue}
      render={({
        field: { ref, value, ...props },
        fieldState: { invalid, error },
      }) => (
        <Widget
          {...props}
          leftAdornments={leftAdornments}
          rightAdornments={rightAdornments}
          readOnly={readOnly}
          id={namePath}
          value={value}
          inputRef={ref}
          label={displayLabel}
          helperText={error?.message}
          variant={invalid ? 'error' : undefined}
        />
      )}
    />
  )
}
