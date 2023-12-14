import React from 'react'
import { TWidget } from '../types'
import { StyledTextField } from '../components/StyledInputFields'

const TextWidget = (props: TWidget) => {
  const { onChange } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value === '' ? null : event.target.value)
  }

  return <StyledTextField {...props} onChange={onChangeHandler} />
}

export default TextWidget
