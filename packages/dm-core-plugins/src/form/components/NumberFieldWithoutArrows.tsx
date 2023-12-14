import styled from 'styled-components'
import { StyledEdsTextWidget } from './StyledEdsTextWidget'

export const NumberFieldWithoutArrows = styled(StyledEdsTextWidget)`
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
