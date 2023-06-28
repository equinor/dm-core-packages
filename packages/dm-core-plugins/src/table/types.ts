import { TGenericObject, TViewConfig } from '@development-framework/dm-core'

export type TTablePluginConfig = {
  editMode: boolean
  columns: string[]
  showDelete: boolean
  editableColumns?: string[]
  functionality: {
    openAsTab: boolean
    openAsExpandable: boolean
    add: boolean
    sort: boolean
    edit: boolean
    delete: boolean
  }
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

export type TTableItemRow = {
  key: string
  data: TGenericObject
  index: number
  expanded: boolean
  isSaved: boolean
}
