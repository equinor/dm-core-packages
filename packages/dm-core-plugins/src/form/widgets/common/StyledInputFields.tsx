import { Icon, TextField, Tooltip } from '@equinor/eds-core-react'
import { info_circle } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
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
    tooltip?: string
  }
) => {
  let background =
    props.config?.backgroundColor ?? tokens.colors.ui.background__light.hex

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
      rightAdornments={
        <span className='flex space-x-2'>
          <p>{props?.unit}</p>
          {props.tooltip && (
            <Tooltip title={props.tooltip ?? ''}>
              <Icon data={info_circle} size={16} />
            </Tooltip>
          )}
        </span>
      }
    ></StyledInputField>
  )
}

export const StyledTextField = (
  props: React.ComponentProps<typeof StyledEDSField>
) => {
  const { value, ...restProps } = props
  return (
    <StyledEDSField
      {...restProps}
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
      defaultValue={value ?? props.defaultValue}
      type={'number'}
    />
  )
}
