import { Button, EdsProvider, Icon } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import * as React from 'react'
import { MouseEventHandler } from 'react'

interface DeleteSoftButtonProps {
  onClick: MouseEventHandler
  title: string
  ariaLabel?: string
  dataTestId?: string
  visibilityWhenNotHover?: 'opaque' | 'visible'
}

export const DeleteSoftButton = ({
  onClick,
  title,
  ariaLabel,
  visibilityWhenNotHover,
  dataTestId,
}: DeleteSoftButtonProps) => {
  const opacity =
    visibilityWhenNotHover === 'opaque' ? 'opacity-50 hover:opacity-100' : ''
  return (
    <EdsProvider density={'compact'}>
      <Button
        variant='ghost_icon'
        onClick={onClick}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        className={opacity}
      >
        <Icon size={16} data={close} title={title} />
      </Button>
    </EdsProvider>
  )
}
