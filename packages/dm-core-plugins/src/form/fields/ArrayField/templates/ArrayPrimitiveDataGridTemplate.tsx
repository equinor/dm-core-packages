import { Typography } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import TooltipButton from '../../../../common/TooltipButton'
import { DataGrid } from '../../../../data-grid/DataGrid'
import { Fieldset, Legend } from '../../../styles'
import type { TArrayTemplate, TPrimitive } from '../../../types'
import { getDisplayLabel } from '../../../utils/getDisplayLabel'

export const ArrayPrimitiveDatagridTemplate = (
  props: TArrayTemplate & {
    value: TPrimitive[]
    onChange: (v: TPrimitive[]) => void
  }
) => {
  const { attribute, value, onChange } = props

  const multiDimensional: boolean = attribute.dimensions?.includes(',') || false
  const [definedColumns, definedRows] = attribute.dimensions?.split(',') || [
    '*,*',
  ]
  const undefinedColumnDimensions = definedColumns === '*'
  const undefinedRowDimensions = definedRows === '*'
  const showCreateButton = !Array.isArray(value)

  const fillValue =
    attribute.attributeType === 'boolean'
      ? false
      : attribute.attributeType === 'number'
        ? 0
        : ''

  function createPrimitiveArray() {
    const definedColumnsAmount = Number.parseInt(definedColumns, 10)
    const definedRowsAmount = Number.parseInt(definedRows, 10)

    // example: dimensions = 3,3
    if (
      multiDimensional &&
      !undefinedRowDimensions &&
      !undefinedColumnDimensions
    ) {
      const emptyRow = Array.from({ length: definedColumnsAmount }).fill(
        fillValue
      )
      const newRows: any[] = []
      for (let i = definedRowsAmount; i > 0; i--) {
        newRows.push(emptyRow)
      }
      onChange(newRows)
      return
    }
    // example dimensions = 4,*
    if (
      multiDimensional &&
      undefinedRowDimensions &&
      !undefinedColumnDimensions
    ) {
      const emptyRow = Array.from({ length: definedColumnsAmount }).fill(
        fillValue
      )
      onChange([emptyRow] as any[])
      return
    }
    // example dimensions = *,3
    if (
      multiDimensional &&
      !undefinedRowDimensions &&
      undefinedColumnDimensions
    ) {
      const newRows: any[] = []
      for (let i = definedRowsAmount; i > 0; i--) {
        newRows.push([fillValue])
      }
      onChange(newRows)
      return
    }
    // example: dimensions = *,*
    if (
      multiDimensional &&
      undefinedRowDimensions &&
      undefinedColumnDimensions
    ) {
      onChange([[fillValue]] as any[])
      return
    }
    // example: dimensions = *
    if (!multiDimensional && undefinedColumnDimensions) {
      onChange([fillValue])
      return
    }
    // example: dimensions = 4
    if (!multiDimensional && !undefinedColumnDimensions) {
      const newRows: any[] = []
      for (let i = definedColumnsAmount; i > 0; i--) {
        newRows.push([fillValue])
      }
      onChange(newRows)
      return
    }
    throw new Error('Use-case for these dimensions are not handled.')
  }

  return (
    <Fieldset>
      <Legend data-testid='primitive-array-legend'>
        <Typography bold={true}>{getDisplayLabel(attribute, true)}</Typography>
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
