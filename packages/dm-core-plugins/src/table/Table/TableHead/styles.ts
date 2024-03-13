import { Table } from '@equinor/eds-core-react'
import styled from 'styled-components'

export const SortCell = styled(Table.Cell)<{ isSorted: boolean }>`
  svg {
    visibility: ${({ isSorted }) => (isSorted ? 'visible' : 'hidden')};
  }

  &:hover {
    svg {
      visibility: visible;
    }
  }
`
