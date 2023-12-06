import {
  IUIPlugin,
  TGenericObject,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TSortableItem,
  TViewConfig,
} from '../../'
import { TItem } from '../../hooks/useList/types'

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
  dataType?: 'string' | 'boolean'
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
}

// Table components types

export type TableProps = {
  addItem: (saveOnAdd: boolean, insertAtIndex?: number) => void
  config: TTableConfig
  dirtyState: boolean
  items: TItem<TGenericObject>[]
  loadingState: boolean
  removeItem: (
    itemToDelete: TItem<TGenericObject>,
    saveOnRemove?: boolean
  ) => Promise<void>
  saveTable: (items: TItem<TGenericObject>[]) => void
  setItems: React.Dispatch<React.SetStateAction<TItem<TGenericObject>[]>>
  updateItem: (
    itemToUpdate: TItem<TGenericObject>,
    newDocument: TGenericObject,
    saveOnUpdate?: boolean
  ) => Promise<void>
  setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
} & IUIPlugin

export type TableHeadProps = {
  config: TTableConfig
  setTableVariant: React.Dispatch<React.SetStateAction<TableVariantNameEnum>>
  sortColumn: string | undefined
  sortDirection: TTableSortDirection
  sortByColumn: (column: string) => void
  tableVariant: TableVariantNameEnum
}

export type TableRowProps = {
  addItem: (saveOnAdd: boolean, insertAtIndex?: number) => void
  config: TTableConfig
  removeItem: (
    itemToDelete: TItem<TGenericObject>,
    saveOnRemove?: boolean
  ) => Promise<void>
  editMode: boolean
  functionalityConfig: TTableFunctionalityConfig
  item: TItem<TGenericObject>
  index: number
  idReference: string
  items: TItem<TGenericObject>[]
  onOpen: any
  rowsPerPage: number
  setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
  setItems: React.Dispatch<React.SetStateAction<TItem<TGenericObject>[]>>
  updateItem: (
    itemToUpdate: TItem<TGenericObject>,
    newDocument: TGenericObject,
    saveOnUpdate?: boolean
  ) => Promise<void>
  tableVariant: TableVariantNameEnum
} & TSortableItem

export type TableRowActionsProps = {
  editMode: boolean
  item: TItem<TGenericObject>
  removeItem: (
    itemToDelete: TItem<TGenericObject>,
    saveOnRemove?: boolean
  ) => Promise<void>
}

export type TableCellProps = {
  column: TTableColumnConfig
  editMode: boolean
  isExpanded: boolean
  item: TItem<TGenericObject>
  openItemAsTab: () => void
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  updateItem: (
    attribute: string,
    newValue: string | number | boolean,
    attributeType: string
  ) => void
}
