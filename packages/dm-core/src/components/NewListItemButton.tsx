import { Button, Icon, Tooltip } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { MouseEvent } from 'react'

export const NewListItemButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  compact?: boolean
}) => (
  <Tooltip title='Add item'>
    <Button
      variant='ghost'
      onClick={props.onClick}
      style={{ paddingInline: props.compact ? '0.5rem' : '0.7rem' }}
      aria-label='append-item'
    >
      <Icon data={add} size={18} title='Append' /> New Item
    </Button>
  </Tooltip>
)
