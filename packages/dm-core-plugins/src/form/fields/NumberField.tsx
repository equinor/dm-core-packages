import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TField, TUiAttributeString } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import { getDisplayLabelWithOptional } from '../utils/getDisplayLabel'
const REGEX_FLOAT = /^\d+(\.\d+)?([eE][-+]?\d+)?$/

export const NumberField = (props: TField) => {
  const { namePath, uiAttribute, attribute, backgroundColor } = props

  const Widget = getWidget(uiAttribute?.widget ?? 'NumberWidget')
  const { config } = useRegistryContext()
  const { control } = useFormContext()
  const readOnly = uiAttribute?.readOnly || config.readOnly
  return (
    <Controller
      name={namePath}
      control={control}
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
              onChange(event !== null ? Number(event) : null)
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
            config={{
              ...uiAttribute?.config,
            }}
          />
        )
      }}
    />
  )
}
