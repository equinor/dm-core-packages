import React, { useState } from 'react'
import { Icon, Menu, Typography } from '@equinor/eds-core-react'
import * as Styled from '../styles'
import * as utils from '../utils'
import { add, delete_to_trash } from '@equinor/eds-icons'
import { TAttribute } from '@development-framework/dm-core'

type ColumnHeaderProps = {
  attributeType: string
  column: any
  columns: number[]
  columnsAreSetDimension: boolean
  data: any[]
  deleteColumn: (index: number) => void
  index: number
  multi: boolean
  selectedColumn: number | undefined
  setColumns: React.Dispatch<React.SetStateAction<number[]>>
  setData: (data: any[]) => void
  setSelectedColumn: React.Dispatch<React.SetStateAction<number | undefined>>
}

export function ColumnHeader(props: ColumnHeaderProps) {
  const {
    attributeType,
    column,
    columns,
    data,
    index,
    multi,
    selectedColumn,
    setColumns,
    setData,
    setSelectedColumn,
  } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  function changeSelectedColumn(index: number) {
    if (index === selectedColumn) {
      setSelectedColumn(undefined)
      return
    }
    setSelectedColumn(index)
  }

  function handleColumnRightClick(event: any) {
    event.preventDefault()
    setSelectedColumn(index)
    setIsMenuOpen(true)
  }

  function addColumn(placement: 'before' | 'after') {
    const newIndex = placement === 'before' ? index : index + 1
    const newColumns = utils.createArrayFromNumber(columns.length + 1)
    const fillValue = utils.getFillValue(attributeType)
    const updatedData = data.map((item) => {
      item.splice(newIndex, 0, fillValue)
      return item
    })
    setData(updatedData)
    setColumns(newColumns)
    setSelectedColumn(newIndex)
  }

  function onContextMenuClose() {
    setIsMenuOpen(false)
    setSelectedColumn(undefined)
  }

  return (
    <Styled.Cell header>
      <Styled.RowButton
        selected={index === selectedColumn}
        onClick={() => (multi ? changeSelectedColumn(index) : null)}
        onContextMenu={handleColumnRightClick}
        ref={setMenuButtonAnchor}
      >
        {utils.columnLabels[column - 1]}
      </Styled.RowButton>
      <Menu
        anchorEl={menuButtonAnchor}
        id={`tablehead-menu`}
        onClose={onContextMenuClose}
        open={isMenuOpen}
      >
        {props.columnsAreSetDimension || !multi ? (
          <Typography variant='caption' style={{ padding: '0 0.5rem' }}>
            Columns are pre-defined and cannot be deleted or added.
          </Typography>
        ) : (
          <>
            <Menu.Item onClick={() => props.deleteColumn(index)}>
              <Icon size={16} data={delete_to_trash} /> Delete column
            </Menu.Item>
            <Menu.Item onClick={() => addColumn('before')}>
              <Icon size={16} data={add} /> Add 1 column left
            </Menu.Item>
            <Menu.Item onClick={() => addColumn('after')}>
              <Icon size={16} data={add} /> Add 1 column right
            </Menu.Item>
          </>
        )}
      </Menu>
    </Styled.Cell>
  )
}
