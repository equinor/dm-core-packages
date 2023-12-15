import React, { ChangeEvent } from 'react'
import * as Styled from '../styles'
import { Checkbox } from '@equinor/eds-core-react'

type DataCellProps = {
  selected: boolean
  rowIndex: number
  cellIndex?: number
  value: string | number | boolean
  data: any[]
  setData: (data: any[]) => void
  attributeType: string
}

export function DataCell(props: DataCellProps) {
  const { attributeType, data, setData, rowIndex, value, cellIndex } = props

  function parseValue(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target
    if (attributeType === 'number') {
      return value === '' ? undefined : parseInt(value, 10)
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
        />
      ) : (
        <Styled.Input
          value={value as string}
          onChange={(event) => updateValue(event, rowIndex, cellIndex)}
          attributeType={attributeType}
        />
      )}
    </Styled.Cell>
  )
}
