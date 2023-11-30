import { Icon, Tooltip } from '@equinor/eds-core-react'
import React from 'react'
import styled from 'styled-components'
import { refresh } from '@equinor/eds-icons'

const StyledRefreshButton = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 1;
  display: flex;
  border: hidden;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-radius: 100%;
  height: 24px;
  width: 24px;
  padding: 0;
  color: rgba(0, 112, 121, 1); // eds green color
  transition: opacity 0.2s;
  background-size: 16px;
  opacity: 0.3;

  &:hover {
    background: rgba(222, 237, 238, 1); // eds ghost-icon hover background color
    opacity: 1;
  }
`

interface Props {
	onClick: () => void
	onMouseEnter: () => void
	onMouseLeave: () => void
	hidden: boolean
	tooltip: string | undefined
}

const RefreshButton = ({
	onClick,
	tooltip,
	onMouseEnter,
	onMouseLeave,
	hidden,
}: Props) => {
	return (
		<Tooltip title={`Refresh ${tooltip}`}>
			<StyledRefreshButton
				style={hidden ? { opacity: 0 } : {}}
				onClick={() => onClick()}
				onMouseLeave={() => onMouseLeave()}
				onMouseEnter={() => onMouseEnter()}
			>
				<Icon data={refresh} size={16} title='refresh' />
			</StyledRefreshButton>
		</Tooltip>
	)
}

export default RefreshButton
