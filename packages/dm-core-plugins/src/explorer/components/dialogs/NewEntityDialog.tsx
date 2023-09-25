import {
  BlueprintPicker,
  Dialog,
  ErrorResponse,
  TreeNode,
} from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { EDialog } from '../../types'
import {
  STANDARD_DIALOG_HEIGHT,
  STANDARD_DIALOG_WIDTH,
} from '../context-menu/NodeRightClickMenu'

type TProps = {
  setDialogId: (id: EDialog | undefined) => void
  node: TreeNode
  setNodeOpen: (x: boolean) => void
}

const NewEntityDialog = (props: TProps) => {
  const { setDialogId, node, setNodeOpen } = props
  const [blueprint, setBlueprint] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleCreate = () => {
    setLoading(true)
    node
      .addEntityToPackage(`dmss://${blueprint}`, 'Created_entity')
      .then(() => {
        setNodeOpen(true)
        toast.success(`Entity is created`)
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
      height={STANDARD_DIALOG_HEIGHT}
    >
      <Dialog.Header>
        <Dialog.Title>Create new entity</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <BlueprintPicker
          label="Blueprint"
          onChange={setBlueprint}
          formData={blueprint}
        />
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button disabled={blueprint === ''} onClick={handleCreate}>
          {loading ? <Progress.Dots /> : 'Create'}
        </Button>
        <Button variant="outlined" onClick={() => setDialogId(undefined)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default NewEntityDialog
