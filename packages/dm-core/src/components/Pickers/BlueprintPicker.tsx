import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { EBlueprint } from '../../Enums'
import {
  PATH_INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'

import {
  Button,
  Input,
  Label,
  Progress,
  Tooltip,
} from '@equinor/eds-core-react'
import { Variants } from '@equinor/eds-core-react/dist/types/components/types'
import { FSTreeContext } from '../../context/FileSystemTreeContext'
import { TreeNode } from '../../domain/Tree'
import { truncatePathString } from '../../utils/truncatePathString'
import { Dialog } from '../Dialog'
import { TreeView } from '../TreeView'

export type TBlueprintPickerProps = {
  /** A function to trigger with the onChange event */
  onChange: (type: string) => void
  /** The value of the input field */
  formData?: string | undefined
  /** The variant to use for the input ('error', 'warning', 'success', 'default') */
  variant?: Variants
  /** Whether the input should be disabled */
  disabled?: boolean
  /** A title for the picker */
  label?: string
  /** Render a input element or just a button */
  type?: 'button' | 'input'
}

const defaults: TBlueprintPickerProps = {
  formData: '',
  variant: undefined,
  disabled: false,
  label: 'Blueprint',
  type: 'input',
  onChange: () => null,
}

/**
 * Component which renders a blueprint picker,
 * allowing the user to select a reference to a blueprint
 *
 * @docs Components
 * @scope BlueprintPicker Dialog
 *
 * @usage
 * ```
 * <BlueprintPicker
 *   label={'Select a Blueprint'}
 *   disabled={false}
 *   onChange={(selectedType) => console.log(`Selected blueprint of type '${selectedType}'`)} />
 * ```
 *
 * @param {TBlueprintPickerProps} props {@link TBlueprintPickerProps}
 * @returns A React component
 */
export const BlueprintPicker = (props: TBlueprintPickerProps) => {
  const { onChange, formData, variant, disabled, label, type } = {
    ...defaults,
    ...props,
  }
  const [showModal, setShowModal] = useState<boolean>(false)
  const { treeNodes, loading } = useContext(FSTreeContext)

  return (
    <div>
      {type === 'input' ? (
        <>
          <Label label={label ?? ''} />
          <Tooltip title={truncatePathString(formData)}>
            <Input
              disabled={disabled}
              variant={variant}
              style={{
                width: PATH_INPUT_FIELD_WIDTH,
                cursor: 'pointer',
              }}
              type="string"
              value={truncatePathString(formData)}
              placeholder="Select"
              onClick={() => setShowModal(true)}
            />
          </Tooltip>
        </>
      ) : (
        <Button onClick={() => setShowModal(true)} variant={'outlined'}>
          {label ?? 'Select Blueprint'}
        </Button>
      )}
      <Dialog
        isDismissable
        open={showModal}
        onClose={() => setShowModal(false)}
        width={TREE_DIALOG_WIDTH}
        height={TREE_DIALOG_HEIGHT}
      >
        <Dialog.Header>
          <Dialog.Title>Select a blueprint as type</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Progress.Circular />
            </div>
          ) : (
            <TreeView
              nodes={treeNodes}
              onSelect={(node: TreeNode) => {
                if (node.type !== EBlueprint.BLUEPRINT) {
                  toast.warning('You can only select a blueprint')
                  return
                } // Only allowed to select blueprints
                setShowModal(false)
                onChange(node.getPath())
              }}
            />
          )}
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
