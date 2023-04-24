import React, { ChangeEvent, useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import {
  BlueprintPicker,
  IUIPlugin,
  INPUT_FIELD_WIDTH,
  Loading,
  Select,
  truncatePathString,
  useDocument,
  TBlueprint,
  TGenericObject
} from '@development-framework/dm-core'

import {
  Accordion,
  Button,
  Icon,
  Label,
  Switch,
  TextField,
} from '@equinor/eds-core-react'


interface Column {
  id: 'index' | 'value';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}



function createData(index:number, value:number) {
  return {index, value };
}



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 740,
  },
});

const SignalTable = (props: { document: TGenericObject })  => {
  const { document } = props
  
  let xlabel = ''
  if (document.xlabel != ''){
    xlabel = document.xlabel
  }
  else {
    xlabel = document.xname
  }
  if (document.xunit != ''){
    xlabel = xlabel + "[" + document.xunit + "]"
  }

  let ylabel = ''
  if (document.label != ''){
    ylabel = document.label
  }
  else {
    ylabel = document.name
  }
  if (document.unit != ''){
    ylabel = ylabel + "[" + document.unit + "]"
  }

  const columns: readonly Column[] = [
    {
      id: "index",
      label: xlabel,
      minWidth: 30,
      align: "right",
      format: (value:number) => value.toLocaleString('en-US'),
    },    
    {
      id: "value",
      label: ylabel,
      minWidth: 100,
      align: "right",
      format: (value:number) => value.toLocaleString('en-US'),
    },
  ];

  const rows = [];

  for (let ind=0; ind<document.value.length; ind++) {
    rows.push(createData(ind*document.xdelta+document.xstart, document.value[ind]));
  }

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event:any, newPage:any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event:any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root} style={{ fontSize: 12 }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth , fontSize: 14 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.index}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell 
                        key={column.id} 
                        align={column.align}
                        style={{ fontSize: 12 }}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, 500, 1000, 5000]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ fontSize: 12 }}
      />
    </Paper>
  );
}
/****************************************************************/
const SignalTable_Component = (props: IUIPlugin) => {
  const { idReference } = props
  const [
    document,
    loading,
    updateDocument,
    error,
  ] = useDocument<TGenericObject>(idReference, 999)

  if (loading) return <Loading />
  if (error) {
    throw new Error(JSON.stringify(error))
  }

  return <SignalTable document={document || {}} />
}

export { SignalTable_Component as SignalTable }

