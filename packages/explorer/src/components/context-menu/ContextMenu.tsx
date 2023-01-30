import React, { useContext, useState } from 'react'
import { Button, Input, Label, Progress } from '@equinor/eds-core-react'
import './react-contextmenu.css'
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu'
import { AxiosError } from 'axios'
import {
  AuthContext,
  EBlueprint,
  DmssAPI,
  TreeNode,
  Dialog,
  BlueprintPicker,
  INPUT_FIELD_WIDTH,
  ErrorResponse,
  TNodeWrapperProps,
} from '@development-framework/dm-core'

// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { createContextMenuItems } from './utils/createContextMenuItmes'
import { SingleTextInput } from './utils/SingleTextInput'
import { DialogContent, edsButtonStyleConfig } from './utils/styles'
import {
  DeleteAction,
  NewFolderAction,
  NewRootPackageAction,
} from './utils/contextMenuActions'

//Component that can be used when a context menu action requires one text (string) input.

export const NodeRightClickMenu = (props: TNodeWrapperProps) => {
  const { node, children, removeNode } = props
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token, 'http://localhost:5000')
  const [scrimToShow, setScrimToShow] = useState<string>('')
  const [formData, setFormData] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)

  const STANDARD_DIALOG_WIDTH = '100%'
  const STANDARD_DIALOG_HEIGHT = '300px'

  const menuItems = createContextMenuItems(node, dmssAPI, setScrimToShow)

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
      NotificationManager.error('Form data cannot be empty!')
    }
  }

  //TODO when the tree changes by adding new package or deleting something, the tree should be updated to give consistent UI to user
  return (
    <div>
      {/*@ts-ignore*/}
      <ContextMenuTrigger id={node.nodeId}>{children}</ContextMenuTrigger>
      {/*@ts-ignore*/}
      <ContextMenu id={node.nodeId}>{menuItems}</ContextMenu>
      <Dialog
        isOpen={scrimToShow === 'new-folder'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        header={'Create new folder'}
        closeScrim={() => {
          setFormData(undefined)
          setScrimToShow('')
        }}
      >
        <DialogContent>
          <SingleTextInput
            label={'Folder name'}
            setFormData={setFormData}
            handleSubmit={() =>
              handleFormDataSubmit(node, formData, NewFolderAction)
            }
            buttonisDisabled={formData === undefined || formData === ''}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'delete'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        closeScrim={() => setScrimToShow('')}
        header={'Confirm Deletion'}
      >
        <DialogContent>
          <div style={{ paddingBottom: '18px' }}>
            Are you sure you want to delete the entity <b>{node.name}</b> of
            type <b>{node.type}</b>?
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <Button onClick={() => setScrimToShow('')}>Cancel</Button>
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
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'new-root-package'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        closeScrim={() => {
          setFormData(undefined)
          setScrimToShow('')
        }}
        header={'New root package'}
      >
        <DialogContent>
          <SingleTextInput
            label={'Root package name'}
            handleSubmit={() =>
              handleFormDataSubmit(node, formData, NewRootPackageAction)
            }
            setFormData={setFormData}
            buttonisDisabled={formData === undefined || formData === ''}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'append-entity'}
        closeScrim={() => setScrimToShow('')}
        header={`Append new entity to list`}
        width={STANDARD_DIALOG_WIDTH}
      >
        <DialogContent>
          {loading ? (
            <Button style={edsButtonStyleConfig}>
              <Progress.Dots />
            </Button>
          ) : (
            <Button
              style={edsButtonStyleConfig}
              onClick={() => {
                setLoading(true)
                node
                  .addEntity(
                    node.attribute.attributeType,
                    `${node.entity.length}`
                  )
                  .then(() => {
                    node.expand()
                    setScrimToShow('')
                  })
                  .catch((error: AxiosError<ErrorResponse>) => {
                    console.error(error)
                    NotificationManager.error(
                      error.response?.data.message,
                      'Failed to create entity'
                    )
                  })
                  .finally(() => setLoading(false))
              }}
            >
              Create
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'new-entity'}
        closeScrim={() => setScrimToShow('')}
        header={`Create new entity`}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
      >
        <DialogContent>
          <div style={{ display: 'block' }}>
            <BlueprintPicker
              label={'Blueprint'}
              onChange={(selectedType: string) =>
                setFormData({ type: selectedType })
              }
              formData={formData?.type || ''}
            />
          </div>
          {loading ? (
            <Button style={edsButtonStyleConfig}>
              <Progress.Dots />
            </Button>
          ) : (
            <Button
              disabled={formData?.type === undefined}
              style={edsButtonStyleConfig}
              onClick={() => {
                setLoading(true)
                node
                  .addEntity(`dmss://${formData?.type}`, formData?.name || '')
                  .then(() => {
                    setScrimToShow('')
                    NotificationManager.success(`New entity created`, 'Success')
                  })
                  .catch((error: AxiosError<ErrorResponse>) => {
                    console.error(error)
                    NotificationManager.error(error.response?.data.message)
                  })
                  .finally(() => setLoading(false))
              }}
            >
              Create
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'new-blueprint'}
        closeScrim={() => setScrimToShow('')}
        header={`Create new blueprint`}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
      >
        <DialogContent>
          <div style={{ display: 'block' }}>
            <Label label={'Name'} />
            <Input
              style={{ width: INPUT_FIELD_WIDTH }}
              type="string"
              value={formData?.name || ''}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Name for new blueprint"
            />
          </div>
          {loading ? (
            <Button style={edsButtonStyleConfig}>
              <Progress.Dots />
            </Button>
          ) : (
            <Button
              disabled={formData?.name === undefined}
              style={edsButtonStyleConfig}
              onClick={() => {
                setLoading(true)
                node
                  .addEntity(EBlueprint.BLUEPRINT, formData?.name)
                  .then(() => {
                    setScrimToShow('')
                  })
                  .catch((error: AxiosError<ErrorResponse>) => {
                    console.error(error)
                    NotificationManager.error(error.response?.data.message)
                  })
                  .finally(() => setLoading(false))
              }}
            >
              Create
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
