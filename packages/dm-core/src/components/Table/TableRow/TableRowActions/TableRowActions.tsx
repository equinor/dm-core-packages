import React, { useState } from 'react'
import { Button, Icon, Menu, Table } from '@equinor/eds-core-react'
import { delete_to_trash, more_vertical } from '@equinor/eds-icons'
import { TableRowActionsProps } from '../../types'

export function TableRowActions(props: TableRowActionsProps) {
  const { editMode, itemKey, removeItem, deleteItem } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  return (
    <Table.Cell style={{ textAlign: 'center' }}>
      {editMode ? (
        <Button
          aria-label="Remove row"
          color="danger"
          variant="ghost_icon"
          onClick={removeItem}
        >
          <Icon data={delete_to_trash} aria-hidden />
        </Button>
      ) : (
        <>
          <Button
            aria-label="Row actions"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-controls={`row-object-menu-${itemKey}`}
            variant="ghost_icon"
            onClick={() => setIsMenuOpen(true)}
            ref={setMenuButtonAnchor}
          >
            <Icon data={more_vertical} aria-hidden />
          </Button>
          <Menu
            anchorEl={menuButtonAnchor}
            aria-labelledby="anchor-default"
            id={`row-object-menu-${itemKey}`}
            onClose={() => setIsMenuOpen(false)}
            open={isMenuOpen}
          >
            <Menu.Item onClick={() => deleteItem(itemKey)}>Delete</Menu.Item>
          </Menu>
        </>
      )}
    </Table.Cell>
  )
}
