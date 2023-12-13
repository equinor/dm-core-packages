import React from 'react'
import { Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TField, TUiAttributeString } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import { getDisplayLabelWithOptional } from '../utils/getDisplayLabel'
const REGEX_FLOAT = /^\d+(\.\d+)?([eE][-+]?\d+)?$/

export const NumberField = (props: TField) => {
  const { namePath, uiAttribute, attribute } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'NumberWidget')
  const { config } = useRegistryContext()
  const readOnly = uiAttribute?.readOnly || config.readOnly
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
      defaultValue={attribute.default || 0}
      render={({
        field: { ref, value, onChange, ...props },
        fieldState: { invalid, error, isDirty },
      }) => {
        return (
          <Widget
            {...props}
            readOnly={readOnly}
            onChange={(event: unknown) => {
              onChange(event ? Number(event) : undefined)
            }}
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
            isDirty={value !== null ? isDirty : false}
            config={uiAttribute?.config}
          />
        )
      }}
    />
  )
}
