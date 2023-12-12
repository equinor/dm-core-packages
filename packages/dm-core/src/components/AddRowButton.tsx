import { Icon } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  background: ${tokens.colors.ui.background__light.hex};
  border: none;
  width: 100%;
  border-radius: 0 0 0.5rem 0.5rem;
  transition: all ease-in-out 0.2s;
  cursor: pointer;
  &:hover {
    background: ${tokens.colors.ui.background__medium.hex};
  }
`

interface AddRowButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  ariaLabel: string
}

export const AddRowButton = ({ onClick, ariaLabel }: AddRowButtonProps) => {
  return (
    <StyledButton onClick={onClick} aria-label={ariaLabel}>
      <Icon size={16} data={add} />
    </StyledButton>
  )
}
