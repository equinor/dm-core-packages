import { DmssAPI, EBlueprint, TreeNode } from '@development-framework/dm-core'
import { MenuItem } from 'react-contextmenu'
import React from 'react'

export function createContextMenuItems(
  node: TreeNode,
  dmssAPI: DmssAPI,
  removeNode: () => void,
  setShowScrimId: (id: string) => void
): JSX.Element[] {
  const menuItems = []

  // dataSources get a "new root package"
  if (node.type === 'dataSource') {
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'new-root-package'}
        onClick={() => setShowScrimId('new-root-package')}
      >
        New package
      </MenuItem>
    )
  }

  // Append to lists
  if (node.attribute.dimensions !== '') {
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'append-entity'}
        onClick={() => setShowScrimId('append-entity')}
      >
        Append {node.name}
      </MenuItem>
    )
  }

  // Packages get a "new folder"
  // and "new entity"
  // and "new blueprint"
  if (node.type == EBlueprint.PACKAGE) {
    menuItems.push(
      // @ts-ignore
      <MenuItem key={'new-entity'} onClick={() => setShowScrimId('new-entity')}>
        New entity
      </MenuItem>
    )
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'new-blueprint'}
        onClick={() => setShowScrimId('new-blueprint')}
      >
        New blueprint
      </MenuItem>
    )
    menuItems.push(
      // @ts-ignore
      <MenuItem key={'new-folder'} onClick={() => setShowScrimId('new-folder')}>
        New folder
      </MenuItem>
    )
  }

  // Everything besides dataSources and folders can be viewed
  if (!['dataSource', EBlueprint.PACKAGE].includes(node.type)) {
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'view'}
        onClick={() => {
          // @ts-ignore
          window.open(`dmt/view/${node.nodeId}`, '_blank').focus()
        }}
      >
        View in new tab
      </MenuItem>
    )
  }

  // Everything besides dataSources can be deleted
  if (node.type !== 'dataSource') {
    menuItems.push(
      //@ts-ignore
      <MenuItem
        key={'delete'}
        onClick={() => {
          setShowScrimId('delete')
        }}
      >
        Delete
      </MenuItem>
    )
  }

  return menuItems
}
