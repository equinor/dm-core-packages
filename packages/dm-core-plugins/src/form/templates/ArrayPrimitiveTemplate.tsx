import React from 'react'
import { add } from '@equinor/eds-icons'
import { Typography } from '@equinor/eds-core-react'
import { TArrayTemplate, TPrimitive } from '../types'
import { Fieldset, Legend } from '../styles'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import { DataGrid } from '../../data-grid/DataGrid'
import TooltipButton from '../../common/TooltipButton'

export const ArrayPrimitiveTemplate = (
  props: TArrayTemplate & {
    value: TPrimitive[]
    onChange: (v: TPrimitive[]) => void
  }
) => {
  const { attribute, value, onChange } = props

  const multi: boolean = attribute.dimensions?.includes(',') || false
  const [definedColumns, definedRows] = attribute.dimensions?.split(',') || [
    '*,*',
  ]
  const showCreateButton = definedRows !== '*' && value.length === 0

  const getFillValue = (type: string) =>
    type === 'boolean' ? false : type === 'number' ? 0 : ''

  function createPrimitiveArray() {
    if (multi && definedRows !== '*') {
      const fillValue = getFillValue(attribute.attributeType)
      const definedRowsAmount = parseInt(definedRows, 10)
      const definedColumnsAmount = parseInt(definedColumns, 10)
      const emptyRow = Array.from({ length: definedColumnsAmount }).fill(
        fillValue
      )
      const newRows: any[] = []
      for (let i = definedRowsAmount; i > 0; i--) {
        newRows.push(emptyRow)
      }
      onChange(newRows)
    }
  }

  return (
    <Fieldset>
      <Legend data-testid='primitive-array-legend'>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        {showCreateButton && (
          <TooltipButton
            title='Create table'
            button-variant='ghost_icon'
            button-onClick={createPrimitiveArray}
            icon={add}
          />
        )}
      </Legend>
      {!showCreateButton && (
        <DataGrid
          data={value}
          attributeType={attribute.attributeType}
          dimensions={attribute?.dimensions}
          setData={onChange}
        />
      )}
    </Fieldset>
  )
}
