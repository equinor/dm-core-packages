import { TGenericObject } from '../..'
import {
  TTableConfig,
  TTableFunctionalityConfig,
  TTableRowItem,
  TTableSortDirection,
  TableVariantNameEnum,
} from './types'

export function updateItemAttribute(
  items: TTableRowItem[],
  key: string,
  attribute: string,
  newValue: string | number | boolean
) {
  const itemsCopy = [...items]
  const index = itemsCopy.findIndex((item) => item.key === key)
  itemsCopy[index].data[attribute] = newValue
  return itemsCopy
}

export function createNewItemObject(
  data: TGenericObject,
  newItemIndex: number
) {
  const id: string = crypto.randomUUID()
  return {
    key: id,
    id,
    data,
    index: newItemIndex,
  }
}

export function removeItemFromList(
  items: TTableRowItem[],
  key: string
): TTableRowItem[] {
  const itemIndex = items.findIndex((item) => item.key === key)
  const itemsCopy = [...items]
  itemsCopy.splice(itemIndex, 1)
  return itemsCopy
}

export function getColumnsLength(
  config: TTableConfig,
  functionality: TTableFunctionalityConfig,
  tableVariant: TableVariantNameEnum
): number {
  let amount = config.columns?.length || 0
  if (functionality.delete) amount += 1
  if (tableVariant === TableVariantNameEnum.Edit) amount += 1
  return amount
}

export function dynamicSort(direction: TTableSortDirection, property: string) {
  const sortOrder = direction === 'ascending' ? 1 : -1

  return (a: any, b: any) => {
    const result =
      a.data[property] < b.data[property]
        ? -1
        : a.data[property] > b.data[property]
        ? 1
        : 0
    return result * sortOrder
  }
}
