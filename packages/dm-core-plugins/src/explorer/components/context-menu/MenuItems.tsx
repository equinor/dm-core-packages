import { EBlueprint, TreeNode } from '@development-framework/dm-core'
import { Menu } from '@equinor/eds-core-react'
import React from 'react'
import { EDialog } from '../../types'

export function MenuItems(props: {
  node: TreeNode
  setDialogId: (id: EDialog | undefined) => void
}): JSX.Element[] {
  const { node, setDialogId } = props
  const menuItems = []
  const MenuItem = (props: { id: EDialog; text: string }) => {
    return (
      <Menu.Item key={props.id} onClick={() => setDialogId(props.id)}>
        {props.text}
      </Menu.Item>
    )
  }

  // dataSources get a "new root package"
  if (node.type === 'dataSource') {
    menuItems.push(<MenuItem id={EDialog.NewRootPackage} text="New package" />)
  }

  // Append to lists
  if (node.attribute.dimensions !== '') {
    menuItems.push(
      <MenuItem id={EDialog.AppendEntity} text={`Append ${node.name}`} />
    )
  }

  // Packages get a "new folder"
  // and "new entity"
  // and "new blueprint"
  if (node.type == EBlueprint.PACKAGE) {
    menuItems.push(<MenuItem id={EDialog.NewEntity} text="New entity" />)
    menuItems.push(<MenuItem id={EDialog.NewBlueprint} text="New blueprint" />)
    menuItems.push(<MenuItem id={EDialog.NewFolder} text="New folder" />)
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
    menuItems.push(<MenuItem id={EDialog.Delete} text="Delete" />)
  }

  return menuItems
}
