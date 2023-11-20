import React, { useEffect, useState } from 'react'
import {
  ErrorResponse,
  IUIPlugin,
  Loading,
  Pagination,
  Stack,
  TGenericObject,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Icon, Table } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { AxiosError, AxiosResponse } from 'axios'
import { FormButton } from '../list/Components'
import { defaultConfig, TTablePluginConfig, TTableRowItem } from './types'
import { TableRow } from './TableRow/TableRow'

export const TablePlugin = (props: IUIPlugin) => {
  const { idReference, type, onOpen = () => null } = props
  const config: TTablePluginConfig = {
    ...defaultConfig,
    ...props.config,
    functionality: {
      ...defaultConfig.functionality,
      ...props.config?.functionality,
    },
  }
  const [items, setItems] = useState<TTableRowItem[]>([])
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { document, isLoading, error } = useDocument<TGenericObject[]>(
    idReference,
    1
  )
  const dmssAPI = useDMSS()
  const paginatedRows = items.slice(
    paginationPage * rowsPerPage,
    paginationPage * rowsPerPage + rowsPerPage
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
    const itemsWithIds = document
      ? Object.values(document)?.map((data, index) => ({
          data,
          expanded: false,
          isSaved: true,
          index,
          key: crypto.randomUUID(),
        }))
      : []

    setItems(itemsWithIds)
  }, [document, isLoading])

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
            index: items?.length,
            expanded: false,
            isSaved: false,
          },
        ])
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
  }

  function saveTable() {
    setIsSaveLoading(true)
    const payload = items.map((item) => item.data)
    dmssAPI
      .documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(payload),
      })
      .then(() => {
        const updatedItems: TTableRowItem[] = items.map((item) => {
          return { ...item, isSaved: true }
        })
        setItems(updatedItems)
        setDirtyState(false)
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
      .finally(() => setIsSaveLoading(false))
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading) return <Loading />

  return (
    <Stack spacing={1}>
      <Table style={{ width: '100%' }}>
        <Table.Head>
          <Table.Row>
            {config.functionality?.openAsExpandable && (
              <Table.Cell
                width="80"
                aria-label="Open as expandable"
              ></Table.Cell>
            )}
            {config.columns.map((attribute: string) => (
              <Table.Cell key={attribute}>{attribute}</Table.Cell>
            ))}
            {config.functionality?.openAsTab && (
              <Table.Cell width="48" aria-label="Open in new tab"></Table.Cell>
            )}
            {config.functionality?.delete && (
              <Table.Cell width="48" aria-label="Delete"></Table.Cell>
            )}
            {config.functionality?.sort && (
              <Table.Cell width="48" aria-label="Sort"></Table.Cell>
            )}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {paginatedRows?.map((item, index) => (
            <TableRow
              key={item?.key}
              config={config}
              item={item}
              index={index}
              idReference={idReference}
              items={items}
              setItems={setItems}
              setDirtyState={setDirtyState}
              onOpen={onOpen}
              rowsPerPage={rowsPerPage}
            />
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
          {config.functionality?.add && (
            <Button onClick={() => addItem()} variant="outlined">
              <Icon data={add} />
              Add row
            </Button>
          )}
          {(config.functionality?.edit || config.functionality?.add) && (
            <FormButton
              onClick={() => saveTable()}
              disabled={isSaveLoading || !dirtyState}
              isLoading={isSaveLoading}
              tooltip={'Save'}
            >
              Save
            </FormButton>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
