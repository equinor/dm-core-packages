import { Dialog, ErrorResponse, TreeNode } from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import { STANDARD_DIALOG_WIDTH } from '../context-menu/ContextMenu'

type TProps = {
  setDialogId: (id: string) => void
  loading: boolean
  setLoading: (isLoading: boolean) => void
  node: TreeNode
}

const AppendEntityDialog = (props: TProps) => {
  const { setDialogId, loading, setLoading, node } = props
  return (
    <Dialog
      open={true}
      isDismissable
      onClose={() => setDialogId('')}
      width={STANDARD_DIALOG_WIDTH}
    >
      <Dialog.Header>
        <Dialog.Title>Append new entity to list</Dialog.Title>
      </Dialog.Header>
      <Dialog.Actions>
        {loading ? (
          <Button>
            <Progress.Dots />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setLoading(true)
              node
                .addEntityToPackage(
                  node.attribute.attributeType,
                  `${node.entity.length}`
                )
                .then(() => {
                  node.expand()
                  setDialogId('')
                })
                .catch((error: AxiosError<ErrorResponse>) => {
                  console.error(error)
                  toast.error('Failed to create entity')
                })
                .finally(() => setLoading(false))
            }}
          >
            Create
          </Button>
        )}
        <Button variant="outlined" onClick={() => setDialogId('')}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default AppendEntityDialog
