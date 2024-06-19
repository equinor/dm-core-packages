import {
  IUIPlugin,
  TInlineRecipeViewConfig,
  TItem,
  TOnOpen,
  TReferenceViewConfig,
  TValidEntity,
  TViewConfig,
} from '@development-framework/dm-core'
import { TSortableItem, TTemplate } from '../../common'

// Table Config types

export const TableVariantNameEnum = {
  Edit: 'edit',
  View: 'view',
} as const

export type TableVariantNameEnum =
  (typeof TableVariantNameEnum)[keyof typeof TableVariantNameEnum]

export type TTableVariant = {
  density?: 'compact' | 'comfortable'
  functionality?: TTableFunctionalityConfig
  name: TableVariantNameEnum
}

export type TTableFunctionalityConfig = {
  add: boolean
  delete: boolean
}

export type TTableColumnConfig = {
  data: string
  dataType?: 'string' | 'boolean' | 'number' | 'datetime'
  editable?: boolean
  label?: string
  presentAs?: 'checkbox' | 'text'
  sortable?: boolean
}

export type TTableSortDirection = 'descending' | 'ascending'

export type TTableConfig = {
  columns: TTableColumnConfig[]
  expandableRecipeViewConfig?:
    | TViewConfig
    | TInlineRecipeViewConfig
    | TReferenceViewConfig
  variant: TTableVariant[]
  templates?: TTemplate[]
  labelByIndex?: boolean
  label?: string
  width?: string
}

// Table components types

export type TableProps = {
  addItem: (
    saveOnAdd: boolean,
    insertAtIndex?: number,
    template?: string
  ) => void
  config: TTableConfig
  dirtyState: boolean
  items: TItem<TValidEntity>[]
  isLoading: boolean
  reloadData?: () => void
  removeItem: (
    itemToDelete: TItem<TValidEntity>,
    saveOnRemove?: boolean
  ) => Promise<void>
  saveTable: (items: TItem<TValidEntity>[]) => void
  setItems: React.Dispatch<React.SetStateAction<TItem<TValidEntity>[]>>
  updateItem: (
    itemToUpdate: TItem<TValidEntity>,
    newDocument: TValidEntity,
    saveOnUpdate?: boolean
  ) => Promise<void>
  setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
} & IUIPlugin

export type TableHeadProps = {
  config: TTableConfig
  setTableVariant: React.Dispatch<React.SetStateAction<TableVariantNameEnum>>
  showActionsCell: boolean
  sortColumn: string | undefined
  sortDirection: TTableSortDirection
  sortByColumn: (column: string) => void
  tableVariant: TableVariantNameEnum
  functionalityConfig: TTableFunctionalityConfig
}

export type TableRowProps = {
  addItem: (
    saveOnAdd: boolean,
    insertAtIndex?: number,
    template?: string
  ) => void
  config: TTableConfig
  removeItem: (
    itemToDelete: TItem<TValidEntity>,
    saveOnRemove?: boolean
  ) => Promise<void>
  editMode: boolean
  functionalityConfig: TTableFunctionalityConfig
  item: TItem<TValidEntity>
  index: number
  idReference: string
  items: TItem<TValidEntity>[]
  onOpen?: TOnOpen
  rowsPerPage: number
  disableActions: boolean
  setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
  setItems: React.Dispatch<React.SetStateAction<TItem<TValidEntity>[]>>
  showActionsCell: boolean
  updateItem: (
    itemToUpdate: TItem<TValidEntity>,
    newDocument: TValidEntity,
    saveOnUpdate?: boolean
  ) => Promise<void>
  tableVariant: TableVariantNameEnum
} & TSortableItem

export type TableRowActionsProps = {
  editMode: boolean
  item: TItem<TValidEntity>
  removeItem: (
    itemToDelete: TItem<TValidEntity>,
    saveOnRemove?: boolean
  ) => Promise<void>
  functionalityConfig: TTableFunctionalityConfig
  disabled?: boolean
}

export type TableCellProps = {
  column: TTableColumnConfig
  editMode: boolean
  isExpanded: boolean
  item: TItem<TValidEntity>
  openItemAsTab: () => void
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  updateItem: (
    attribute: string,
    newValue: string | number | boolean,
    attributeType: string
  ) => void
}
