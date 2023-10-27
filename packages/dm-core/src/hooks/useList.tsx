import { ErrorResponse } from '../services'
import { useEffect, useState } from 'react'
import { useDMSS } from '../context/DMSSContext'
import { AxiosError, AxiosResponse } from 'axios'
import {
  TAttribute,
  TGenericObject,
  TLinkReference,
  TValidEntity,
} from '../types'
import { toast } from 'react-toastify'
import { EBlueprint } from '../Enums'

export type TItem<T> = {
  key: string
  index: number
  data: T
  reference: TLinkReference | null
}

interface IUseListReturnType<T> {
  items: TItem<T>[] | null
  attribute: TAttribute | null
  isLoading: boolean
  addItem: () => Promise<void>
  updateItem: (itemToUpdate: TItem<T>, newDocument: T) => Promise<void>
  removeItem: (itemToDelete: TItem<T>) => Promise<void>
  error: ErrorResponse | null
  addReference: (address: string, entity: TValidEntity) => Promise<void>
  save: () => Promise<void>
  updateAttribute: (
    itemToUpdate: TItem<T>,
    attribute: string,
    newValue: any
  ) => void
  dirtyState: boolean
}

export function useList<T>(idReference: string): IUseListReturnType<T> {
  const [attribute, setAttribute] = useState<TAttribute | null>(null)
  const [items, setItems] = useState<TItem<T>[] | null>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => {
    dmssAPI
      .attributeGet({
        address: idReference,
        resolve: false,
      })
      .then((response: AxiosResponse) => {
        setAttribute(response.data.attribute)
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false))
  }, [dmssAPI, idReference])

  useEffect(() => {
    if (!attribute) return
    setLoading(true)
    dmssAPI
      .documentGet({
        address: idReference,
        depth: 0,
      })
      .then(async (response: AxiosResponse) => {
        if (attribute.contained) {
          const items = Object.values(response.data).map((data, index) => ({
            key: crypto.randomUUID(),
            index: index,
            data: data,
            reference: null,
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
  }, [attribute])

  const addItem = async () => {
    if (!attribute?.type || !items) return
    if (!attribute.contained)
      throw new Error(
        "Can't add item to a list that has uncontained items, need to use addReference method instead"
      )
    setLoading(true)
    dmssAPI
      .instantiateEntity({
        entity: { type: attribute?.attributeType },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        dmssAPI
          .documentAdd({
            address: idReference,
            document: JSON.stringify(newEntity.data),
          })
          .then(() => {
            const newList = [
              ...items,
              {
                key: crypto.randomUUID(),
                index: items?.length,
                data: newEntity.data,
                reference: null,
              },
            ]
            // @ts-ignore
            setItems(newList)
          })
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
      .finally(() => setLoading(false))
  }

  const removeItem = async (itemToDelete: TItem<T>) => {
    if (!attribute?.type || !items) return
    setLoading(true)
    const index = items.findIndex(
      (item: TItem<T>) => item.key === itemToDelete.key
    )
    dmssAPI
      .documentRemove({
        address: `${idReference}[${index}]`,
      })
      .then(() => {
        const newList = [...items]
        newList.splice(index, 1)
        setItems(newList)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
      .finally(() => setLoading(false))
  }

  const addReference = async (address: string, entity: TValidEntity) => {
    if (!attribute?.type || !items) return
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
    dmssAPI
      .documentAdd({
        address: idReference,
        document: JSON.stringify(reference),
      })
      .then(() => {
        const newList = [
          ...items,
          {
            key: crypto.randomUUID(),
            index: items?.length,
            data: entity,
            reference: reference,
          },
        ]
        // @ts-ignore
        setItems(newList)
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
      .finally(() => setLoading(false))
  }

  const updateItem = async (itemToUpdate: TItem<T>, newDocument: T) => {
    if (!items) return
    setLoading(true)
    const index = items.findIndex(
      (item: TItem<T>) => item.key === itemToUpdate.key
    )
    const address = attribute?.contained
      ? `${idReference}[${index}]`
      : items[index].reference?.address
    if (!address) return
    return dmssAPI
      .documentUpdate({
        idAddress: address,
        data: JSON.stringify(newDocument),
      })
      .then(() => {
        const newList = [...items]
        newList[index].data = newDocument
        setItems(newList)
        setError(null)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        setError(error.response?.data || { message: error.name, data: error })
      })
      .finally(() => setLoading(false))
  }

  const save = async () => {
    // TODO: Updating data of uncontained items
    if (!items) return
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
          return { ...item }
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
    setItems(newList)
    setDirtyState(true)
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
  }
}
