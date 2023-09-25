import {
  Dialog,
  ErrorResponse,
  INPUT_FIELD_WIDTH,
  TreeNode,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Progress, TextField } from '@equinor/eds-core-react'
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
  isRoot: boolean
}

const NewFolderDialog = (props: TProps) => {
  const { setDialogId, node, setNodeOpen, isRoot } = props
  const [folderName, setFolderName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  const handleCreate = () => {
    const newFolder = {
      name: folderName,
      type: 'dmss://system/SIMOS/Package',
      isRoot: isRoot,
      content: [],
    }
    const address = isRoot ? node.dataSource : `${node.nodeId}.content`
    setLoading(true)
    dmssAPI
      .documentAdd({
        address: address,
        document: JSON.stringify(newFolder),
        updateUncontained: true,
      })
      .then(() => {
        setNodeOpen(true)
        toast.success('Folder is created')
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
      isDismissable
      open={true}
      width={STANDARD_DIALOG_WIDTH}
      height={STANDARD_DIALOG_HEIGHT}
      onClose={() => setDialogId(undefined)}
    >
      <Dialog.Header>
        <Dialog.Title>
          Create new {isRoot ? 'root package' : 'folder'}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <TextField
          id="folderName"
          label="Name"
          value={folderName}
          style={{ width: INPUT_FIELD_WIDTH }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFolderName(event.target.value)
          }
        />
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button disabled={folderName === ''} onClick={handleCreate}>
          {loading ? <Progress.Dots /> : 'Create'}
        </Button>
        <Button variant="outlined" onClick={() => setDialogId(undefined)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default NewFolderDialog
