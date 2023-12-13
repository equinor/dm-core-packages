import React from 'react'
import { NumberFieldWithoutArrows } from '../components/NumberFieldWithoutArrows'
import { TWidget } from '../types'
import ReadOnlyField from '../components/ReadOnlyField'

const NumberWidget = (props: TWidget) => {
  const { label, onChange, isDirty, value } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.(Number(event.target.value))

  if (props.readOnly) return <ReadOnlyField label={label} value={value} />

  return (
    <NumberFieldWithoutArrows
      id={props.id}
      label={label}
      defaultValue={value}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={'Helpertext'}
      onChange={onChangeHandler}
      type={'number'}
      data-testid={`form-number-widget-${label}`}
      style={
        isDirty && props.variant !== 'error'
          ? {
              // @ts-ignore
              '--eds-input-background': '#85babf5e',
            }
          : {}
      }
    />
  )
}

export default NumberWidget
