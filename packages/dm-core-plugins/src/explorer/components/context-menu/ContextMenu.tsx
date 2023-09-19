import { TNodeWrapperProps } from '@development-framework/dm-core'
import { Menu } from '@equinor/eds-core-react'
import React, { useState } from 'react'
import AppendEntityDialog from '../dialogs/AppendEntityDialog'
import DeleteDialog from '../dialogs/DeleteDialog'
import NewBlueprintDialog from '../dialogs/NewBlueprintDialog'
import NewEntityDialog from '../dialogs/NewEntityDialog'
import NewFolderDialog from '../dialogs/NewFolderDialog'
import NewRootPackageDialog from '../dialogs/NewRootPackageDialog'
import { createContextMenuItems } from './utils/createContextMenuItmes'

export const STANDARD_DIALOG_WIDTH = '100%'
export const STANDARD_DIALOG_HEIGHT = '300px'

export const NodeRightClickMenu = (props: TNodeWrapperProps) => {
  const { node, children } = props
  const [dialogId, setDialogId] = useState<string>('')
  const [formData, setFormData] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const menuItems = createContextMenuItems(node, setDialogId)

  //TODO when the tree changes by adding new package or deleting something, the tree should be updated to give consistent UI to user
  return (
    <>
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

      {dialogId === 'new-folder' && (
        <NewFolderDialog
          setDialogId={setDialogId}
          formData={formData}
          setFormData={setFormData}
          node={node}
        />
      )}

      {dialogId == 'delete' && (
        <DeleteDialog
          setDialogId={setDialogId}
          loading={loading}
          setLoading={setLoading}
          node={node}
        />
      )}

      {dialogId === 'new-root-package' && (
        <NewRootPackageDialog
          setDialogId={setDialogId}
          formData={formData}
          setFormData={setFormData}
          node={node}
        />
      )}

      {dialogId === 'append-entity' && (
        <AppendEntityDialog
          setDialogId={setDialogId}
          loading={loading}
          setLoading={setLoading}
          node={node}
        />
      )}

      {dialogId === 'new-entity' && (
        <NewEntityDialog
          setDialogId={setDialogId}
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          setLoading={setLoading}
          node={node}
        />
      )}

      {dialogId === 'new-blueprint' && (
        <NewBlueprintDialog
          setDialogId={setDialogId}
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          setLoading={setLoading}
          node={node}
        />
      )}
    </>
  )
}
