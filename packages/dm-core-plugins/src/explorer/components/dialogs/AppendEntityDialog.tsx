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
}

const AppendEntityDialog = (props: TProps) => {
  const { setDialogId, node } = props
  const [loading, setLoading] = useState<boolean>(false)
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
        {loading ? (
          <Button>
            <Progress.Dots />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setLoading(true)
              node
                .addEntityToPackage(
                  node.attribute.attributeType,
                  `${node.entity.length}`
                )
                .then(() => {
                  node.expand()
                  setDialogId(undefined)
                })
                .catch((error: AxiosError<ErrorResponse>) => {
                  console.error(error)
                  toast.error('Failed to create entity')
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

export default AppendEntityDialog
