import {
  ErrorResponse,
  IUIPlugin,
  Loading,
  TGenericObject,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Input, Table } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  AppendButton,
  DeleteButton,
  MoveItemDownButton,
  MoveItemUpButton,
  SaveButton,
} from './Components'
import { reorderObject } from './utils'

type TGenericTablePlugin = {
  editMode: boolean
  columns: string[]
  showDelete: boolean
}
const defaultConfig: TGenericTablePlugin = {
  editMode: true,
  columns: ['name', 'type'],
  showDelete: true,
}

export const GenericTablePlugin = (
  props: IUIPlugin & { config?: TGenericTablePlugin }
) => {
  const { idReference, config, type } = props
  const internalConfig = { ...defaultConfig, ...config }
  const [document, loading, , error] = useDocument<TGenericObject[]>(
    idReference,
    2
  )
  const [items, setItems] = useState<{ [key: string]: TGenericObject }>({})
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => {
    if (loading || !document) return
    // Need to generate a uuid for each item in the list to be used for reacts "key" property
    const itemsWithIds = Object.fromEntries(
      Object.values(document).map((value: any) => [crypto.randomUUID(), value])
    )
    setItems(itemsWithIds)
  }, [document, loading])

  const deleteItem = (reference: string, key: string) => {
    delete items[key]
    setItems({ ...items })
    setDirtyState(true)
  }
  const addItem = () => {
    dmssAPI
      .instantiateEntity({
        entity: { type: type },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        setDirtyState(true)
        setItems({
          ...items,
          [crypto.randomUUID()]: { ...newEntity.data },
        })
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
  }

  const updateItem = (
    key: string,
    attribute: string,
    newValue: string | number | boolean
  ) => {
    items[key][attribute] = newValue
    setItems({ ...items })
    setDirtyState(true)
  }

  const saveTable = () => {
    setIsSaveLoading(true)
    dmssAPI
      .documentUpdate({
        idReference: idReference,
        data: JSON.stringify(Object.values(items)),
      })
      .then(() => setDirtyState(false))
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
      .finally(() => setIsSaveLoading(false))
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
      <Table style={{ width: '100%' }}>
        <Table.Head>
          <Table.Row>
            {internalConfig.columns.map((attribute: string) => (
              <Table.Cell key={attribute}>{attribute}</Table.Cell>
            ))}
            {internalConfig.editMode && internalConfig.showDelete && (
              <Table.Cell>Delete</Table.Cell>
            )}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(items).map(([key, item], index) => (
            <Table.Row key={key}>
              {internalConfig.columns.map((attribute: string) => {
                if (typeof item[attribute] === 'object')
                  throw new Error(
                    `Objects can not be displayed in table. Attribute '${attribute}' is not a primitive type.`
                  )
                // TODO: Consider having a more robust way of getting type and validating form
                const attributeType = typeof item[attribute]
                return (
                  <Table.Cell key={attribute}>
                    <Input
                      value={item[attribute] ?? ''}
                      readOnly={
                        attribute === 'type' || !internalConfig.editMode
                      }
                      type={attributeType}
                      rightAdornments={
                        <>{internalConfig.editMode ? attributeType : ''}</>
                      }
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        let newValue: string | number | boolean =
                          event.target.value
                        if (attributeType === 'number')
                          newValue = Number(newValue)
                        updateItem(key, attribute, newValue)
                      }}
                    />
                  </Table.Cell>
                )
              })}

              <Table.Cell style={{ textAlign: 'right' }}>
                {internalConfig.editMode && internalConfig?.showDelete && (
                  <>
                    <MoveItemUpButton
                      onClick={() => {
                        setItems(reorderObject(key, -1, items))
                        setDirtyState(true)
                      }}
                    />
                    <MoveItemDownButton
                      onClick={() => {
                        setItems(reorderObject(key, 1, items))
                        setDirtyState(true)
                      }}
                    />
                    <DeleteButton
                      onClick={() => deleteItem(`${idReference}.${index}`, key)}
                    />
                  </>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div>
        {internalConfig.editMode && (
          <>
            <SaveButton
              onClick={() => saveTable()}
              disabled={isSaveLoading || !dirtyState}
              isLoading={isSaveLoading}
            />
            <AppendButton onClick={() => addItem()} />
          </>
        )}
      </div>
    </div>
  )
}
