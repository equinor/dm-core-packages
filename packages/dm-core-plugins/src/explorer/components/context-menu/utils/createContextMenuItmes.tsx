import { EBlueprint, TreeNode } from '@development-framework/dm-core'
import { Menu } from '@equinor/eds-core-react'
import React from 'react'

export function createContextMenuItems(
  node: TreeNode,
  setScrimId: (id: string) => void
): JSX.Element[] {
  const menuItems = []
  const MenuItem = (props: { id: string; text: string }) => {
    return (
      <Menu.Item key={props.id} onClick={() => setScrimId(props.id)}>
        {props.text}
      </Menu.Item>
    )
  }

  // dataSources get a "new root package"
  if (node.type === 'dataSource') {
    menuItems.push(<MenuItem id="new-root-package" text="New package" />)
  }

  // Append to lists
  if (node.attribute.dimensions !== '') {
    menuItems.push(<MenuItem id="append-entity" text={`Append ${node.name}`} />)
  }

  // Packages get a "new folder"
  // and "new entity"
  // and "new blueprint"
  if (node.type == EBlueprint.PACKAGE) {
    menuItems.push(<MenuItem id="new-entity" text="New entity" />)
    menuItems.push(<MenuItem id="new-blueprint" text="New blueprint" />)
    menuItems.push(<MenuItem id="new-folder" text="New folder" />)
  }

  // Everything besides dataSources and folders can be viewed
  if (!['dataSource', EBlueprint.PACKAGE].includes(node.type)) {
    menuItems.push(
      <Menu.Item
        key={'view'}
        as="a"
        href={`dmt/view/${node.nodeId}`}
        target="_blank"
      >
        View in new tab
      </Menu.Item>
    )
  }

  // Everything besides dataSources can be deleted
  if (node.type !== 'dataSource') {
    menuItems.push(<MenuItem id="delete" text="Delete" />)
  }

  return menuItems
}
