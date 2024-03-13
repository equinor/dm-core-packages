import { Button, EdsProvider, Icon } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import { MouseEventHandler } from 'react'

interface DeleteSoftButtonProps {
  onClick: MouseEventHandler
  title: string
  ariaLabel?: string
  dataTestId?: string
  disabled?: boolean
  visibilityWhenNotHover?: 'opaque' | 'visible'
}

export const DeleteSoftButton = ({
  onClick,
  title,
  ariaLabel,
  visibilityWhenNotHover,
  dataTestId,
  disabled,
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
        disabled={disabled}
      >
        <Icon size={16} data={close} title={title} />
      </Button>
    </EdsProvider>
  )
}
