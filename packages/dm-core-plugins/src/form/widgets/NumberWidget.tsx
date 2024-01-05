import React from 'react'
import { TWidget } from '../types'
import { StyledNumberField } from './common/StyledInputFields'

const NumberWidget = (props: TWidget) => {
  const { onChange } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.(event.target.value !== '' ? Number(event.target.value) : null)
  return (
    <StyledNumberField
      {...props}
      onChange={onChangeHandler}
      data-testid={`form-number-widget-${props.label || props.id}`}
    />
  )
}

export default NumberWidget
