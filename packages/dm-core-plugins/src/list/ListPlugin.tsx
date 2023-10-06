import React, { useEffect, useState } from 'react'
import {
  ErrorResponse,
  IUIPlugin,
  Loading,
  Pagination,
  Stack,
  TGenericObject,
  TViewConfig,
  useDMSS,
  useDocument,
  ViewCreator,
} from '@development-framework/dm-core'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import { AppendButton, ListItemButton, SaveButton } from './Components'
import { moveItem } from './utils'
import { add, minimize } from '@equinor/eds-icons'

type TListConfig = {
  expanded?: boolean
  openInline: boolean
  headers: string[]
  defaultView: TViewConfig
  views: TViewConfig[]
  functionality: {
    openAsTab: boolean
    openAsExpandable: boolean
    add: boolean
    sort: boolean
    delete: boolean
  }
}
const defaultConfig: TListConfig = {
  expanded: false,
  openInline: false,
  headers: ['name', 'type'],
  defaultView: { type: 'ViewConfig', scope: 'self' },
  views: [],
  functionality: {
    openAsTab: true,
    openAsExpandable: false,
    add: false,
    sort: false,
    delete: false,
  },
}

type ItemRow = {
  key: string
  data: TGenericObject
  index: number
  expanded: boolean
  isSaved: boolean
}

export const ListPlugin = (props: IUIPlugin & { config?: TListConfig }) => {
  const { idReference, config, type, onOpen = () => null } = props
  const internalConfig: TListConfig = {
    ...defaultConfig,
    ...config,
    functionality: { ...defaultConfig.functionality, ...config.functionality },
  }
  const { document, isLoading, error } = useDocument<TGenericObject[]>(
    idReference,
    1
  )
  const [items, setItems] = useState<ItemRow[]>([])
  const [paginationPage, setPaginationPage] = useState(0)
  const [paginationRowsPerPage, setPaginationRowsPerPage] = useState(10)
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  const paginatedRows = items.slice(
    paginationPage * paginationRowsPerPage,
    paginationPage * paginationRowsPerPage + paginationRowsPerPage
  )

  useEffect(() => {
    if (isLoading || !document) return
    else if (!Array.isArray(document)) {
      throw new Error(
        `Generic table plugin cannot be used on document that is not an array! Got document ${JSON.stringify(
          document
        )} `
      )
    }
    // Need to generate a uuid for each item in the list to be used for reacts "key" property
    const itemsWithIds = document
      ? Object.values(document).map((data, index) => ({
          data,
          expanded: internalConfig.expanded ?? false,
          isSaved: true,
          index,
          key: crypto.randomUUID(),
        }))
      : []

    setItems(itemsWithIds)
  }, [document, isLoading])

  function deleteItem(reference: string, key: string) {
    const itemIndex = items.findIndex((item) => item.key === key)
    const itemsCopy = [...items]
    itemsCopy.splice(itemIndex, 1)
    setItems(itemsCopy)
    setUnsavedChanges(true)
  }

  function addItem() {
    setUnsavedChanges(true)
    dmssAPI
      .instantiateEntity({
        entity: { type: type },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        setItems([
          ...items,
          {
            key: crypto.randomUUID(),
            data: newEntity.data,
            index: Object.keys(items).length,
            expanded: internalConfig.expanded ?? false,
            isSaved: false,
          },
        ])
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        alert(JSON.stringify(error.response?.data, null, 2))
      })
  }

  function save() {
    setIsLoading(true)
    const payload = items.map((item) => item.data)
    dmssAPI
      .documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(Object.values(payload)),
      })
      .then(() => {
        const updatedItems: ItemRow[] = items.map((item) => {
          return { ...item, isSaved: true }
        })
        setItems(updatedItems)
        setUnsavedChanges(false)
      })
      .catch((e: Error) => alert(JSON.stringify(e, null, 2)))
      .finally(() => setIsLoading(false))
  }

  function openItemAsTab(item: TGenericObject) {
    const view = { label: item?.data?.name, type: 'ViewConfig' }
    onOpen(crypto.randomUUID(), view, `${idReference}[${item.index}]`)
  }

  function expandItem(index: number) {
    const itemsCopy = [...items]
    itemsCopy[index].expanded = !itemsCopy[index].expanded
    setItems(itemsCopy)
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading) return <Loading />

  return (
    <Stack>
      {paginatedRows.map((item, index) => (
        <React.Fragment key={item?.key}>
          <Stack
            direction="row"
            role="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
            style={{
              padding: '0.25rem 0.5rem',
              borderBottom: '1px solid #ccc',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={
                  internalConfig.openInline
                    ? item.expanded
                      ? 'Minimize'
                      : 'Expand'
                    : 'Open in new tab'
                }
              >
                <Button
                  variant="ghost_icon"
                  color="secondary"
                  disabled={!item.isSaved}
                  onClick={
                    internalConfig.openInline
                      ? () => expandItem(index)
                      : () => openItemAsTab(item)
                  }
                >
                  <Icon
                    data={item.expanded ? minimize : add}
                    title={item.expanded ? 'Close item' : 'Open item'}
                  />
                </Button>
              </Tooltip>
              {internalConfig.headers.map(
                (attribute: string, index: number) => {
                  if (item.data && item.data?.[attribute]) {
                    if (typeof item.data[attribute] === 'object')
                      throw new Error(
                        `Objects can not be displayed in table header. Attribute '${attribute}' is not a primitive type.`
                      )
                    return (
                      <Typography
                        key={attribute}
                        variant="body_short"
                        bold={index === 0}
                      >
                        {item?.data[attribute]}
                      </Typography>
                    )
                  }
                }
              )}
            </Stack>
            <Stack direction="row" alignItems="center">
              {internalConfig?.functionality?.delete && (
                <>
                  <ListItemButton
                    disabled={index === 0}
                    onClick={() => {
                      setItems(moveItem(items, item.key, 'up'))
                      setUnsavedChanges(true)
                    }}
                    type="up"
                  />
                  <ListItemButton
                    type="down"
                    disabled={
                      index === paginationRowsPerPage - 1 ||
                      index === items?.length - 1
                    }
                    onClick={() => {
                      setItems(moveItem(items, item.key, 'down'))
                      setUnsavedChanges(true)
                    }}
                  />
                  <ListItemButton
                    type="delete"
                    onClick={() =>
                      deleteItem(`${idReference}[${item.index}]`, item.key)
                    }
                  />
                </>
              )}
            </Stack>
          </Stack>
          <Stack>
            {item?.expanded && (
              <ViewCreator
                idReference={`${idReference}[${item.index}]`}
                viewConfig={
                  internalConfig.views[item.index] ?? internalConfig.defaultView
                }
              />
            )}
          </Stack>
        </React.Fragment>
      ))}

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        style={{ padding: '1rem 0' }}
      >
        <Pagination
          count={Object.keys(items).length}
          page={paginationPage}
          setPage={setPaginationPage}
          rowsPerPage={paginationRowsPerPage}
          setRowsPerPage={setPaginationRowsPerPage}
        />
        <Stack direction="row" spacing={1}>
          <AppendButton onClick={() => addItem()} />
          <SaveButton
            onClick={save}
            disabled={!unsavedChanges}
            isLoading={isLoading}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
