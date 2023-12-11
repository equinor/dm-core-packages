import { Button, EdsProvider, Tooltip } from '@equinor/eds-core-react'
import React from 'react'

interface FormObjectTextButtonProps {
  onClick: () => void
  buttonText: string
  title: string
  ariaLabel: string
  tooltip: string
}

const FormObjectTextButton = ({
  onClick,
  buttonText,
  title,
  tooltip,
  ariaLabel,
}: FormObjectTextButtonProps) => {
  return (
    <Tooltip title={tooltip}>
      <EdsProvider density='compact'>
        <Button
          variant='ghost'
          title={title}
          aria-label={ariaLabel}
          style={{ paddingInline: '5px' }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </EdsProvider>
    </Tooltip>
  )
}

export default FormObjectTextButton
