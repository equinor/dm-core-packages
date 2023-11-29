import { EBlueprint, TreeNode } from '@development-framework/dm-core'
import { Menu } from '@equinor/eds-core-react'
import React from 'react'
import { EDialog } from '../../types'

// This function must return a list of Menu.Item, ie not wrapped in a <></>.
// See https://github.com/equinor/design-system/issues/2659
export function getMenuItems(
  node: TreeNode,
  setDialogId: (id: EDialog | undefined) => void,
): React.ReactElement[] {
  const menuItems = []
  const getMenuItem = (id: EDialog, text: string) => {
    return (
      <Menu.Item key={id} onClick={() => setDialogId(id)}>
        {text}
      </Menu.Item>
    )
  }

  // dataSources get a "new root package"
  if (node.type === 'dataSource') {
    menuItems.push(getMenuItem(EDialog.NewRootPackage, 'New package'))
  }

  // Append to lists
  if (Array.isArray(node.entity)) {
    menuItems.push(getMenuItem(EDialog.AppendEntity, `Append ${node.name}`))
  }

  // Packages get a "new folder"
  // and "new entity"
  // and "new blueprint"
  if (node.type == EBlueprint.PACKAGE) {
    menuItems.push(getMenuItem(EDialog.NewEntity, 'New entity'))
    menuItems.push(getMenuItem(EDialog.NewBlueprint, 'New blueprint'))
    menuItems.push(getMenuItem(EDialog.NewFolder, 'New folder'))
  }

  // Everything besides dataSources and folders can be viewed
  if (!['dataSource', EBlueprint.PACKAGE].includes(node.type)) {
    menuItems.push(
      <Menu.Item
        key={'view'}
        as='a'
        href={`dmt/view/${node.nodeId}`}
        target='_blank'
      >
        View in new tab
      </Menu.Item>,
    )
  }

  // Everything besides dataSources can be deleted
  if (node.type !== 'dataSource') {
    menuItems.push(getMenuItem(EDialog.Delete, 'Delete'))
  }

  return menuItems
}
