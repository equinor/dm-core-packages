import { IUIPlugin, TViewConfig } from '@development-framework/dm-core'

export type TTablePlugin = {
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

export const defaultConfig: TTablePlugin = {
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

export type ITableItemRow = {
  key: string
  data: any
  index: number
  expanded: boolean
  isSaved: boolean
}

export type TablePluginProps = {
  config?: TTablePlugin
} & IUIPlugin
