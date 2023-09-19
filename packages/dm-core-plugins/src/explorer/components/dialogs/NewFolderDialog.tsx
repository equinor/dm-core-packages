import {
  Dialog,
  INPUT_FIELD_WIDTH,
  TreeNode,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Input, Label } from '@equinor/eds-core-react'
import React from 'react'
import { toast } from 'react-toastify'
import { EDialog } from '../../types'
import {
  STANDARD_DIALOG_HEIGHT,
  STANDARD_DIALOG_WIDTH,
} from '../context-menu/NodeRightClickMenu'
import { NewFolderAction } from '../context-menu/utils/contextMenuActions'

type TProps = {
  setDialogId: (id: EDialog | undefined) => void
  formData: any
  setFormData: (id: any) => void
  node: TreeNode
}

const NewFolderDialog = (props: TProps) => {
  const { setDialogId, formData, setFormData, node } = props
  const dmssAPI = useDMSS()
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
              NewFolderAction(node, formData, dmssAPI)
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
