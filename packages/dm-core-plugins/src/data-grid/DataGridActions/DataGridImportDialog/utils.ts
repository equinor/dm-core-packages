export async function checkAndParseToAttributeType(
  data: any[][],
  attributeType: string,
  isMultiDimensional: boolean
): Promise<[any[], string[]]> {
  const parsedData: string[][] = []
  const errors: string[] = []

  function parseValue(value: any, rowIndex: number, colIndex: number) {
    if (attributeType === 'number') {
      const parsedValue = parseFloat(value.replace(',', '.'))
      if (Number.isNaN(parsedValue)) {
        errors.push(
          `Data in cell ${colIndex + 1}, row ${
            rowIndex + 1
          } of value "${value}" is not a valid number`
        )
      }
      return parsedValue
    }
    if (attributeType === 'boolean') {
      if (value !== 'true' && value !== 'false') {
        errors.push(
          `Data in cell ${colIndex + 1}, row ${
            rowIndex + 1
          } of value "${value}" is not a valid boolean "true" or "false"`
        )
      }
      return value === 'true'
    }
    return value
  }

  data.forEach((row, rowIndex) => {
    if (isMultiDimensional) {
      const parsedRow: any[] = []
      row.forEach((value, colIndex) => {
        parsedRow.push(parseValue(value, rowIndex, colIndex))
      })
      parsedData.push(parsedRow)
    } else {
      parsedData.push(parseValue(row[0], rowIndex, 0))
    }
  })
  return [parsedData, errors]
}

export async function checkDimensions(
  data: any[],
  dimensions: string | undefined
): Promise<string[]> {
  const errors = []

  // Check if every row has correct amount of values, should happen by default if you copy from excel-like programs
  const equal = data.every((x) => x.length === data[0].length)
  if (!equal) {
    errors.push('Each row in pasted data must have an equal amount of values')
  }

  // If set dimensions - check if they match
  const [definedColumns, definedRows] = (dimensions || '*,*').split(',')
  const isMultiDimensional: boolean = dimensions?.includes(',') || false
  if (definedColumns === '*' && definedRows === '*') return []
  const definedColumnsAmount =
    definedColumns !== '*' ? parseInt(definedColumns, 10) : '*'
  const definedRowsAmount = !isMultiDimensional
    ? definedColumnsAmount
    : definedRows !== '*'
      ? parseInt(definedRows, 10)
      : '*'
  const dataColumnsLength = data[0].length
  const dataRowsLength = data.length
  const isAcceptableColumnsLength =
    definedColumnsAmount === '*' || definedColumnsAmount === dataColumnsLength
  const isAcceptableRowsLength =
    definedRowsAmount === '*' || definedRowsAmount === dataRowsLength
  if (isMultiDimensional && !isAcceptableColumnsLength)
    errors.push(
      `Amount of columns in data pasted (${dataColumnsLength}) does not match the amount of columns defined (${definedColumnsAmount}) for data-table`
    )
  if (!isMultiDimensional && dataColumnsLength > 1)
    errors.push(
      `Expecting a 1-dimensional array, but recieved ${dataColumnsLength} values per row.`
    )
  if (!isAcceptableRowsLength)
    errors.push(
      `Amount of rows in data pasted (${dataRowsLength}) does not match the amount of columns defined (${definedRowsAmount}) for data-table`
    )

  return errors
}
