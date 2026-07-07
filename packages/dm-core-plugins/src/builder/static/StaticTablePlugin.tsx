import type { IUIPlugin } from '@development-framework/dm-core'
import { Pagination, Table } from '@equinor/eds-core-react'
import { useMemo, useState } from 'react'

export interface StaticTablePluginConfig {
  /** Full grid of cells; the first row is the header. */
  rows?: string[][]
  /** Rows shown per page; defaults to 25. */
  pageSize?: number
  caption?: string
}

/**
 * Renders a self-contained table from inline config. The first row is the
 * header. Large tables are paginated so the page stays responsive regardless of
 * row count. No DMSS binding needed.
 */
export const StaticTablePlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticTablePluginConfig }
): React.ReactElement => {
  const { rows = [], pageSize = 25, caption } = props.config
  const [page, setPage] = useState(1)

  const [columns, body] = useMemo(() => [rows[0] ?? [], rows.slice(1)], [rows])
  const totalPages = Math.max(1, Math.ceil(body.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => body.slice((safePage - 1) * pageSize, safePage * pageSize),
    [body, safePage, pageSize]
  )

  if (columns.length === 0 && body.length === 0)
    return (
      <div style={{ padding: 16, color: '#6f6f6f', textAlign: 'center' }}>
        No data. Write a table or upload a CSV/Excel file in the inspector.
      </div>
    )

  return (
    <div className='dm-plugin-padding' style={{ width: '100%' }}>
      <Table style={{ width: '100%' }}>
        {caption && <Table.Caption>{caption}</Table.Caption>}
        <Table.Head>
          <Table.Row>
            {columns.map((label, index) => (
              <Table.Cell key={`h-${index}`}>{label}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {pageRows.map((row, rowIndex) => (
            <Table.Row key={`r-${rowIndex}`}>
              {columns.map((_, colIndex) => (
                <Table.Cell key={`c-${rowIndex}-${colIndex}`}>
                  {row[colIndex] ?? ''}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {body.length > pageSize && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}
        >
          <Pagination
            totalItems={body.length}
            itemsPerPage={pageSize}
            onChange={(_, newPage) => setPage(newPage)}
            withItemIndicator
          />
        </div>
      )}
    </div>
  )
}
