import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  ErrorResponse,
  IUIPlugin,
  Loading,
  Pagination,
  Stack,
  TGenericObject,
  TViewConfig,
  ViewCreator,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Icon, Input, Table, Tooltip } from '@equinor/eds-core-react'
import { add, minimize } from '@equinor/eds-icons'
import { AxiosError, AxiosResponse } from 'axios'
import { ListItemButton, SaveButton } from './Components'
import { moveItem } from './utils'

type TGenericTablePlugin = {
  editMode: boolean
  columns: string[]
  showDelete: boolean
  editableColumns?: string[]
  functionality: {
    openAsTab: boolean
    openAsExpandable: boolean
    add: boolean
    sort: boolean
    edit: boolean
    delete: boolean
  }
  defaultView: TViewConfig
  views: TViewConfig[]
}
const defaultConfig: TGenericTablePlugin = {
  editMode: true,
  columns: ['name', 'type'],
  showDelete: true,
  editableColumns: [],
  functionality: {
    openAsTab: true,
    openAsExpandable: false,
    add: false,
    sort: false,
    edit: false,
    delete: false,
  },
  defaultView: { type: 'ViewConfig', scope: 'self' },
  views: [],
}

type ITableItemRow = {
  key: string
  data: any
  index: number
  expanded: boolean
}

type GenericTablePluginProps = {
  config?: TGenericTablePlugin
} & IUIPlugin

