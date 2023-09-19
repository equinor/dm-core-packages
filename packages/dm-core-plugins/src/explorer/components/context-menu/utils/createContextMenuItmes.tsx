import { EBlueprint, TreeNode } from '@development-framework/dm-core'
import { Menu } from '@equinor/eds-core-react'
import React from 'react'

export function createContextMenuItems(
  node: TreeNode,
  setScrimId: (id: string) => void
): JSX.Element[] {
  const menuItems = []

  // dataSources get a "new root package"
  if (node.type === 'dataSource') {
    menuItems.push(
      // @ts-ignore
      <Menu.Item
        key={'new-root-package'}
        onClick={() => setScrimId('new-root-package')}
      >
        New package
      </Menu.Item>
    )
  }

  // Append to lists
  if (node.attribute.dimensions !== '') {
    menuItems.push(
      // @ts-ignore
      <Menu.Item
        key={'append-entity'}
        onClick={() => setScrimId('append-entity')}
      >
        Append {node.name}
      </Menu.Item>
    )
  }

  // Packages get a "new folder"
  // and "new entity"
  // and "new blueprint"
  if (node.type == EBlueprint.PACKAGE) {
    menuItems.push(
      // @ts-ignore
      <Menu.Item key={'new-entity'} onClick={() => setScrimId('new-entity')}>
        New entity
      </Menu.Item>
    )
    menuItems.push(
      // @ts-ignore
      <Menu.Item
        key={'new-blueprint'}
        onClick={() => setScrimId('new-blueprint')}
      >
        New blueprint
      </Menu.Item>
    )
    menuItems.push(
      // @ts-ignore
      <Menu.Item key={'new-folder'} onClick={() => setScrimId('new-folder')}>
        New folder
      </Menu.Item>
    )
  }

  // Everything besides dataSources and folders can be viewed
  if (!['dataSource', EBlueprint.PACKAGE].includes(node.type)) {
    menuItems.push(
      // @ts-ignore
      <Menu.Item
        key={'view'}
        onClick={() => {
          // @ts-ignore
          window.open(`dmt/view/${node.nodeId}`, '_blank').focus()
        }}
      >
        View in new tab
      </Menu.Item>
    )
  }

  // Everything besides dataSources can be deleted
  if (node.type !== 'dataSource') {
    menuItems.push(
      //@ts-ignore
      <Menu.Item
        key={'delete'}
        onClick={() => {
          setScrimId('delete')
        }}
      >
        Delete
      </Menu.Item>
    )
  }

  return menuItems
}
