import React, { useState } from 'react'
import { Button, Icon, Menu, Table } from '@equinor/eds-core-react'
import { more_vertical } from '@equinor/eds-icons'
import {
  TTableColumnConfig,
  TableHeadProps,
  TableVariantNameEnum,
} from '../types'
import { SortCell } from './styles'

export function TableHead(props: TableHeadProps) {
  const {
    config,
    tableVariant,
    setTableVariant,
    sortColumn,
    sortDirection,
    sortByColumn,
  } = props
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  return (
    <Table.Head>
      <Table.Row>
        {tableVariant == TableVariantNameEnum.Edit && (
          <Table.Cell width='48' aria-label='Sort'></Table.Cell>
        )}
        {config.columns.map((column: TTableColumnConfig) => {
          if (column.data === '^expandable' || column.data === '^tab') {
            return tableVariant == TableVariantNameEnum.View ? (
              <Table.Cell
                key={column.data}
                width={column.data === '^expandable' ? '80' : '48'}
                aria-label={
                  column.data === '^expandable'
                    ? 'Open as expandable'
                    : 'Open in new tab'
                }
              />
            ) : null
          }
          return (
            <SortCell
              aria-sort={
                !column.sortable || tableVariant === TableVariantNameEnum.Edit
                  ? undefined
                  : column.data === sortColumn
                    ? sortDirection
                    : 'none'
              }
              key={column.data}
              isSorted={
                column.data === sortColumn &&
                tableVariant === TableVariantNameEnum.View
              }
              onClick={() =>
                column.sortable ? sortByColumn(column.data) : null
              }
              tabIndex={column.sortable ? 0 : -1}
            >
              {column.label || column.data}
              {column.sortable &&
                tableVariant === TableVariantNameEnum.View && (
                  <Icon
                    name={
                      sortDirection === 'descending' ? 'arrow_down' : 'arrow_up'
                    }
                  />
                )}
            </SortCell>
          )
        })}
        <Table.Cell width='40'>
          <>
            <Button
              aria-label='Table actions'
              aria-haspopup='true'
              aria-expanded={isMenuOpen}
              aria-controls={`tablehead-menu`}
              onClick={() => setIsMenuOpen(true)}
              ref={setMenuButtonAnchor}
              variant='ghost_icon'
            >
              <Icon data={more_vertical} aria-hidden />
            </Button>
            <Menu
              anchorEl={menuButtonAnchor}
              aria-labelledby='anchor-default'
              id={`tablehead-menu`}
              onClose={() => setIsMenuOpen(false)}
              open={isMenuOpen}
            >
              {config.variant?.length === 2 && (
                <Menu.Item
                  onClick={() =>
                    setTableVariant(
                      tableVariant == TableVariantNameEnum.View
                        ? TableVariantNameEnum.Edit
                        : TableVariantNameEnum.View,
                    )
                  }
                >
                  {tableVariant == TableVariantNameEnum.View ? 'Edit' : 'View'}
                </Menu.Item>
              )}
            </Menu>
          </>
        </Table.Cell>
      </Table.Row>
    </Table.Head>
  )
}
