import { Button, Checkbox, Icon, Tooltip } from '@equinor/eds-core-react'
import { checkbox, checkbox_outline, external_link } from '@equinor/eds-icons'
import { DateTime } from 'luxon'
import type { ChangeEvent } from 'react'
import { CollapseExpandButton } from '../../../../common'
import { Datepicker } from '../../../../common/Datepicker'
import type { TableCellProps } from '../../types'
import { resolvePath } from '../../utils'
import * as Styled from '../styles'

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

  // TODO: Add more logic for creating better default values.
  //  If pointing to complex optional object, it has to be created.
  const value = resolvePath(item.data || {}, column?.data, '')

  if (typeof value === 'object') {
    throw new Error(
      `Objects can not be displayed in table. Attribute '${column}' is not a primitive type.`
    )
  }

  if (column.data === '^expandable') {
    return !editMode ? (
      <Styled.TableCell>
        <CollapseExpandButton
          isExpanded={isExpanded}
          setIsExpanded={() => setIsExpanded(!isExpanded)}
        />
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
            <Icon data={external_link} aria-hidden size={18} />
          </Button>
        </Tooltip>
      </Styled.TableCell>
    ) : null
  }

  const isEditableField =
    editMode && (column.editable || column.editable === undefined)

  if (column.dataType === 'datetime') {
    return (
      <Styled.TableCell
        style={{ textAlign: column.presentAs === 'text' ? 'left' : 'center' }}
      >
        {isEditableField ? (
          <Datepicker
            id={'valla'}
            variant={'datetime'}
            value={value}
            onChange={(date) => updateItem(column.data, date, 'datetime')}
          />
        ) : value ? (
          DateTime.fromISO(value).toLocaleString(
            {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h23',
            },
            { locale: 'nb' }
          )
        ) : (
          '-'
        )}
      </Styled.TableCell>
    )
  }

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
    <Styled.TableCell $noPadding={isEditableField}>
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
        value || (column.dataType === 'number' ? 0 : '-')
      )}
    </Styled.TableCell>
  )
}
