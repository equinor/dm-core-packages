import React from 'react'

import { TWidget } from '../types'
import { StyledTextField } from '../components/StyledInputFields'

const TextareaWidget = (props: TWidget) => {
  const { label, onChange } = props

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const formattedValue = value === '' ? null : value
    onChange?.(formattedValue)
  }

  return (
    <StyledTextField
      {...props}
      multiline={true}
      rows={5}
      onChange={onChangeHandler}
    />
  )
}

export default TextareaWidget
