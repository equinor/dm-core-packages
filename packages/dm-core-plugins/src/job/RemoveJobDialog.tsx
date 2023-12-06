import React from 'react'
import { Button } from '@equinor/eds-core-react'
import { Dialog } from '@development-framework/dm-core'

type RemoveJobDialogProps = {
  isOpen: boolean
  onConfirm: () => void
  close: () => void
  title?: string
}
export const RemoveJobDialog = (props: RemoveJobDialogProps) => {
  const { isOpen, onConfirm, close, title } = props
  return (
    <Dialog open={isOpen}>
      <Dialog.Header>
        <Dialog.Title>
          {title ?? 'Are you sure you want to stop the job?'}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Actions style={{ justifyContent: 'space-around' }}>
        <Button
          onClick={() => {
            onConfirm()
            close()
          }}
          color={'danger'}
        >
          Ok
        </Button>
        <Button onClick={close}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  )
}
