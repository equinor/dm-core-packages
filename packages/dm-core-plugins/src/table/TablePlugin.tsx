import React, { useEffect } from 'react'
import {
  IUIPlugin,
  Loading,
  TTableConfig,
  Table,
  useList,
  TGenericObject,
} from '@development-framework/dm-core'
import * as utils from './utils'

export const TablePlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const config: TTableConfig = utils.mergeConfigs(props.config)

  const {
    items,
    setItems,
    isLoading,
    error,
    dirtyState,
    setDirtyState,
    addItem,
    removeItem,
    save,
  } = useList<TGenericObject>(idReference)

  useEffect(() => {
    console.log("Table plugin mount")
    return () => {
      console.log("Table plugin unmount")
    }
  }, [])

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading) return <Loading />

  return (
    <Table
      addItem={addItem}
      config={config}
      dirtyState={dirtyState}
      idReference={idReference}
      items={items}
      loadingState={isLoading}
      onOpen={props.onOpen}
      removeItem={removeItem}
      saveTable={save}
      setDirtyState={setDirtyState}
      setItems={setItems}
      type={props.type}
    />
  )
}
