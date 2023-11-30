import React from 'react'
import { Button } from '@equinor/eds-core-react'
import { Dialog } from '@development-framework/dm-core'

type RemoveJobDialogProps = {
  isOpen: boolean
  remove: () => void
  afterRemove: () => void
}
export const RemoveJobDialog = (props: RemoveJobDialogProps) => {
  const { isOpen, remove, afterRemove } = props
  return (
    <Dialog open={isOpen}>
      <Dialog.Header>
        <Dialog.Title>Confirm Stop</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <p> Are you sure you want to stop the current job? </p>
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          onClick={() => {
            remove()
            afterRemove()
          }}
          color={'danger'}
        >
          Yes
        </Button>
        <Button onClick={() => afterRemove()} variant='outlined'>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
