import React, { useState, ChangeEvent } from 'react'
import { TWidget } from '../types'
import { TextField, Tooltip, Typography } from '@equinor/eds-core-react'

const DimensionalScalarWidget = ({
  value: entity,
  readOnly,
  onChange,
  config: widgetConfig,
  isDirty,
}: TWidget) => {
  const [error, setError] = useState('')

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
      <TextField
        unit={widgetConfig?.unit || entity?.unit}
        id={entity?.id}
        type="number"
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
          if (e.target.value === '') setError('Value is required')
          else setError('')
          onChange({ ...entity, value: parseFloat(e.target.value) })
        }}
        defaultValue={entity?.value ?? ''}
      />
    </div>
  )
}

export default DimensionalScalarWidget
