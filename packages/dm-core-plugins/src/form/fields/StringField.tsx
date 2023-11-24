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
    leftAdornments,
    rightAdornments,
    attribute,
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
        fieldState: { invalid, error, isDirty },
      }) => {
        return (
          <Widget
            enumType={attribute.enumType || undefined}
            isDirty={value !== null ? isDirty : false}
            readOnly={readOnly}
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
            widgetConfig={uiAttribute?.widgetConfig}
          />
        )
      }}
    />
  )
}
