import React, { useEffect, useState } from 'react'
import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useDMSS,
  useDocument,
  TTableRowItem,
  TTableConfig,
  Table,
} from '@development-framework/dm-core'
import * as utils from './utils'

export const TablePlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const config: TTableConfig = utils.mergeConfigs(props.config)
  const [items, setItems] = useState<TTableRowItem[]>([])
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const { document, isLoading, error } = useDocument<TGenericObject[]>(
    idReference,
    1
  )
  const dmssAPI = useDMSS()

  useEffect(() => {
    if (isLoading || !document) return
    if (!Array.isArray(document)) {
      throw new Error(
        `Generic table plugin cannot be used on document that is not an array! Got document ${JSON.stringify(
          document
        )}`
      )
    }
    const itemsWithIds = utils.createItemsFromDocument(document)
    setItems(itemsWithIds)
  }, [document, isLoading])

  async function saveTable(itemsList: TTableRowItem[]) {
    setIsSaveLoading(true)
    const payload = itemsList.map((item) => item.data)
    try {
      const response = await dmssAPI.documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(payload),
      })
      if (response.status === 200) {
        setItems(itemsList)
        setDirtyState(false)
        setIsSaveLoading(false)
      }
    } catch (error) {
      alert(JSON.stringify(error.response?.data))
      setIsSaveLoading(false)
    }
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading) return <Loading />

  return (
    <Table
      config={config}
      dirtyState={dirtyState}
      idReference={idReference}
      items={items}
      loadingState={isSaveLoading}
      onOpen={props.onOpen}
      saveTable={saveTable}
      setDirtyState={setDirtyState}
      setItems={setItems}
      type={props.type}
    />
  )
}
