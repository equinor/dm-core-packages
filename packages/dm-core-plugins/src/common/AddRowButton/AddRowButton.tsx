import { Icon } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
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
  ${(props) =>
    props.disabled &&
    `
      cursor: not-allowed;
      &:hover {
        background-color: ${tokens.colors.ui.background__light.hex}; /* Keep the background color on hover */
      }
    `}
`

interface AddRowButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  ariaLabel: string
  disabled?: boolean
}

export const AddRowButton = ({
  onClick,
  ariaLabel,
  disabled,
}: AddRowButtonProps) => {
  return (
    <StyledButton onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
      <Icon size={16} data={add} />
    </StyledButton>
  )
}
