import { Table } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Skeleton } from '../../../common'
import { NotHoverColorTableRow } from './styles'

export const SkeletonCell = styled(Table.Cell)`
  padding: 3px 0;
  margin: 0 0 0 0;
  line-height: 0;
  height: 33px;
`
export const SkeletonRow = ({
  columnsLength,
  count = 1,
}: { columnsLength: number; count?: number }) => {
  let keyCounter = 0

  return Array.from({ length: count }).map(() => {
    keyCounter = keyCounter + 1
    return (
      <NotHoverColorTableRow key={keyCounter}>
        <SkeletonCell colSpan={columnsLength}>
          <Skeleton height={'100%'} />
        </SkeletonCell>
      </NotHoverColorTableRow>
    )
  })
}
