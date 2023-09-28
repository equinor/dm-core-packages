import { Dialog, ErrorResponse, TreeNode } from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { EDialog } from '../../types'
import { STANDARD_DIALOG_WIDTH } from '../context-menu/NodeRightClickMenu'

type TProps = {
  setDialogId: (id: EDialog | undefined) => void
  node: TreeNode
  setNodeOpen: (x: boolean) => void
}

const AppendEntityDialog = (props: TProps) => {
  const { setDialogId, node, setNodeOpen } = props
  const [loading, setLoading] = useState<boolean>(false)

  const handleAppend = () => {
    setLoading(true)
    node
      .addEntityToPackage(node.type, `${node.entity.length}`)
      .then(() => {
        setNodeOpen(true)
        toast.success('The new entity has been appended to the list')
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
      .finally(() => {
        setLoading(false)
        setDialogId(undefined)
      })
  }

  return (
    <Dialog
      open={true}
      isDismissable
      onClose={() => setDialogId(undefined)}
      width={STANDARD_DIALOG_WIDTH}
    >
      <Dialog.Header>
        <Dialog.Title>Append new entity to list</Dialog.Title>
      </Dialog.Header>
      <Dialog.Actions>
        <Button onClick={handleAppend}>
          {loading ? <Progress.Dots /> : 'Create'}
        </Button>
        <Button variant="outlined" onClick={() => setDialogId(undefined)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default AppendEntityDialog
