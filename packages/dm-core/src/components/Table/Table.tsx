import React, { useState } from 'react'
import {
  Pagination,
  Stack,
  SortableList,
  ConditionalWrapper,
  SortableItem,
  TGenericObject,
  TTemplate,
} from '../../'
import { Button, Table as EDSTable, Progress } from '@equinor/eds-core-react'
import * as utils from './utils'
import {
  TableProps,
  TTableSortDirection,
  TableVariantNameEnum,
  TTableVariant,
  TTableConfig,
} from './types'
import { TableHead } from './TableHead/TableHead'
import { TableRow } from './TableRow/TableRow'
import { SortableContext } from '../SortableList/SortableContext'
import { TItem } from '../../hooks/useList/types'
import { AddRowButton } from '../AddRowButton'
import { TemplateMenu } from '../TemplateMenu'

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
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] =
    useState<TTableSortDirection>('ascending')
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)

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

  function reorderItems(reorderedItems: TItem<TGenericObject>[]) {
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
                  <SortableList items={items}>{children}</SortableList>
                )}
              >
                {paginatedRows?.map((item, index) => (
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
                      rowsPerPage={rowsPerPage}
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
        {functionalityConfig.add &&
          (!config.templates || config.templates.length < 2) && (
            <AddRowButton
              onClick={() => {
                const defaultTemplate = config?.templates
                  ? config.templates[0]
                  : undefined
                addItem(
                  tableVariant === TableVariantNameEnum.View,
                  undefined,
                  defaultTemplate?.path
                )
              }}
              ariaLabel={'Add new row'}
            />
          )}
        {functionalityConfig.add &&
          config.templates &&
          config.templates.length > 1 && (
            <>
              <AddRowButton
                ariaLabel={'Add new row'}
                onClick={() => setTemplateMenuIsOpen(true)}
              />
              <TemplateMenu
                templates={config.templates}
                onSelect={(template: TTemplate) =>
                  addItem(false, undefined, template?.path)
                }
                onClose={() => setTemplateMenuIsOpen(false)}
                isOpen={isTemplateMenuOpen}
              />
            </>
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
