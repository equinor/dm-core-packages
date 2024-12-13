import { Button, EdsProvider, Icon } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import type { MouseEventHandler } from 'react'

interface DeleteSoftButtonProps {
  onClick: MouseEventHandler
  title: string
  ariaLabel?: string
  dataTestId?: string
  disabled?: boolean
  visibility?: 'opaque' | 'normal'
}

export const DeleteSoftButton = ({
  onClick,
  title,
  ariaLabel,
  visibility = 'normal',
  dataTestId,
  disabled,
}: DeleteSoftButtonProps) => {
  return (
    <EdsProvider density={'compact'}>
      <Button
        variant='ghost_icon'
        onClick={onClick}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        disabled={disabled}
        title={title}
      >
        <Icon
          size={16}
          data={close}
          color={visibility === 'opaque' ? 'rgba(150, 150, 150, 1)' : 'primary'}
        />
      </Button>
    </EdsProvider>
  )
}
