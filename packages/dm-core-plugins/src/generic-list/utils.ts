export function reorderObject(
  key: string,
  moveValue: number,
  inObject: { [k: string]: any }
): { [k: string]: any } {
  const oldIndex = Object.keys(inObject).indexOf(key)
  const item = inObject[key]
  delete inObject[key]
  const itemKeys = Object.keys(inObject)
  const oldItems = Object.values(inObject)
  let newIndex = oldIndex + moveValue
  // Move from top to bottom
  if (newIndex < 0) newIndex = itemKeys.length
  // Move from bottom to top
  else if (newIndex > itemKeys.length) newIndex = 0

  itemKeys.splice(newIndex, 0, key)
  oldItems.splice(newIndex, 0, item)

  return Object.fromEntries(
    itemKeys.map((key: string, index: number) => [key, oldItems[index]])
  )
}
