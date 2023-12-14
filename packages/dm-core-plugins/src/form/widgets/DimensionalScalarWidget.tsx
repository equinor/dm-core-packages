import React, { useState, ChangeEvent } from 'react'
import { TWidget } from '../types'
import {
  EdsProvider,
  TextField,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
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
    <div
      className={`border border-equinor-green ${
        widgetConfig?.inline ? 'flex justify-between' : ''
      }
    ${widgetConfig?.width ? `w-[${widgetConfig?.width}]` : ''}
    `}
    >
      <Tooltip title={widgetConfig?.description || entity?.description}>
        <Typography
          style={{
            fontWeight: 'bold',
            paddingLeft: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {widgetConfig?.label || entity?.label}
        </Typography>
      </Tooltip>
      <div
        className={
          widgetConfig?.inputBoxWidth
            ? `w-[${widgetConfig?.inputBoxWidth}}]`
            : ''
        }
      >
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
              targetValue =
                e.target.value === '' ? 0 : parseFloat(e.target.value)

            const changed = isPrimitive
              ? targetValue
              : { ...entity, value: targetValue }

            onChange(changed)
          }}
          defaultValue={isPrimitive ? entity : entity?.value ?? ''}
        />
      </div>
    </div>
  )
}

export default DimensionalScalarWidget
