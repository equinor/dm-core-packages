import {
  Button,
  EdsProvider,
  Icon,
  NativeSelect,
  Typography,
} from '@equinor/eds-core-react'
import { chevron_left, chevron_right } from '@equinor/eds-icons'
import { useMemo } from 'react'
import { Stack } from '..'

type PaginationProps = {
  count: number
  page: number
  setPage: (page: number) => void
  rowsPerPage: number
  setRowsPerPage: (numItems: number) => void
  defaultRowsPerPage?: number
}

export function Pagination(props: PaginationProps) {
  const {
    count = 0,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    defaultRowsPerPage,
  } = props

  const calculatedPages = Math.ceil(count / rowsPerPage) // could be less than zero
  const availablePages = calculatedPages < 1 ? 1 : calculatedPages // if calculated pages is less than zero, return 1
  const visibleFromLabel = count === 0 ? 0 : page * rowsPerPage + 1
  const visibleToLabel = Math.min(count, (page + 1) * rowsPerPage)

  const paginationSizes = useMemo(() => {
    const sizes = [5, 10, 25, 50, 100, 500]
    if (defaultRowsPerPage && !sizes.includes(defaultRowsPerPage)) {
      sizes.push(defaultRowsPerPage)
      sizes.sort((a, b) => a - b)
    }
    return sizes
  }, [defaultRowsPerPage])

  return (
    <EdsProvider density='compact'>
      <Stack direction='row' spacing={1} alignItems='center'>
        <Stack spacing={0.5} direction='row' alignItems='center'>
          <Typography variant='label' group='input'>
            Rows per page:{' '}
          </Typography>
          <NativeSelect
            id='rowsPerPage'
            label=''
            value={rowsPerPage}
            onChange={(event) => setRowsPerPage(Number(event.target.value))}
            style={{ width: '70px' }}
          >
            {paginationSizes.map((amount) => (
              <option key={amount}>{amount}</option>
            ))}
          </NativeSelect>
        </Stack>
        <Stack spacing={0.5} alignItems='center'>
          <Typography variant='meta'>
            {visibleFromLabel} - {visibleToLabel} of {count}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={0.5} alignItems='center'>
          <Button
            disabled={page === 0}
            variant='ghost_icon'
            onClick={() => setPage(page - 1)}
            className='overflow-hidden'
          >
            <Icon data={chevron_left} title='Previous page' />
          </Button>
          <Button
            disabled={page + 1 === availablePages}
            variant='ghost_icon'
            onClick={() => setPage(page + 1)}
            className='overflow-hidden'
          >
            <Icon data={chevron_right} title='Next page' />
          </Button>
        </Stack>
      </Stack>
    </EdsProvider>
  )
}
