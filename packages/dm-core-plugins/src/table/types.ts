import { TGenericObject, TViewConfig } from '@development-framework/dm-core'

export type TTableFunctionalityConfig = {
  openAsTab: boolean
  openAsExpandable: boolean
  add: boolean
  sort: boolean
  edit: boolean
  delete: boolean
}

export type TTablePluginConfig = {
  editMode: boolean
  columns: string[]
  showDelete: boolean
  editableColumns?: string[]
  functionality: TTableFunctionalityConfig
  defaultView: TViewConfig
  views: TViewConfig[]
}

export const defaultConfig: TTablePluginConfig = {
  editMode: true,
  columns: ['name', 'type'],
  showDelete: true,
  editableColumns: [],
  functionality: {
    openAsTab: true,
    openAsExpandable: false,
    add: false,
    sort: false,
    edit: false,
    delete: false,
  },
  defaultView: { type: 'ViewConfig', scope: 'self' },
  views: [],
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
