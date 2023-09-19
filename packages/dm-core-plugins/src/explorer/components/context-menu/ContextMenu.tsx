import {
  BlueprintPicker,
  Dialog,
  DmssAPI,
  EBlueprint,
  ErrorResponse,
  INPUT_FIELD_WIDTH,
  TNodeWrapperProps,
  TreeNode,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Input, Label, Menu, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import {
  DeleteAction,
  NewFolderAction,
  NewRootPackageAction,
} from './utils/contextMenuActions'
import { createContextMenuItems } from './utils/createContextMenuItmes'

//Component that can be used when a context menu action requires one text (string) input.

export const NodeRightClickMenu = (props: TNodeWrapperProps) => {
  const { node, children } = props
  const dmssAPI = useDMSS()
  const [scrimToShow, setScrimToShow] = useState<string>('')
  const [formData, setFormData] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const STANDARD_DIALOG_WIDTH = '100%'
  const STANDARD_DIALOG_HEIGHT = '300px'

  const menuItems = createContextMenuItems(node, setScrimToShow)

  const handleFormDataSubmit = (
    node: TreeNode,
    formData: string,
    action: (
      node: TreeNode,
      formData: string,
      dmssAPI: DmssAPI,
      setLoading: (isLoading: boolean) => void
    ) => void
  ) => {
    if (formData) {
      action(node, formData, dmssAPI, setLoading)
      setScrimToShow('')
      setFormData('')
    } else {
      toast.error('Form data cannot be empty!')
    }
  }

  //TODO when the tree changes by adding new package or deleting something, the tree should be updated to give consistent UI to user
  return (
    <div>
      <div
        style={{ width: 'fit-content' }}
        ref={setAnchorEl}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowMenu(!showMenu)
        }}
      >
        {children}
      </div>
      <Menu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        anchorEl={anchorEl}
        placement="bottom-start"
        matchAnchorWidth={true}
      >
        {menuItems}
      </Menu>
      <Dialog
        isDismissable
        open={scrimToShow === 'new-folder'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        onClose={() => {
          setFormData(undefined)
          setScrimToShow('')
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
              handleFormDataSubmit(node, formData, NewFolderAction)
            }}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setFormData(undefined)
              setScrimToShow('')
            }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        open={scrimToShow === 'delete'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        isDismissable
        onClose={() => setScrimToShow('')}
      >
        <Dialog.Header>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          Are you sure you want to delete the entity <b>{node.name}</b> of type{' '}
          <b>{node.type}</b>?
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Button
            color="danger"
            onClick={async () => {
              await DeleteAction(node, dmssAPI, setLoading)
              await node.remove()
              setScrimToShow('')
            }}
          >
            {loading ? <Progress.Dots /> : 'Delete'}
          </Button>
          <Button variant="outlined" onClick={() => setScrimToShow('')}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        open={scrimToShow === 'new-root-package'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        isDismissable
        onClose={() => {
          setFormData(undefined)
          setScrimToShow('')
        }}
      >
        <Dialog.Header>
          <Dialog.Title>New root package</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Label label={'Root package name'} />
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
              handleFormDataSubmit(node, formData, NewRootPackageAction)
            }}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setFormData(undefined)
              setScrimToShow('')
            }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        open={scrimToShow === 'append-entity'}
        isDismissable
        onClose={() => setScrimToShow('')}
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
                    setScrimToShow('')
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
          <Button variant="outlined" onClick={() => setScrimToShow('')}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        open={scrimToShow === 'new-entity'}
        isDismissable
        onClose={() => setScrimToShow('')}
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
                    setScrimToShow('')
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
          <Button variant="outlined" onClick={() => setScrimToShow('')}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        open={scrimToShow === 'new-blueprint'}
        isDismissable
        onClose={() => setScrimToShow('')}
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
                    setScrimToShow('')
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
          <Button variant="outlined" onClick={() => setScrimToShow('')}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
