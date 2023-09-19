import {
  Dialog,
  EBlueprint,
  ErrorResponse,
  INPUT_FIELD_WIDTH,
  TreeNode,
} from '@development-framework/dm-core'
import { Button, Input, Label, Progress } from '@equinor/eds-core-react'
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

const NewBlueprintDialog = (props: TProps) => {
  const { setDialogId, node } = props
  const [formData, setFormData] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <Dialog
      open={true}
      isDismissable
      onClose={() => setDialogId(undefined)}
      width={STANDARD_DIALOG_WIDTH}
      height={STANDARD_DIALOG_HEIGHT}
    >
      <Dialog.Header>
        <Dialog.Title>Create new blueprint</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <Label label={'Name'} />
        <Input
          style={{ width: INPUT_FIELD_WIDTH }}
          type="string"
          value={formData?.name || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: event.target.value })
          }
          placeholder="Name for new blueprint"
        />
      </Dialog.CustomContent>
      <Dialog.Actions>
        {loading ? (
          <Button>
            <Progress.Dots />
          </Button>
        ) : (
          <Button
            disabled={formData?.name === undefined}
            onClick={() => {
              setLoading(true)
              node
                .addEntityToPackage(EBlueprint.BLUEPRINT, formData?.name)
                .then(() => {
                  setDialogId(undefined)
                })
                .catch((error: AxiosError<ErrorResponse>) => {
                  console.error(error)
                  toast.error(error.response?.data.message)
                })
                .finally(() => setLoading(false))
            }}
          >
            Create
          </Button>
        )}
        <Button variant="outlined" onClick={() => setDialogId(undefined)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default NewBlueprintDialog
