import styled from 'styled-components'

export const Legend = styled.legend`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  height: 40px;
`

export const Fieldset = styled.fieldset`
  padding: 0;
  border: 0;
  & > *:not(legend) {
    padding-left: 1rem;
    border-left: 1px solid black;
  }
`
