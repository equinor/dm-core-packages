import React from 'react'

import { TextField, Typography } from '@equinor/eds-core-react'
import { TWidget } from '../types'
import ReadOnlyField from '../components/ReadOnlyField'

const TextareaWidget = (props: TWidget) => {
  const { label, onChange, readOnly } = props

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const formattedValue = value === '' ? null : value
    onChange?.(formattedValue)
  }

  if (props.readOnly) return <ReadOnlyField />

  return (
    <TextField
      {...props}
      multiline={true}
      readOnly={false}
      disabled={props.readOnly}
      rows={5}
      onChange={onChangeHandler}
    />
  )
}

export default TextareaWidget
