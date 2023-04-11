import React, {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  AuthContext,
  DmssAPI,
  ErrorResponse,
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { AxiosError, AxiosResponse } from 'axios'
import { Button, Icon, Input, Progress, Table } from '@equinor/eds-core-react'
import { delete_to_trash, library_add } from '@equinor/eds-icons'

const AppendButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}) => (
  <Button variant="ghost_icon" onClick={props.onClick}>
    <Icon data={library_add} title="Append" />
  </Button>
)

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
  const [document, loading, _, error] = useDocument<TGenericObject[]>(
    idReference,
    2
  )
  const [items, setItems] = useState<{ [key: string]: TGenericObject }>({})
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

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

  if (loading) return <Loading />
  if (error) throw new Error(JSON.stringify(error, null, 2))

  return (
    <>
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

                {internalConfig.editMode && internalConfig?.showDelete && (
                  <Table.Cell style={{ textAlign: 'right' }}>
                    <Button
                      variant="ghost_icon"
                      color="danger"
                      onClick={() => deleteItem(`${idReference}.${index}`, key)}
                    >
                      <Icon data={delete_to_trash} title="Delete" />
                    </Button>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div>
          {internalConfig.editMode && (
            <Button
              disabled={isSaveLoading || !dirtyState}
              onClick={() => saveTable()}
            >
              {isSaveLoading ? <Progress.Dots color={'primary'} /> : 'Save'}
            </Button>
          )}
          <AppendButton onClick={() => addItem()} />
        </div>
      </div>
    </>
  )
}
