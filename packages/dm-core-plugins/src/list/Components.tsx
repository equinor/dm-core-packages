import React, { MouseEvent } from 'react'
import { Button, EdsProvider, Icon, Progress } from '@equinor/eds-core-react'
import {
  chevron_down,
  chevron_up,
  delete_to_trash,
  add,
} from '@equinor/eds-icons'

export const AppendButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}) => (
  <Button variant="outlined" onClick={props.onClick}>
    <Icon data={add} title="Append" /> Add Item
  </Button>
)

export const SaveButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  isLoading: boolean
}) => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick}
    data-testid="SaveList"
  >
    {props.isLoading ? <Progress.Dots color={'primary'} /> : 'Save'}
  </Button>
)

export const ReloadButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  isLoading: boolean
}) => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick}
    data-testid="ReloadData"
  >
    {props.isLoading ? <Progress.Dots color={'primary'} /> : 'Undo'}
  </Button>
)

export const ListItemButton = (props: {
  onClick: () => void
  disabled?: boolean
  type: 'up' | 'down' | 'delete'
}) => {
  const { type } = props
  const ICONS = {
    delete: delete_to_trash,
    up: chevron_up,
    down: chevron_down,
  }
  const iconTitle =
    type === 'up' ? 'Move up' : type === 'down' ? 'Move Down' : 'Delete'
  return (
    <EdsProvider density="compact">
      <Button
        color={type === 'delete' ? 'danger' : 'primary'}
        disabled={props.disabled}
        variant="ghost_icon"
        onClick={props.onClick}
      >
        <Icon data={ICONS[type]} title={iconTitle} />
      </Button>
    </EdsProvider>
  )
}
