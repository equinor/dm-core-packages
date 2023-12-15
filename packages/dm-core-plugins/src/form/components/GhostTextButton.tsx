import { Button, EdsProvider, Tooltip } from '@equinor/eds-core-react'
import React from 'react'

interface FormObjectTextButtonProps {
  onClick: () => void
  buttonText: string
  title: string
  ariaLabel: string
  tooltip: string
}

const GhostTextButton = ({
  onClick,
  buttonText,
  title,
  tooltip,
  ariaLabel,
}: FormObjectTextButtonProps) => {
  return (
    <EdsProvider density='compact'>
      <Tooltip title={tooltip}>
        <Button
          variant='ghost'
          title={title}
          aria-label={ariaLabel}
          style={{ paddingInline: '5px' }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Tooltip>
    </EdsProvider>
  )
}

export default GhostTextButton
