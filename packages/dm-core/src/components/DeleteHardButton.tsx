import React, { useState } from 'react'

import { Button, EdsProvider, Icon, Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import { Dialog } from './Dialog'

interface DeleteDialogProps {
  setShowDialog: (show: boolean) => void
  confirmDelete: () => void
}

const DeleteDialog = ({ confirmDelete, setShowDialog }: DeleteDialogProps) => {
  return (
    <Dialog open={true} isDismissable onClose={() => setShowDialog(false)}>
      <Dialog.Header>
        <Dialog.Title>Confirm Deletion</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        Are you sure you want to delete the entity.
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button color='danger' onClick={confirmDelete}>
          {'Delete'}
        </Button>
        <Button variant='outlined' onClick={() => setShowDialog(false)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

interface DeleteHardButtonProps {
  onConfirmDelete: () => void
  title?: string
}

export const DeleteHardButton = ({
  onConfirmDelete,
  title,
}: DeleteHardButtonProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false)

  return (
    <div>
      <Tooltip title={title || 'Delete'}>
        <div>
          <EdsProvider density={'compact'}>
            <Button
              variant='ghost_icon'
              title={'Delete'}
              size={16}
              onClick={() => setShowDialog(true)}
            >
              <Icon data={close} />
            </Button>
          </EdsProvider>
          {showDialog && (
            <DeleteDialog
              setShowDialog={setShowDialog}
              confirmDelete={() => onConfirmDelete()}
            />
          )}
        </div>
      </Tooltip>
    </div>
  )
}
