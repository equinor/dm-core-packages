import React from 'react'
import { TWidget } from '../types'
import { StyledTextField } from './common/StyledInputFields'
import { Tooltip } from '@equinor/eds-core-react'

const TextWidget = (props: TWidget) => {
  const { onChange } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value === '' ? null : event.target.value)
  }

  return (
    <StyledTextField
      {...props}
      data-testid={`form-text-widget-${props.label || props.id}`}
      onChange={onChangeHandler}
    />
  )
}

export default TextWidget
