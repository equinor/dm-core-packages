import React, { useState } from 'react'

import { Button, EdsProvider, Icon, Tooltip } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import { Dialog } from './Dialog'

interface DeleteDialogProps {
  setShowDialog: (show: boolean) => void
  confirmDelete: () => void
  popupTitle?: string
  popupMessage?: string
}

const DeleteDialog = ({
  confirmDelete,
  setShowDialog,
  popupMessage,
  popupTitle,
}: DeleteDialogProps) => {
  return (
    <Dialog open={true} isDismissable onClose={() => setShowDialog(false)}>
      <Dialog.Header>
        <Dialog.Title>{popupTitle || 'Confirm Deletion'}</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        {popupMessage || 'Are you sure you want to delete the entity.'}
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          color='danger'
          onClick={confirmDelete}
          aria-label={'Confirm Delete'}
        >
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
  popupTitle?: string
  popupMessage?: string
}

export const DeleteHardButton = ({
  onConfirmDelete,
  title,
  popupMessage,
  popupTitle,
}: DeleteHardButtonProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false)

  return (
    <div>
      <Tooltip title={title || 'Delete'}>
        <div>
          <EdsProvider density={'compact'}>
            <Button
              variant='ghost_icon'
              title={'Delete permanently'}
              onClick={() => setShowDialog(true)}
            >
              <Icon size={16} data={close} />
            </Button>
          </EdsProvider>
          {showDialog && (
            <DeleteDialog
              setShowDialog={setShowDialog}
              confirmDelete={() => {
                setShowDialog(false)
                onConfirmDelete()
              }}
              popupMessage={popupMessage}
              popupTitle={popupTitle}
            />
          )}
        </div>
      </Tooltip>
    </div>
  )
}
