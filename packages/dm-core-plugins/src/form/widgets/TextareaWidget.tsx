import React from 'react'

import { Icon, TextField } from '@equinor/eds-core-react'

import { error_filled } from '@equinor/eds-icons'
import { TWidget } from '../types'

Icon.add({ error_filled })

const TextareaWidget = (props: TWidget) => {
  const { label, onChange } = props

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const formattedValue = value === '' ? null : value
    onChange?.(formattedValue)
  }

  return (
    // @ts-ignore
    <TextField
      {...props}
      multiline={true}
      rows={5}
      onChange={onChangeHandler}
      label={label}
    />
  )
}

export default TextareaWidget
