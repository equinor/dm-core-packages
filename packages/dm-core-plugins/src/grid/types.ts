import { IUIPlugin } from '@development-framework/dm-core'

export type TGridSize = {
  columns: number
  rows: number
}

export type TGridArea = {
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
}

export type TBaseGridItem = {
  type: string
  gridArea: TGridArea
}

export type TAttributeGridItem = TBaseGridItem & {
  attribute: string
  uiRecipes?: string[]
}

export type TUiRecipeGridItem = TBaseGridItem & {
  uiRecipes: string[]
}

export function isAttributeGridItem(
  gridItem: TBaseGridItem
): gridItem is TAttributeGridItem {
  return gridItem.type.split('/').at(-1) === 'AttributeGridItem'
}

export type TGridItem = TAttributeGridItem | TUiRecipeGridItem

export type TGridPluginConfig = IUIPlugin & {
  config?: {
    size: TGridSize
    items: TGridItem[]
  }
}
