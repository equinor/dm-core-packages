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