export const GenericTablePlugin = (props: GenericTablePluginProps) => {
  const { idReference, type, onOpen = () => null } = props
  const config = { ...defaultConfig, ...props.config }
  const functionality = {
    ...defaultConfig.functionality,
    ...props.config.functionality,
  }
  const [items, setItems] = useState<ITableItemRow[]>([])
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const [paginationPage, setPaginationPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [document, loading, , error] = useDocument<TGenericObject[]>(
    idReference,
    2
  )
  const dmssAPI = useDMSS()
  const paginatedRows = items.slice(
    paginationPage * rowsPerPage,
    paginationPage * rowsPerPage + rowsPerPage
  )

  useEffect(() => {
    if (loading || !document) return
    const itemsWithIds = document
      ? Object.values(document)?.map((data, index) => ({
          data,
          expanded: false,
          index,
          key: crypto.randomUUID(),
        }))
      : []

    setItems(itemsWithIds)
  }, [document, loading])

  function deleteItem(reference: string, key: string) {
    const itemIndex = items.findIndex((item) => item.key === key)
    const itemsCopy = [...items]
    itemsCopy.splice(itemIndex, 1)
    setItems(itemsCopy)
    setDirtyState(true)
  }

  function addItem() {
    dmssAPI
      .instantiateEntity({
        entity: { type: type },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        setDirtyState(true)
        setItems([
          ...items,
          {
            key: crypto.randomUUID(),
            data: newEntity.data,
            index: Object.keys(items).length,
            expanded: false,
          },
        ])
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
  }

  function updateItem(
    index: number,
    attribute: string,
    newValue: string | number | boolean
  ) {
    const itemsCopy = [...items]
    itemsCopy[index].data[attribute] = newValue
    setItems(itemsCopy)
    setDirtyState(true)
  }

  function saveTable() {
    setIsSaveLoading(true)
    const payload = items.map((item) => item.data)
    dmssAPI
      .documentUpdate({
        idReference: idReference,
        data: JSON.stringify(payload),
      })
      .then(() => setDirtyState(false))
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
      .finally(() => setIsSaveLoading(false))
  }

  function openItemAsTab(item: TGenericObject, index: number) {
    const view = { label: item?.data?.name, type: 'ViewConfig' }
    onOpen(crypto.randomUUID(), view, `${idReference}[${index}]`)
  }

  function expandItem(index: number) {
    const itemsCopy = [...items]
    itemsCopy[index].expanded = !itemsCopy[index].expanded
    setItems(itemsCopy)
  }

  function getColumnsLength() {
    let amount = config.columns?.length || 0
    if (functionality.delete) amount += 1
    if (functionality.openAsTab || functionality.openAsExpandable) amount += 1
    if (functionality.sort) amount += 1
    return amount
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (loading) return <Loading />

  return (
    <Stack spacing={1}>
      <Table style={{ width: '100%' }}>
        <Table.Head>
          <Table.Row>
            {(functionality?.openAsTab || functionality?.openAsExpandable) && (
              <Table.Cell width="80"></Table.Cell>
            )}
            {config.columns.map((attribute: string) => (
              <Table.Cell key={attribute}>{attribute}</Table.Cell>
            ))}
            {functionality?.delete && (
              <Table.Cell width="48" aria-label="Delete"></Table.Cell>
            )}
            {functionality?.sort && (
              <Table.Cell width="48" aria-label="Sort"></Table.Cell>
            )}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {paginatedRows?.map((item, index) => (
            <>
              <Table.Row key={item.key}>
                {(functionality?.openAsTab ||
                  functionality.openAsExpandable) && (
                  <Table.Cell>
                    <Tooltip
                      title={
                        functionality.openAsExpandable
                          ? item.expanded
                            ? 'Minimize'
                            : 'Expand'
                          : 'Open in new tab'
                      }
                    >
                      <Button
                        variant="ghost_icon"
                        color="secondary"
                        onClick={
                          functionality.openAsExpandable
                            ? () => expandItem(index)
                            : () => openItemAsTab(item, index)
                        }
                      >
                        <Icon data={item.expanded ? minimize : add} />
                      </Button>
                    </Tooltip>
                  </Table.Cell>
                )}
                {config.columns.map((attribute: string) => {
                  if (typeof item.data[attribute] === 'object')
                    throw new Error(
                      `Objects can not be displayed in table. Attribute '${attribute}' is not a primitive type.`
                    )
                  // TODO: Consider having a more robust way of getting type and validating form
                  const attributeType = typeof item.data[attribute]
                  return (
                    <Table.Cell key={attribute}>
                      {functionality?.edit &&
                      config.editableColumns?.includes(attribute) ? (
                        <Input
                          value={item.data[attribute] ?? ''}
                          readOnly={attribute === 'type'}
                          type={attributeType}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            let newValue: string | number | boolean =
                              event.target.value
                            if (attributeType === 'number')
                              newValue = Number(newValue)
                            updateItem(index, attribute, newValue)
                          }}
                        />
                      ) : (
                        item.data?.[attribute]
                      )}
                    </Table.Cell>
                  )
                })}

                {functionality?.delete && (
                  <Table.Cell style={{ textAlign: 'center' }}>
                    <ListItemButton
                      type="delete"
                      onClick={() =>
                        deleteItem(`${idReference}.${index}`, item.key)
                      }
                    />
                  </Table.Cell>
                )}
                {functionality?.sort && (
                  <Table.Cell style={{ width: '48px' }}>
                    <>
                      <ListItemButton
                        type="up"
                        disabled={index === 0}
                        onClick={() => {
                          setItems(moveItem(items, item.key, 'up'))
                          setDirtyState(true)
                        }}
                      />
                      <ListItemButton
                        type="down"
                        disabled={
                          index === rowsPerPage - 1 ||
                          index === items?.length - 1
                        }
                        onClick={() => {
                          setItems(moveItem(items, item.key, 'down'))
                          setDirtyState(true)
                        }}
                      />
                    </>
                  </Table.Cell>
                )}
              </Table.Row>
              {item?.expanded && (
                <Table.Row>
                  <Table.Cell colSpan={getColumnsLength()}>
                    <ViewCreator
                      idReference={`${idReference}[${item.index}]`}
                      viewConfig={
                        config.views?.[item.index] ?? config.defaultView
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              )}
            </>
          ))}
        </Table.Body>
      </Table>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Pagination
          page={paginationPage}
          setPage={setPaginationPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={items?.length || 0}
        />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {functionality?.add && (
            <Button onClick={() => addItem()} variant="outlined">
              <Icon data={add} />
              Add row
            </Button>
          )}
          {(functionality?.edit || functionality?.add) && (
            <SaveButton
              onClick={() => saveTable()}
              disabled={isSaveLoading || !dirtyState}
              isLoading={isSaveLoading}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
