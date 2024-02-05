import { Table } from '@equinor/eds-core-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

export const NotHoverColorTableRow = styled(Table.Row)`
  &:hover {
    background-color: white; // same as the non-hover state
  }
`

const SkeletonCell = styled(Table.Cell)`
padding: 0;
margin: 0;
`

export const TableRowSkeleton = ({
  columnsLength,
  count = 1,
}: { columnsLength: number; count?: number }): React.ReactNode => {
  return (
    <>
      {Array.from({ length: count }).map(() => (
        <NotHoverColorTableRow>
          <SkeletonCell
            colSpan={columnsLength}
            style={{ padding: '0 0 3px 0', height: '33px' }}
          >
            <Skeleton count={1} height={26} />
          </SkeletonCell>
        </NotHoverColorTableRow>
      ))}
    </>
  )
}
