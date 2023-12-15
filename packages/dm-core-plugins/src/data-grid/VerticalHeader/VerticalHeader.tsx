import React, { useState } from 'react'
import * as Styled from '../styles'
import { Icon, Menu, Typography } from '@equinor/eds-core-react'
import { add, delete_to_trash } from '@equinor/eds-icons'

type VerticalHeaderProps = {
  selectedRow: number | undefined
  setSelectedRow: React.Dispatch<React.SetStateAction<number | undefined>>
  index: number
  addRow: (newIndex?: number) => void
  deleteRow: () => void
  rowsAreSetDimension: boolean
}

export function VerticalHeader(props: VerticalHeaderProps) {
  const { selectedRow, setSelectedRow, index, addRow } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  function changeSelectedRow(index: number) {
    if (index === selectedRow) {
      setSelectedRow(undefined)
      return
    }
    setSelectedRow(index)
  }

  function handleColumnRightClick(event: any) {
    event.preventDefault()
    setSelectedRow(index)
    setIsMenuOpen(true)
  }

  function onContextMenuClose() {
    setIsMenuOpen(false)
    setSelectedRow(undefined)
  }

  return (
    <Styled.Cell
      style={{
        width: '1.25rem',
        minWidth: '1.25rem',
        position: 'relative',
        fontWeight: 'bold',
      }}
    >
      <Styled.RowButton
        selected={selectedRow === index}
        onClick={() => changeSelectedRow(index)}
        onContextMenu={handleColumnRightClick}
        ref={setMenuButtonAnchor}
      >
        {index + 1}
      </Styled.RowButton>
      <Menu
        anchorEl={menuButtonAnchor}
        id={`${index}_tablerow-menu`}
        onClose={onContextMenuClose}
        open={isMenuOpen}
      >
        {props.rowsAreSetDimension ? (
          <Typography variant='caption' style={{ padding: '0 0.5rem' }}>
            Number of rows are pre-defined and cannot be deleted or added.
          </Typography>
        ) : (
          <>
            <Menu.Item onClick={props.deleteRow}>
              <Icon size={16} data={delete_to_trash} /> Delete row
            </Menu.Item>
            <Menu.Item onClick={() => addRow(index)}>
              <Icon size={16} data={add} /> Add 1 row above
            </Menu.Item>
            <Menu.Item onClick={() => addRow(index + 1)}>
              <Icon size={16} data={add} /> Add 1 row below
            </Menu.Item>
          </>
        )}
      </Menu>
    </Styled.Cell>
  )
}
