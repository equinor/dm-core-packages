import {
  type TGenericObject,
  type TItem,
  usePagination,
} from '@development-framework/dm-core'
import {
  Button,
  Table as EDSTable,
  Icon,
  Progress,
} from '@equinor/eds-core-react'
import { useEffect, useState } from 'react'
import {
  AddRowButton,
  Pagination,
  SortableContext,
  SortableItem,
  SortableList,
  Stack,
  type TTemplate,
  TemplateMenu,
} from '../../common'
import { ConditionalWrapper } from '../../utils/ConditionalWrapper'
import { TableHead } from './TableHead/TableHead'
import { TableRow } from './TableRow/TableRow'

import { undo } from '@equinor/eds-icons'
import { SkeletonRow } from './TableRow/SkeletonRow'
import {
  type TTableConfig,
  type TTableSortDirection,
  type TTableVariant,
  type TableProps,
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
    isLoading,
    saveTable,
    reloadData,
  } = props

  const [tableVariant, setTableVariant] = useState<TableVariantNameEnum>(
    config.variant[0].name
  )
  const [sortedItems, setSortedItems] = useState<TItem<TGenericObject>[]>([])
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] =
    useState<TTableSortDirection>('ascending')
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)
  const [addingRow, setAddingRow] = useState<boolean>(false)
  const [deletingRow, setDeletingRow] = useState<string>('')

  useEffect(() => {
    if (isLoading) return
    setAddingRow(false)
    setDeletingRow('')
  }, [isLoading])

  const handleAddItem = (
    saveOnAdd: boolean,
    insertAtIndex?: number | undefined,
    template?: string | undefined
  ) => {
    goToLastPage(1)
    setAddingRow(true)
    addItem(saveOnAdd, insertAtIndex, template)
  }

  const handleRemoveItem = async (
    itemToDelete: TItem<TGenericObject>,
    saveOnRemove?: boolean | undefined
  ) => {
    setDeletingRow(itemToDelete.key)
    removeItem(itemToDelete, saveOnRemove)
  }

  const {
    currentItems,
    itemsPerPage,
    currentPage,
    setItemsPerPage,
    setPage,
    goToLastPage,
  } = usePagination(
    TableVariantNameEnum.Edit === tableVariant
      ? items
      : !sortColumn
        ? items
        : sortedItems,
    10
  )
  const functionalityConfig =
    config.variant.length === 1
      ? config.variant[0].functionality
      : config.variant.find(
          (variant: TTableVariant) => variant.name === tableVariant
        ).functionality

  const showActionsCell =
    config.variant?.length === 2 || functionalityConfig.delete

  /**
   * Start with ascending order if sorting on new column, switch to descending if already sorted, turn off sorting and reset to initial data if sorting was descending
   */
  function sortByColumn(column: string) {
    let newSortColumn: string | undefined = column
    let newSortDirection: TTableSortDirection =
      column !== sortColumn ? 'ascending' : 'descending'
    let newSortItems: TItem<TGenericObject>[]
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
  const columnsLength: number = utils.getColumnsLength(
    config,
    functionalityConfig,
    tableVariant
  )
  return (
    <Stack
      data-testid='table-wrapper'
      style={{
        width: config?.width || '100%',
      }}
      spacing={0.5}
      alignItems='flex-end'
    >
      <Stack
        fullWidth
        style={{
          paddingRight: tableVariant === TableVariantNameEnum.Edit ? 32 : 0,
        }}
      >
        <SortableContext items={items} onReorder={reorderItems}>
          <EDSTable style={{ width: '100%' }}>
            <TableHead
              config={config}
              tableVariant={tableVariant}
              showActionsCell={showActionsCell}
              setTableVariant={setTableVariant}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              sortByColumn={sortByColumn}
              functionalityConfig={functionalityConfig}
            />
            <EDSTable.Body>
              <ConditionalWrapper
                condition={tableVariant === TableVariantNameEnum.Edit}
                wrapper={(children: React.ReactNode) => (
                  <SortableList items={items}>{children}</SortableList>
                )}
              >
                {currentItems?.map((item: any, index) => (
                  <ConditionalWrapper
                    key={item.key}
                    condition={tableVariant === TableVariantNameEnum.Edit}
                    wrapper={(children: React.ReactNode) => (
                      <SortableItem item={item}>{children}</SortableItem>
                    )}
                  >
                    {deletingRow === item.key ? (
                      <SkeletonRow
                        columnsLength={columnsLength}
                        key={item.key}
                      />
                    ) : (
                      <TableRow
                        key={item.key}
                        addItem={addItem}
                        config={config}
                        removeItem={handleRemoveItem}
                        editMode={tableVariant === TableVariantNameEnum.Edit}
                        functionalityConfig={functionalityConfig}
                        idReference={props.idReference}
                        index={items.findIndex(
                          (it: TItem<TGenericObject>) => it.key === item.key
                        )}
                        item={item}
                        items={items}
                        onOpen={props.onOpen}
                        rowsPerPage={itemsPerPage}
                        showActionsCell={showActionsCell}
                        setDirtyState={setDirtyState}
                        setItems={setItems}
                        tableVariant={tableVariant}
                        updateItem={updateItem}
                        disableActions={isLoading}
                      />
                    )}
                  </ConditionalWrapper>
                ))}
              </ConditionalWrapper>
              {((isLoading && !items.length && !deletingRow) || addingRow) && (
                <SkeletonRow
                  columnsLength={columnsLength}
                  count={addingRow ? 1 : 3}
                />
              )}
            </EDSTable.Body>
          </EDSTable>
        </SortableContext>
        {functionalityConfig.add && (
          <>
            <AddRowButton
              onClick={() => {
                const saveOnAdd = tableVariant === TableVariantNameEnum.View
                if (!(config.templates && config.templates.length)) {
                  handleAddItem(saveOnAdd)
                } else if (config.templates.length === 1) {
                  handleAddItem(saveOnAdd, undefined, config.templates[0].path)
                } else setTemplateMenuIsOpen(true)
              }}
              ariaLabel={'Add new row'}
              disabled={isLoading}
            />
            {config.templates?.length && (
              <TemplateMenu
                templates={config.templates}
                onSelect={(template: TTemplate) => {
                  handleAddItem(
                    tableVariant === TableVariantNameEnum.View,
                    undefined,
                    template?.path
                  )
                }}
                onClose={() => setTemplateMenuIsOpen(false)}
                isOpen={isTemplateMenuOpen}
              />
            )}
          </>
        )}
      </Stack>
      <Stack direction='row' spacing={1} justifyContent='flex-end' fullWidth>
        <Pagination
          count={items?.length || 0}
          rowsPerPage={itemsPerPage}
          setRowsPerPage={setItemsPerPage}
          page={currentPage}
          setPage={setPage}
        />
        {tableVariant === TableVariantNameEnum.Edit && reloadData && (
          <Button
            aria-label='Revert changes'
            style={{ overflow: 'hidden' }}
            variant='outlined'
            disabled={isLoading || !props.dirtyState}
            onClick={reloadData}
          >
            <Icon data={undo} size={16} />
          </Button>
        )}
        {tableVariant === TableVariantNameEnum.Edit && (
          <Button
            style={{ overflow: 'hidden' }}
            disabled={isLoading || !props.dirtyState}
            onClick={() => saveTable(items)}
          >
            {isLoading ? <Progress.Dots color={'primary'} /> : 'Save'}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
