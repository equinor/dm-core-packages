import { Button, Icon } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import * as React from 'react'
import { MouseEventHandler } from 'react'

interface DeleteSoftButtonProps {
  onClick: MouseEventHandler
  title: string
}

export const DeleteSoftButton = ({ onClick, title }: DeleteSoftButtonProps) => {
  return (
    <Button variant='ghost_icon' onClick={onClick}>
      <Icon size={18} data={close} title={title} />
    </Button>
  )
}
