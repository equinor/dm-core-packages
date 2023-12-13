import { TGenericObject } from '../..'
import { TItem } from '../../hooks/useList/types'
import {
  TTableConfig,
  TTableFunctionalityConfig,
  TTableSortDirection,
  TableVariantNameEnum,
} from './types'
import { isObject } from 'lodash'

function setValue(object: TGenericObject, attribute: string, value: any) {
  const properties = attribute.split('.')
  const lastProperty = properties.pop()
  const lastObject = properties.reduce(
    (a, prop) => (isObject(a) ? a[prop] : null),
    object
  )
  if (isObject(lastObject) && lastProperty) {
    lastObject[lastProperty] = value
    return true
  } else {
    return false
  }
}

export function updateItemAttribute(
  items: TItem<TGenericObject>[],
  key: string,
  attribute: string,
  newValue: string | number | boolean
) {
  const itemsCopy = [...items]
  const index = itemsCopy.findIndex((item) => item.key === key)
  const itemData = itemsCopy[index].data || {}
  const success = setValue(itemData, attribute, newValue)
  if (success && itemsCopy[index].data) {
    ;(itemsCopy[index].data as TGenericObject) = itemData
  }
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
  items: TItem<TGenericObject>[],
  key: string
): TItem<TGenericObject>[] {
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

export const resolvePath = (
  object: TGenericObject,
  path: string,
  defaultValue: any
) =>
  path
    .split(/[.[\]'"]/)
    .filter((p) => p)
    .reduce((o, p) => (o ? o[p] : defaultValue), object)
