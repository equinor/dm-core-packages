import {
  Dialog,
  ErrorResponse,
  TreeNode,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import { EDialog } from '../../types'
import {
  STANDARD_DIALOG_HEIGHT,
  STANDARD_DIALOG_WIDTH,
} from '../context-menu/NodeRightClickMenu'

type TProps = {
  setDialogId: (id: EDialog | undefined) => void
  loading: boolean
  setLoading: (isLoading: boolean) => void
  node: TreeNode
}

const DeleteDialog = (props: TProps) => {
  const { setDialogId, loading, setLoading, node } = props
  const dmssAPI = useDMSS()

  const handleDelete = async () => {
    setLoading(true)
    await dmssAPI
      .documentRemove({
        address: `${node.dataSource}/${node.pathFromRootPackage()}`,
      })
      .then(() => {
        node.remove()
        toast.success('Deleted')
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error('Failed to delete')
      })
      .finally(() => {
        setLoading(false)
        setDialogId(undefined)
      })
  }

  return (
    <Dialog
      open={true}
      width={STANDARD_DIALOG_WIDTH}
      height={STANDARD_DIALOG_HEIGHT}
      isDismissable
      onClose={() => setDialogId(undefined)}
    >
      <Dialog.Header>
        <Dialog.Title>Confirm Deletion</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        Are you sure you want to delete the entity <b>{node.name}</b> of type{' '}
        <b>{node.type}</b>?
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button color="danger" onClick={handleDelete}>
          {loading ? <Progress.Dots /> : 'Delete'}
        </Button>
        <Button variant="outlined" onClick={() => setDialogId(undefined)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default DeleteDialog
