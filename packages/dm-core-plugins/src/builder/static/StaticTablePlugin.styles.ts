import { Table } from '@equinor/eds-core-react'
import styled from 'styled-components'

export const EmptyMessage = styled.div`
  padding: 16px;
  color: #6f6f6f;
  text-align: center;
`

export const TableContainer = styled.div`
  width: 100%;
`

export const FullWidthTable = styled(Table)`
  width: 100%;
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`
