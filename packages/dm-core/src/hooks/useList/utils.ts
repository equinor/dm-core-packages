import type { TItem } from './types'

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export const createNewItemObject = (
  data: any,
  newItemIndex: number,
  isSaved: boolean,
  idReference: string
): TItem<any> => ({
  key: crypto.randomUUID(),
  idReference: idReference,
  data,
  index: newItemIndex,
  reference: null,
  isSaved,
})
