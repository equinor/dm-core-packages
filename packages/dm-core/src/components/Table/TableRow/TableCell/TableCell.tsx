import React, { ChangeEvent } from 'react'
import { Button, Checkbox, Icon, Tooltip } from '@equinor/eds-core-react'
import {
  checkbox,
  checkbox_outline,
  chevron_down,
  chevron_up,
  external_link,
} from '@equinor/eds-icons'
import * as Styled from '../styles'
import { TableCellProps } from '../../types'

export function TableCell(props: TableCellProps) {
  const {
    column,
    editMode,
    isExpanded,
    setIsExpanded,
    item,
    updateItem,
    openItemAsTab,
  } = props

  const value = item.data[column?.data]

  if (typeof value === 'object') {
    throw new Error(
      `Objects can not be displayed in table. Attribute '${column}' is not a primitive type.`
    )
  }

  if (column.data === '^expandable') {
    return !editMode ? (
      <Styled.TableCell>
        <Tooltip title={isExpanded ? 'Collapse row' : 'Expand row'}>
          <Button
            aria-label={
              isExpanded ? 'Close expandable row' : 'Open expandable row'
            }
            variant='ghost_icon'
            color='secondary'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon data={isExpanded ? chevron_up : chevron_down} />
          </Button>
        </Tooltip>
      </Styled.TableCell>
    ) : null
  }

  if (column.data === '^tab') {
    return !editMode ? (
      <Styled.TableCell style={{ textAlign: 'center' }}>
        <Tooltip title='Open as new tab'>
          <Button
            variant='ghost_icon'
            aria-label='Open in new tab'
            onClick={openItemAsTab}
          >
            <Icon data={external_link} aria-hidden />
          </Button>
        </Tooltip>
      </Styled.TableCell>
    ) : null
  }

  const isEditableField =
    editMode && (column.editable || column.editable === undefined)

  // Datatype is boolean. Input checkbox in editmode, using static icons to showcase values when not or as simple text
  if (column.dataType === 'boolean') {
    return (
      <Styled.TableCell
        style={{ textAlign: column.presentAs === 'text' ? 'left' : 'center' }}
      >
        {isEditableField ? (
          <Checkbox
            checked={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateItem(
                column.data,
                event.target.checked,
                column.dataType || 'string'
              )
            }
          />
        ) : column.presentAs === 'text' ? (
          `${value}`
        ) : (
          <Icon aria-label={value} data={value ? checkbox : checkbox_outline} />
        )}
      </Styled.TableCell>
    )
  }

  return (
    <Styled.TableCell noPadding={isEditableField}>
      {isEditableField ? (
        <Styled.Input
          defaultValue={value ?? ''}
          type='text'
          onBlur={(event: ChangeEvent<HTMLInputElement>) =>
            updateItem(
              column.data,
              event.target.value,
              column.dataType || 'string'
            )
          }
        />
      ) : (
        value || '-'
      )}
    </Styled.TableCell>
  )
}
