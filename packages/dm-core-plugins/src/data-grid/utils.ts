import { DataGridConfig, PredefinedLabels, TFunctionalityChecks } from './types'

const predefinedLabels: PredefinedLabels[] = ['...ABC', '...ZYX', '...123']

function getPredefinedLabels(type: PredefinedLabels, length: number) {
  if (type === '...ABC') {
    const labels_ABC = Array.from({ length }, (_, i) =>
      String.fromCharCode(i + 65)
    )
    return labels_ABC
  }
  if (type === '...ZYX') {
    const labels_ZYX = Array.from({ length }, (_, i) =>
      String.fromCharCode(90 - i)
    )
    return labels_ZYX
  }
  if (type === '...123') {
    const labels_123 = Array.from({ length }, (_, i) => `${i + 1}`)
    return labels_123
  }
  return []
}

export function createLabels(labels: string[], length: number): string[] {
  const predefinedColumns = labels.filter((label) =>
    predefinedLabels.includes(label as PredefinedLabels)
  )
  if (predefinedColumns?.length > 0) {
    const predefinedLabelsNeeded =
      length - (labels?.length - predefinedColumns?.length)
    let mappedLabels: string[] = []
    labels.forEach((label) => {
      if (predefinedLabels.includes(label as PredefinedLabels)) {
        const createdLabels = getPredefinedLabels(
          label as PredefinedLabels,
          predefinedLabelsNeeded
        )
        mappedLabels = [...mappedLabels, ...createdLabels]
      } else {
        mappedLabels.push(label)
      }
    })
    return mappedLabels as string[]
  }
  return labels
}

export const createArrayFromNumber = (number: number) =>
  Array.from({ length: number }, (_, i) => i + 1)

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export const getFillValue = (type: string) =>
  type === 'boolean' ? false : type === 'number' ? 0 : ''

export function getFunctionalityVariables(
  config: DataGridConfig,
  dimensions: string | undefined
): TFunctionalityChecks {
  const {
    editable,
    adjustableColumns,
    adjustableRows,
    fieldNames,
    printDirection,
  } = config

  const [columnDimensions, rowDimensions] = dimensions?.split(',') || ['*', '*']
  const isMultiPrimitive = fieldNames.length > 1
  const isMultiDimensional: boolean = dimensions?.includes(',') || false
  const addButtonFunctionality =
    printDirection === 'horizontal' ? 'addRow' : 'addColumn'
  const isSortEnabled =
    !isMultiPrimitive &&
    config.adjustableRows &&
    columnDimensions === '*' &&
    config.editable &&
    config.movableRows
  const rowsAreEditable =
    editable && adjustableRows && isMultiDimensional
      ? rowDimensions === '*'
      : columnDimensions === '*'
  const columnsAreEditable =
    editable &&
    adjustableColumns &&
    columnDimensions === '*' &&
    isMultiDimensional
  const addButtonIsEnabled =
    (isMultiPrimitive && printDirection === 'vertical') ||
    (rowsAreEditable && printDirection === 'horizontal') ||
    (columnsAreEditable && printDirection === 'vertical') ||
    (!isMultiDimensional && columnDimensions === '*')

  return {
    rowsAreEditable,
    columnsAreEditable,
    addButtonFunctionality,
    addButtonIsEnabled,
    isMultiDimensional,
    columnDimensions,
    isSortEnabled,
  }
}
