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
}

const NewEntityDialog = (props: TProps) => {
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
        <Dialog.Title>Create new entity</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <BlueprintPicker
          label={'Blueprint'}
          onChange={(selectedType: string) =>
            setFormData({ type: selectedType })
          }
          formData={formData?.type || ''}
        />
      </Dialog.CustomContent>
      <Dialog.Actions>
        {loading ? (
          <Button>
            <Progress.Dots />
          </Button>
        ) : (
          <Button
            disabled={formData?.type === undefined}
            onClick={() => {
              setLoading(true)
              node
                .addEntityToPackage(
                  `dmss://${formData?.type}`,
                  formData?.name || 'Created_entity'
                )
                .then(() => {
                  setDialogId(undefined)
                  toast.success(`New entity created`)
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

export default NewEntityDialog
