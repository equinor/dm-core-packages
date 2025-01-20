import type { TAttribute } from '@development-framework/dm-core'
import {
  type DataGridConfig,
  PredefinedLabel,
  type TFunctionalityChecks,
} from './types'

export function getCalculatedDimensions(
  config: DataGridConfig,
  attribute: TAttribute
): string {
  const { fieldNames, printDirection } = config
  // If multi primitive (more than one data field)
  if (fieldNames?.length > 1) {
    return printDirection === 'vertical' ? `${fieldNames.length},*` : `*,*`
  }
  // If switched around
  if (printDirection === 'vertical') {
    const reversed = (attribute?.dimensions || '*,*')
      ?.split('')
      .reverse()
      .join('')
    return reversed
  }
  return attribute?.dimensions || '*,*'
}

export function parseDataBeforeSave(
  data: any[] | undefined,
  config: DataGridConfig,
  dimensions: string
) {
  const { fieldNames } = config
  const multiplePrimitives = fieldNames?.length > 1
  let modifiedData = data
  if (config.printDirection === 'vertical') {
    modifiedData = reverseData(data || [], dimensions)
  }
  let dataToSave = { [fieldNames[0]]: modifiedData }
  if (multiplePrimitives && data?.length) {
    dataToSave = Object.fromEntries(
      (modifiedData || []).map((value, index) => [fieldNames[index], value])
    )
  }
  return dataToSave
}

const getPredefinedLabels = (type: PredefinedLabel) =>
  Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(type === PredefinedLabel.ABC ? i + 65 : 90 - i)
  )

/**
 * createLabels: Generate labels based on config
 * @param labels: labels from config
 * @returns labels: string[]
 * @returns use index for numeric labels: boolean
 */
export function createLabels(labels: string[]): [string[], boolean] {
  const predefinedLabels: PredefinedLabel[] = Object.values(PredefinedLabel)
  const predefinedLabelUsage = labels.findIndex((label) =>
    predefinedLabels.includes(label as PredefinedLabel)
  )
  if (labels[predefinedLabelUsage] === PredefinedLabel.NUMERIC) {
    return [[], true]
  }
  if (predefinedLabelUsage !== -1) {
    const createdLabels = getPredefinedLabels(
      labels[predefinedLabelUsage] as PredefinedLabel
    )
    return [createdLabels, false]
  }
  return [labels, false]
}

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const arrayCopy = [...arr]
  const element = arrayCopy[fromIndex]
  arrayCopy.splice(fromIndex, 1)
  arrayCopy.splice(toIndex, 0, element)
  return arrayCopy
}

export const getFillValue = (type: string) =>
  type === 'boolean' ? false : type === 'number' || type === 'integer' ? 0 : ''

export function reverseData(dataArray: string[][], dimensions: string) {
  const reversedData: any[] = []
  const dataLength = dimensions.includes(',')
    ? dataArray[0]?.length
    : dataArray?.length
  for (let index = 0; index < dataLength; index++) {
    const values = dataArray.map((item) => item[index])
    reversedData.push(values)
  }
  return reversedData
}

export function getFunctionalityVariables(
  config: DataGridConfig,
  dimensions: string
): TFunctionalityChecks {
  const { editable, adjustableColumns, adjustableRows } = config

  const [columnDimensions, rowDimensions] = dimensions.split(',')
  const isMultiDimensional: boolean = dimensions?.includes(',') || false
  const actualRowDimensions = isMultiDimensional
    ? rowDimensions
    : columnDimensions
  const hasMultipleDataFields = config.fieldNames.length > 1
  const isSortRowsEnabled =
    rowDimensions === '*' && config.adjustableRows && config.editable
  const rowsAreEditable =
    editable &&
    adjustableRows &&
    actualRowDimensions === '*' &&
    !(hasMultipleDataFields && config.printDirection === 'horizontal')

  const columnsAreEditable =
    editable &&
    adjustableColumns &&
    columnDimensions === '*' &&
    isMultiDimensional
  const addButtonIsEnabled = config.editable && rowsAreEditable

  return {
    rowsAreEditable,
    columnsAreEditable,
    addButtonIsEnabled,
    isMultiDimensional,
    columnDimensions,
    isSortRowsEnabled,
  }
}
