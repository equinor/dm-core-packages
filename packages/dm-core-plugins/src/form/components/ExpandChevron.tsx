import React from 'react'
import TooltipButton from '../../common/TooltipButton'
import { chevron_down, chevron_right } from '@equinor/eds-icons'

const ExpandChevron = ({
  isExpanded,
  setIsExpanded,
}: { isExpanded: boolean; setIsExpanded: (expanded: boolean) => void }) => {
  return (
    <TooltipButton
      title={isExpanded ? 'Collapse' : 'Expand'}
      button-variant='ghost_icon'
      compact
      iconSize={24}
      button-onClick={() => setIsExpanded(!isExpanded)}
      icon={isExpanded ? chevron_down : chevron_right}
    />
  )
}

export default ExpandChevron
