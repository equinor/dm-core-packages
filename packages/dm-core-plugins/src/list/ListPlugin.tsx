import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  ApplicationContext,
  EBlueprint,
  EntityPickerDialog,
  ErrorResponse,
  IUIPlugin,
  Loading,
  Pagination,
  Stack,
  TGenericObject,
  TValidEntity,
  TViewConfig,
  useDMSS,
  useDocument,
  ViewCreator,
} from '@development-framework/dm-core'
import { toast } from 'react-toastify'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import { AppendButton, ListItemButton, SaveButton } from './Components'
import { moveItem } from './utils'
import { add, link, minimize } from '@equinor/eds-icons'
type TListConfig = {
  expanded?: boolean
  headers: string[]
  defaultView: TViewConfig
  views: TViewConfig[]
  openAsTab: boolean
  selectFromScope?: string
  functionality: {
    add: boolean
    sort: boolean
    delete: boolean
  }
}
const defaultConfig: TListConfig = {
  expanded: false,
  headers: ['name', 'type'],
  defaultView: { type: 'ViewConfig', scope: 'self' },
  views: [],
  openAsTab: false,
  selectFromScope: undefined,
  functionality: {
    add: true,
    sort: true,
    delete: true,
  },
}

type ItemRow = {
  key: string
  resolvedData: TGenericObject // Document fetched with depth=1 (need data for showing headers)
  rawData: TGenericObject // Document fetched with depth=0 (need references to modify the list)
  index: number
  expanded: boolean
  isSaved: boolean
}

export const ListPlugin = (props: IUIPlugin & { config?: TListConfig }) => {
  const { idReference, config, type, onOpen } = props
  const internalConfig: TListConfig = {
    ...defaultConfig,
    ...config,
    functionality: { ...defaultConfig.functionality, ...config.functionality },
  }
  // Get the list, without resolving references. Need these when saving the list.
  const { document: rawDocument, isLoading: isRawDocumentLoading } =
    useDocument<TGenericObject[]>(idReference, 0)
  const {
    document,
    isLoading: isLoadingDocument,
    error,
  } = useDocument<TGenericObject[]>(idReference, 1)
  const [items, setItems] = useState<ItemRow[]>([])
  const [paginationPage, setPaginationPage] = useState(0)
  const [paginationRowsPerPage, setPaginationRowsPerPage] = useState(10)
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAttributeLoading, setIsAttributeLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const dmssAPI = useDMSS()
  const { name: applicationContext } = useContext(ApplicationContext)
  const [isListOfReferences, setIsListOfReferences] = useState<boolean>(false)

  const paginatedRows = useMemo(
    () =>
      items.slice(
        paginationPage * paginationRowsPerPage,
        paginationPage * paginationRowsPerPage + paginationRowsPerPage
      ),
    [paginationPage, paginationRowsPerPage, items]
  )
  useEffect(() => {
    setIsAttributeLoading(true)
    dmssAPI
      .attributeGet({
        address: idReference,
      })
      .then((response: AxiosResponse) => {
        setIsListOfReferences(!response.data.contained ?? false)
      })
      .catch((error) => toast.error(error))
      .finally(() => setIsAttributeLoading(false))
  }, [dmssAPI, applicationContext, idReference])

  useEffect(() => {
    if (isLoadingDocument || !document || !rawDocument) return
    else if (!Array.isArray(document)) {
      throw new Error(
        `Generic table plugin cannot be used on document that is not an array! Got document ${JSON.stringify(
          document
        )} `
      )
    }
    // Need to generate an uuid for each item in the list to be used for reacts "key" property
    const itemsWithIds = document
      ? Object.values(document).map((data, index) => ({
          resolvedData: data,
          rawData: rawDocument[index],
          expanded: internalConfig.expanded ?? false,
          isSaved: true,
          index,
          key: crypto.randomUUID(),
        }))
      : []
    setItems(itemsWithIds)
  }, [document, isLoadingDocument])

  function deleteItem(reference: string, key: string) {
    const itemIndex = items.findIndex((item) => item.key === key)
    const itemsCopy = [...items]
    itemsCopy.splice(itemIndex, 1)
    setItems(itemsCopy)
    setUnsavedChanges(true)
  }

  async function addItem() {
    if (isListOfReferences) {
      setShowModal(true)
      return
    }

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
            resolvedData: newEntity.data,
            rawData: newEntity.data,
            index: Object.keys(items).length,
            expanded: internalConfig.expanded ?? false,
            isSaved: false,
          },
        ])
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(JSON.stringify(error.response?.data, null, 2))
      })
  }

  function save() {
    setIsLoading(true)
    const payload = items.map((item) => item.rawData) // Make sure we save with "rawDate" i.e. references
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
      .catch((e: Error) => toast.error(JSON.stringify(e, null, 2)))
      .finally(() => setIsLoading(false))
  }

  function openItemAsTab(item: TGenericObject) {
    const view = { label: item?.data?.name, type: 'ViewConfig' }
    if (!onOpen) {
      toast.error(
        'Invalid UiRecipes. The list plugin was not passed an "onOpen()"-function.'
      )
      return
    }
    onOpen(crypto.randomUUID(), view, `${idReference}[${item.index}]`)
  }

  function expandItem(index: number) {
    const itemsCopy = [...items]
    itemsCopy[index].expanded = !itemsCopy[index].expanded
    setItems(itemsCopy)
    console.log(items[index])
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoadingDocument || isAttributeLoading || isRawDocumentLoading)
    return <Loading />

  return (
    <Stack>
      <EntityPickerDialog
        showModal={showModal}
        setShowModal={setShowModal}
        typeFilter={type}
        scope={config.selectFromScope}
        onChange={(address: string, entity: TValidEntity) => {
          setUnsavedChanges(true)
          setItems([
            ...items,
            {
              key: crypto.randomUUID(),
              resolvedData: entity,
              rawData: {
                type: EBlueprint.REFERENCE,
                referenceType: 'link',
                address: address,
              },
              index: Object.keys(items).length,
              expanded: internalConfig.expanded ?? false,
              isSaved: false,
            },
          ])
        }}
      />
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
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip
                title={
                  !internalConfig.openAsTab
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
                  data-testid={`expandListItem-${index}`}
                  onClick={
                    !internalConfig.openAsTab
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
              {isListOfReferences && <Icon data={link} />}
              {internalConfig.headers.map(
                (attribute: string, index: number) => {
                  if (item.resolvedData && item.resolvedData?.[attribute]) {
                    if (typeof item.resolvedData[attribute] === 'object')
                      throw new Error(
                        `Objects can not be displayed in table header. Attribute '${attribute}' is not a primitive type.`
                      )
                    return (
                      <Typography
                        key={attribute}
                        variant="body_short"
                        bold={index === 0}
                      >
                        {item?.resolvedData[attribute]}
                      </Typography>
                    )
                  }
                }
              )}
            </Stack>
            <Stack direction="row" alignItems="center">
              {internalConfig.functionality.sort && (
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
                </>
              )}
              {internalConfig.functionality.delete && (
                <ListItemButton
                  type="delete"
                  onClick={() =>
                    deleteItem(`${idReference}[${item.index}]`, item.key)
                  }
                />
              )}
            </Stack>
          </Stack>
          <Stack>
            {item?.expanded && (
              <ViewCreator
                idReference={
                  isListOfReferences
                    ? item.rawData.address
                    : `${idReference}[${item.index}]`
                }
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
          {internalConfig.functionality.add && (
            <AppendButton onClick={() => addItem()} />
          )}
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
