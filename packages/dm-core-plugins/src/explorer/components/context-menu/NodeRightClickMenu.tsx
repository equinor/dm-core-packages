import {
  CopyLinkDialog,
  type TNodeWrapperProps,
} from '@development-framework/dm-core'
import { Menu } from '@equinor/eds-core-react'
import { useState } from 'react'
import { EDialog } from '../../types'
import AppendEntityDialog from '../dialogs/AppendEntityDialog'
import DeleteDialog from '../dialogs/DeleteDialog'
import EditACLDialog from '../dialogs/EditACLDialog'
import NewBlueprintDialog from '../dialogs/NewBlueprintDialog'
import NewEntityDialog from '../dialogs/NewEntityDialog'
import NewFolderDialog from '../dialogs/NewFolderDialog'
import { getMenuItems } from './getMenuItems'

export const STANDARD_DIALOG_WIDTH = '100%'
export const STANDARD_DIALOG_HEIGHT = '300px'

const NodeRightClickMenu = (
  props: TNodeWrapperProps & { setRawView: (type: string, id: string) => void }
) => {
  const { node, children, setNodeOpen, setRawView } = props
  const [dialogId, setDialogId] = useState<EDialog | undefined>()
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

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
        placement='bottom-start'
        matchAnchorWidth={true}
      >
        {getMenuItems(node, setDialogId, setRawView)}
      </Menu>

      {dialogId === EDialog.NewFolder && (
        <NewFolderDialog
          setDialogId={setDialogId}
          node={node}
          setNodeOpen={setNodeOpen}
          isRoot={false}
        />
      )}

      {dialogId === EDialog.Delete && (
        <DeleteDialog setDialogId={setDialogId} node={node} />
      )}

      {dialogId === EDialog.NewRootPackage && (
        <NewFolderDialog
          setDialogId={setDialogId}
          node={node}
          setNodeOpen={setNodeOpen}
          isRoot={true}
        />
      )}

      {dialogId === EDialog.AppendEntity && (
        <AppendEntityDialog
          setDialogId={setDialogId}
          node={node}
          setNodeOpen={setNodeOpen}
        />
      )}

      {dialogId === EDialog.NewEntity && (
        <NewEntityDialog
          setDialogId={setDialogId}
          node={node}
          setNodeOpen={setNodeOpen}
        />
      )}

      {dialogId === EDialog.NewBlueprint && (
        <NewBlueprintDialog
          setDialogId={setDialogId}
          node={node}
          setNodeOpen={setNodeOpen}
        />
      )}
      {dialogId === EDialog.CopyLink && (
        <CopyLinkDialog
          idReference={node.nodeId}
          open={true}
          setOpen={() => setDialogId(undefined)}
        />
      )}
      {dialogId === EDialog.EditACL && (
        <EditACLDialog
          setDialogId={setDialogId}
          node={node}
          setNodeOpen={setNodeOpen}
        />
      )}
    </>
  )
}

export default NodeRightClickMenu
