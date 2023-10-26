import { ErrorResponse } from '../services'
import { useEffect, useState } from 'react'
import { useDMSS } from '../context/DMSSContext'
import { AxiosError, AxiosResponse, isAxiosError } from 'axios'
import { TAttribute, TLinkReference } from '../types'
import { toast } from 'react-toastify'
import { EBlueprint } from '../Enums'

export type TItem<T> = {
  key: string
  index: number
  data: T
  reference: TLinkReference | null
  isSaved: boolean
}

interface IUseListReturnType<T> {
  items: TItem<T>[]
  attribute: TAttribute | null
  isLoading: boolean
  addItem: (saveOnAdd?: boolean) => Promise<void>
  updateItem: (itemToUpdate: TItem<T>, newDocument: T) => Promise<void>
  removeItem: (itemToDelete: TItem<T>, saveOnRemove?: boolean) => Promise<void>
  error: ErrorResponse | null
  addReference: (
    address: string,
    entity: T,
    saveOnAdd?: boolean
  ) => Promise<string>
  save: () => Promise<void>
  updateAttribute: (
    itemToUpdate: TItem<T>,
    attribute: string,
    newValue: any,
    saveOnUpdate?: boolean
  ) => void
  dirtyState: boolean
  moveItem: (itemToMove: TItem<T>, direction: 'up' | 'down') => void
}

function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export function useList<T extends object>(
  idReference: string
): IUseListReturnType<T> {
  const [attribute, setAttribute] = useState<TAttribute | null>(null)
  const [items, setItems] = useState<TItem<T>[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => {
    dmssAPI
      .attributeGet({
        address: idReference,
      })
      .then((response: AxiosResponse) => {
        setAttribute(response.data.attribute)
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false))
  }, [dmssAPI, idReference])

  useEffect(() => {
    if (!attribute) return
    if (!items) throw new Error('Missing items')
    setLoading(true)

    const effect = async () => {
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
              key: crypto.randomUUID(),
              index: index,
              data: data,
              reference: null,
              isSaved: true,
            }))
            // @ts-ignore
            setItems(items)
            setError(null)
          } else {
            const resolved = await dmssAPI.documentGet({
              address: idReference,
              depth: 1,
            })
            if (Array.isArray(resolved.data)) {
              const items = Object.values(response.data).map((data, index) => ({
                key: crypto.randomUUID(),
                index: index,
                // @ts-ignore
                data: resolved.data[index],
                reference: data,
                isSaved: true,
              }))
              // @ts-ignore
              setItems(items)
              setError(null)
            }
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error)
          setError(error.response?.data || { message: error.name, data: error })
        })
        .finally(() => setLoading(false))
    }

    effect()
  }, [attribute])

  const addItem = async (saveOnAdd: boolean = true) => {
    if (!attribute) throw new Error('Missing attribute')
    if (!items) throw new Error('Missing items')
    if (!attribute.contained)
      throw new Error(
        "Can't add item to a list that has uncontained items, need to use addReference method instead"
      )
    setLoading(true)
    try {
      const newEntity = await dmssAPI.instantiateEntity({
        entity: {
          type: attribute?.attributeType,
        },
      })
      if (saveOnAdd) {
        await dmssAPI.documentAdd({
          address: idReference,
          document: JSON.stringify(newEntity.data),
        })
      } else {
        setDirtyState(true)
      }
      const newList = [
        ...items,
        {
          key: crypto.randomUUID(),
          index: items?.length,
          data: newEntity.data,
          reference: null,
          isSaved: saveOnAdd,
        },
      ]
      // @ts-ignore
      setItems(newList)
    } catch (error) {
      if (isAxiosError(error)) {
        alert(JSON.stringify(error.response?.data))
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
    if (!items) throw new Error('Missing items')
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
        alert(JSON.stringify(error.response?.data))
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const addReference = async (
    address: string,
    entity: T,
    saveOnAdd: boolean = true
  ) => {
    if (!attribute) throw new Error('Missing attribute')
    if (!items) throw new Error('Missing items')
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
        alert(JSON.stringify(error.response?.data))
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
    return newKey
  }

  const updateItem = async (
    itemToUpdate: TItem<T>,
    newDocument: T,
    saveOnUpdate: boolean = true
  ) => {
    if (!attribute) throw new Error('Missing attribute')
    if (!items) throw new Error('Missing items')
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
          data: JSON.stringify(newDocument)
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
        alert(JSON.stringify(error.response?.data))
        setError(error.response?.data || { message: error.name, data: error })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    // TODO: Updating data of uncontained items
    if (!items) throw new Error('Missing items')
    setLoading(true)
    const payload = items.map((item) =>
      attribute?.contained ? item.data : item.reference
    )
    dmssAPI
      .documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(Object.values(payload)),
      })
      .then(() => {
        const updatedItems: TItem<T>[] = items.map((item) => {
          return { ...item, isSaved: true }
        })
        setItems(updatedItems)
        setDirtyState(false)
      })
      .catch((e: Error) => toast.error(JSON.stringify(e, null, 2)))
      .finally(() => setLoading(false))
  }

  const updateAttribute = (
    itemToUpdate: TItem<T>,
    attribute: string,
    newValue: any
  ) => {
    if (!items) return
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
    const updatedList = arrayMove(items, itemIndex, toIndex)
    setItems(updatedList)
  }

  return {
    items,
    attribute,
    isLoading,
    error,
    dirtyState,
    addItem,
    removeItem,
    addReference,
    updateItem,
    save,
    updateAttribute,
    moveItem,
  }
}
