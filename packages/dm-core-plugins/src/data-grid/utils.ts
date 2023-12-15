export const columnLabels = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(i + 65)
)

export const createArrayFromNumber = (number: number) =>
  Array.from({ length: number }, (_, i) => i + 1)

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export const getFillValue = (type: string) =>
  type === 'boolean' ? false : type === 'number' ? 0 : ''
