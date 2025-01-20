import { EdsProvider, Typography } from '@equinor/eds-core-react'
import { useMemo, useState } from 'react'
import { Stack } from '../common'
import { DataCell } from './DataCell/DataCell'
import { DataGridActions } from './DataGridActions/DataGridActions'
import { DataGridPagination } from './DataGridPagination/DataGridPagination'
import { HeaderCell } from './HeaderCell/HeaderCell'
import * as Styled from './styles'
import {
  type DataGridConfig,
  type DataGridProps,
  type TFunctionalityChecks,
  defaultConfig,
} from './types'
import * as utils from './utils'

export function DataGrid(props: DataGridProps) {
  const { data, attributeType, dimensions, setData, config: userConfig } = props
  const config: DataGridConfig = { ...defaultConfig, ...userConfig }
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined)
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  )
  const [paginationPage, setPaginationPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState(props.initialRowsPerPage || 25)
  const dataGridId: string = useMemo(() => crypto.randomUUID(), [])
  const paginatedRows = useMemo(
    () =>
      data.slice(
        paginationPage * rowsPerPage,
        paginationPage * rowsPerPage + rowsPerPage
      ),
    [paginationPage, rowsPerPage, data]
  )
  const functionality: TFunctionalityChecks = useMemo(
    () => utils.getFunctionalityVariables(config, dimensions),
    [config, dimensions]
  )
  const columns = functionality.isMultiDimensional ? data[0] : [0]

  const [
    columnLabels,
    useIndexForColumnLabels,
    rowLabels,
    useIndexForRowLabels,
  ] = useMemo(() => {
    const [createdColumnLabels, useIndexForColumnLabels] = utils.createLabels(
      config.columnLabels
    )
    const [createdRowLabels, useIndexForRowLabels] = utils.createLabels(
      config.rowLabels
    )
    return [
      createdColumnLabels,
      useIndexForColumnLabels,
      createdRowLabels,
      useIndexForRowLabels,
    ]
  }, [config.columnLabels, config.rowLabels])

  function addRow(newIndex?: number) {
    const fillValue = utils.getFillValue(attributeType)
    const newRow =
      typeof data[0] !== 'string'
        ? Array.from({ length: columns.length }).fill(fillValue)
        : fillValue
    const dataCopy = [...data]
    dataCopy.splice(newIndex || data.length, 0, newRow)
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

  function clearTable() {
    const fill = utils.getFillValue(attributeType)
    setData(functionality.isMultiDimensional ? [[fill]] : [fill])
    setSelectedRow(undefined)
    setSelectedColumn(undefined)
    setPaginationPage(0)
  }

  function moveRow(direction: 'up' | 'down') {
    if (selectedRow !== undefined) {
      const toIndex = direction === 'up' ? selectedRow - 1 : selectedRow + 1
      const updatedData = utils.arrayMove(data, selectedRow, toIndex)
      setData(updatedData)
      setSelectedRow(toIndex)
    }
  }

  function addColumn(newIndex?: number) {
    newIndex = newIndex || columnLabels.length
    const fillValue = utils.getFillValue(attributeType)
    const updatedData = data.map((item) => {
      item.splice(newIndex, 0, fillValue)
      return item
    })
    setData(updatedData)
    setSelectedColumn(newIndex)
  }

  function deleteColumn(index: number) {
    const updatedData = data.map((item) => {
      item.splice(index, 1)
      return item
    })
    setData(updatedData)
    setSelectedColumn(undefined)
  }

  return (
    <Stack fullWidth>
      <Stack>
        {config.title && <Typography variant='h5'>{config.title}</Typography>}
        {config.description && <Typography>{config.description}</Typography>}
      </Stack>
      <EdsProvider density='compact'>
        <Styled.DataGrid>
          {config.showColumns && (
            <Styled.Head>
              <Styled.Row>
                {config.showRows && <th style={{ width: '2rem' }}></th>}
                {columns?.map((_: string, index: number) => (
                  <HeaderCell
                    key={`${dataGridId}_header_${index}`}
                    add={addColumn}
                    editable={functionality.columnsAreEditable}
                    delete={deleteColumn}
                    index={index}
                    label={
                      useIndexForColumnLabels
                        ? String(index + 1)
                        : columnLabels[index]
                    }
                    selected={selectedColumn}
                    setSelected={setSelectedColumn}
                    type='column'
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
                      label={
                        useIndexForRowLabels
                          ? String(calculatedIndex + 1)
                          : rowLabels[calculatedIndex]
                      }
                      editable={functionality.rowsAreEditable}
                      selected={selectedRow}
                      setSelected={setSelectedRow}
                      type='row'
                    />
                  )}
                  {functionality.isMultiDimensional ? (
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
        <DataGridActions
          addRow={addRow}
          attributeType={attributeType}
          columnLabels={columnLabels}
          config={config}
          data={data}
          deleteRow={deleteRow}
          dimensions={dimensions}
          functionality={functionality}
          moveRow={moveRow}
          name={props.name || dataGridId}
          rowLabels={rowLabels}
          selectedRow={selectedRow}
          setData={setData}
          clearTable={clearTable}
        />
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
