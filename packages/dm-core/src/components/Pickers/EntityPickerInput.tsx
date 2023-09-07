import React, { useContext, useState } from 'react'

import { Button, Input, Label } from '@equinor/eds-core-react'
import { toast } from 'react-toastify'
import { FSTreeContext } from '../../context/FileSystemTreeContext'
import { TreeNode } from '../../domain/Tree'
import { TReference } from '../../types'
import {
  INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'
import { Dialog } from '../Dialog'
import { TreeView } from '../TreeView'

export const EntityPickerInput = (props: {
  onChange: (ref: TReference) => void
  formData?: TReference
  typeFilter?: string
  label?: string
}) => {
  const { onChange, formData, typeFilter, label } = props
  const [showModal, setShowModal] = useState<boolean>(false)
  const { treeNodes } = useContext(FSTreeContext)

  return (
    <div>
      <Label label={label || 'Select entity'} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Input
          type="string"
          value={formData?.name || formData?._id || ''}
          placeholder="Select"
          onClick={() => setShowModal(true)}
          style={{ width: INPUT_FIELD_WIDTH, cursor: 'pointer' }}
        />
        <Dialog
          isDismissable
          open={showModal}
          onClose={() => setShowModal(false)}
          width={TREE_DIALOG_WIDTH}
          height={TREE_DIALOG_HEIGHT}
        >
          <Dialog.Header>
            <Dialog.Header>Select an Entity</Dialog.Header>
          </Dialog.Header>
          <Dialog.CustomContent>
            <TreeView
              nodes={treeNodes}
              onSelect={(node: TreeNode) => {
                if (node.type !== typeFilter) {
                  toast.warning('Wrong type')
                  return
                }
                node
                  .fetch()
                  .then((doc: any) => {
                    setShowModal(false)
                    onChange(doc)
                  })
                  .catch((error: any) => {
                    console.error(error)
                    toast.error('Failed to fetch')
                  })
              }}
            />
          </Dialog.CustomContent>
          <Dialog.Actions>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </div>
    </div>
  )
}
