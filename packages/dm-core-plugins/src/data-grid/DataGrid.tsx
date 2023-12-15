import React, { useState, useMemo, useEffect } from 'react'
import { Stack, TAttribute } from '@development-framework/dm-core'
import { Button, EdsProvider, Icon } from '@equinor/eds-core-react'
import { add, chevron_down, chevron_up, minimize } from '@equinor/eds-icons'
import * as Styled from './styles'
import * as utils from './utils'
import { DataCell } from './DataCell/DataCell'
import { DataGridPagination } from './DataGridPagination/DataGridPagination'
import { ColumnHeader } from './ColumnHeader/ColumnHeader'
import { VerticalHeader } from './VerticalHeader/VerticalHeader'

type DataGridProps = {
  attributeType: string
  dimensions?: string
  data: any[]
  setData: (data: any[]) => void
  initialRowsPerPage?: number
}

export function DataGrid(props: DataGridProps) {
  const { data, attributeType, dimensions, setData } = props
  const [columns, setColumns] = useState<number[]>([])
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined)
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  )
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState(props.initialRowsPerPage || 25)

  const dataGridId = useMemo(() => crypto.randomUUID(), [])
  const multi: boolean = dimensions?.includes(',') || false
  const fillValue = utils.getFillValue(attributeType)
  const paginatedRows = data.slice(
    paginationPage * rowsPerPage,
    paginationPage * rowsPerPage + rowsPerPage
  )
  const [definedColumns, definedRows] = dimensions?.split(',') || ['*', '*']
  const rowsAreSetDimension = multi
    ? definedRows !== '*'
    : definedColumns !== '*'

  useEffect(() => {
    const columnsArray = multi
      ? definedColumns === '*'
        ? utils.createArrayFromNumber(data.length > 0 ? data[0].length : [])
        : utils.createArrayFromNumber(parseInt(definedColumns, 10))
      : [1]

    setColumns(columnsArray)
  }, [])

  function addRow(newIndex?: number) {
    const newRow =
      columns.length > 1
        ? Array.from({ length: columns.length }).fill(fillValue)
        : fillValue
    const dataCopy = [...data]
    dataCopy.splice(newIndex || columns.length, 0, newRow)
    setData(dataCopy)
  }

  function deleteRow() {
    if (selectedRow !== undefined) {
      const dataCopy = [...data]
      dataCopy.splice(selectedRow, 1)
      setData(dataCopy)
      setSelectedRow(undefined)
    }
  }

  function moveRow(direction: 'up' | 'down') {
    if (selectedRow !== undefined) {
      const toIndex = direction === 'up' ? selectedRow - 1 : selectedRow + 1
      const updatedData = utils.arrayMove(data, selectedRow, toIndex)
      setData(updatedData)
      setSelectedRow(toIndex)
    }
  }

  function deleteColumn(index: number) {
    const newColumns = utils.createArrayFromNumber(columns.length - 1)
    const updatedData = data.map((item) => {
      item.splice(index, 1)
      return item
    })
    setColumns(newColumns)
    setData(updatedData)
    setSelectedColumn(undefined)
  }

  return (
    <Stack>
      <EdsProvider density='compact'>
        <Styled.DataGrid>
          <Styled.Row header>
            <Styled.Cell header style={{ width: '1.25rem' }}>
              #
            </Styled.Cell>
            {columns.map((column, index) => (
              <ColumnHeader
                key={`${dataGridId}_header_${index}`}
                attributeType={attributeType}
                column={column}
                columns={columns}
                columnsAreSetDimension={definedColumns !== '*'}
                data={data}
                deleteColumn={deleteColumn}
                index={index}
                multi={multi}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
                setData={setData}
                setColumns={setColumns}
              />
            ))}
          </Styled.Row>
          {paginatedRows.map((item, rowIndex) => {
            const calculatedIndex = paginationPage * rowsPerPage + rowIndex
            return (
              <Styled.Row key={`${dataGridId}_row_${calculatedIndex}`}>
                <VerticalHeader
                  addRow={addRow}
                  deleteRow={deleteRow}
                  index={calculatedIndex}
                  rowsAreSetDimension={rowsAreSetDimension}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                />
                {multi ? (
                  item.map((cellValue: any, cellIndex: number) => (
                    <DataCell
                      key={`${dataGridId}_row_${calculatedIndex}_cell_${cellIndex}`}
                      selected={
                        selectedRow === calculatedIndex ||
                        selectedColumn === cellIndex
                      }
                      value={cellValue}
                      cellIndex={cellIndex}
                      rowIndex={calculatedIndex}
                      data={data}
                      setData={setData}
                      attributeType={attributeType}
                    />
                  ))
                ) : (
                  <DataCell
                    key={`${dataGridId}_row_${calculatedIndex}_cell`}
                    selected={selectedRow === calculatedIndex}
                    value={item}
                    rowIndex={calculatedIndex}
                    data={data}
                    setData={setData}
                    attributeType={attributeType}
                  />
                )}
              </Styled.Row>
            )
          })}
        </Styled.DataGrid>
      </EdsProvider>
      <Styled.ActionRow>
        <Stack direction='row'>
          {!rowsAreSetDimension && (
            <Styled.ActionRowButton
              aria-label='Add data row'
              onClick={() => addRow()}
            >
              <Icon size={16} data={add} />
            </Styled.ActionRowButton>
          )}
          {selectedRow !== undefined && (
            <>
              {definedRows === '*' && (
                <Styled.ActionRowButton onClick={deleteRow}>
                  <Icon size={16} data={minimize} />
                </Styled.ActionRowButton>
              )}
              <Styled.ActionRowButton onClick={() => moveRow('up')}>
                <Icon size={16} data={chevron_up} />
              </Styled.ActionRowButton>
              <Styled.ActionRowButton onClick={() => moveRow('down')}>
                <Icon size={16} data={chevron_down} />
              </Styled.ActionRowButton>
            </>
          )}
        </Stack>
        <DataGridPagination
          count={data.length}
          page={paginationPage}
          setPage={setPaginationPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Styled.ActionRow>
    </Stack>
  )
}
