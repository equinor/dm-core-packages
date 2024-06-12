import {
  Button,
  EdsProvider,
  Icon,
  Progress,
  Tooltip,
} from '@equinor/eds-core-react'
import { add, chevron_down, chevron_up } from '@equinor/eds-icons'
import { MouseEvent, ReactNode } from 'react'

export const FormButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  isLoading: boolean
  children: ReactNode
  variant?: 'contained' | 'contained_icon' | 'outlined' | 'ghost' | 'ghost_icon'
  tooltip: string
  dataTestid: string
}) => (
  <Tooltip title={props.tooltip}>
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      data-testid={props.dataTestid}
      variant={props.variant ?? undefined}
      aria-label={props.tooltip}
    >
      {props.isLoading ? <Progress.Dots color={'primary'} /> : props.children}
    </Button>
  </Tooltip>
)

export const ListChevronButton = (props: {
  onClick: () => void
  disabled?: boolean
  type: 'up' | 'down'
}) => {
  const { type } = props
  const ICONS = {
    up: chevron_up,
    down: chevron_down,
  }

  return (
    <EdsProvider density='compact'>
      <Button
        disabled={props.disabled}
        variant='ghost_icon'
        onClick={props.onClick}
        aria-label={type === 'up' ? 'Move up' : 'Move Down'}
      >
        <Icon data={ICONS[type]} />
      </Button>
    </EdsProvider>
  )
}

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
