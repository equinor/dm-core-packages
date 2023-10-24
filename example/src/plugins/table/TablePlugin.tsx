import {
  EntityPickerDialog,
  IUIPlugin,
  Loading,
  TGenericObject,
  TItem,
  TValidEntity,
  useList,
} from '@development-framework/dm-core'
import React, { useState } from 'react'
import { Button } from '@equinor/eds-core-react'

const TablePlugin = (props: IUIPlugin) => {
  const { idReference } = props

  const {
    items,
    attribute,
    isLoading,
    error,
    addItem,
    updateItem,
    addReference,
    removeItem,
    save,
    dirtyState,
    updateAttribute,
  } = useList<TGenericObject>(idReference)

  const [showAddReferenceModal, setShowAddReferenceModal] =
    useState<boolean>(false)

  if (isLoading) return <Loading />

  if (error) {
    throw new Error(JSON.stringify(error))
  }

  const handleAddReference = () => {
    setShowAddReferenceModal(true)
  }

  return (
    <>
      <h2>Attribute</h2>
      <pre>{JSON.stringify(attribute, null, 2)}</pre>
      <h2>Items ({items?.length})</h2>
      {attribute && !attribute.contained && (
        <Button onClick={() => handleAddReference()}>Add reference</Button>
      )}
      <EntityPickerDialog
        showModal={showAddReferenceModal}
        setShowModal={setShowAddReferenceModal}
        typeFilter={attribute?.attributeType}
        onChange={(address: string, entity: TValidEntity) => {
          addReference(address, entity)
        }}
      />
      {attribute && attribute.contained && (
        <Button onClick={() => addItem()}>Add item</Button>
      )}
      {dirtyState && <Button onClick={() => save()}>Save</Button>}
      <ul>
        {items?.map((item: TItem<TGenericObject>) => {
          return (
            <li key={item.key}>
              <pre>{JSON.stringify(item.data, null, 2)}</pre>
              {attribute && !attribute?.contained && (
                <pre>{JSON.stringify(item.reference, null, 2)}</pre>
              )}
              <Button
                onClick={() =>
                  updateItem(item, { ...item.data, name: 'NewName' })
                }
              >
                Update name
              </Button>
              <Button
                onClick={() =>
                  updateAttribute(item, 'complete', !item.data?.complete)
                }
              >
                Toggle complete
              </Button>
              <Button onClick={() => removeItem(item)}>Remove</Button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export { TablePlugin }
