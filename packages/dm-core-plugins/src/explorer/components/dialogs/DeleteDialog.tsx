import { Dialog, TreeNode, useDMSS } from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import React from 'react'
import {
  STANDARD_DIALOG_HEIGHT,
  STANDARD_DIALOG_WIDTH,
} from '../context-menu/NodeRightClickMenu'
import { DeleteAction } from '../context-menu/utils/contextMenuActions'

type TProps = {
  setDialogId: (id: string) => void
  loading: boolean
  setLoading: (isLoading: boolean) => void
  node: TreeNode
}

const DeleteDialog = (props: TProps) => {
  const { setDialogId, loading, setLoading, node } = props
  const dmssAPI = useDMSS()
  return (
    <Dialog
      open={true}
      width={STANDARD_DIALOG_WIDTH}
      height={STANDARD_DIALOG_HEIGHT}
      isDismissable
      onClose={() => setDialogId('')}
    >
      <Dialog.Header>
        <Dialog.Title>Confirm Deletion</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        Are you sure you want to delete the entity <b>{node.name}</b> of type{' '}
        <b>{node.type}</b>?
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          color="danger"
          onClick={async () => {
            await DeleteAction(node, dmssAPI, setLoading)
            await node.remove()
            setDialogId('')
          }}
        >
          {loading ? <Progress.Dots /> : 'Delete'}
        </Button>
        <Button variant="outlined" onClick={() => setDialogId('')}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default DeleteDialog
