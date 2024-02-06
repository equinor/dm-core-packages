import { Table } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Skeleton } from '../../../components/common/Skeleton/Skeleton'
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
  return Array.from({ length: count }).map(() => (
    <NotHoverColorTableRow>
      <SkeletonCell colSpan={columnsLength}>
        <Skeleton height={'100%'} />
      </SkeletonCell>
    </NotHoverColorTableRow>
  ))
}
