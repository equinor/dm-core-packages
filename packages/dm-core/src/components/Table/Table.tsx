import { Button, Progress, Table as EDSTable } from '@equinor/eds-core-react'
import React, { useState } from 'react'
import {
  ConditionalWrapper,
  Pagination,
  SortableItem,
  SortableList,
  Stack,
  TGenericObject,
  TTemplate,
  usePagination,
} from '../../'
import { TItem } from '../../hooks/useList/types'
import { AddRowButton } from '../AddRowButton'
import { SortableContext } from '../SortableList/SortableContext'
import { TemplateMenu } from '../TemplateMenu'
import { TableHead } from './TableHead/TableHead'
import { TableRow } from './TableRow/TableRow'
import {
  TTableConfig,
  TTableSortDirection,
  TTableVariant,
  TableProps,
  TableVariantNameEnum,
} from './types'
import * as utils from './utils'

export type { TTableConfig }

export function Table(props: TableProps) {
  const {
    addItem,
    items,
    removeItem,
    setItems,
    updateItem,
    config,
    setDirtyState,
    loadingState,
    saveTable,
  } = props

  const [tableVariant, setTableVariant] = useState<TableVariantNameEnum>(
    config.variant[0].name
  )
  const [sortedItems, setSortedItems] = useState<TItem<TGenericObject>[]>([])
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] =
    useState<TTableSortDirection>('ascending')
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)

  const {
    currentItems,
    itemsPerPage,
    currentPage,
    setItemsPerPage,
    setPage,
    setLastPage,
  } = usePagination(
    TableVariantNameEnum.Edit || !sortColumn ? items : sortedItems,
    10
  )
  const functionalityConfig =
    config.variant.length === 1
      ? config.variant[0].functionality
      : config.variant.find(
          (variant: TTableVariant) => variant.name === tableVariant
        ).functionality

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
    setPage(0)
  }

  function reorderItems(reorderedItems: TItem<TGenericObject>[]) {
    setItems(reorderedItems)
    setDirtyState(true)
  }

  return (
    <Stack style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Stack
        style={{
          width: '100%',
          maxHeight: 'calc(100% - 40px)',
          overflow: 'auto',
        }}
      >
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
                  <SortableList items={items}>{children}</SortableList>
                )}
              >
                {currentItems?.map((item, index) => (
                  <ConditionalWrapper
                    key={item.key}
                    condition={tableVariant === TableVariantNameEnum.Edit}
                    wrapper={(children: React.ReactNode) => (
                      <SortableItem item={item}>{children}</SortableItem>
                    )}
                  >
                    <TableRow
                      key={item.key}
                      addItem={addItem}
                      config={config}
                      removeItem={removeItem}
                      editMode={tableVariant === TableVariantNameEnum.Edit}
                      functionalityConfig={functionalityConfig}
                      idReference={props.idReference}
                      index={index}
                      item={item}
                      items={items}
                      onOpen={props.onOpen}
                      rowsPerPage={itemsPerPage}
                      setDirtyState={setDirtyState}
                      setItems={setItems}
                      tableVariant={tableVariant}
                      updateItem={updateItem}
                    />
                  </ConditionalWrapper>
                ))}
              </ConditionalWrapper>
            </EDSTable.Body>
          </EDSTable>
        </SortableContext>
        {functionalityConfig.add && (
          <>
            <AddRowButton
              onClick={() => {
                const saveOnAdd = tableVariant === TableVariantNameEnum.View
                if (!(config.templates && config.templates.length)) {
                  addItem(saveOnAdd)
                  setLastPage()
                } else if (config.templates.length === 1) {
                  addItem(saveOnAdd, undefined, config.templates[0].path)
                  setLastPage()
                } else setTemplateMenuIsOpen(true)
              }}
              ariaLabel={'Add new row'}
            />
            {config.templates?.length && (
              <TemplateMenu
                templates={config.templates}
                onSelect={(template: TTemplate) => {
                  addItem(
                    tableVariant === TableVariantNameEnum.View,
                    undefined,
                    template?.path
                  )
                  setLastPage()
                }}
                onClose={() => setTemplateMenuIsOpen(false)}
                isOpen={isTemplateMenuOpen}
              />
            )}
          </>
        )}
      </Stack>
      <Stack
        direction='row'
        spacing={1}
        justifyContent='space-between'
        style={{ height: '40px' }}
      >
        <Pagination
          count={items?.length || 0}
          rowsPerPage={itemsPerPage}
          setRowsPerPage={setItemsPerPage}
          page={currentPage}
          setPage={setPage}
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
