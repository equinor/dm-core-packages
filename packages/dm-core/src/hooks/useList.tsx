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
}

export function useList<T>(idReference: string): IUseListReturnType<T> {
  const [attribute, setAttribute] = useState<TAttribute | null>(null)
  const [items, setItems] = useState<TItem<T>[] | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const dmssAPI = useDMSS()

  useEffect(() => {
    dmssAPI
      .attributeGet({
        address: idReference,
      })
      .then((response: AxiosResponse) => {
        setAttribute(response.data)
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false))
  }, [dmssAPI, idReference])

  useEffect(() => {
    if (!attribute) return
    dmssAPI
      .documentGet({
        address: idReference,
        depth: 0,
      })
      .then(async (response: any) => {
        if (!attribute.contained) {
          const resolved = await dmssAPI.documentGet({
            address: idReference,
            depth: 1,
          })
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
        } else {
          const items = Object.values(response.data).map((data, index) => ({
            key: crypto.randomUUID(),
            index: index,
            data: data,
            reference: null,
          }))
          // @ts-ignore
          setItems(items)
          setError(null)
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
  }

  const removeItem = async (itemToDelete: TItem<T>) => {
    if (!attribute?.type || !items) return
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
  }

  const addReference = async (address: string, entity: TValidEntity) => {
    if (!attribute?.type || !items) return
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
  }

  const updateItem = async (itemToUpdate: TItem<T>, newDocument: T) => {
    console.log(newDocument)
    if (!items) return
    const index = items.findIndex(
      (item: TItem<T>) => item.key === itemToUpdate.key
    )
    return dmssAPI
      .documentUpdate({
        // @ts-ignore
        idAddress: attribute?.contained
          ? `${idReference}[${index}]`
          : items[index].reference?.address,
        data: JSON.stringify(newDocument),
        updateUncontained: false,
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
      })
      .catch((e: Error) => toast.error(JSON.stringify(e, null, 2)))
      .finally(() => setLoading(false))
  }

  return {
    items: items,
    attribute,
    isLoading,
    error,
    addItem,
    removeItem,
    addReference,
    updateItem,
    save,
  }
}
