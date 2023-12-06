import { ErrorResponse } from '../../services'
import { useCallback, useEffect, useState } from 'react'
import { useDMSS } from '../../context/DMSSContext'
import { AxiosError, AxiosResponse, isAxiosError } from 'axios'
import { TAttribute, TLinkReference } from '../../types'
import { EBlueprint } from '../../Enums'
import { IUseListReturnType, TItem } from './types'
import * as utils from './utils'

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

  useEffect(() => {
    if (!attribute) return
    setLoading(true)
    setDirtyState(false)
    dmssAPI
      .documentGet({
        address: idReference,
        depth: 0,
      })
      .then(async (response: AxiosResponse) => {
        if (attribute.contained) {
          if (!Array.isArray(response.data)) {
            throw new Error(
              `Not an array! Got document ${JSON.stringify(response.data)} `
            )
          }
          const items = Object.values(response.data).map((data, index) => ({
            key: crypto.randomUUID() as string,
            index: index,
            data: data,
            reference: null,
            isSaved: true,
          }))
          setItems(items)
          setError(null)
        } else {
          const resolved =
            resolveReferences &&
            (await dmssAPI.documentGet({
              address: idReference,
              depth: 1,
            }))
          const resolvedItems = (resolved ? resolved.data : []) as T[]
          const items = Object.values(response.data).map((data, index) => ({
            key: crypto.randomUUID() as string,
            index: index,
            data: resolveReferences ? resolvedItems[index] : (data as T),
            reference: data as TLinkReference,
            isSaved: true,
          }))
          setItems(items)
          setError(null)
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data || { message: error.name, data: error })
      })
      .finally(() => setLoading(false))
  }, [attribute, refresh])

  const addItem = useCallback(
    async (saveOnAdd: boolean = true, insertAtIndex?: number) => {
      if (!attribute) throw new Error('Missing attribute')
      if (!attribute.contained) {
        throw new Error(
          "Can't add item to a list that has uncontained items, need to use addReference method instead"
        )
      }
      setLoading(true)
      try {
        setDirtyState(true)
        const instantiateResponse = await dmssAPI.instantiateEntity({
          entity: {
            type: attribute?.attributeType,
          },
        })
        const itemsCopy = [...items]
        const newItem: TItem<T> = utils.createNewItemObject(
          instantiateResponse.data,
          insertAtIndex || items.length,
          saveOnAdd
        )
        const index = insertAtIndex !== undefined ? insertAtIndex : items.length
        itemsCopy.splice(index, 0, newItem)
        setItems(itemsCopy)
        if (saveOnAdd) {
          save(itemsCopy)
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
    },
    [attribute, items]
  )

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
      if (saveOnRemove) {
        await dmssAPI.documentRemove({
          address: `${idReference}[${index}]`,
        })
      } else {
        setDirtyState(true)
      }
      const newList = [...items]
      newList.splice(index, 1)
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
      if (saveOnAdd) {
        await dmssAPI.documentAdd({
          address: idReference,
          document: JSON.stringify(reference),
        })
      } else {
        setDirtyState(true)
      }
      const newList = [
        ...items,
        {
          key: newKey,
          index: items?.length,
          data: entity,
          reference: reference,
          isSaved: saveOnAdd,
        },
      ]
      setItems(newList)
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
      if (saveOnUpdate) {
        await dmssAPI.documentUpdate({
          idAddress: address,
          data: JSON.stringify(newDocument),
        })
      } else {
        setDirtyState(true)
      }
      const newList = [...items]
      newList[index].data = newDocument
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
    updateItem,
    save,
    updateAttribute,
    moveItem,
    reloadData,
  }
}
