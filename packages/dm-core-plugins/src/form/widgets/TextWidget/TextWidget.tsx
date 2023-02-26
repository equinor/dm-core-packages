import React from 'react'

import { TextField, Icon } from '@equinor/eds-core-react'

import { error_filled } from '@equinor/eds-icons'
import { TWidget } from '../../types'

Icon.add({ error_filled })

const TextWidget = (props: TWidget) => {
  const { label, onChange } = props

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => onChange(value === '' ? '' : value)
  return (
    <TextField
      id={props.id}
      readOnly={props.readOnly}
      value={props.value}
      onClick={props.onClick}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onChange={_onChange}
      label={label}
    />
  )
}

export default TextWidget
