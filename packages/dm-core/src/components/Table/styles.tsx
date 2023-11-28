import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

export const AddRowButton = styled.button`
  display: flex;
  justify-content: center;
  background: ${tokens.colors.ui.background__light.hex};
  border: none;
  border-radius: 0 0 0.5rem 0.5rem;
  transition: all ease-in-out 0.2s;
  cursor: pointer;
  &:hover {
    background: ${tokens.colors.ui.background__medium.hex};
  }
`
