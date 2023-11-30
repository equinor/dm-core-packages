import React, { useState } from 'react'
import {
  Pagination,
  Stack,
  SortableList,
  ConditionalWrapper,
  useDMSS,
  SortableItem,
} from '../../'
import {
  Button,
  Table as EDSTable,
  Icon,
  Progress,
} from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import * as utils from './utils'
import { AddRowButton } from './styles'
import {
  TableProps,
  TTableSortDirection,
  TableVariantNameEnum,
  TTableRowItem,
  TTableVariant,
  TTableConfig,
} from './types'
import { TableHead } from './TableHead/TableHead'
import { TableRow } from './TableRow/TableRow'
import { SortableContext } from '../SortableList/SortableContext'

export type { TTableRowItem, TTableConfig }

export function Table(props: TableProps) {
  const {
    items,
    setItems,
    config,
    setDirtyState,
    loadingState,
    type,
    saveTable,
  } = props
  const [tableVariant, setTableVariant] = useState<TableVariantNameEnum>(
    config.variant[0].name
  )
  const dmssAPI = useDMSS()
  const [sortedItems, setSortedItems] = useState<TTableRowItem[]>([])
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] =
    useState<TTableSortDirection>('ascending')

  const functionalityConfig =
    config.variant.length === 1
      ? config.variant[0].functionality
      : config.variant.find(
          (variant: TTableVariant) => variant.name === tableVariant
        ).functionality

  const paginatedRows =
    tableVariant === TableVariantNameEnum.Edit || !sortColumn
      ? items.slice(
          paginationPage * rowsPerPage,
          paginationPage * rowsPerPage + rowsPerPage
        )
      : sortedItems.slice(
          paginationPage * rowsPerPage,
          paginationPage * rowsPerPage + rowsPerPage
        )

  async function instantiateAndAddItem(insertAtIndex?: number) {
    try {
      const response = await dmssAPI.instantiateEntity({
        entity: { type },
      })
      if (response.status === 200) {
        setDirtyState(true)
        const itemsCopy = [...items]
        const newItem = utils.createNewItemObject(response.data, items.length)
        const index = insertAtIndex !== undefined ? insertAtIndex : items.length
        itemsCopy.splice(index, 0, newItem)
        setItems(itemsCopy)
        if (tableVariant === TableVariantNameEnum.View) {
          saveTable(itemsCopy)
        }
      }
    } catch (error) {
      alert(JSON.stringify(error.response?.data))
    }
  }

  function deleteItem(key: string) {
    const updatedItemsList = utils.removeItemFromList(items, key)
    saveTable(updatedItemsList)
  }

  /**
   * Start with ascending order if sorting on new column, switch to descending if already sorted, turn off sorting and reset to initial data if sorting was descending
   */
  function sortByColumn(column: string) {
    let newSortColumn: string | undefined = column
    let newSortDirection: TTableSortDirection =
      column !== sortColumn ? 'ascending' : 'descending'
    let newSortItems
    if (sortDirection === 'descending' && column === sortColumn) {
      newSortDirection = 'ascending'
      newSortColumn = undefined
      newSortItems = [...items]
    } else {
      newSortItems = [...items].sort(
        utils.dynamicSort(newSortDirection, column)
      )
    }
    setSortedItems(newSortItems)
    setSortDirection(newSortDirection)
    setSortColumn(newSortColumn)
  }

  function reorderItems(reorderedItems: TTableRowItem[]) {
    setItems(reorderedItems)
    setDirtyState(true)
  }

  return (
    <Stack spacing={1}>
      <Stack>
        <SortableContext items={items} onReorder={reorderItems}>
          <EDSTable
            style={{
              width: '100%',
              paddingRight: tableVariant === TableVariantNameEnum.Edit ? 32 : 0,
            }}
          >
            <TableHead
              config={config}
              tableVariant={tableVariant}
              setTableVariant={setTableVariant}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              sortByColumn={sortByColumn}
            />
            <EDSTable.Body>
              <ConditionalWrapper
                condition={tableVariant === TableVariantNameEnum.Edit}
                wrapper={(children: React.ReactNode) => (
                  <SortableList items={paginatedRows}>{children}</SortableList>
                )}
              >
                {paginatedRows?.map((item, index) => (
                  <ConditionalWrapper
                    key={item?.key}
                    condition={tableVariant === TableVariantNameEnum.Edit}
                    wrapper={(children: React.ReactNode) => (
                      <SortableItem item={item} key={item?.key}>
                        {children}
                      </SortableItem>
                    )}
                  >
                    <TableRow
                      key={item?.key}
                      addItem={instantiateAndAddItem}
                      config={config}
                      deleteItem={deleteItem}
                      editMode={tableVariant === TableVariantNameEnum.Edit}
                      functionalityConfig={functionalityConfig}
                      idReference={props.idReference}
                      index={index}
                      item={item}
                      items={items}
                      onOpen={props.onOpen}
                      rowsPerPage={rowsPerPage}
                      setDirtyState={setDirtyState}
                      setItems={setItems}
                      tableVariant={tableVariant}
                    />
                  </ConditionalWrapper>
                ))}
              </ConditionalWrapper>
            </EDSTable.Body>
          </EDSTable>
        </SortableContext>
        {functionalityConfig.add && (
          <AddRowButton
            aria-label='Add new row'
            onClick={() => instantiateAndAddItem()}
          >
            <Icon size={16} data={add} />
          </AddRowButton>
        )}
      </Stack>
      <Stack direction='row' spacing={1} justifyContent='space-between'>
        <Pagination
          count={items?.length || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={paginationPage}
          setPage={setPaginationPage}
        />
        {tableVariant === TableVariantNameEnum.Edit && (
          <Button
            disabled={loadingState || !props.dirtyState}
            onClick={() => saveTable(items)}
          >
            {loadingState ? <Progress.Dots color={'primary'} /> : 'Save'}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
