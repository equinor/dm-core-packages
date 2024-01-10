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
  movableRows: boolean
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
  columnLabels: ['...ABC'],
  showRows: true,
  adjustableRows: true,
  rowLabels: ['...123'],
  movableRows: true,
  printDirection: 'horizontal',
  rowsPerPage: 25,
  hidePaginationIfLessThan: 0,
}

export type DataGridProps = {
  attributeType: string
  config?: DataGridConfig
  data: any[]
  description?: string
  dimensions?: string
  initialRowsPerPage?: number
  setData: (data: any[]) => void
  title?: string
}

export type PredefinedLabels = '...ABC' | '...ZYX' | '...123'
