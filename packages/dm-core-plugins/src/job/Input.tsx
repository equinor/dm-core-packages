import styled from 'styled-components'
import { primaryGray } from './Colors'

// This should be used instead of the EDS SingleSelect as that one is broken
export const StyledSelect = styled.select`
  position: relative;
  font-size: medium;
  padding: 8px 16px;
  border: 0;
  border-bottom: 2px solid #dbdbdb;
  cursor: pointer;
  width: fit-content;
  background-color: ${primaryGray};
  min-width: 150px;
`
