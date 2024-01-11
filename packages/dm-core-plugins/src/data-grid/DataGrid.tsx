import React, { useState, useMemo, useEffect } from 'react'
import { Stack } from '@development-framework/dm-core'
import { EdsProvider, Icon, Typography } from '@equinor/eds-core-react'
import { add, chevron_down, chevron_up, minimize } from '@equinor/eds-icons'
import * as Styled from './styles'
import * as utils from './utils'
import { DataCell } from './DataCell/DataCell'
import { DataGridPagination } from './DataGridPagination/DataGridPagination'
import { HeaderCell } from './HeaderCell/HeaderCell'
import { DataGridConfig, DataGridProps, defaultConfig } from './types'

export function DataGrid(props: DataGridProps) {
  const { data, attributeType, dimensions, setData, config: userConfig } = props
  const config: DataGridConfig = { ...defaultConfig, ...userConfig }
  const [columnLabels, setColumnLabels] = useState<string[]>([])
  const [rowLabels, setRowLabels] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined)
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  )
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState(props.initialRowsPerPage || 25)

  const dataGridId: string = useMemo(() => crypto.randomUUID(), [])
  const fillValue = utils.getFillValue(attributeType)
  const paginatedRows = data.slice(
    paginationPage * rowsPerPage,
    paginationPage * rowsPerPage + rowsPerPage
  )
  const [
    rowsAreEditable,
    columnsAreEditable,
    addButtonFunctionality,
    addButtonIsEnabled,
    isMultiDimensional,
    columnDimensions,
    isSortEnabled,
  ] = utils.getFunctionalityVariables(config, dimensions)

  useEffect(() => {
    const columnLabels = isMultiDimensional
      ? columnDimensions === '*'
        ? utils.createLabels(
            config.columnLabels,
            data.length > 0 ? data[0].length : 0
          )
        : utils.createLabels(
            config.columnLabels,
            parseInt(columnDimensions, 10)
          )
      : ['1']
    const rowLabels = utils.createLabels(config.rowLabels, data?.length)

    setRowLabels(rowLabels)
    setColumnLabels(columnLabels)
  }, [])

  function addRow(newIndex?: number) {
    const newRow =
      columnLabels.length > 1
        ? Array.from({ length: columnLabels.length }).fill(fillValue)
        : fillValue
    const dataCopy = [...data]
    dataCopy.splice(newIndex || data.length, 0, newRow)
    const newLabels = utils.createLabels(config.rowLabels, data.length + 1)
    setRowLabels(newLabels)
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

  function addColumn(newIndex: number) {
    const newColumns = utils.createLabels(
      config.columnLabels,
      columnLabels.length + 1
    )
    const fillValue = utils.getFillValue(attributeType)
    const updatedData = data.map((item) => {
      item.splice(newIndex, 0, fillValue)
      return item
    })
    setData(updatedData)
    setColumnLabels(newColumns)
    setSelectedColumn(newIndex)
  }

  function deleteColumn(index: number) {
    const newColumns = utils.createLabels(
      config.columnLabels,
      columnLabels.length - 1
    )
    const updatedData = data.map((item) => {
      item.splice(index, 1)
      return item
    })
    setColumnLabels(newColumns)
    setData(updatedData)
    setSelectedColumn(undefined)
  }

  return (
    <Stack>
      <Stack>
        {config.title && <Typography variant='h5'>{config.title}</Typography>}
        {config.description && <Typography>{config.description}</Typography>}
      </Stack>
      <EdsProvider density='compact'>
        <Styled.DataGrid flip={config.printDirection === 'vertical'}>
          {config.showColumns && (
            <Styled.Head>
              <Styled.Row>
                {config.showRows && <th style={{ width: '2rem' }}>#</th>}
                {columnLabels.map((column, index) => (
                  <HeaderCell
                    key={`${dataGridId}_header_${index}`}
                    add={addColumn}
                    editable={columnsAreEditable}
                    delete={deleteColumn}
                    index={index}
                    label={column}
                    selected={selectedColumn}
                    setSelected={setSelectedColumn}
                    type={
                      config.printDirection === 'horizontal' ? 'column' : 'row'
                    }
                  />
                ))}
              </Styled.Row>
            </Styled.Head>
          )}
          <tbody>
            {paginatedRows.map((item, rowIndex) => {
              const calculatedIndex = paginationPage * rowsPerPage + rowIndex
              return (
                <Styled.Row key={`${dataGridId}_row_${calculatedIndex}`}>
                  {config.showRows && (
                    <HeaderCell
                      add={addRow}
                      delete={deleteRow}
                      index={calculatedIndex}
                      label={rowLabels[calculatedIndex]}
                      editable={rowsAreEditable}
                      selected={selectedRow}
                      setSelected={setSelectedRow}
                      type={
                        config.printDirection === 'horizontal'
                          ? 'row'
                          : 'column'
                      }
                    />
                  )}
                  {isMultiDimensional ? (
                    item?.map((cellValue: any, cellIndex: number) => (
                      <DataCell
                        key={`${dataGridId}_row_${calculatedIndex}_cell_${cellIndex}`}
                        selected={
                          selectedRow === calculatedIndex ||
                          selectedColumn === cellIndex
                        }
                        config={config}
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
                      config={config}
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
          </tbody>
        </Styled.DataGrid>
      </EdsProvider>
      <Styled.ActionRow>
        <Stack direction='row'>
          {addButtonIsEnabled && (
            <Styled.ActionRowButton
              aria-label='Add data row'
              onClick={() =>
                addButtonFunctionality === 'addRow'
                  ? addRow()
                  : addColumn(columnLabels.length)
              }
            >
              <Icon size={16} data={add} />
            </Styled.ActionRowButton>
          )}
          {selectedRow !== undefined && (
            <>
              {rowsAreEditable && (
                <Styled.ActionRowButton onClick={deleteRow}>
                  <Icon size={16} data={minimize} />
                </Styled.ActionRowButton>
              )}
              {isSortEnabled && (
                <>
                  <Styled.ActionRowButton
                    onClick={() => moveRow('up')}
                    disabled={selectedRow === 0}
                  >
                    <Icon size={16} data={chevron_up} />
                  </Styled.ActionRowButton>
                  <Styled.ActionRowButton
                    onClick={() => moveRow('down')}
                    disabled={selectedRow === data?.length - 1}
                  >
                    <Icon size={16} data={chevron_down} />
                  </Styled.ActionRowButton>
                </>
              )}
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
