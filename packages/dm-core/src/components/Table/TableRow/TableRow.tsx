import React, { useState } from 'react'
import { EdsProvider, Icon, Table } from '@equinor/eds-core-react'
import { ViewCreator } from '../../../'
import { TTableColumnConfig, TableRowProps } from '../types'
import * as utils from '../utils'
import * as Styled from './styles'
import { TableRowActions } from './TableRowActions/TableRowActions'
import { TableCell } from './TableCell/TableCell'

export function TableRow(props: TableRowProps) {
  const {
    addItem,
    config,
    dragHandle,
    editMode,
    functionalityConfig,
    idReference,
    index,
    item,
    items,
    setItems,
    setDirtyState,
    tableVariant,
    ...dragProps
  } = props

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const columnsLength: number = utils.getColumnsLength(
    config,
    functionalityConfig,
    tableVariant
  )

  function openItemAsTab() {
    props.onOpen(
      crypto.randomUUID(),
      { label: item?.data?.name, type: 'ViewConfig' },
      `${idReference}[${index}]`
    )
  }

  function removeItem() {
    setItems(utils.removeItemFromList(items, item.key))
    setDirtyState(true)
  }

  function updateItem(
    attribute: string,
    newValue: string | number | boolean,
    attributeType: string
  ) {
    if (attributeType === 'number') newValue = Number(newValue)
    setItems(utils.updateItemAttribute(items, item.key, attribute, newValue))
    setDirtyState(true)
  }

  return (
    <>
      {editMode && (
        <Table.Row style={{ height: 0, position: 'relative' }}>
          <Table.Cell
            style={{ padding: 0, margin: 0, height: 0, borderBottom: 'none' }}
            colSpan={columnsLength}
          >
            <Styled.InsertRowButton
              title="Add row"
              onClick={() => addItem(index)}
            >
              <span className="resting_state_indicator" />
              <Icon name="add" color="white" />
            </Styled.InsertRowButton>
          </Table.Cell>
        </Table.Row>
      )}
      <EdsProvider density="compact">
        <Table.Row
          key={item.key}
          style={dragProps.style}
          ref={dragProps.setNodeRef}
        >
          {editMode && (
            <Styled.TableCell style={{ position: 'relative' }}>
              {dragHandle ? dragHandle() : null}
            </Styled.TableCell>
          )}
          {config.columns.map((column: TTableColumnConfig) => (
            <TableCell
              key={column.data}
              column={column}
              editMode={editMode}
              isExpanded={isExpanded}
              item={item}
              openItemAsTab={openItemAsTab}
              setIsExpanded={setIsExpanded}
              updateItem={updateItem}
            ></TableCell>
          ))}
          {functionalityConfig?.delete && (
            <TableRowActions
              editMode={editMode}
              itemKey={item.key}
              removeItem={removeItem}
              deleteItem={props.deleteItem}
            />
          )}
        </Table.Row>
      </EdsProvider>
      {isExpanded && (
        <Table.Row>
          <Table.Cell colSpan={columnsLength}>
            <ViewCreator
              idReference={`${idReference}[${item.index}]`}
              viewConfig={
                config.expandableRecipeViewConfig
                  ? config.expandableRecipeViewConfig
                  : { type: 'ViewConfig', scope: 'self' }
              }
            />
          </Table.Cell>
        </Table.Row>
      )}
    </>
  )
}
