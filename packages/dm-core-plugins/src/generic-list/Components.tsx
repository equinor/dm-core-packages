import React, { MouseEvent } from 'react'
import { Button, Icon, Progress } from '@equinor/eds-core-react'
import {
  arrow_down,
  arrow_up,
  delete_to_trash,
  library_add,
} from '@equinor/eds-icons'

export const AppendButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}) => (
  <Button variant="ghost_icon" onClick={props.onClick}>
    <Icon data={library_add} title="Append" />
  </Button>
)

export const SaveButton = (props: {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  isLoading: boolean
}) => (
  <Button disabled={props.disabled} onClick={props.onClick}>
    {props.isLoading ? <Progress.Dots color={'primary'} /> : 'Save'}
  </Button>
)

export const DeleteButton = (props: { onClick: () => void }) => (
  <Button variant="ghost_icon" color="danger" onClick={props.onClick}>
    <Icon data={delete_to_trash} title="Delete" />
  </Button>
)

export const MoveItemUpButton = (props: { onClick: () => void }) => (
  <Button variant="ghost_icon" onClick={props.onClick}>
    <Icon data={arrow_up} title="Move up" />
  </Button>
)

export const MoveItemDownButton = (props: { onClick: () => void }) => (
  <Button variant="ghost_icon" onClick={props.onClick}>
    <Icon data={arrow_down} title="Move down" />
  </Button>
)
