import { ErrorResponse } from '../services'
import { useEffect, useState } from 'react'
import { useDMSS } from '../context/DMSSContext'
import { AxiosError, AxiosResponse } from 'axios'
import { TAttribute, TGenericObject } from '../types'
import { toast } from 'react-toastify'

/*type TItem = {
  key: string
  index: number
  data: TGenericObject
}*/

interface IUseListReturnType<T> {
  list: T | null
  attribute: TAttribute | null
  isLoading: boolean
  addItem: () => Promise<void>
  removeItem: (index: number) => Promise<void>
  // updateDocument: (newDocument: T, notify: boolean) => Promise<void>
  error: ErrorResponse | null
}

export function useList<T>(idReference: string): IUseListReturnType<T> {
  const [attribute, setAttribute] = useState<TAttribute | null>(null)
  const [list, setList] = useState<T | null>(null)
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
        depth: 1,
      })
      .then((response: any) => {
        const data = response.data
        setList(data)
        setError(null)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        setError(error.response?.data || { message: error.name, data: error })
      })
      .finally(() => setLoading(false))
  }, [attribute])

  const addItem = async () => {
    if (!attribute?.type) return
    dmssAPI
      .instantiateEntity({
        entity: { type: attribute?.attributeType },
      })
      .then((newEntity: AxiosResponse<object, TGenericObject>) => {
        if (attribute.contained) {
          dmssAPI
            .documentAdd({
              address: idReference,
              document: JSON.stringify(newEntity.data),
            })
            .then(() => {
              // @ts-ignore
              const newList = [...list, newEntity.data]
              // @ts-ignore
              setList(newList)
            })
        }
        console.log(newEntity)
      })
      .catch((error: AxiosError<ErrorResponse>) =>
        alert(JSON.stringify(error.response?.data))
      )
  }

  const removeItem = async (index: number) => {
    if (!attribute?.type) return
    dmssAPI
      .documentRemove({
        address: `${idReference}[${index}]`,
      })
      .then(() => {
        // const itemIndex = items.findIndex((item) => item.key === key)
        // @ts-ignore
        const newList = [...list]
        newList.splice(index, 1)
        // @ts-ignore
        setList(newList)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }

  return { list, attribute, isLoading, error, addItem, removeItem }
}
