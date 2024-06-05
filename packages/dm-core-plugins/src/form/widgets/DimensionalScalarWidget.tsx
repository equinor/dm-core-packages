import { EdsProvider, Tooltip, Typography } from '@equinor/eds-core-react'
import { ChangeEvent, useState } from 'react'
import { Stack } from '../../common'
import { TWidget } from '../types'
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
    <Stack
      direction={widgetConfig?.inline ? 'row' : 'column'}
      style={{ width: widgetWidth }}
    >
      <div
        style={
          widgetConfig?.inline
            ? {
                borderRadius: '2px 0 0 2px',
                display: 'flex',
                alignItems: 'center',
                paddingInline: '4px',
                width: `calc(${widgetWidth} - ${inputBoxWidth})`,
                height: widgetConfig?.compact ? '24px' : '36px',
              }
            : {}
        }
      >
        <Tooltip title={widgetConfig?.description || entity?.description || ''}>
          <Typography
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
      <div
        style={{
          width: inputBoxWidth,
        }}
      >
        <EdsProvider
          density={widgetConfig?.compact ? 'compact' : 'comfortable'}
        >
          <InputField
            unit={widgetConfig?.unit || entity?.unit}
            meta={widgetConfig?.meta || entity?.meta}
            isDirty={props.isDirty}
            helperText={error}
            variant={error ? 'error' : undefined}
            onChange={onChangeHandler}
            value={isPrimitive ? entity : entity?.value ?? ''}
          />
        </EdsProvider>
      </div>
    </Stack>
  )
}

export default DimensionalScalarWidget
