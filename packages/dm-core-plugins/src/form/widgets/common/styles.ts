import { TextField } from '@equinor/eds-core-react'
import styled from 'styled-components'

const props_to_remove = ['isDirty', 'config', 'tooltip', 'enumType']

export const StyledInputField = styled(TextField).withConfig({
  shouldForwardProp: (propName) => !props_to_remove.includes(propName),
})<{ $background: string }>`
  & :disabled {
    background: #f7f7f7;
    color: black;
  }

  div {
    border-radius: 2px;
  }

  input {
    padding: 0 8px;
    background: ${({ $background }) => $background};
  }

  span {
    color: #6f6f6f;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
`
