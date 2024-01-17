import { colors } from '@development-framework/dm-core'
import { TextField } from '@equinor/eds-core-react'
import React from 'react'
import styled from 'styled-components'

const StyledInputField = styled(TextField)`
  & :disabled {
    background: #f7f7f7;
    color: black;
  }

  div {
    border-radius: 2px;
  }

  input {
    padding: 0 8px
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
  let background = props.config?.backgroundColor ?? colors.equinorLightGray

  background =
    props.isDirty && props.variant !== 'error' ? '#85babf5e' : background

  return (
    <StyledInputField
      {...props}
      disabled={props.readOnly}
      readOnly={false}
      style={{
        // @ts-ignore
        '--eds-input-background': background,
      }}
    ></StyledInputField>
  )
}

export const StyledTextField = (
  props: React.ComponentProps<typeof StyledEDSField>
) => {
  const { value, ...propsWithoutValue } = props

  return (
    <StyledEDSField
      {...propsWithoutValue}
      defaultValue={
        props.readOnly && props.value === ''
          ? '-'
          : props.defaultValue ?? props.value
      }
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
  const { value, ...propsWithoutValue } = props

  return (
    <NumberFieldWithoutArrows
      {...propsWithoutValue}
      onWheel={(event: React.UIEvent<HTMLInputElement>) =>
        (event.target as HTMLInputElement).blur()
      }
      defaultValue={props.defaultValue ?? props.value}
      type={'number'}
    />
  )
}
