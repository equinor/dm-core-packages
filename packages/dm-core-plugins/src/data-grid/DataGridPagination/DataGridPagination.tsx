import { Stack } from '@development-framework/dm-core'
import { Icon, Typography } from '@equinor/eds-core-react'
import { chevron_left, chevron_right } from '@equinor/eds-icons'
import React from 'react'
import * as Styled from '../styles'

type DataGridPaginationProps = {
  count: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
}

export function DataGridPagination(props: DataGridPaginationProps) {
  const { count = 0, page, setPage, rowsPerPage, setRowsPerPage } = props

  const calculatedPages = Math.ceil(count / rowsPerPage) // could be less than zero
  const availablePages = calculatedPages < 1 ? 1 : calculatedPages // if calculated pages is less than zero, return 1
  const visibleFromLabel = count === 0 ? 0 : page * rowsPerPage + 1
  const visibleToLabel = Math.min(count, (page + 1) * rowsPerPage)

  return (
    <Stack
      direction='row'
      spacing={0.5}
      alignItems='center'
      justifyContent='flex-end'
    >
      <Stack spacing={0.5} direction='row' alignItems='center'>
        <Typography variant='meta'>Rows per page: </Typography>
        <Styled.Select
          id='rowsPerPage'
          value={rowsPerPage}
          onChange={(event) => setRowsPerPage(Number(event.target.value))}
        >
          {[5, 10, 25, 50, 100, 500].map((amount) => (
            <option key={amount}>{amount}</option>
          ))}
        </Styled.Select>
      </Stack>
      <Stack spacing={0.5} alignItems='center'>
        <Typography variant='meta'>
          {visibleFromLabel} - {visibleToLabel} of {count}
        </Typography>
      </Stack>
      <Stack direction='row' alignItems='center'>
        <Styled.ActionRowButton
          disabled={page === 0}
          onClick={() => setPage((prevPage) => prevPage - 1)}
        >
          <Icon data={chevron_left} size={16} title='Previous page' />
        </Styled.ActionRowButton>
        <Styled.ActionRowButton
          disabled={page + 1 === availablePages}
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          <Icon data={chevron_right} size={16} title='Next page' />
        </Styled.ActionRowButton>
      </Stack>
    </Stack>
  )
}
