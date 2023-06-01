import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core'

import {
  IUIPlugin,
  Loading,
  useDocument,
  TGenericObject,
} from '@development-framework/dm-core'

interface Column {
  id: 'index' | 'value'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 740,
  },
})

const SignalTable = (props: { document: TGenericObject }) => {
  const { document } = props
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const xLabel = `${document.xlabel || document.xname}${
    document.xunit ? ` [${document.xunit}]` : ''
  }`
  const yLabel = `${document.label || document.name}${
    document.unit ? ` [${document.unit}]` : ''
  }`

  const columns: readonly Column[] = [
    {
      id: 'index',
      label: xLabel,
      minWidth: 30,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'value',
      label: yLabel,
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
  ]

  const rows = document.value?.map((value: any, index: number) => ({
    index: index * document.xdelta + document.xstart,
    value,
  }))

  const onPageChange = (event: any, newPage: any) => {
    setPage(newPage)
  }

  const onRowsPerPageChange = (event: any) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper className={classes.root} style={{ fontSize: 12 }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontSize: 14 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.index}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ fontSize: 12 }}
                      >
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, 500, 1000, 5000]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        style={{ fontSize: 12 }}
      />
    </Paper>
  )
}
/****************************************************************/
const SignalTable_Component = (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading, updateDocument, error] =
    useDocument<TGenericObject>(idReference, 999)

  if (loading) return <Loading />
  if (error) {
    throw new Error(JSON.stringify(error))
  }

  return <SignalTable document={document || {}} />
}

export { SignalTable_Component as SignalTable }
