import {
  Button,
  type ButtonProps,
  EdsProvider,
  Icon,
  Tooltip,
} from '@equinor/eds-core-react'
import { chevron_right } from '@equinor/eds-icons'
import styled from 'styled-components'

const StyledButton = styled(Button)<{ $expanded: boolean }>`
    span, svg {
        transition: transform ease-in-out 0.2s;
        transform: ${(props) => (props.expanded ? 'rotate(90deg)' : 'none')};
    }
`

type CollapseExpandButtonProps = {
  isExpanded: boolean
  setIsExpanded: () => void
  controls?: string
} & ButtonProps

export function CollapseExpandButton(props: CollapseExpandButtonProps) {
  const { isExpanded, setIsExpanded, color = 'primary', ...buttonProps } = props

  const iconRotation = {
    transition: 'transform ease-in-out 0.2s',
    transform: isExpanded ? 'rotate(90deg)' : 'none',
  }

  return (
    <EdsProvider density='compact'>
      <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
        <StyledButton
          aria-expanded={isExpanded}
          aria-controls={props.controls}
          aria-label={isExpanded ? 'Collapse item' : 'Expand item'}
          $expanded={isExpanded}
          variant='ghost_icon'
          color={color}
          onClick={setIsExpanded}
          {...buttonProps}
        >
          <Icon data={chevron_right} style={iconRotation} />
        </StyledButton>
      </Tooltip>
    </EdsProvider>
  )
}
