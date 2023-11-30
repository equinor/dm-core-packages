import {
	IUIPlugin,
	TGenericObject,
	TInlineRecipeViewConfig,
	TReferenceViewConfig,
	TSortableItem,
	TViewConfig,
} from '../../'

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

export type TTableRowItem = {
	data: TGenericObject
	id: string
	index: number
	key: string
}

// Table components types

export type TableProps = {
	config: TTableConfig
	dirtyState: boolean
	items: any[]
	loadingState: boolean
	saveTable: (items: TTableRowItem[]) => void
	setItems: React.Dispatch<React.SetStateAction<TTableRowItem[]>>
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
	addItem: (insertAtIndex?: number) => void
	config: TTableConfig
	deleteItem: (key: string) => void
	editMode: boolean
	functionalityConfig: TTableFunctionalityConfig
	item: TTableRowItem
	index: number
	idReference: string
	items: TTableRowItem[]
	onOpen: any
	rowsPerPage: number
	setDirtyState: React.Dispatch<React.SetStateAction<boolean>>
	setItems: React.Dispatch<React.SetStateAction<TTableRowItem[]>>
	tableVariant: TableVariantNameEnum
} & TSortableItem

export type TableCellProps = {
	column: TTableColumnConfig
	editMode: boolean
	isExpanded: boolean
	item: TTableRowItem
	openItemAsTab: () => void
	setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
	updateItem: (
		attribute: string,
		newValue: string | number | boolean,
		attributeType: string
	) => void
}

export type TableRowActionsProps = {
	editMode: boolean
	deleteItem: (key: string) => void
	itemKey: string
	removeItem: () => void
}
