import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TField } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import { getDisplayLabelWithOptional } from '../utils/getDisplayLabel'

export const StringField = (props: TField) => {
  const { namePath, uiAttribute, attribute } = props
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
        field: { ref, value, onChange },
        fieldState: { invalid, error, isDirty },
      }) => {
        return (
          <Widget
            enumType={attribute.enumType || undefined}
            isDirty={value !== null ? isDirty : false}
            onChange={(value: unknown) => onChange(value ?? '')}
            readOnly={config.readOnly}
            value={value ?? ''}
            id={namePath}
            label={
              !uiAttribute?.config?.hideLabel
                ? getDisplayLabelWithOptional(attribute)
                : ''
            }
            inputRef={ref}
            helperText={error?.message || error?.type}
            variant={invalid ? 'error' : undefined}
            config={uiAttribute?.config}
          />
        )
      }}
    />
  )
}
