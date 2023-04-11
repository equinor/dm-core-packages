import React, { useContext, useEffect, useState } from 'react'
import {
  AuthContext,
  DmssAPI,
  EntityView,
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { AxiosResponse } from 'axios'
import { Button, Icon } from '@equinor/eds-core-react'
import {
  chevron_down,
  chevron_right,
  delete_to_trash,
  library_add,
} from '@equinor/eds-icons'

import styled from 'styled-components'

const TableData = styled.td`
  text-align: right;
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
}
const defaultConfig: TGenericListConfig = {
  expanded: false,
  headers: ['name'],
  showDelete: true,
}

export const GenericListPlugin = (
  props: IUIPlugin & { config?: TGenericListConfig }
) => {
  const { idReference, config } = props
  const internalConfig = { ...defaultConfig, ...config }
  const [document, loading, _, error] = useDocument<TGenericObject[]>(
    idReference,
    2
  )
  const [items, setItems] = useState<{ [key: string]: TGenericObject }>({})
  const [itemsExpanded, setItemsExpanded] = useState<{
    [key: string]: boolean
  }>({})
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

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
    dmssAPI.documentRemove({ idReference: reference }).then(() => {
      delete items[key]
      setItems({ ...items })
    })
  }
  const addItem = (reference: string, type: string) => {
    dmssAPI
      // TODO: Get type from parent blueprint, be able to select specialised type
      .instantiateEntity({
        entity: { type: items[Object.keys(items)[0]].type },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        dmssAPI
          .documentAdd({ absoluteRef: reference, body: newEntity.data })
          .then(() =>
            setItems({
              ...items,
              [crypto.randomUUID()]: { ...newEntity.data },
            })
          )
      })
  }

  if (loading) return <Loading />
  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (!items) return <Loading />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          variant="ghost_icon"
          onClick={() => addItem(idReference, 'type')}
        >
          <Icon data={library_add} title="Append" />
        </Button>
      </div>
      <Table>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
            <th></th>
            {internalConfig.headers.map((attribute: string) => (
              <th>{attribute}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([key, item], index: number) => (
            <React.Fragment key={key}>
              <TableRow
                onClick={() =>
                  setItemsExpanded({
                    ...itemsExpanded,
                    [key]: !itemsExpanded[key],
                  })
                }
              >
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
                      title="Delete"
                    />
                  </Button>
                </td>
                {internalConfig.headers.map((attribute: string) => {
                  if (typeof item[attribute] === 'object')
                    throw new Error(
                      `Objects can not be displayed in table header. Attribute '${attribute}' is not a primitive type.`
                    )
                  return (
                    <td style={{ textAlign: 'center' }}>{item[attribute]}</td>
                  )
                })}
                <TableData>
                  {internalConfig?.showDelete && (
                    <Button
                      variant="ghost_icon"
                      color="danger"
                      onClick={() => deleteItem(`${idReference}.${index}`, key)}
                    >
                      <Icon data={delete_to_trash} title="Delete" />
                    </Button>
                  )}
                </TableData>
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
                    <EntityView
                      type={item.type}
                      idReference={`${idReference}.${index}`}
                    />
                  )}
                </td>
              </TableRow>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          variant="ghost_icon"
          onClick={() => addItem(idReference, 'type')}
        >
          <Icon data={library_add} title="Append" />
        </Button>
      </div>
    </>
  )
}
