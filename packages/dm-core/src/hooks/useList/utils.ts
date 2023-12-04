import { AxiosResponse } from 'axios'
import { TLinkReference } from '../../types'
import { TItem } from './types'

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export function createNewItemObject(
  data: any,
  newItemIndex: number,
  isSaved: boolean
) {
  const id: string = crypto.randomUUID()
  return {
    key: id,
    data,
    index: newItemIndex,
    reference: null,
    isSaved,
  }
}

export function createItemsFromDocument(
  response: AxiosResponse,
  contained: boolean | undefined,
  resolvedReferences: any[]
): TItem<any>[] {
  if (contained && !Array.isArray(response.data)) {
    throw new Error(
      `Not an array! Got document ${JSON.stringify(response.data)} `
    )
  }
  const items = Object.values(response.data).map((data, index) => ({
    key: crypto.randomUUID() as string,
    index: index,
    data: contained ? data : resolvedReferences || data,
    reference: contained ? null : (data as TLinkReference),
    isSaved: true,
  }))
  return items
}
