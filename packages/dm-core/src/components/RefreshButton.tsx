import { Icon, Tooltip } from '@equinor/eds-core-react'
import { refresh } from '@equinor/eds-icons'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

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
  background-size: 16px;

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
  const [wait, setWait] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setWait(false)
    }, 100)
    return () => clearInterval(interval)
  }, [])
  return (
    <Tooltip title={`Refresh ${tooltip}`}>
      <StyledRefreshButton
        style={hidden || wait ? { opacity: 0 } : {}}
        onClick={() => onClick()}
        onMouseLeave={() => onMouseLeave()}
        onMouseEnter={() => onMouseEnter()}
      >
        <Icon data={refresh} size={18} />
      </StyledRefreshButton>
    </Tooltip>
  )
}

export default RefreshButton
