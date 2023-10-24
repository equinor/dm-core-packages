import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useList,
} from '@development-framework/dm-core'
import React from 'react'
import { Button } from '@equinor/eds-core-react'

const TablePlugin = (props: IUIPlugin) => {
  const { idReference } = props

  const { list, attribute, isLoading, error, addItem, removeItem } =
    useList<TGenericObject[]>(idReference)

  if (isLoading) return <Loading />

  if (error) {
    throw new Error(JSON.stringify(error))
  }

  return (
    <>
      <Button onClick={() => addItem()}>Add</Button>
      <Button onClick={() => removeItem(2)}>Remove item 2</Button>
      <div>{attribute?.attributeType || ''}</div>
      <div>{list?.length}</div>
    </>
  )
}

export { TablePlugin }
