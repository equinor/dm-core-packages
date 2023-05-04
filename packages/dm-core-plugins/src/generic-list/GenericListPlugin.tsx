import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TViewConfig,
  useDMSS,
  useDocument,
  ViewCreator,
  ErrorResponse,
} from '@development-framework/dm-core'
import { Button, Icon, Typography } from '@equinor/eds-core-react'
import { chevron_down, chevron_right } from '@equinor/eds-icons'
import { AxiosResponse, AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  AppendButton,
  DeleteButton,
  MoveItemDownButton,
  MoveItemUpButton,
  SaveButton,
} from './Components'
import { reorderObject } from './utils'

const TableData = styled.td`
  text-align: center;
`
const TableRow = styled.tr`
  text-align: right;
  border-collapse: collapse;
  cursor: pointer;
`
const Table = styled.table`
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  border-radius: 4px;
  width: 100%;
  bordercollapse: collapse;
`

type TGenericListConfig = {
  expanded: boolean
  headers: string[]
  showDelete: boolean
  defaultView: TViewConfig
  views: TViewConfig[]
}
const defaultConfig: TGenericListConfig = {
  expanded: false,
  headers: ['name', 'type'],
  showDelete: true,
  defaultView: { type: 'ViewConfig', scope: 'self' },
  views: [],
}

export const GenericListPlugin = (
  props: IUIPlugin & { config?: TGenericListConfig }
) => {
  const { idReference, config, type } = props
  const internalConfig = { ...defaultConfig, ...config }
  const [document, loading, , error] = useDocument<TGenericObject[]>(
    idReference,
    2
  )
  const [items, setItems] = useState<{ [key: string]: TGenericObject }>({})
  const [itemsExpanded, setItemsExpanded] = useState<{
    [key: string]: boolean
  }>({})
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => {
    if (loading || !document) return
    // Need to generate a uuid for each item in the list to be used for reacts "key" property
    const itemsWithIds = Object.fromEntries(
      Object.values(document).map((value: any) => [crypto.randomUUID(), value])
    )

    const itemsExpanded = Object.fromEntries(
      Object.keys(itemsWithIds).map((key: string) => [
        key,
        internalConfig.expanded,
      ])
    )
    setItemsExpanded(itemsExpanded)
    setItems(itemsWithIds)
  }, [document, loading])

  const deleteItem = (reference: string, key: string) => {
    setIsLoading(true)
    dmssAPI
      .documentRemove({ idReference: reference })
      .then(() => {
        delete items[key]
        setItems({ ...items })
      })
      .finally(() => setIsLoading(false))
  }
  const addItem = () => {
    dmssAPI
      .instantiateEntity({
        entity: { type: type },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        dmssAPI
          .documentAdd({ absoluteRef: idReference, body: newEntity.data })
          .then(() =>
            setItems({
              ...items,
              [crypto.randomUUID()]: { ...newEntity.data },
            })
          )
          .catch((error: AxiosError<ErrorResponse>) => {
            console.error(error)
            alert(JSON.stringify(error.response?.data, null, 2))
          })
      })
  }

  const save = () => {
    setIsLoading(true)
    dmssAPI
      .documentUpdate({
        idReference: idReference,
        data: JSON.stringify(Object.values(items)),
      })
      .then(() => setUnsavedChanges(false))
      .catch((e: Error) => alert(JSON.stringify(e, null, 2)))
      .finally(() => setIsLoading(false))
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (loading) return <Loading />
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
      }}
    >
      <AppendButton onClick={() => addItem()} />
      <Table>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
            <th></th>
            {internalConfig.headers.map((attribute: string) => (
              <th key={attribute}>
                <Typography group="table" variant={'cell_header'}>
                  {attribute}
                </Typography>
              </th>
            ))}
            <th>
              <Typography group="table" variant={'cell_header'}>
                Controls
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([key, item], index: number) => (
            <React.Fragment key={key}>
              <TableRow>
                <td style={{ textAlign: 'left' }}>
                  <Button
                    variant="ghost_icon"
                    onClick={() =>
                      setItemsExpanded({
                        ...itemsExpanded,
                        [key]: !itemsExpanded[key],
                      })
                    }
                  >
                    <Icon
                      data={itemsExpanded[key] ? chevron_down : chevron_right}
                      title="Expand"
                    />
                  </Button>
                </td>
                {internalConfig.headers.map((attribute: string) => {
                  if (typeof item[attribute] === 'object')
                    throw new Error(
                      `Objects can not be displayed in table header. Attribute '${attribute}' is not a primitive type.`
                    )
                  return (
                    <TableData key={attribute}>
                      <Typography group="table" variant={'cell_text'}>
                        {item[attribute]}
                      </Typography>
                    </TableData>
                  )
                })}
                <td style={{ textAlign: 'right' }}>
                  {internalConfig?.showDelete && (
                    <>
                      <MoveItemUpButton
                        onClick={() => {
                          setItems(reorderObject(key, -1, items))
                          setUnsavedChanges(true)
                        }}
                      />
                      <MoveItemDownButton
                        onClick={() => {
                          setItems(reorderObject(key, 1, items))
                          setUnsavedChanges(true)
                        }}
                      />
                      <DeleteButton
                        onClick={() =>
                          deleteItem(`${idReference}.${index}`, key)
                        }
                      />
                    </>
                  )}
                </td>
              </TableRow>
              <TableRow style={{ cursor: 'initial' }}>
                <td
                  colSpan={4}
                  style={{
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    textAlign: 'initial',
                  }}
                >
                  {itemsExpanded[key] && (
                    // @ts-ignore
                    <ViewCreator
                      idReference={`${idReference}[${index}]`}
                      blueprintAttribute={{
                        name: 'nil',
                        attributeType: type,
                        dimensions: '',
                      }}
                      viewConfig={
                        internalConfig.views[index] ??
                        internalConfig.defaultView
                      }
                    />
                  )}
                </td>
              </TableRow>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <div>
        <SaveButton
          onClick={save}
          disabled={!unsavedChanges}
          isLoading={isLoading}
        />
        <AppendButton onClick={() => addItem()} />
      </div>
    </div>
  )
}
