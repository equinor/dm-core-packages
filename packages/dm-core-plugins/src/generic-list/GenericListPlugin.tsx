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
import { Accordion, Button, Icon } from '@equinor/eds-core-react'
import { delete_to_trash, library_add } from '@equinor/eds-icons'

type TGenericListConfig = {
  expanded: boolean
}
const defaultConfig = {
  expanded: false,
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
  const [items, setItems] = useState<TGenericObject[]>([])
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    if (loading || !document) return
    // Need to generate a uuid for each item in the list to be used for reacts "key" property
    let itemsWithIds = document.map((item: TGenericObject) => ({
      __react_key__: crypto.randomUUID(),
      ...item,
    }))
    setItems(itemsWithIds)
  }, [document, loading])

  const deleteItem = (reference: string, index: number) => {
    dmssAPI.documentRemove({ idReference: reference }).then(() => {
      items.splice(index, 1)
      setItems([...items])
    })
  }
  const addItem = (reference: string, type: string) => {
    dmssAPI
      // TODO: Get type from parent blueprint, be able to select specialised type
      .instantiateEntity({ entity: { type: items[0].type } })
      .then((newEntity: AxiosResponse<any>) => {
        dmssAPI
          .documentAdd({ absoluteRef: reference, body: newEntity.data })
          .then(() =>
            setItems([
              ...items,
              { __react_key__: crypto.randomUUID(), ...newEntity.data },
            ])
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
      <Accordion>
        {items.map((item: any, index: number) => (
          <Accordion.Item
            key={item.__react_key__}
            isExpanded={internalConfig.expanded}
          >
            <Accordion.Header>
              <Accordion.HeaderTitle>
                {`${idReference}.${index}`}
              </Accordion.HeaderTitle>
              <Accordion.HeaderActions>
                <Button
                  variant="ghost_icon"
                  color="danger"
                  onClick={() => deleteItem(`${idReference}.${index}`, index)}
                >
                  <Icon data={delete_to_trash} title="Delete" />
                </Button>
              </Accordion.HeaderActions>
            </Accordion.Header>
            <Accordion.Panel>
              <EntityView
                type={item.type}
                idReference={`${idReference}.${index}`}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
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
