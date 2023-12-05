import React, { useState, ChangeEvent } from 'react'
import { TWidget } from '../types'
import { TextField, Tooltip, Typography } from '@equinor/eds-core-react'
import { NumberFieldWithoutArrows } from '../components/NumberFieldWithoutArrows'

const DimensionalScalarWidget = ({
  value: entity,
  readOnly,
  onChange,
  config: widgetConfig,
  isDirty,
}: TWidget) => {
  const [error, setError] = useState('')

  const isPrimitive = typeof entity === 'number' || typeof entity === 'string'
  const isNumber = isPrimitive
    ? typeof entity === 'number'
    : typeof entity?.value === 'number'

  const InputField = isNumber ? NumberFieldWithoutArrows : TextField
  return (
    <div style={widgetConfig?.width ? { maxWidth: widgetConfig?.width } : {}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Tooltip title={widgetConfig?.description || entity?.description}>
          <Typography
            style={{
              fontWeight: 'bold',
              paddingLeft: '8px',
            }}
          >
            {widgetConfig?.label || entity?.label}
          </Typography>
        </Tooltip>
      </div>
      <InputField
        unit={widgetConfig?.unit || entity?.unit}
        type={isNumber ? 'number' : undefined}
        meta={widgetConfig?.meta || entity?.meta}
        helperText={error}
        variant={error ? 'error' : undefined}
        style={
          isDirty && !error
            ? // @ts-ignore
              { '--eds-input-background': '#85babf5e' }
            : {}
        }
        disabled={readOnly}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setError(e.target.value === '' ? 'Value is required' : '')
          let targetValue: string | number = e.target.value
          if (isNumber)
            targetValue = e.target.value === '' ? 0 : parseFloat(e.target.value)

          const changed = isPrimitive
            ? targetValue
            : { ...entity, value: targetValue }

          onChange(changed)
        }}
        defaultValue={isPrimitive ? entity : entity?.value ?? ''}
      />
    </div>
  )
}

export default DimensionalScalarWidget
