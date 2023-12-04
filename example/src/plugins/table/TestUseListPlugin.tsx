import {
  EntityPickerDialog,
  IUIPlugin,
  Loading,
  Pagination,
  TGenericObject,
  TItem,
  TValidEntity,
  useList,
} from '@development-framework/dm-core'
import React, { useMemo, useState } from 'react'
import { Button } from '@equinor/eds-core-react'

const TestUseListPlugin = (props: IUIPlugin) => {
  const { idReference: address } = props

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
  } = useList<TGenericObject>(address)

  const [paginationPage, setPaginationPage] = useState(0)
  const [paginationRowsPerPage, setPaginationRowsPerPage] = useState(10)
  const paginatedRows = useMemo(
    () =>
      items?.slice(
        paginationPage * paginationRowsPerPage,
        paginationPage * paginationRowsPerPage + paginationRowsPerPage
      ),
    [paginationPage, paginationRowsPerPage, items]
  )

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
      <h2>Items ({paginatedRows?.length})</h2>
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
      {attribute?.contained && (
        <Button onClick={() => addItem()}>Add item</Button>
      )}
      {dirtyState && <Button onClick={() => save(items)}>Save</Button>}
      <ul>
        {paginatedRows?.map((item: TItem<TGenericObject>) => {
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
      {items && (
        <Pagination
          count={Object.keys(items).length}
          page={paginationPage}
          setPage={setPaginationPage}
          rowsPerPage={paginationRowsPerPage}
          setRowsPerPage={setPaginationRowsPerPage}
        />
      )}
    </>
  )
}

export { TestUseListPlugin }
