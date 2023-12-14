import styled from 'styled-components'
import { TextField, Typography } from '@equinor/eds-core-react'
import React from 'react'

const StyledInputField = styled(TextField)`
  & :disabled {
    background: #f7f7f7;
    color: black;
    border-radius: 8px;
  }
  div {
    border-radius: 4px 4px 0 0;
  }
  span {
    color: #6f6f6f;
  }
`

const StyledEDSField = (
  props: React.ComponentProps<typeof StyledInputField> & {
    isDirty?: boolean
  }
) => {
  return (
    <StyledInputField
      {...props}
      disabled={props.readOnly}
      readOnly={false}
      style={
        props.isDirty && props.variant !== 'error'
          ? {
              // @ts-ignore
              '--eds-input-background': '#85babf5e',
            }
          : {}
      }
    ></StyledInputField>
  )
}

export const StyledTextField = (
  props: React.ComponentProps<typeof StyledEDSField>
) => {
  return (
    <StyledEDSField
      {...props}
      data-testid={`form-text-widget-${props.label}`}
    />
  )
}

const NumberFieldWithoutArrows = styled(StyledEDSField)`
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

export const StyledNumberField = (
  props: React.ComponentProps<typeof StyledEDSField>
) => {
  return (
    <NumberFieldWithoutArrows
      {...props}
      onWheel={(event: React.UIEvent<HTMLInputElement>) =>
        (event.target as HTMLInputElement).blur()
      }
      type={'number'}
      data-testid={`form-number-widget-${props.label}`}
    />
  )
}
