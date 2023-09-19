import {
  BlueprintPicker,
  Dialog,
  ErrorResponse,
  TreeNode,
} from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import {
  STANDARD_DIALOG_HEIGHT,
  STANDARD_DIALOG_WIDTH,
} from '../context-menu/ContextMenu'

type TProps = {
  setDialogId: (id: string) => void
  formData: any
  setFormData: (id: any) => void
  loading: boolean
  setLoading: (isLoading: boolean) => void
  node: TreeNode
}

const NewEntityDialog = (props: TProps) => {
  const { setDialogId, formData, setFormData, loading, setLoading, node } =
    props
  return (
    <Dialog
      open={true}
      isDismissable
      onClose={() => setDialogId('')}
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
                  setDialogId('')
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
        <Button variant="outlined" onClick={() => setDialogId('')}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default NewEntityDialog
