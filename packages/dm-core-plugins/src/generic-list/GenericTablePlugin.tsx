import {
  ErrorResponse,
  IUIPlugin,
  Loading,
  TGenericObject,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Icon, Input, Table } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  DeleteButton,
  MoveItemDownButton,
  MoveItemUpButton,
  SaveButton,
} from './Components'
import { reorderObject } from './utils'
import { add } from '@equinor/eds-icons'

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
        width: '100%',
      }}
    >
      <Table style={{ width: '100%' }}>
        <Table.Head>
          <Table.Row>
            {internalConfig.editMode && (
              <Table.Cell aria-label="Controls"></Table.Cell>
            )}
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
              <Table.Cell style={{ width: '48px', padding: '0.25rem 0.5rem' }}>
                {internalConfig.editMode && (
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
                  </>
                )}
              </Table.Cell>
              {internalConfig.columns.map((attribute: string) => {
                if (typeof item[attribute] === 'object')
                  throw new Error(
                    `Objects can not be displayed in table. Attribute '${attribute}' is not a primitive type.`
                  )
                // TODO: Consider having a more robust way of getting type and validating form
                const attributeType = typeof item[attribute]
                return (
                  <Table.Cell
                    key={attribute}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
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

              <Table.Cell
                style={{ textAlign: 'center', padding: '0.25rem 0.5rem' }}
              >
                {internalConfig.editMode && internalConfig?.showDelete && (
                  <DeleteButton
                    onClick={() => deleteItem(`${idReference}.${index}`, key)}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          marginTop: '0.5rem',
        }}
      >
        {internalConfig.editMode && (
          <>
            <Button onClick={() => addItem()} variant="outlined">
              <Icon data={add} />
              Add row
            </Button>
            <SaveButton
              onClick={() => saveTable()}
              disabled={isSaveLoading || !dirtyState}
              isLoading={isSaveLoading}
            />
          </>
        )}
      </div>
    </div>
  )
}
