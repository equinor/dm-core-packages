import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TBooleanFieldProps } from '../types'

export const BooleanField = (props: TBooleanFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue, uiAttribute } = props

  // We need to convert default values coming from the API since they are always strings
  const usedDefaultValue =
    (defaultValue !== undefined && defaultValue == 'True') || false

  const defaultWidget = uiAttribute ? uiAttribute.widget : 'CheckboxWidget'
  const Widget = getWidget(defaultWidget)

  return (
    <Controller
      name={namePath}
      control={control}
      defaultValue={usedDefaultValue}
      render={({
        field: { ref, value, ...props },
        fieldState: { invalid, error },
      }) => (
        <Widget
          {...props}
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
