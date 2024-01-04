import { Controller, useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import { getWidget } from '../context/WidgetContext'
import { TField } from '../types'
import { getDisplayLabel } from '../utils/getDisplayLabel'

export const StringField = (props: TField) => {
  const { namePath, uiAttribute, attribute } = props
  const Widget = getWidget(uiAttribute?.widget ?? 'TextWidget')
  const { config } = useRegistryContext()
  const { control } = useFormContext()
  const readOnly = uiAttribute?.readOnly || config.readOnly
  return (
    <Controller
      name={namePath}
      control={control}
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
            onChange={(value: unknown) => {
              return onChange(value ?? '')
            }}
            readOnly={readOnly}
            value={value ?? ''}
            id={namePath}
            label={
              !uiAttribute?.config?.hideLabel
                ? getDisplayLabel(
                    attribute,
                    uiAttribute?.hideOptionalLabel || uiAttribute?.readOnly,
                    uiAttribute
                  )
                : ''
            }
            inputRef={ref}
            tooltip={uiAttribute?.tooltip}
            helperText={error?.message || error?.type}
            variant={invalid ? 'error' : undefined}
            config={{
              ...uiAttribute?.config,
            }}
          />
        )
      }}
    />
  )
}
