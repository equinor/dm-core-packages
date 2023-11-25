import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TBooleanFieldProps } from '../types'
import { useRegistryContext } from '../context/RegistryContext'

export const BooleanField = (props: TBooleanFieldProps) => {
  const {
    namePath,
    displayLabel,
    uiAttribute,
    leftAdornments,
    rightAdornments,
    attribute,
  } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'CheckboxWidget')
  const { config } = useRegistryContext()
  return (
    <Controller
      name={namePath}
      defaultValue={attribute.default == 'True'} // we need to convert default values coming from the API since they are always strings
      render={({
        field: { ref, value, ...props },
        fieldState: { invalid, error },
      }) => (
        <Widget
          {...props}
          leftAdornments={leftAdornments}
          rightAdornments={rightAdornments}
          readOnly={config.readOnly}
          id={namePath}
          value={value}
          inputRef={ref}
          label={displayLabel}
          helperText={error?.message}
          variant={invalid ? 'error' : undefined}
          config={uiAttribute?.config}
        />
      )}
    />
  )
}
