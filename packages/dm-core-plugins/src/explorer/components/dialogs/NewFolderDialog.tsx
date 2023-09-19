import {
  Dialog,
  ErrorResponse,
  INPUT_FIELD_WIDTH,
  TreeNode,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Input, Label } from '@equinor/eds-core-react'
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
}

const NewFolderDialog = (props: TProps) => {
  const { setDialogId, node } = props
  const [formData, setFormData] = useState<any>('')
  const dmssAPI = useDMSS()

  const handleCreate = (folderName: string) => {
    const newFolder = {
      name: folderName,
      type: 'dmss://system/SIMOS/Package',
      isRoot: false,
      content: [],
    }
    const address = `${node.nodeId}.content`
    dmssAPI
      .documentAdd({
        address: address,
        document: JSON.stringify(newFolder),
        updateUncontained: true,
      })
      .then(() => node.expand())
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
  }

  return (
    <Dialog
      isDismissable
      open={true}
      width={STANDARD_DIALOG_WIDTH}
      height={STANDARD_DIALOG_HEIGHT}
      onClose={() => {
        setFormData(undefined)
        setDialogId(undefined)
      }}
    >
      <Dialog.Header>
        <Dialog.Title>Create new folder</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <Label label={'Folder name'} />
        <Input
          type={'string'}
          style={{ width: INPUT_FIELD_WIDTH }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(event.target.value)
          }
        />
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          disabled={formData === undefined || formData === ''}
          onClick={() => {
            if (formData) {
              handleCreate(formData)
              setDialogId(undefined)
              setFormData('')
            } else {
              toast.error('Form data cannot be empty!')
            }
          }}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setFormData(undefined)
            setDialogId(undefined)
          }}
        >
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default NewFolderDialog
