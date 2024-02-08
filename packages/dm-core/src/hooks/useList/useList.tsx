import { AxiosError, AxiosResponse, isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { EBlueprint } from '../../Enums'
import { useDMSS } from '../../context/DMSSContext'
import { ErrorResponse } from '../../services'
import { TAttribute, TGenericObject, TLinkReference } from '../../types'
import { resolveRelativeAddressSimplified } from '../../utils/addressUtilities'
import { IUseListReturnType, TItem } from './types'
import * as utils from './utils'
import { useApplication } from '../../context/ApplicationContext'
import { rescopeUsingIdReference } from '../../utils/objectUtilities'
import { TEntityPickerReturn } from '../../components'

export type { TItem }

export function useList<T extends object>(
  idReference: string,
  resolveReferences: boolean = true
): IUseListReturnType<T> {
  const [attribute, setAttribute] = useState<TAttribute | null>(null)
  const [items, setItems] = useState<TItem<T>[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const [refresh, reloadData] = useState()
  const dmssAPI = useDMSS()
  const { selectedEntity, updateEntity } = useApplication()

  useEffect(() => {
    dmssAPI
      .attributeGet({
        address: idReference,
      })
      .then((response: AxiosResponse) => {
        setAttribute(response.data.attribute)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data || { message: error.name, data: error })
      })
  }, [dmssAPI, idReference])

  const scoped = rescopeUsingIdReference(selectedEntity, idReference)

  useEffect(() => {
    if (!attribute) return
    setLoading(true)
    setDirtyState(false)
    async function getEntity() {
      let values: any[] = []

      if (selectedEntity) {
        if (idReference.includes('.')) {
          values = [...scoped]
        }
      }
      const includesReferences = values.some((item) => item.referenceType)
      if (!selectedEntity || includesReferences) {
        const response = await dmssAPI.documentGet({
          address: idReference,
          depth: resolveReferences ? 2 : 0,
        })
        if (!Array.isArray(response.data)) {
          throw new Error(
            `Not an array! Got document ${JSON.stringify(response.data)} `
          )
        }
        values = response.data as any[]
      }

      const items = Object.values(values).map((data, index) => ({
        key: crypto.randomUUID() as string,
        index: index,
        data: data,
        reference: scoped[index],
        isSaved: true,
      }))
      setItems(items)
      setError(null)
      setLoading(false)
    }
    getEntity()
  }, [attribute, refresh, scoped])

  async function addItem(
    saveOnAdd: boolean = true,
    insertAtIndex?: number,
    template?: string
  ) {
    if (!attribute) throw new Error('Missing attribute')
    if (!attribute.contained) {
      throw new Error(
        "Can't add item to a list that has uncontained items, need to use addReference method instead"
      )
    }
    setLoading(true)
    try {
      setDirtyState(true)
      let newEntity: TGenericObject
      if (template) {
        newEntity = (
          await dmssAPI.documentGet({
            address: resolveRelativeAddressSimplified(template, idReference),
            depth: 1,
          })
        ).data
      } else {
        const instantiateResponse = await dmssAPI.instantiateEntity({
          entity: {
            type: attribute?.attributeType,
          },
        })
        newEntity = instantiateResponse.data
      }

      const newItem: TItem<T> = utils.createNewItemObject(
        newEntity,
        insertAtIndex || items.length,
        saveOnAdd
      )

      const itemsCopy = [...items]
      itemsCopy.splice(insertAtIndex || items.length, 0, newItem)
      setItems(itemsCopy)
      if (saveOnAdd) {
        await save(itemsCopy)
        updateEntity(idReference, itemsCopy)
        setDirtyState(false)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (
    itemToDelete: TItem<T>,
    saveOnRemove: boolean = true
  ) => {
    if (!attribute) throw new Error('Missing attribute')
    setLoading(true)
    const index = items.findIndex(
      (item: TItem<T>) => item.key === itemToDelete.key
    )
    try {
      const newList = [...items]
      newList.splice(index, 1)
      if (saveOnRemove) {
        await dmssAPI.documentRemove({
          address: `${idReference}[${index}]`,
        })
        updateEntity(idReference, newList)
      } else {
        setDirtyState(true)
      }
      setItems(newList)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function addReference(
    address: string,
    entity: T | null,
    saveOnAdd: boolean = true
  ) {
    if (!attribute) throw new Error('Missing attribute')
    if (attribute.contained)
      throw new Error(
        "Can't add reference to a list that has contained items, need to use addItem method instead"
      )
    setLoading(true)
    const reference: TLinkReference = {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: address,
    }
    const newKey = crypto.randomUUID() as string
    try {
      const newItems = [
        ...items,
        {
          key: newKey,
          index: items?.length,
          data: entity,
          reference: reference,
          isSaved: saveOnAdd,
        },
      ]
      if (saveOnAdd) {
        await dmssAPI.documentAdd({
          address: idReference,
          document: JSON.stringify(reference),
        })
        updateEntity(idReference, newItems)
      } else {
        setDirtyState(true)
      }
      setItems(newItems)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
    return newKey
  }

  async function addReferences(
    entities: TEntityPickerReturn[],
    saveOnAdd: boolean = true
  ): Promise<string[]> {
    if (!attribute) throw new Error('Missing attribute')
    if (attribute.contained)
      throw new Error(
        "Can't add reference to a list that has contained items, need to use addItem method instead"
      )
    setLoading(true)
    const newItems: TItem<T>[] = []
    for (const { address, entity } of entities) {
      const reference: TLinkReference = {
        type: EBlueprint.REFERENCE,
        referenceType: 'link',
        address: address,
      }
      console.log(reference)
      try {
        if (saveOnAdd) {
          await dmssAPI.documentAdd({
            address: idReference,
            document: JSON.stringify(reference),
          })
        } else {
          setDirtyState(true)
        }
        newItems.push({
          key: crypto.randomUUID(),
          index: items?.length,
          data: entity as T,
          reference: reference,
          isSaved: saveOnAdd,
        })
      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.response?.data || { message: error.name, data: error })
        }
        throw error
      } finally {
        if (saveOnAdd) {
          updateEntity(idReference, newItems)
        }
        setItems([...items, ...newItems])
        setLoading(false)
      }
    }
    return newItems.map((item) => item.key)
  }

  async function updateItem(
    itemToUpdate: TItem<T>,
    newDocument: T,
    saveOnUpdate: boolean = true
  ) {
    if (!attribute) throw new Error('Missing attribute')
    setLoading(true)
    const index = items.findIndex(
      (item: TItem<T>) => item.key === itemToUpdate.key
    )
    const address = attribute?.contained
      ? `${idReference}[${index}]`
      : items[index].reference?.address
    if (!address) throw new Error('Missing address')
    try {
      const newList = [...items]
      newList[index].data = newDocument
      if (saveOnUpdate) {
        await dmssAPI.documentUpdate({
          idAddress: address,
          data: JSON.stringify(newDocument),
        })
        updateEntity(idReference, newList)
      } else {
        setDirtyState(true)
      }
      setItems(newList)
      setError(null)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function save(itemsToSave: TItem<T>[]) {
    setLoading(true)
    const payload = itemsToSave.map((item) =>
      attribute?.contained ? item.data : item.reference
    )
    try {
      await dmssAPI.documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(payload),
      })
      const updatedItems: TItem<T>[] = itemsToSave.map((item) => {
        return { ...item, isSaved: true }
      })
      updateEntity(idReference, payload)
      setItems(updatedItems)
      setDirtyState(false)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function updateAttribute(
    itemToUpdate: TItem<T>,
    attribute: string,
    newValue: any
  ) {
    const newList = [...items]
    const index = items.findIndex(
      (item: TItem<T>) => item.key === itemToUpdate.key
    )
    // @ts-ignore
    newList[index].data[attribute] = newValue
    newList[index].isSaved = false
    setItems(newList)
    setDirtyState(true)
  }

  const moveItem = (itemToMove: TItem<T>, direction: 'up' | 'down') => {
    const itemIndex = items.findIndex((item) => item.key === itemToMove.key)
    const toIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1
    const updatedList = utils.arrayMove(items, itemIndex, toIndex)
    updatedList[itemIndex].index = itemIndex
    updatedList[toIndex].index = toIndex
    setDirtyState(true)
    setItems(updatedList)
  }

  return {
    items,
    setItems,
    attribute,
    isLoading,
    error,
    dirtyState,
    setDirtyState,
    addItem,
    removeItem,
    addReference,
    addReferences,
    updateItem,
    save,
    updateAttribute,
    moveItem,
    reloadData,
  }
}
