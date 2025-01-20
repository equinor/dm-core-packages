export enum PredefinedLabel {
  ABC = '...ABC',
  ZYX = '...ZYX',
  NUMERIC = '...123',
}

export type DataGridConfig = {
  title: string
  description: string
  fieldNames: string[]
  editable: boolean
  showColumns: boolean
  adjustableColumns: boolean
  columnLabels: string[]
  showRows: boolean
  adjustableRows: boolean
  rowLabels: string[]
  printDirection: 'horizontal' | 'vertical'
  rowsPerPage: number
  hidePaginationIfLessThan: number
}

export const defaultConfig: DataGridConfig = {
  title: '',
  description: '',
  fieldNames: [],
  editable: true,
  showColumns: true,
  adjustableColumns: true,
  columnLabels: [PredefinedLabel.ABC],
  showRows: true,
  adjustableRows: true,
  rowLabels: [PredefinedLabel.NUMERIC],
  printDirection: 'horizontal',
  rowsPerPage: 25,
  hidePaginationIfLessThan: 0,
}

export type DataGridProps = {
  attributeType: string
  config?: DataGridConfig
  data: any[]
  description?: string
  dimensions: string
  initialRowsPerPage?: number
  name?: string
  setData: (data: any[]) => void
  title?: string
}

export type TFunctionalityChecks = {
  addButtonIsEnabled: boolean
  columnDimensions: string
  columnsAreEditable: boolean
  isMultiDimensional: boolean
  isSortRowsEnabled: boolean
  rowsAreEditable: boolean
}
