import {
  TGenericObject,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'

export type TTableFunctionalityConfig = {
  openAsTab: boolean
  openAsExpandable: boolean
  add: boolean
  sort: boolean
  edit: boolean
  delete: boolean
}

export type TTablePluginConfig = {
  columns: string[]
  editableColumns?: string[]
  expandableRecipeViewConfig?:
    | TViewConfig
    | TInlineRecipeViewConfig
    | TReferenceViewConfig
  functionality: TTableFunctionalityConfig
}

export const defaultConfig: TTablePluginConfig = {
  columns: ['name', 'type'],
  editableColumns: [],
  functionality: {
    openAsTab: true,
    openAsExpandable: false,
    add: false,
    sort: false,
    edit: false,
    delete: false,
  },
}

export type TTableRowItem = {
  key: string
  data: TGenericObject
  index: number
  expanded: boolean
  isSaved: boolean
}

export type TTableRow = {
  config: TTablePluginConfig
  item: TTableRowItem
  index: number
  idReference: string
  items: TTableRowItem[]
  setItems: React.Dispatch<React.SetStateAction<TTableRowItem[]>>
  setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
  onOpen: any
  rowsPerPage: number
}
