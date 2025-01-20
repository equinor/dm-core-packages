import { Checkbox } from '@equinor/eds-core-react'
import type { ChangeEvent } from 'react'
import * as Styled from '../styles'
import type { DataGridConfig } from '../types'

type DataCellProps = {
  attributeType: string
  cellIndex?: number
  config: DataGridConfig
  data: any[]
  rowIndex: number
  selected: boolean
  setData: (data: any[]) => void
  value: string | number | boolean
}

export function DataCell(props: DataCellProps) {
  const { attributeType, data, setData, rowIndex, value, cellIndex, config } =
    props

  function parseValue(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target
    if (attributeType === 'number') {
      return value === ''
        ? undefined
        : value === '-'
          ? '-'
          : Number.parseFloat(value)
    }
    if (attributeType === 'integer') {
      return value === ''
        ? undefined
        : value === '-'
          ? '-'
          : Number.parseInt(value, 10)
    }
    if (attributeType === 'boolean') {
      return checked
    }
    return value
  }

  function updateValue(
    event: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    cellIndex?: number
  ) {
    const parsedValue = parseValue(event)
    const dataCopy = [...data]
    if (cellIndex !== undefined) {
      dataCopy[rowIndex][cellIndex] = parsedValue
    } else {
      dataCopy[rowIndex] = parsedValue
    }
    setData(dataCopy)
  }

  return (
    <Styled.Cell selected={props.selected} attributeType={attributeType}>
      {attributeType === 'boolean' ? (
        <Checkbox
          checked={value as boolean}
          onChange={(event) => updateValue(event, rowIndex, cellIndex)}
          readOnly={!config.editable}
        />
      ) : (
        <Styled.Input
          value={value as string}
          onChange={(event) => updateValue(event, rowIndex, cellIndex)}
          attributeType={attributeType}
          readOnly={!config.editable}
          type={
            attributeType === 'number' || attributeType === 'integer'
              ? 'number'
              : 'text'
          }
        />
      )}
    </Styled.Cell>
  )
}
