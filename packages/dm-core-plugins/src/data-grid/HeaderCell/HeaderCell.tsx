import React, { useState } from 'react'
import { Icon, Menu, Typography } from '@equinor/eds-core-react'
import * as Styled from '../styles'
import { add as addIcon, delete_to_trash } from '@equinor/eds-icons'

type HeaderCellProps = {
  add: (newIndex: number) => void
  editable: boolean
  delete: (index: number) => void
  index: number
  label: string
  selected: number | undefined
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>
  type: 'column' | 'row'
}

export function HeaderCell(props: HeaderCellProps) {
  const { add, index, label, selected, setSelected, type } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  function changeSelected(index: number) {
    if (index === selected) {
      setSelected(undefined)
      return
    }
    setSelected(index)
  }

  function handleColumnRightClick(event: any) {
    event.preventDefault()
    setSelected(index)
    setIsMenuOpen(true)
  }

  function onContextMenuClose() {
    setIsMenuOpen(false)
    setSelected(undefined)
  }

  function setSelectedOnKeyDown(event: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      changeSelected(index)
    }
  }

  return (
    <Styled.Header
      aria-haspopup
      onContextMenu={handleColumnRightClick}
      onClick={() => changeSelected(index)}
      onKeyDown={setSelectedOnKeyDown}
      //@ts-ignore
      ref={setMenuButtonAnchor}
      selected={index === selected}
      tabIndex={0}
    >
      {label}
      <Menu
        anchorEl={menuButtonAnchor}
        id={`tablehead-menu`}
        onClose={onContextMenuClose}
        open={isMenuOpen}
      >
        {!props.editable ? (
          <Typography variant='caption' style={{ padding: '0 0.5rem' }}>
            {type === 'column' ? 'Columns' : 'Rows'} are pre-defined and cannot
            be deleted or added.
          </Typography>
        ) : (
          <>
            <Menu.Item onClick={() => props.delete(index)}>
              <Icon size={16} data={delete_to_trash} /> Delete {type}
            </Menu.Item>
            <Menu.Item onClick={() => add(index - 1)}>
              <Icon size={16} data={addIcon} /> Add 1 {type}{' '}
              {type === 'column' ? 'left' : 'above'}
            </Menu.Item>
            <Menu.Item onClick={() => add(index)}>
              <Icon size={16} data={addIcon} /> Add 1 {type}{' '}
              {type === 'column' ? 'left' : 'below'}
            </Menu.Item>
          </>
        )}
      </Menu>
    </Styled.Header>
  )
}
