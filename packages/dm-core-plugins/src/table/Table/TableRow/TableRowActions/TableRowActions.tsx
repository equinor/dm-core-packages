import { Button, Dialog, Icon, Menu, Table } from '@equinor/eds-core-react'
import { more_vertical } from '@equinor/eds-icons'
import { useState } from 'react'
import { DeleteSoftButton } from '../../../../common'
import type { TableRowActionsProps } from '../../types'

export function TableRowActions(props: TableRowActionsProps) {
  const { editMode, item, removeItem, disabled } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)
  const itemName = item.data?.name ?? item.data?.label

  return (
    <Table.Cell style={{ textAlign: 'center' }}>
      {props.functionalityConfig.delete &&
        (editMode ? (
          <DeleteSoftButton
            onClick={() => removeItem(item, false)}
            title={'Remove row'}
            ariaLabel={'Remove row'}
            disabled={disabled}
          />
        ) : (
          <>
            <Button
              aria-label='Row actions'
              aria-haspopup='true'
              aria-expanded={isMenuOpen}
              aria-controls={`row-object-menu-${item.key}`}
              variant='ghost_icon'
              onClick={() => setIsMenuOpen(true)}
              ref={setMenuButtonAnchor}
              disabled={disabled}
            >
              <Icon data={more_vertical} aria-hidden />
            </Button>
            <Menu
              anchorEl={menuButtonAnchor}
              aria-labelledby='anchor-default'
              id={`row-object-menu-${item.key}`}
              onClose={() => setIsMenuOpen(false)}
              open={isMenuOpen}
            >
              <Menu.Item
                onClick={() => {
                  if (props.functionalityConfig.confirmDelete) {
                    setIsMenuOpen(false)
                    setIsConfirmOpen(true)
                    return
                  }
                  removeItem(item, true)
                }}
              >
                Delete
              </Menu.Item>
            </Menu>
            <Dialog
              open={isConfirmOpen}
              isDismissable
              onClose={() => setIsConfirmOpen(false)}
            >
              <Dialog.Header>
                <Dialog.Title>Delete {itemName ?? 'row'}?</Dialog.Title>
              </Dialog.Header>
              <Dialog.CustomContent>
                This cannot be undone.
              </Dialog.CustomContent>
              <Dialog.Actions>
                <Button
                  color='danger'
                  onClick={() => {
                    setIsConfirmOpen(false)
                    removeItem(item, true)
                  }}
                >
                  Delete
                </Button>
                <Button variant='ghost' onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
          </>
        ))}
    </Table.Cell>
  )
}
