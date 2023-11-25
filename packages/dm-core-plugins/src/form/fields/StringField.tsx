import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TStringFieldProps } from '../types'
import { useRegistryContext } from '../context/RegistryContext'

export const StringField = (props: TStringFieldProps) => {
  const {
    namePath,
    displayLabel,
    uiAttribute,
    leftAdornments,
    rightAdornments,
    attribute,
  } = props
  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')
  const { config } = useRegistryContext()
  return (
    <Controller
      name={namePath}
      rules={{
        required: attribute.optional ? false : 'Required',
      }}
      defaultValue={attribute.default ?? ''}
      render={({
        field: { ref, value, ...props },
        fieldState: { invalid, error, isDirty },
      }) => {
        return (
          <Widget
            enumType={attribute.enumType || undefined}
            isDirty={value !== null ? isDirty : false}
            readOnly={config.readOnly}
            {...props}
            value={value ?? ''}
            id={namePath}
            leftAdornments={leftAdornments}
            rightAdornments={rightAdornments}
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
