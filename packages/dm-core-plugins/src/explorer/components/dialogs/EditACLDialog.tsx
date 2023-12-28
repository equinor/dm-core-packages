import {
  AccessControlListComponent,
  Dialog,
  TreeNode,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import React from 'react'
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

const EditACLDialog = (props: TProps) => {
  const { setDialogId, node } = props

  return (
    <Dialog
      open={true}
      isDismissable
      onClose={() => setDialogId(undefined)}
      width={STANDARD_DIALOG_WIDTH}
    >
      <Dialog.Header>
        <Dialog.Title>Change permissions</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <AccessControlListComponent
          documentId={node.nodeId}
          close={() => setDialogId(undefined)}
        />
      </Dialog.CustomContent>
    </Dialog>
  )
}

export default EditACLDialog
