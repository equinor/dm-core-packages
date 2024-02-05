import { Button, Icon, Menu, Table } from '@equinor/eds-core-react'
import { more_vertical } from '@equinor/eds-icons'
import { useState } from 'react'
import { DeleteSoftButton } from '../../../DeleteSoftButton'
import { TableRowActionsProps } from '../../types'

export function TableRowActions(props: TableRowActionsProps) {
  const { editMode, item, removeItem } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  return (
    <Table.Cell style={{ textAlign: 'center' }}>
      {props.functionalityConfig.delete &&
        (editMode ? (
          <DeleteSoftButton
            onClick={() => removeItem(item, false)}
            title={'Remove row'}
            ariaLabel={'Remove row'}
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
              <Menu.Item onClick={() => removeItem(item, true)}>
                Delete
              </Menu.Item>
            </Menu>
          </>
        ))}
    </Table.Cell>
  )
}
