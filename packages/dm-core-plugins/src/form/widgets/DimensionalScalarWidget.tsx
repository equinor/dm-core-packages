import React, { useState, ChangeEvent } from 'react'
import { TWidget } from '../types'
import {
  EdsProvider,
  TextField,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { StyledNumberField, StyledTextField } from './common/StyledInputFields'

const parseWidthString = (widthString: string) => {
  const width = parseFloat(widthString)
  if (!width || width < 0) return
  return widthString
}

const DimensionalScalarWidget = (props: TWidget) => {
  const { value: entity, config: widgetConfig } = props
  const [error, setError] = useState('')

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setError(e.target.value === '' ? 'Value is required' : '')
    let targetValue: string | number = e.target.value
    if (isNumber)
      targetValue = e.target.value === '' ? 0 : parseFloat(e.target.value)

    const changed = isPrimitive
      ? targetValue
      : { ...entity, value: targetValue }

    props.onChange(changed)
  }

  const isPrimitive = typeof entity === 'number' || typeof entity === 'string'
  const isNumber = isPrimitive
    ? typeof entity === 'number'
    : typeof entity?.value === 'number'

  const InputField = isNumber ? StyledNumberField : StyledTextField

  const widgetWidth = parseWidthString(widgetConfig?.width) ?? '100%'
  const inputBoxWidth =
    parseWidthString(widgetConfig?.inputBoxWidth) ??
    (widgetConfig?.inline ? '50%' : '100%')

  return (
    <div
      className={`overflow-hidden ${
        widgetConfig?.inline ? 'flex justify-between' : ''
      }
    `}
      style={{ width: widgetWidth }}
    >
      <div
        style={
          widgetConfig?.inline
            ? {
                border: 'solid #6c6c6c 1px',
                borderRadius: '2px 0 0 2px',
                display: 'flex',
                alignItems: 'center',
                background: '#dedede',
                paddingInline: '4px',
                width: `calc(${widgetWidth} - ${inputBoxWidth})`,
                height: widgetConfig?.compact ? '24px' : '36px',
              }
            : {}
        }
      >
        <Tooltip title={widgetConfig?.description || entity?.description}>
          <Typography
            bold={true}
            style={{
              overflow: 'hidden',
              paddingLeft: '4px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {widgetConfig?.label || entity?.label || props.label}
          </Typography>
        </Tooltip>
      </div>
      <EdsProvider density={widgetConfig?.compact ? 'compact' : 'comfortable'}>
        <InputField
          unit={widgetConfig?.unit || entity?.unit}
          meta={widgetConfig?.meta || entity?.meta}
          isDirty={props.isDirty}
          helperText={error}
          variant={error ? 'error' : undefined}
          onChange={onChangeHandler}
          defaultValue={isPrimitive ? entity : entity?.value ?? ''}
        />
      </EdsProvider>
    </div>
  )
}

export default DimensionalScalarWidget
