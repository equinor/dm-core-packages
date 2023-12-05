import React from 'react'

import { TextField } from '@equinor/eds-core-react'

import { TWidget } from '../types'
import styled from 'styled-components'

const NumberFieldWithoutArrows = styled(TextField)`
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
`

const NumberWidget = (props: TWidget) => {
  const { label, onChange, isDirty } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.(Number(event.target.value))

  return (
    <NumberFieldWithoutArrows
      id={props.id}
      readOnly={props.readOnly}
      defaultValue={props.value}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onChange={onChangeHandler}
      type={'number'}
      label={label}
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
