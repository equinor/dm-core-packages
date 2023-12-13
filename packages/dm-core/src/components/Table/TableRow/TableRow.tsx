import React, { useState } from 'react'
import { EdsProvider, Icon, Table } from '@equinor/eds-core-react'
import { TGenericObject, TItem, ViewCreator } from '../../../'
import { TableRowProps, TTableColumnConfig } from '../types'
import * as utils from '../utils'
import * as Styled from './styles'
import { TableRowActions } from './TableRowActions/TableRowActions'
import { TableCell } from './TableCell/TableCell'
import { add } from '@equinor/eds-icons'

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
    updateItem,
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

  const handleItemUpdate = (itemToChange: TItem<any>, data: any) => {
    updateItem(itemToChange, data, false)
  }

  function openItemAsTab() {
    props.onOpen(
      crypto.randomUUID(),
      {
        label:
          item?.data?.name ??
          `${idReference.split('.').slice(-1)} #${item.index}`,
        type: 'ViewConfig',
      },
      `${idReference}[${index}]`,
      false,
      (data: any) => handleItemUpdate(item, data)
    )
  }

  function updateCell(
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
              title='Add new row'
              onClick={() => addItem(!editMode, index)}
            >
              <span className='resting_state_indicator' />
              <Icon data={add} color='white' />
            </Styled.InsertRowButton>
          </Table.Cell>
        </Table.Row>
      )}
      <EdsProvider density='compact'>
        <Table.Row
          key={item.key}
          style={{
            ...dragProps.style,
            backgroundColor: index % 2 === 0 ? '#f7f7f7' : '',
          }}
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
              updateItem={updateCell}
            ></TableCell>
          ))}
          {functionalityConfig?.delete && (
            <TableRowActions
              editMode={editMode}
              item={item}
              removeItem={props.removeItem}
            />
          )}
        </Table.Row>
      </EdsProvider>
      {isExpanded && (
        <Table.Row>
          <Table.Cell colSpan={columnsLength}>
            <ViewCreator
              idReference={`${idReference}[${item.index}]`}
              onSubmit={(data: TGenericObject) => handleItemUpdate(item, data)}
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
